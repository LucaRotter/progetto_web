// Importa le librerie necessarie
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const express = require('express');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const nodemailer = require('nodemailer');// Includi nodemailer per l'invio di email
const cloudinary = require('cloudinary').v2; // Includi cloudinary per il caricamento delle immagini
const multer = require('multer'); // Includi multer per la gestione dei file
const stripe = require("stripe")(process.env.SECRET_KEY_STRIPE);//include stripe per i pagamenti
const fs = require('fs');
const { get } = require('http');



// INIZIALIZZAZIONE DEL SERVER E CONFIGURAZIONE DELLE VARIABILI DA USARE

const app = express();
app.use(express.json());
app.use(cors());
const port = 8000;

//GESTIONE RICHIESTE UTENTI MASSIME
const RATE_LIMIT = 100; // max richieste per IP
const WINDOW_MS = 60 * 1000; // 1 minuto

const ipRequests = new Map();

setInterval(() => {
  ipRequests.clear(); // reset ogni minuto
}, WINDOW_MS);

app.use((req, res, next) => {
  const ip = req.ip || req.socket.remoteAddress;

  const count = ipRequests.get(ip) || 0;

  if (count >= RATE_LIMIT) {
    return res.status(429).send('Troppe richieste, riprova più tardi.');
  }

  ipRequests.set(ip, count + 1);

  next();
});


//connessione a PostgreSQL
const pool = new Pool({
  user: process.env.PG_USER,              
  host: process.env.PG_HOST,               
  database: process.env.PG_DATABASE,        
  password: process.env.PG_PASSWORD,       
  port: process.env.PG_PORT,
});

//pulizia shuffled
async function startServer() {
  try {
    await pool.query("DELETE FROM shuffled");
    console.log("Tabella 'shuffled' svuotata all'avvio.");

  } catch (err) {
    console.error("Errore durante la pulizia iniziale:", err);
    process.exit(1);
  }
}

startServer();


//JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// Configurazione di Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

//cartella temporanea per l'upload delle immagini
const uploadMiddleware = multer({ dest: 'temp/' });

// Configurazione del trasportatore per inviare email
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.APP_PASSWORD // App password for Gmail
    }
});
//recupera ip utente per utenti senza token
const getUserKey = (req) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    try {
      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      return decoded.id;  // qui restituisci user_id dal token direttamente
    } catch {
      // token invalido, fallback a IP
      return req.ip;
    }
  } else {
    // nessun token, fallback a IP
    return req.ip;
  }
};

// Middleware verifica token e recupera permessi utente
const protect = async (req, res, next) => {
    let token = req.headers.authorization;
    if (token && token.startsWith("Bearer ")) {
        try {

            token = token.split(" ")[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const userResult = await pool.query('SELECT * FROM users WHERE user_id = $1', [decoded.id]);
            req.permissions = await getUserPermissions(decoded.id);
            req.user = userResult.rows[0];
            //generazione nuovo token
            const newToken = jwt.sign(
                { id: decoded.id },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );
            res.setHeader('x-refresh-token', newToken);
            
            next();
        } catch (error) {
            res.status(401).json({ message: "Unauthorized, invalid token" });
        }
    } else {
        res.status(401).json({ message: "Unauthorized, no token" });
    }
};







//CREAZIONE FUNZIONI

//funzione per l'upload delle immagini su Cloudinary
async function uploadToCloudinary(filePath, folder = 'prodotti') {
  try {
    const result = await cloudinary.uploader.upload(filePath, { folder });
    fs.unlinkSync(filePath); // elimina il file temporaneo
    return {
      url: result.secure_url,
      public_id: result.public_id//serve solo per il test
    };
  } catch (error) {
    console.error('Errore in uploadToCloudinary:', error);
    throw error; // rilancia per essere gestito nel catch del route handler
  }
};

//funzione per rimuovere le immagini da Cloudinary
async function deleteFromCloudinary(publicId) {
    try {
        await cloudinary.uploader.destroy(publicId);
        console.log('Immagine eliminata con successo da Cloudinary');
    } catch (error) {
        console.error('Errore durante l\'eliminazione dell\'immagine da Cloudinary:', error);
    }
}

// Funzione per inviare email
async function sendEmail(to, subject, text){
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER, // Mittente
            to,                          // Destinatario
            subject,                     // Oggetto
            text                         // Corpo del messaggio
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email inviata: ' + info.response);
        return info;
    } catch (error) {
        console.error('Errore nell\'invio dell\'email:', error);
    }
};

//verifica permission, DA INSERIRE NEI PARAMETRI DELLA CRUD ES: hasPermission(inserisci_articolo)
function hasPermission(Permission_name) {
    return async (req, res, next) => {
      // Se i permessi non sono presenti nel token, li recuperiamo dal database
      if (!req.permissions) {
        try {
          const permissions = await getUserPermissions(req.user.user_id);  
          req.permissions = permissions;  
  
          if (!permissions.includes(Permission_name)) {
            return res.status(403).json({ message: 'Permission denied' });
          }
  
          // Se l'utente ha il permesso, passa al prossimo middleware o alla route
          return next();
        } catch (err) {
          console.error('Failure to retrieve permissions:', err);
          return res.status(500).json({ message: 'Internal Error' });
        }
      } else {
        // Se i permessi sono già presenti nel token
        if (!req.permissions.includes(Permission_name)) {
          return res.status(403).json({ message: 'Permission denied' });
        }
        return next();  // Se l'utente ha il permesso, passa al prossimo middleware o alla route
      }
    };
}

//recupera permessi subito dopo aver effettuato il login
async function getUserPermissions(user_id) {
    user_id = `${user_id}`;
   
    const query = (`
      SELECT p.name AS permission
      FROM users u
      JOIN roles r ON u.role_id = r.role_id
      JOIN roles_permissions rp ON r.role_id = rp.role_id
      JOIN permissions p ON rp.permission_id = p.permission_id
      WHERE u.user_id = $1
    `);

    try {
      const result = await pool.query(query, [user_id]);
      return result.rows.map(row => row.permission);// restituisce un array di stringhe con i nomi dei permessi
    } catch (err) {
      console.error('Errore nel recupero dei permessi:', err);
      throw err;
    }
}







//TUTTE LE CRUD

//CRUD PER LA GESTIONE DELLE IMMAGINI
//upload immagine
app.post('/upload', uploadMiddleware.single('immagine'), async (req, res) => {
    try {
      console.log('File ricevuto:', req.file.path);
      const { public_id, url } = await uploadToCloudinary(req.file.path);
      res.json({ message: 'Upload riuscito!',public_id, url });
    } catch (err) {
      res.status(500).json({ error: 'Errore upload', details: err.message });
    }
});

//elimina immagine
app.delete('/delete-image', async (req, res) => {
    const { publicId } = req.body;
    try {
        await deleteFromCloudinary(publicId);
        res.json({ message: 'Immagine eliminata con successo' });
    } catch (err) {
        res.status(500).json({ error: 'Errore durante l\'eliminazione dell\'immagine', details: err.message });
    }
});


//CRUD PER LA GESTIONE DEGLI UTENTI

//registrazione utente
app.post('/register', async (req, res) => {
    const { name, surname, email, pwd, role } = req.body;
    const result1 = await pool.query('SELECT role_id FROM roles WHERE name = $1', [role]); //fare la query per recuperare l'id del ruolo
    const role_id = result1.rows[0].role_id;
    const hashedPassword = await bcrypt.hash(pwd, 10);

    const userResult = await pool.query('SELECT * FROM users WHERE email = $1 AND role_id = $2', [email, role_id]);
    if (!role_id) {
        return res.status(400).json({ message: "Ruolo non valido" });
    }
    if (userResult.rows.length > 0) {
        return res.status(400).json({ message: "User already exists" });
    }

    //creazione id utente
    let user_id = "";

    const maxResult = await pool.query('SELECT MAX(CAST(user_id AS INTEGER)) AS maxUser_id FROM users');
    const maxId = maxResult.rows[0].maxuser_id;
    const nextId = (maxId !== null ? maxId : 0) + 1;
    user_id = nextId.toString();

    const result = await pool.query(
        'INSERT INTO users (user_id, name, surname, email, pwd, role_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING user_id, name, email, role_id',
        [user_id, name, surname, email, hashedPassword, role_id]
    );
    const newUser = result.rows[0];
    // Invia un'email di benvenuto
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Conferma Registrazione',
        text: `Ciao ${name},\n\nGrazie per esserti registrato!\n\nBenvenuto nella nostra piattaforma!`
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Errore nell\'invio dell\'email:', error);
        res.status(500).json({ error: 'Errore nell\'invio dell\'email' });
    }
    res.json({ token: generateToken(newUser.user_id), user: newUser });
});

//login utente
app.post('/login', async (req, res) => {
    const { email, pwd, role } = req.body;
    const result = await pool.query('SELECT role_id FROM roles WHERE name = $1', [role]); //fare la query per recuperare l'id del ruolo
    const role_id = result.rows[0]?.role_id;
    const userResult = await pool.query('SELECT * FROM users WHERE email = $1 AND role_id = $2', [email, role_id]);
    

    if (userResult.rows.length > 0) {
        const user = userResult.rows[0];
        if (await bcrypt.compare(pwd, user.pwd)) {
            if(role_id != 3){
                const token= generateToken(user.user_id);
                res.json({ token });

            } else {
                const token= generateToken(user.user_id);
                const randomCode = Math.floor(10 + Math.random() * 90); // genera un numero casuale intero tra 10 e 99
                // genera e invia mail con il codice
                await sendEmail(
                    email,
                    'Codice di accesso',
                    `Ciao ${user.name},\n\nIl tuo codice di accesso è: ${randomCode}\n\nBuon Lavoro!`
                );

                res.json({ number: randomCode, token : token });
            }
        } else {
            res.status(401).json({ message: "Invalid credentials" });
        }
    } else {
        res.status(401).json({ message: "Invalid credentials" });
    }
});

//aggiungi foto profilo utente
app.put('/profile-picture', uploadMiddleware.single('immagine'), protect, hasPermission('update_profile'), async (req, res) => {
    console.log('File ricevuto:', req.file.path);
    const response = await uploadToCloudinary(req.file.path);
    const url = response.url;
    const user_id = req.user.user_id;
    const result = await pool.query('UPDATE users SET image_url = $1 WHERE user_id = $2', [url, user_id]);
    if (result.rowCount > 0) {
        res.json({ message: "Profile picture updated", imageUrl : url });
    } else {
        res.status(400).json({ message: "User not found" });
    }
});
//ricevi tutti gli utenti
app.get('/users', protect, hasPermission('manage_users'), async (req, res) => {
    const result = await pool.query("SELECT * FROM users where role_id != '3'");
    res.json({users: result.rows});
});

//ricevi utente
app.get('/user', protect, hasPermission('update_profile'), async (req, res) => {
    const user_id = req.user.user_id;
    const result = await pool.query('SELECT user_id, name, surname, email, image_url FROM users WHERE user_id = $1', [user_id]);
    if (result.rows.length > 0) {
        res.json({user: result.rows[0]});
    } else {
        res.status(400).json({ message: "User not found" });
    }
});
//modifica nome e cognome user da parte di un admin
app.put('/update-name-user/:id', protect, hasPermission('manage_users'), async (req, res) => {
    const user_id = req.params.id;
    const { name, surname } = req.body;
    const result = await pool.query('UPDATE users SET name = $1, surname = $2 WHERE user_id = $3', [name, surname, user_id]);
    if (result.rowCount > 0) {
        res.json({ message: "Name updated" });
    } else {
        res.status(400).json({ message: "User not found" });
    }
});


//modifica nome utente
app.put('/update-name', protect, hasPermission('update_profile'), async (req, res) => {
    const { name, surname } = req.body;
    const user_id = req.user.user_id;
    const result = await pool.query('UPDATE users SET name = $1, surname = $2 WHERE user_id = $3', [name, surname, user_id]);
    if (result.rowCount > 0) {
        res.json({ message: "Name updated" });
    } else {
        res.status(400).json({ message: "User not found" });
    }
});

//per admin: recupera utente, dopo aver recuperato la segnalazione
app.get('/user/:id', protect, hasPermission('manage_users'), async (req, res) => {
    const user_id = req.params.id;
    const result = await pool.query('SELECT user_id, name, surname, email, role_id FROM users WHERE user_id = $1', [user_id]);
    if (result.rows.length > 0) {
        res.json({user: result.rows[0]});
    } else {
        res.status(400).json({ message: "User not found" });
    }
});

app.get('/userby/:id', async (req, res) => {
    const user_id = req.params.id;
    const result = await pool.query('SELECT name, surname, image_url FROM users WHERE user_id = $1', [user_id]);
    if (result.rows.length > 0) {
        res.json({user: result.rows[0]});
    } else {
        res.status(400).json({ message: "User not found" });
    }
});

//per admin: recupera id utente da email e ruolo
app.get('/user-by-email', protect, hasPermission('manage_users'), async (req, res) => {
    const { email, role } = req.body;
    const resultRole = await pool.query('SELECT role_id FROM roles WHERE name = $1', [role]); //fare la query per recuperare l'id del ruolo
    const role_id = resultRole.rows[0].role_id;
    const result = await pool.query('SELECT user_id FROM users WHERE email = $1 AND role_id = $2', [email, role_id]);
    if (result.rows.length > 0) {
        res.json({ user_id: result.rows[0].user_id });
    } else {
        res.status(400).json({ message: "User not found" });
    }
});

//aggiorna password di un utente da parte di un admin
app.put('/update-password/:id', protect, hasPermission('manage_users'), async (req, res) => {
    const { newPassword } = req.body;
    const user_id = req.params.id;
    const userResult = await pool.query('SELECT * FROM users WHERE user_id = $1', [user_id]);
    
    if (userResult.rows.length > 0) {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await pool.query('UPDATE users SET pwd = $1 WHERE user_id = $2', [hashedPassword, user_id]);
         res.json({ message: "Password updated" });    
    } else {
        res.status(400).json({ message: "User not found" });
    }
});

//aggiorna email di un utente da parte di un admin
app.put('/update-email/:id', protect, hasPermission('manage_users'), async (req, res) => {
    const { newEmail } = req.body;
    const user_id = req.params.id;
    const userResult = await pool.query('SELECT * FROM users WHERE user_id = $1', [user_id]);
    if (userResult.rows.length > 0) {
        await pool.query('UPDATE users SET email = $1 WHERE user_id = $2', [newEmail, user_id]);
         res.json({ message: "Email updated" });    
    } else {
        res.status(400).json({ message: "User not found" });
    }
});


//eliminazione utente da parte dell'utente stesso
app.delete('/user', protect, hasPermission('update_profile'), async (req, res) => {
    const user_id = req.user.user_id;
    const result = await pool.query('DELETE FROM users WHERE user_id = $1', [user_id]);
    //aggiunta mail
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: req.user.email,
        subject: 'Eliminazione account',
        text: `Ciao ${req.user.name},\n\nIl tuo account è stato eliminato con successo.\n\nGrazie per aver utilizzato il nostro servizio!`
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Errore nell\'invio dell\'email:', error);
        res.status(500).json({ error: 'Errore nell\'invio dell\'email' });
    }
    if (result.rowCount > 0) {
        res.json({ message: "User deleted" });
    } else {
        res.status(400).json({ message: "User not found" });
    }
});

//eliminazione utente da parte dell'admin
app.delete('/user/:id', protect, hasPermission('delete_user'), async (req, res) => {
    const user_id = req.params.id;
    const email = await pool.query('SELECT email FROM users WHERE user_id = $1', [user_id]);
    const result = await pool.query('DELETE FROM users WHERE user_id = $1', [user_id]);
    //aggiunta mail
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email.rows[0].email,
        subject: 'Eliminazione account',
        text: `Un admin ha eliminato il tuo account.\n\nSe hai bisogno di assistenza, contatta il supporto.\n\nGrazie per aver utilizzato il nostro servizio!`
    };

    try {
       await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Errore nell\'invio dell\'email:', error);
        res.status(500).json({ error: 'Errore nell\'invio dell\'email' });
    }
    if (result.rowCount > 0) {
        res.json({ message: "User deleted" });
    } else {
        res.status(400).json({ message: "User not found" });
    }
});


//CRUD PER RESET PASSWORD

//recupera password
app.post('/forgot-password', async (req, res) => {
    const { email, role } = req.body;
    result = await pool.query('SELECT role_id FROM roles WHERE name = $1', [role]); //fare la query per recuperare l'id del ruolo
    const role_id = result.rows[0].role_id;
    const userResult = await pool.query('SELECT * FROM users WHERE email = $1 AND role_id = $2', [email, role_id]);
    if (userResult.rows.length > 0) {
        const user = userResult.rows[0];
        
        // Invia un'email con il link per il reset della password
        sendEmail(
            email,
            'Recupero Password',
            `Ciao ${user.name},\n\nPer favore clicca sul seguente link per reimpostare la tua password:\n\n http://127.0.0.1:5500/prova/resetPWD.html?email=${email}&role=${role} \n\nGrazie!`
        );

        res.json({ message: "Email sent"});
    } else {
        res.status(400).json({ message: "User not found" });
    }
});

//reimposta password
app.post('/reset-password', async (req, res) => {
    const { email, newPassword, role } = req.body;
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const result1 = await pool.query('SELECT role_id FROM roles WHERE name = $1', [role]);; //fare la query per recuperare l'id del ruolo
    const role_id = result1.rows[0].role_id;
    const result = await pool.query('UPDATE users SET pwd = $1 WHERE email = $2 AND role_id = $3', [hashedPassword, email, role_id]);
    if (result.rowCount > 0) {
        res.json({ message: "Password updated" });
    } else {
        res.status(400).json({ message: "User not found" });
    }
});

//aggiorna password
app.put('/update-password', protect, hasPermission('update_profile'), async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const user_id = req.user.user_id;
    const userResult = await pool.query('SELECT * FROM users WHERE user_id = $1', [user_id]);
    
    if (userResult.rows.length > 0) {
        const user = userResult.rows[0];
        if (await bcrypt.compare(oldPassword, user.pwd)) {
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            await pool.query('UPDATE users SET pwd = $1 WHERE user_id = $2', [hashedPassword, user_id]);
            res.json({ message: "Password updated" });
        } else {
            res.status(401).json({ message: "Old password is incorrect" });
        }
    } else {
        res.status(400).json({ message: "User not found" });
    }
});

//CRUD PER LA GESTIONE DELLE RECENSIONI

//aggiungi recensione
app.post('/add-review', protect, hasPermission('add_review'), async (req, res) => {
    const { item_id, description, evaluation } = req.body;
    const user_id = req.user.user_id;
    const count = await pool.query('SELECT * FROM reviews WHERE item_id = $1 AND user_id = $2', [item_id, user_id]);
    if (count.rows.length > 0) {
        return res.status(400).json({ message: "Review already exists" });
    }
    const maxResult = await pool.query('SELECT MAX(CAST(review_id AS INTEGER)) AS max_id FROM reviews');
    const maxId = maxResult.rows[0].max_id;
    const nextId = (maxId !== null ? maxId : 0) + 1;
    const review_id = nextId.toString();
    console.log('review_id:', review_id);
    const result = await pool.query(
        'INSERT INTO reviews (review_id, user_id, item_id, description, evaluation) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [review_id, user_id, item_id, description, evaluation]);
    res.json({ message: "Review added", review: result.rows[0] });
});

//elimina recensione, recuperare prima id articolo /itemGetId e user_id se ad eliminazione da parte dell'admin
app.delete('/delete-review/:id', protect, hasPermission('delete_review'), async (req, res) => {
    const item_id = req.params.id;
    const role_id = req.user.role_id;
    if( role_id == 3){
        user_id = req.body.user_id;
    }else{
        user_id = req.user.user_id;
    }
    const result = await pool.query('SELECT review_id FROM reviews WHERE item_id = $1 AND user_id = $2', [item_id, user_id]);
    const deleteResult = await pool.query('DELETE FROM reviews WHERE review_id = $1', [result.rows[0].review_id]);
    if (deleteResult.rowCount > 0) {
        res.json({ message: "Review deleted" });
    } else {
        res.status(400).json({ message: "Review not found" });
    }
});

//recensioni relative ad un articolo
app.get('/reviews/:id', async (req, res) => {
    const item_id = req.params.id;
    const result = await pool.query(
        'SELECT u.name, r.description, r.evaluation, r.review_id FROM users u JOIN reviews r ON u.user_id = r.user_id WHERE r.item_id = $1',
         [item_id]);
    res.json({reviews:result.rows});
});

//valuazione media di un articolo
app.get('/average-rating/:id', async (req, res) => {
    const item_id = req.params.id;
    const result = await pool.query('SELECT AVG(evaluation) AS average FROM reviews WHERE item_id = $1', [item_id]);
    if (result.rows.length > 0) {
        res.json({ average: result.rows[0].average });
    } else {
        res.status(400).json({ message: "No reviews found" });
    }
});
//recupera id recensione avendo l'id dell'articolo e l'id dell'utente
app.get('/review-id', protect, hasPermission('moderate_reviews'), async (req, res) => {
    const { item_id, user_id } = req.body;
    const result = await pool.query('SELECT review_id FROM reviews WHERE item_id = $1 AND user_id = $2', [item_id, user_id]);
    if (result.rows.length > 0) {
        res.json({ review_id: result.rows[0].review_id });
    } else {
        res.status(400).json({ message: "Review not found" });
    }
});


//recupera recensione per id
app.get('/review/:id', protect, hasPermission('moderate_reviews'), async (req, res) => {
    const review_id = req.params.id;
    const result = await pool.query('SELECT * FROM reviews WHERE review_id = $1', [review_id]);
    if (result.rows.length > 0) {
        res.json({review:result.rows[0]});
    } else {
        res.status(400).json({ message: "Review not found" });
    }
});

//CRUD PER LA GESTIONE DEL CARRELLO

//inserimento articolo nel carrello
app.post('/cart', protect, hasPermission('update_cart'), async (req, res) => {
    const item_id = Number(req.body.item_id);
    const quantity = Number(req.body.quantity);
    const user_id = req.user.user_id;

    try {
        const check = await pool.query(
            'SELECT 1 FROM carts WHERE user_id = $1 AND item_id = $2',
            [user_id, item_id]
        );

        if (check.rows.length > 0) {
            await pool.query(
                'UPDATE carts SET quantity = quantity + $1 WHERE user_id = $2 AND item_id = $3',
                [quantity, user_id, item_id]
            );
        } else {
            await pool.query(
                'INSERT INTO carts (user_id, item_id, quantity) VALUES ($1, $2, $3)',
                [user_id, item_id, quantity]
            );
        }

        res.json({ message: "Item added to cart" });

    } catch (err) {
        console.error('Error updating cart:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});
//articoli dal carrello
app.get('/cart', protect, async (req, res) => {
    const user_id = req.user.user_id;
    const result = await pool.query('SELECT * FROM carts WHERE user_id = $1', [user_id]);
    res.json({items:result.rows});
});

//modifica quantità articolo nel carrello
app.put('/cart/:id', protect, hasPermission('update_cart'), async (req, res) => {
    const { quantity } = req.body;
    const user_id = req.user.user_id;
    const result = await pool.query('UPDATE carts SET quantity = $1 WHERE user_id = $2 AND item_id = $3', [quantity, user_id, req.params.id]);
    if (result.rowCount > 0) {
        res.json({ message: "Item updated in cart" });
    } else {
        res.status(400).json({ message: "Item not found in cart" });
    }
});

//rimozione articolo con id passato per parametro dal carrello dell'utente passato come token
app.delete('/cart/:id', protect, hasPermission('update_cart'), async (req, res) => {
    const user_id = req.user.user_id;
    const result = await pool.query('DELETE FROM carts WHERE user_id = $1 AND item_id = $2', [user_id, req.params.id]);
    if (result.rowCount > 0) {
        res.json({ message: "Item removed from cart" });
    } else {
        res.status(400).json({ message: "Item not found in cart" });
    }
});

//rimozione di tutti gli articoli dal carrello dell'utente con id passato per parametro
app.delete('/delete-cart', protect, hasPermission('update_cart'), async (req, res) => {
    const user_id = req.user.user_id;
    const result = await pool.query('DELETE FROM carts WHERE user_id = $1', [user_id]);
    if (result.rowCount > 0) {
        res.json({ message: "Items removed from cart" });
    } else {
        res.status(400).json({ message: "Item not found in cart" });
    }
});

//numero tipi articoli diversi nel carrello
app.get('/cart-count', protect, hasPermission('update_cart'), async (req, res) => {
    const user_id = req.user.user_id;
    const result = await pool.query('SELECT COUNT(*) AS count FROM carts WHERE user_id = $1', [user_id]);
    res.json({ count: result.rows[0].count });
});
//numero articoli totali nel carrello
app.get('/cart-total', protect, hasPermission('update_cart'), async (req, res) => {
    const user_id = req.user.user_id;
    const result = await pool.query('SELECT SUM(quantity) AS total FROM carts WHERE user_id = $1', [user_id]);
    res.json({ total: result.rows[0].total });
});

//totale prezzo articoli nel carrello
app.get('/cart-price', protect, hasPermission('update_cart'), async (req, res) => {
    const user_id = req.user.user_id;
    const result = await pool.query(`
        SELECT SUM(i.price * c.quantity) AS total_price
        FROM carts c
        JOIN items i ON c.item_id = i.item_id
        WHERE c.user_id = $1
    `, [user_id]);
    res.json({ totalPrice: result.rows[0].total_price });
});



//gestione categorie
//restituisce tutte le categorie
app.get('/categories', async (req,res) => {
    const result = await pool.query('SELECT * FROM categories');
    res.json(result.rows);
});

//aggiungi categoria
app.post('/add-category',uploadMiddleware.single('immagine'), protect, hasPermission('manage_categories'), async (req, res) => {
    const response = await uploadToCloudinary(req.file.path);
    const url = response.url;
    const name = req.body.name;
    const maxResult = await pool.query('SELECT MAX(CAST(category_id AS INTEGER)) AS max_id FROM categories');
    const maxId = maxResult.rows[0].max_id;
    const nextId = (maxId !== null ? maxId : 0) + 1;
    const category_id = nextId.toString();

    const result = await pool.query(
        'INSERT INTO categories (category_id, name, image_url) VALUES ($1, $2, $3)',
        [category_id, name, url]);
    res.json({ message: "Category added", category_id});//la categoria_id viene restituita per i test
});

//modifica nome categoria
app.put('/update-category-name/:id', protect, hasPermission('manage_categories'), async (req, res) => {
    const { name } = req.body;
    const category_id = req.params.id;
    const result = await pool.query('UPDATE categories SET name = $1 WHERE category_id = $2', [name, category_id]);
    if (result.rowCount > 0) {
        res.json({ message: "Category name updated" });
    } else {
        res.status(400).json({ message: "Category not found" });
    }
});

//modifica immagine categoria
app.put('/update-category-image/:id', uploadMiddleware.single('immagine'), protect, hasPermission('manage_categories'), async (req, res) => {
    const category_id = req.params.id;
    const response = await uploadToCloudinary(req.file.path);
    const url = response.url
    const result = await pool.query('UPDATE categories SET image_url = $1 WHERE category_id = $2', [url, category_id]);
    if (result.rowCount > 0) {
        res.json({ message: "Category image updated" });
    } else {
        res.status(400).json({ message: "Category not found" });
    }
});

//elimina categoria
app.delete('/delete-category/:id', protect, hasPermission('manage_categories'), async (req, res) => {
    const category_id = req.params.id;
    const result = await pool.query('DELETE FROM categories WHERE category_id = $1', [category_id]);
    if (result.rowCount > 0) {
        res.json({ message: "Category deleted" });
    } else {
        res.status(400).json({ message: "Category not found" });
    }
});

//CRUD PER LA GESTIONE DEGLI ARTICOLI

//aggiungi articolo
app.post('/add-item', protect, hasPermission('update_item'), async (req, res) => {
    console.log('qui1');
    const { name, category, description, price, quantity, image_url } = req.body;
    const user_id = req.user.user_id;
    const maxResult = await pool.query('SELECT MAX(CAST(item_id AS INTEGER)) AS max_id FROM items');
    const maxId = maxResult.rows[0].max_id;
    const nextId = (maxId !== null ? maxId : 0) + 1;
    const item_id = nextId.toString();
    const tmp = await pool.query('SELECT category_id FROM categories WHERE name = $1', [category]);
    const category_id = tmp.rows[0].category_id;

    const result = await pool.query(
        'INSERT INTO items (item_id, user_id, name, category_id, description, price, quantity, image_url) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)RETURNING *', 
        [item_id, user_id, name, category_id, description, price, quantity, image_url]);
    res.json({ message: "Item added", item: result.rows[0] });//restituire l'item serve per il test
});

//modifica prezzo articolo
app.put('/update-price/:id', protect, hasPermission('update_item'), async (req, res) => {
    const { price } = req.body;
    const item_id = req.params.id;
    const result = await pool.query('UPDATE items SET price = $1 WHERE item_id = $2  RETURNING *', [price, item_id]);
    if (result.rowCount > 0) {
        res.json({ message: "Price updated", item: result.rows[0] });
    } else {
        res.status(400).json({ message: "Item not found" });
    }
});

//modifica quantità articolo
app.put('/update-quantity/:id', protect, hasPermission('update_item'), async (req, res) => {
    const { quantity } = req.body;
    const item_id = req.params.id;
    const result = await pool.query('UPDATE items SET quantity = $1 WHERE item_id = $2 RETURNING *', [quantity, item_id]);
    if (result.rowCount > 0) {
        res.json({ message: "Quantity updated", item: result.rows[0] });
    } else {
        res.status(400).json({ message: "Item not found"});
    }
});

//modifica immagine articolo
app.put('/update-image/:id',uploadMiddleware.single('immagine'), protect, hasPermission('update_item'),  async (req, res) => {
    const item_id = req.params.id;
    const response = await uploadToCloudinary(req.file.path);
    const url = response.url;
    const result = await pool.query('UPDATE items SET image_url = $1 WHERE item_id = $2 RETURNING *', [url, item_id]);
    if (result.rowCount > 0) {
        res.json({ message: "Image updated", item: result.rows[0] });
    } else {
        res.status(400).json({ message: "Item not found" });
    }
});

//modifica nome articolo
app.put('/update-name/:id', protect, hasPermission('update_item'), async (req, res) => {
    const { name } = req.body;
    const item_id = req.params.id;
    const result = await pool.query('UPDATE items SET name = $1 WHERE item_id = $2 RETURNING *', [name, item_id]);
    if (result.rowCount > 0) {
        res.json({ message: "Name updated", item: result.rows[0] });
    } else {
        res.status(400).json({ message: "Item not found" });
    }
});

//modifica categoria articolo
app.put('/update-category/:id', protect, hasPermission('update_item'), async (req, res) => {
    const { category } = req.body;
    const item_id = req.params.id;
    const response = await pool.query('SELECT category_id FROM categories WHERE name = $1', [category]);
    const category_id = response.rows[0].category_id;
    const result = await pool.query('UPDATE items SET category_id = $1 WHERE item_id = $2 RETURNING *', [category_id, item_id]);
    if (result.rowCount > 0) {
        res.json({ message: "Category updated", item: result.rows[0] });
    } else {
        res.status(400).json({ message: "Item not found" });
    }
});

//modifica descrizione articolo
app.put('/update-description/:id', protect, hasPermission('update_item'), async (req, res) => {
    const { description } = req.body;
    const item_id = req.params.id;
    const result = await pool.query('UPDATE items SET description = $1 WHERE item_id = $2 RETURNING *', [description, item_id]);
    if (result.rowCount > 0) {
        res.json({ message: "Description updated", item: result.rows[0] });
    } else {
        res.status(400).json({ message: "Item not found" });
    }
});

//elimina articolo
app.delete('/delete-item/:id', protect, hasPermission('delete_item'), async (req, res) => {
    const item_id = req.params.id;
    const result = await pool.query('DELETE FROM items WHERE item_id = $1', [item_id]);
    if (result.rowCount > 0) {
        res.json({ message: "Item deleted" });
    } else {
        res.status(400).json({ message: "Item not found" });
    }
});

//recupera articolo per id
app.get('/item/:id', async (req, res) => {
    const item_id = req.params.id;
    const result = await pool.query('SELECT * FROM items WHERE item_id = $1', [item_id]);

    const response = await pool.query('SELECT * FROM categories WHERE category_id = $1',[result.rows[0].category_id]);
    const category_name = response.rows[0].name;
    res.json({item: result.rows, category_name: category_name});
});

//recupera id articolo per nome, prezzo, descrizione, categoria
app.get('/itemgetId', async (req, res) => {
    const { name, price, description, category } = req.body;
    const categoryResult = await pool.query('SELECT category_id FROM categories WHERE name = $1', [category]);
       

    const result = await pool.query('SELECT item_id FROM items WHERE name = $1 AND price = $2 AND description = $3 AND category_id = $4',
        [name, price, description, categoryResult.rows[0].category_id]
    );
    res.json({ item_id: result.rows[0] });
});


//restituisce articoli per user_id(artigiano) dallo stesso artigiano
app.get('/user-items/',protect, hasPermission('update_item'), async (req, res) => {
    const user_id = req.user.user_id;;
    let result = await pool.query('SELECT * FROM items WHERE user_id = $1', [user_id]);
    for (const item of result.rows) {
        const categoryRes = await pool.query('SELECT name FROM categories WHERE category_id = $1', [item.category_id]);
        item.category = categoryRes.rows[0]?.name || null;
    }
    res.json({items: result.rows});
});

//restituisce articoli per user_id(artigiano) per vedere i prodotti di un artigiano
app.get('/user-items/:id', async (req, res) => {
    const user_id = req.params.id;
    let result = await pool.query('SELECT * FROM items WHERE user_id = $1', [user_id]);
    for (const item of result.rows) {
        const categoryRes = await pool.query('SELECT name FROM categories WHERE category_id = $1', [item.category_id]);
        item.category = categoryRes.rows[0]?.name || null;
    }
    res.json({items: result.rows});
});


//ricevi un elenco di articoli casuali con il numero di articoli specificato nel body della richiesta
const userState = new Map(); 

app.delete('/reset-items', async (req, res) => {
    const userKey = getUserKey(req);
    await pool.query('DELETE FROM shuffled WHERE user_key = $1', [userKey]);
    userState.delete(userKey); // reset dello stato dell'utente
    res.json({ message: "Lista resettata" });
});

app.get('/random-items', async (req, res) => {
    const userKey = getUserKey(req);
    

    const nItems = parseInt(req.query.nItems, 10);
    

    if (!nItems || isNaN(nItems)) {
        return res.status(400).json({ error: "Parametro 'nItems' non valido" });
    }

    try {
        if (!userState.has(userKey)) {
            const result = await pool.query('SELECT item_id FROM items');
            const shuffled = result.rows.sort(() => 0.5 - Math.random());

            const maxResult = await pool.query('SELECT MAX(CAST(item_id AS INTEGER)) AS max_id FROM shuffled');
            const maxId = maxResult.rows[0].max_id;
            const nextId = (maxId !== null ? maxId : 0) + 1;
            const index = nextId;
            const indexMax = index + shuffled.length - 1;

            userState.set(userKey, { index: index, indexMax: indexMax });
            
            for (let i = 0; i < shuffled.length; i++) {
                await pool.query('INSERT INTO shuffled (item_index, user_key, item_id, category_id) VALUES ($1, $2, $3, $4)', [i+index, userKey, shuffled[i].item_id, null]);
            }
        }

        const { index, indexMax } = userState.get(userKey);
        if (index === indexMax + 1) {
            return res.status(404).json({ error: "Nessun altro elemento disponibile" });
        }
        const startIndex = parseInt(index, 10);
        let endIndex = startIndex + nItems - 1;
        if (endIndex > indexMax) {
            endIndex = indexMax;
        }
       
        const selectedItems_id = await pool.query(
            `SELECT item_id FROM shuffled WHERE item_index >= $1 AND item_index <= $2`, 
            [ startIndex, endIndex]
        );
       
        const selectedItems = await pool.query('SELECT * FROM items WHERE item_id = ANY($1)', [selectedItems_id.rows.map(row => row.item_id)]);

        userState.set(userKey, { index: endIndex + 1, indexMax: indexMax });
        console.log("Stato utente aggiornato:", userState.get(userKey));

        res.json({selectedItems: selectedItems.rows});
    } catch (err) {
        console.error("Errore:", err);
        res.status(500).json({ error: "Errore interno del server" });
    }
});


//recupera articoli appartenenti ad una categoria
// Recupera articoli appartenenti a una categoria in modo casuale, senza ripetizioni nella sessione utente
const categoryItemsCache = new Map(); 

app.delete('/reset-category-items/:name', async (req, res) => {
    const userKey = getUserKey(req);
    
    const categoryName = req.params.name;
    const result =  await pool.query('SELECT category_id FROM categories WHERE name = $1', [categoryName]);
    if (result.rows.length === 0) {
        return res.status(404).json({ error: "Categoria non trovata" });
    }
    const category_id = result.rows[0].category_id;

    const key = `${userKey}-${category_id}`;


    if (!categoryItemsCache.has(key)) {
        return res.status(404).json({ error: "Nessun elemento da resettare per l\'utente in questa categoria" });
    }

    await pool.query('DELETE FROM shuffled WHERE user_key = $1 AND category_id = $2', [userKey, category_id]);
    categoryItemsCache.delete(key); // reset dello stato dell'utente
    res.json({ message: "Lista resettata" });
});

app.get('/category-items/:name', async (req, res) => {
    const userKey = getUserKey(req);
    const nItems = parseInt(req.query.nItems, 10);
    const categoryName = req.params.name;
    const result = await pool.query('SELECT category_id FROM categories WHERE name = $1', [categoryName]);
    if (result.rows.length === 0) {
        return res.status(404).json({ error: "Categoria non trovata" });
    }
    const category_id = result.rows[0].category_id;
    const key = `${userKey}-${category_id}`;
    
    

    if (!nItems || isNaN(nItems)) {
        return res.status(400).json({ error: "Parametro 'nItems' non valido" });
    }

    try {
        if (!categoryItemsCache.has(key)) {
            
            const result = await pool.query('SELECT item_id FROM items WHERE category_id = $1', [category_id]);
            const shuffled = result.rows.sort(() => 0.5 - Math.random());

            const maxResult = await pool.query('SELECT MAX(CAST(item_index AS INTEGER)) AS max_id FROM shuffled');
            const maxId = maxResult.rows[0].max_id;
            const nextId = (maxId !== null ? maxId : 0) + 1;
            const index = nextId;
            const indexMax = index + shuffled.length - 1;

            categoryItemsCache.set(key, { index: index, indexMax: indexMax });
            
            for (let i = 0; i < shuffled.length; i++) {
                await pool.query('INSERT INTO shuffled (item_index, user_key, item_id, category_id) VALUES ($1, $2, $3, $4)', [i+index, userKey, shuffled[i].item_id, category_id]);
            }


        }

        const { index, indexMax } = categoryItemsCache.get(key);
        if (index === indexMax + 1) {
            return res.status(404).json({ error: "Nessun altro elemento disponibile" });
        }
        const startIndex = parseInt(index, 10);
        let endIndex = startIndex + nItems - 1;
        if (endIndex > indexMax) {
            endIndex = indexMax;
        }
       
        const selectedItems_id = await pool.query(
            `SELECT item_id FROM shuffled WHERE item_index >= $1 AND item_index <= $2`, 
            [ startIndex, endIndex]
        );
       
        const selectedItems = await pool.query('SELECT * FROM items WHERE item_id = ANY($1)', [selectedItems_id.rows.map(row => row.item_id)]);
        
        categoryItemsCache.set(key, { index: endIndex + 1, indexMax: indexMax });
        console.log("Stato utente aggiornato:", categoryItemsCache.get(key));

        res.json({selectedItems: selectedItems.rows});
    } catch (err) {
        console.error("Errore:", err);
        res.status(500).json({ error: "Errore interno del server" });
    }
});

//articoli con i filtri
app.get('/items', async (req, res) => {
    const { name, category, minPrice, maxPrice, minEvaluation } = req.query;
    const params = [];
    let count = 1;

    //Se un articolo non ha recensioni, la valutazione media è 0 con il COALESCE
    //left join non esclude gli articoli senza recensioni
    let query = `
        SELECT 
            items.*,
            COALESCE(AVG(reviews.evaluation), 0) AS average_evaluation 
        FROM items
        LEFT JOIN reviews ON reviews.item_id = items.item_id
        WHERE 1=1
    `;

    if (name) {
        query += ` AND items.name ILIKE $${count}`;
        params.push(`%${name}%`);
        count++;
    }

    if (category) {
        const response = await pool.query('SELECT category_id FROM categories WHERE name = $1', [category]);
        const category_id = response.rows[0].category_id;
        query += ` AND items.category_id = $${count}`;
        params.push(category_id);
        count++;
    }

    if (minPrice) {
        query += ` AND items.price >= $${count}`;
        params.push(minPrice);
        count++;
    }

    if (maxPrice) {
        query += ` AND items.price <= $${count}`;
        params.push(maxPrice);
        count++;
    }

    query += ` GROUP BY items.item_id`;

    if (minEvaluation) {
        query += ` HAVING AVG(reviews.evaluation) >= $${count}`;
        params.push(minEvaluation);
        count++;
    }

    try {
        const result = await pool.query(query, params);
        res.json({ items: result.rows });
    } catch (err) {
        console.error("Errore durante il recupero degli articoli:",  err.message, err.stack);
        res.status(500).json({ error: "Errore interno del server" });
    }
});

//gestione ordini
//aggiungi ordine
app.post('/add-order', protect, hasPermission('place_order'), async (req, res) => {
    const { items, address, civic_number, postal_code, city, province, country, phone_number  } = req.body;
    const user_id = req.user.user_id;
    const maxResult = await pool.query('SELECT MAX(CAST(order_id AS INTEGER)) AS max_id FROM orders');
    const maxId = maxResult.rows[0].max_id;
    const nextId = (maxId !== null ? maxId : 0) + 1;
    const order_id = nextId.toString();

    const now = new Date();
    const day = now.toISOString().split('T')[0]; // formato YYYY-MM-DD
    const time = now.toTimeString().split(' ')[0]; // formato HH:MM:SS

    for (let item of items) {

        let artisan_id = await pool.query('SELECT user_id FROM items WHERE item_id = $1', [item.item_id]);
        artisan_id = artisan_id.rows[0].user_id;
        const oldqty = await pool.query('SELECT quantity FROM items WHERE item_id = $1', [item.item_id]);
        const newqty = oldqty.rows[0].quantity - item.quantity;
        if (newqty < 0) {
            return res.status(400).json({ message: "Insufficient stock for item: " + item.item_id });
        } else {
            await pool.query('UPDATE items SET quantity = $1 WHERE item_id = $2', [newqty, item.item_id]);
        }

        await pool.query(
            'INSERT INTO orders (order_id, customer_id, artisan_id, item_id, quantity, day, time, state, address, civic_number, postal_code, city, province, country, phone_number) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)',
            [order_id, user_id, artisan_id, item.item_id, item.quantity, day, time, 'confirmed', address, civic_number, postal_code, city, province, country, phone_number]
        );
    }
    res.json({ message: "Order added", order_id: order_id });//l'order_id viene restituito per i test
});

//aggiorna stato ordine
app.put('/update-order/:id', protect, hasPermission('manage_orders'), async (req, res) => {
    const order_id = req.params.id;
    const result = await pool.query('UPDATE orders SET state = $1 WHERE order_id = $2', ['shipped', order_id]);
    if (result.rowCount > 0) {
        res.json({ message: "Order updated" });
    } else {
        res.status(400).json({ message: "Order not found" });
    }
});

//recupera ordini per id utente del cliente
app.get('/customer-orders', protect, hasPermission('view_orders'), async (req, res) => {
    const user_id = req.user.user_id;
    const result = await pool.query('SELECT * FROM orders WHERE customer_id = $1 ORDER BY day DESC', [user_id]);
    res.json({orders: result.rows});
});

//recupera ordini per id utente dell'artigiano
app.get('/artisan-orders', protect, hasPermission('manage_orders'), async (req, res) => {
    const user_id = req.user.user_id;
    const result = await pool.query('SELECT * FROM orders WHERE artisan_id = $1 ORDER BY day DESC', [user_id]);
    res.json({orders: result.rows});
});

//recupera ordini per id ordine per amministratore
app.get('/admin-orders/:id', protect, hasPermission('view_manage_orders'), async (req, res) => {
    const order_id = req.params.id;
    const result = await pool.query('SELECT * FROM orders WHERE order_id = $1', [order_id]);
    if (result.rows.length > 0) {
        res.json({orders:result.rows});
    } else {
        res.status(400).json({ message: "Order not found" });
    }
});

//elimina ordine da parte dell'amministratore
app.delete('/delete-orders/:id', protect, hasPermission('view_manage_orders'), async (req, res) => {
    const order_id = req.params.id;
    const result = await pool.query('DELETE FROM orders WHERE order_id = $1 RETURNING *', [order_id]);
    if (result.rowCount > 0) {
        res.json({ message: "Order deleted" });
    } else {
        res.status(400).json({ message: "Order not found" });
    }
});


//gestione segnalazioni

//crea una segnalazione
app.post('/create-report', protect, hasPermission('manage_report'), async (req, res) => {
    const { item_id, category, description } = req.body;
    const user_id = req.user.user_id;
    const maxResult = await pool.query('SELECT MAX(CAST(report_id AS INTEGER)) AS max_id FROM reports');
    const maxId = maxResult.rows[0].max_id;
    const nextId = (maxId !== null ? maxId : 0) + 1;
    const report_id = nextId.toString();

    let artisan_id = null;
    let customer_id = null;

    if (req.user.role_id == 1) {
        customer_id = user_id;
    } else {
        artisan_id = user_id;
    } 

    const result = await pool.query(
        'INSERT INTO reports (report_id, customer_id, artisan_id, item_id, category, description) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [report_id, customer_id, artisan_id, item_id, category, description]);
    res.json({ message: "Report created", report: result.rows[0] });
});

//aggiunta admin nella segnalazione, da fare dopo che l'admin recupera le free-reports
app.put('/add-admin-report/:id', protect, hasPermission('moderate_reports'), async (req, res) => {
    const report_id = req.params.id;
    const admin_id = req.user.user_id;
    const result = await pool.query('UPDATE reports SET admin_id = $1 WHERE report_id = $2', [admin_id, report_id]);
    if (result.rowCount > 0) {
        res.json({ message: "Admin added to report" });
    } else {
        res.status(400).json({ message: "Report not found" });
    }
});

//recupera segnalazioni per id admin
app.get('/admin-reports', protect, hasPermission('moderate_reports'), async (req, res) => {
    const admin_id = req.user.user_id;
    const result = await pool.query('SELECT * FROM reports WHERE admin_id = $1', [admin_id]);
    res.json({reports:result.rows});
});

//recupera segnalazioni senza id admin
app.get('/free-reports',protect, hasPermission('moderate_reports'), async (req, res) => {
    const result = await pool.query('SELECT * FROM reports WHERE admin_id IS NULL');
    res.json({reports:result.rows});
});

//elimina segnalazione
app.delete('/delete-report/:id', protect, hasPermission('moderate_reports'), async (req, res) => {
    const report_id = req.params.id;
    const result = await pool.query('DELETE FROM reports WHERE report_id = $1', [report_id]);
    if (result.rowCount > 0) {
        res.json({ message: "Report deleted" });
    } else {
        res.status(400).json({ message: "Report not found" });
    }
});


//gestione pagamenti

//crea il link per il pagamento su stripe e alla fine reindirizza il client automaticamente sul link succes_url
app.post("/create-checkout-session", protect, hasPermission('place_order'), async (req, res) => {
  try {
    const items = req.body.items;

    // Mappa gli articoli per Stripe
   const line_items = items.map(item => {
   const unitAmount = Math.round(item.price * 100); 

    return {
        price_data: {
        currency: "eur",
        product_data: {
            name: item.name,
        },
        unit_amount: unitAmount, // in centesimi
        },
        quantity: item.quantity,
    };
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: "http://127.0.0.1:3000/TrueOrder.html",//da cambiare
      cancel_url: "http://127.0.0.1:3000/index.html",// da cambiare
    });
    
    console.log(session.url)
    res.json({ url: session.url, id: session.id, paymentStatus: session.payment_status });
  } catch (err) {
    console.error("Errore Stripe:", err);
    res.status(500).json({ error: "Errore creazione sessione di pagamento" });
  }
});

//richiesta da fare quando viene reindirizzato nella nuova pagina per vedere lo stato del pagamento
app.get("/checkout-session/:id", async (req, res) => {
    console.log("ID sessione:", req.params.id);
    const session = await stripe.checkout.sessions.retrieve(req.params.id);
    res.json({session}); // contiene anche payment_status
});

// Invia un'email di conferma al cliente
app.post('/send-confirmation-email', protect, async (req, res) => {
    const { orderDetails } = req.body;
    const email = req.user.email;

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Conferma Ordine',
        text: `Grazie per il tuo ordine! Dettagli:\n${JSON.stringify(orderDetails, null, 2)}`
    };

    try {
        await transporter.sendMail(mailOptions);
        res.json({ message: 'Email di conferma inviata' });
    } catch (error) {
        console.error('Errore nell\'invio dell\'email:', error);
        res.status(500).json({ error: 'Errore nell\'invio dell\'email' });
    }
});


module.exports = {
    app,
    pool,
    generateToken,
    userState,
    categoryItemsCache
};

//route per verificare la comunicazione con il backend
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

//chiusura connessione al database quando il server viene chiuso
process.on('SIGINT', () => {
    pool.end(() => {
        console.log('Pool chiuso');
        process.exit(0);
    });
});