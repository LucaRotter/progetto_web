// Importa le librerie necessarie
require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const nodemailer = require('nodemailer');// Includi nodemailer per l'invio di email
const cloudinary = require('cloudinary').v2; // Includi cloudinary per il caricamento delle immagini
const multer = require('multer'); // Includi multer per la gestione dei file
const stripe = require("stripe")(process.env.SECRET_KEY_STRIPE);//include stripe per i pagamenti





// INIZIALIZZAZIONE DEL SERVER E CONFIGURAZIONE DELLE VARIABILI DA USARE

const app = express();
app.use(express.json());
app.use(cors());
const port = 5432;


//connessione a PostgreSQL
const pool = new Pool({
  user: process.env.PG_USER,              
  host: process.env.PG_HOST,               
  database: process.env.PG_DATABASE,       
  password: process.env.PG_PASSWORD,       
  port: process.env.PG_PORT,
});

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

// Middleware verifica token
const protect = async (req, res, next) => {
    let token = req.headers.authorization;
    if (token && token.startsWith("Bearer ")) {
        try {
            token = token.split(" ")[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const userResult = await pool.query('SELECT * FROM users WHERE id = $1', [decoded.id]);
            req.user = userResult.rows[0];
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
    const result = await cloudinary.uploader.upload(filePath, { folder });
    fs.unlinkSync(filePath); // elimina il file temporaneo
    return result.secure_url;
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
const sendEmail = async (to, subject, text) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER, // Mittente
            to,                          // Destinatario
            subject,                     // Oggetto
            text                         // Corpo del messaggio
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email inviata: ' + info.response);
    } catch (error) {
        console.error('Errore nell\'invio dell\'email:', error);
    }
};

//verifica permission, DA INSERIRE NEI PARAMETRI DELLA CRUD ES: hasPermission(inserisci_articolo)
async function hasPermission(Permission_name) {
    return async (req, res, next) => {
      // Se i permessi non sono presenti nel token, li recuperiamo dal database
      if (!req.user.permissions) {
        try {
          const permissions = await getUserPermissions(req.user.id);  
          req.user.permessiions = permissions;  
  
          
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
        if (!req.user.permissions.includes(Permission_name)) {
          return res.status(403).json({ message: 'Permission denied' });
        }
        return next();  // Se l'utente ha il permesso, passa al prossimo middleware o alla route
      }
    };
}

//recupera permessi subito dopo aver effettuato il login
async function getUserPermissions(user_Id) {
    const query = `
      SELECT p.name AS permission
      FROM users u
      JOIN roles r ON u.role_id = r.role_id
      JOIN roles_permission rp ON r.role_id = rp.role_id
      JOIN permission p ON rp.permission_id = p.permission_id
      WHERE u.id = $1
    `;
  
    try {
      const result = await pool.query(query, [user_Id]);
      return result.rows.map(row => row.permission);
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
      const url = await uploadToCloudinary(req.file.path);
      res.json({ message: 'Upload riuscito!', url });
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
    role_id = await pool.query('SELECT role_id FROM roles WHERE name = $1', [role]); //fare la query per recuperare l'id del ruolo
    const hashedPassword = await bcrypt.hash(pwd, 10);

    const userResult = await pool.query('SELECT * FROM users WHERE email = $1 AND role_id = $2', [email, role_id]);
    if (userResult.rows.length > 0) {
        res.status(400).json({ message: "User already exists" });
    }

    //creazione id utente
    const user_id = "";
    if(role_id == 1){
        const number = await pool.query('SELECT COUNT(*) FROM users WHERE role_id = 1');
        const usersNumber = parseInt(number.rows[0].count) + 1;
        user_id = "C" + usersNumber.toString().padStart(4, '0');
    } else if(role_id == 2){
        const number = await pool.query('SELECT COUNT(*) FROM users WHERE role_id = 2');
        const usersNumber = parseInt(number.rows[0].count) + 1;
        user_id = "A" + usersNumber.toString().padStart(4, '0');
    } else if(role_id == 3){
        const number = await pool.query('SELECT COUNT(*) FROM users WHERE role_id = 3');
        const usersNumber = parseInt(number.rows[0].count) + 1;
        user_id = "Ad" + usersNumber.toString().padStart(3, '0');
    }

    const result = await pool.query(
        'INSERT INTO users (user_id, name, surname, email, pwd, role_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING user_id, name, email',
        [user_id, name, surname, email, hashedPassword, role_id]
    );
    const newUser = result.rows[0];
    res.json({ token: generateToken(newUser.id), user: newUser });
});

//login utente
app.post('/login', async (req, res) => {
    const { email, pwd, role } = req.body;
    role_id = await pool.query('SELECT role_id FROM roles WHERE name = $1', [role]); //fare la query per recuperare l'id del ruolo
    const userResult = await pool.query('SELECT * FROM users WHERE email = $1 AND role_id = $2', [email, role_id]);

    if (userResult.rows.length > 0) {
        const user = userResult.rows[0];
        if (await bcrypt.compare(pwd, user.pwd)) {
            if(role_id != 3){
                const permissions = await getUserPermissions(user.id);
                res.json({ token: generateToken(user.id), user: { id: user.id, name: user.name, surname: user.surname, email: user.email,
                    permissions : permissions
                 } });
            } else {
                const randomCode = Math.floor(10 + Math.random() * 90); // genera un numero casuale intero tra 10 e 99
                
                // genera e invia mail con il codice
                sendEmail(
                    email,
                    'Codice di accesso',
                    `Ciao ${user.name},\n\nIl tuo codice di accesso è: ${randomCode}\n\nBuon Lavoro!`
                );

                res.json({ number: randomCode, user: user });
            }
        } else {
            res.status(401).json({ message: "Invalid credentials" });
        }
    } else {
        res.status(401).json({ message: "Invalid credentials" });
    }
});

//aggiungi foto profilo utente
app.put('/profile-picture', uploadMiddleware.single('immagine'), protect, async (req, res) => {
    const url = await uploadToCloudinary(req.file.path);
    const user_id = req.user.id;
    const result = await pool.query('UPDATE users SET image_url = $1 WHERE id = $2', [url, user_id]);
    if (result.rowCount > 0) {
        res.json({ message: "Profile picture updated" });
    } else {
        res.status(400).json({ message: "User not found" });
    }
});


//CRUD PER RESET PASSWORD

//recupera password
app.post('/forgot-password', async (req, res) => {
    const { email, role } = req.body;
    role_id = await pool.query('SELECT role_id FROM roles WHERE name = $1', [role]); //fare la query per recuperare l'id del ruolo
    const userResult = await pool.query('SELECT * FROM users WHERE email = $1 && role_id = $2', [email, role_id]);
    if (userResult.rows.length > 0) {
        const user = userResult.rows[0];
        
        // Invia un'email con il link per il reset della password
        sendEmail(
            email,
            'Recupero Password',
            `Ciao ${user.name},\n\nPer favore clicca sul seguente link per reimpostare la tua password:\n\n((aggiungi link))\n\nGrazie!`
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
    role_id = await pool.query('SELECT role_id FROM roles WHERE name = $1', [role]);; //fare la query per recuperare l'id del ruolo
    const result = await pool.query('UPDATE users SET pwd = $1 WHERE email = $2 AND role_id = $3', [hashedPassword, email, role_id]);
    if (result.rowCount > 0) {
        res.json({ message: "Password updated" });
    } else {
        res.status(400).json({ message: "User not found" });
    }
});


//CRUD PER LA GESTIONE DEL CARRELLO

//inserimento articolo nel carrello
app.post('/cart', protect, async (req, res) => {
    const { item_id, quantity } = req.body;
    const user_id = req.user.id;
    const result = await pool.query('INSERT INTO cart (user_id, item_id, quantity) VALUES ($1, $2, $3)', [user_id, item_id, quantity]);
    res.json({ message: "Item added to cart" });
});

//articoli dal carrello
app.get('/cart/:id', protect, async (req, res) => {
    const user_id = req.params.id;
    const result = await pool.query('SELECT * FROM cart WHERE user_id = $1', [user_id]);
    res.json(result.rows);
});

//modifica quantità articolo nel carrello
app.put('/cart/:id', protect, async (req, res) => {
    const { quantity } = req.body;
    const user_id = req.user.id;
    const result = await pool.query('UPDATE cart SET quantity = $1 WHERE user_id = $2 AND item_id = $3', [quantity, user_id, req.params.id]);
    if (result.rowCount > 0) {
        res.json({ message: "Item updated in cart" });
    } else {
        res.status(400).json({ message: "Item not found in cart" });
    }
});

//rimozione articolo con id passato per parametro dal carrello dell'utente passato come token
app.delete('/cart/:id', protect, async (req, res) => {
    const user_id = req.user.id;
    const result = await pool.query('DELETE FROM cart WHERE user_id = $1 AND item_id = $2', [user_id, req.params.id]);
    if (result.rowCount > 0) {
        res.json({ message: "Item removed from cart" });
    } else {
        res.status(400).json({ message: "Item not found in cart" });
    }
});

//rimozione di tutti gli articoli dal carrello dell'utente con id passato per parametro
app.delete('/delete-cart/:id', protect, async (req, res) => {
    const user_id = req.params.id;
    const result = await pool.query('DELETE FROM cart WHERE user_id = $1', [user_id]);
    if (result.rowCount > 0) {
        res.json({ message: "Items removed from cart" });
    } else {
        res.status(400).json({ message: "Item not found in cart" });
    }
});


//CRUD PER LA GESTIONE DEGLI ARTICOLI

//aggiungi articolo
app.post('/add-item', async (req, res) => {
    const { item_id, user_id, name, category, description, price, quantity, image_url } = req.body;
    const category_id = await pool.query('SELECT category_id FROM categories WHERE name = $1', [category]);
    const result = await pool.query(
        'INSERT INTO items (item_id, user_id, name, category, description, price, quantity, image_url) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)', 
        [item_id, user_id, name, category_id, description, price, quantity, image_url]);
    res.json({ message: "Item added" });
});

//modifica prezzo articolo
app.put('/update-price/:id', async (req, res) => {
    const { price } = req.body;
    const item_id = req.params.id;
    const result = await pool.query('UPDATE items SET price = $1 WHERE item_id = $2', [price, item_id]);
    if (result.rowCount > 0) {
        res.json({ message: "Price updated" });
    } else {
        res.status(400).json({ message: "Item not found" });
    }
});

//modifica quantità articolo
app.put('/update-quantity/:id', async (req, res) => {
    const { quantity } = req.body;
    const item_id = req.params.id;
    const result = await pool.query('UPDATE items SET quantity = $1 WHERE item_id = $2', [quantity, item_id]);
    if (result.rowCount > 0) {
        res.json({ message: "Quantity updated" });
    } else {
        res.status(400).json({ message: "Item not found" });
    }
});

//modifica immagine articolo
app.put('/update-image/:id', uploadMiddleware.single('immagine'), async (req, res) => {
    const item_id = req.params.id;
    const url = await uploadToCloudinary(req.file.path);
    const result = await pool.query('UPDATE items SET image_url = $1 WHERE item_id = $2', [url, item_id]);
    if (result.rowCount > 0) {
        res.json({ message: "Image updated" });
    } else {
        res.status(400).json({ message: "Item not found" });
    }
});

//modifica nome articolo
app.put('/update-name/:id', async (req, res) => {
    const { name } = req.body;
    const item_id = req.params.id;
    const result = await pool.query('UPDATE items SET name = $1 WHERE item_id = $2', [name, item_id]);
    if (result.rowCount > 0) {
        res.json({ message: "Name updated" });
    } else {
        res.status(400).json({ message: "Item not found" });
    }
});

//modifica categoria articolo
app.put('/update-category/:id', async (req, res) => {
    const { category } = req.body;
    const item_id = req.params.id;
    const category_id = await pool.query('SELECT category_id FROM categories WHERE name = $1', [category]);
    const result = await pool.query('UPDATE items SET category = $1 WHERE item_id = $2', [category_id, item_id]);
    if (result.rowCount > 0) {
        res.json({ message: "Category updated" });
    } else {
        res.status(400).json({ message: "Item not found" });
    }
});

//modifica descrizione articolo
app.put('/update-description/:id', async (req, res) => {
    const { description } = req.body;
    const item_id = req.params.id;
    const result = await pool.query('UPDATE items SET description = $1 WHERE item_id = $2', [description, item_id]);
    if (result.rowCount > 0) {
        res.json({ message: "Description updated" });
    } else {
        res.status(400).json({ message: "Item not found" });
    }
});

//elimina articolo
app.delete('/delete-item/:id', async (req, res) => {
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
    res.json(result.rows);
});

//ricevi un elenco di articoli casuali con il numero di articoli specificato nel body della richiesta
let list_items = [];
let shuffledItems = [];

app.get('/random-items', async (req, res) => {
    const nItems = parseInt(req.query.nItems, 10);
    if (!nItems || isNaN(nItems)) {
        return res.status(400).json({ error: "Invalid or missing 'nItems' parameter" });
    }

    try {
        if (shuffledItems.length === 0) {
            const result = await pool.query('SELECT * FROM items');
            shuffledItems = result.rows.sort(() => 0.5 - Math.random());
        }
        let start = list_items.length;
        let end = start + nItems;
        if (end > shuffledItems.length) {
            end = shuffledItems.length;
        }
        const selectedItems = shuffledItems.slice(start, end);
        list_items.push(...selectedItems);

        if (list_items.length === shuffledItems.length) {
            list_items = [];
            shuffledItems = [];
        }

        res.json(selectedItems);

    } catch (err) {
        console.error("Errore durante il recupero degli articoli:", err);
        res.status(500).json({ error: "Errore interno del server" });
    }
});

//recupera articoli appartenenti ad una categoria
// Recupera articoli appartenenti a una categoria in modo casuale, senza ripetizioni nella sessione utente
const categoryItemsCache = {};

app.get('/category/:name', async (req, res) => {
    const category_name = req.params.name;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (limit * (page - 1));

    try {
        const categoryResult = await pool.query('SELECT category_id FROM categories WHERE name = $1', [category_name]);
        if (categoryResult.rows.length === 0) {
            return res.status(404).json({ message: "Category not found" });
        }
        const category_id = categoryResult.rows[0].category_id;

        // Usa una chiave per ogni categoria per mantenere la lista mescolata
        if (!categoryItemsCache[category_id]) {
            const allItemsResult = await pool.query('SELECT * FROM items WHERE category_id = $1', [category_id]);
            // Mescola gli articoli
            categoryItemsCache[category_id] = allItemsResult.rows.sort(() => 0.5 - Math.random());
        }

        const items = categoryItemsCache[category_id];
        const selectedItems = items.slice(offset, offset + limit);

        // Se abbiamo raggiunto la fine, resetta la cache per questa categoria
        if (offset + limit >= items.length) {
            delete categoryItemsCache[category_id];
        }

        res.json(selectedItems);
    } catch (err) {
        console.error("Errore durante il recupero degli articoli per categoria:", err);
        res.status(500).json({ error: "Errore interno del server" });
    }
});

//gestione pagamenti

//crea il link per il pagamento su stripe e alla fine reindirizza il client automaticamente sul link succes_url
app.post("/create-checkout-session", async (req, res) => {
  try {
    const items = req.body.items;

    // Mappa gli articoli per Stripe
    const line_items = items.map(item => ({
      price_data: {
        currency: "eur",
        product_data: {
          name: item.name,
        },
        unit_amount: item.price, // in centesimi
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: "https://res.cloudinary.com/dftu5zdbs/image/upload/v1746723876/test_upload/dwurd5vegcxqy4xgwfqb.jpg",//da cambiare
      cancel_url: "https://tuosito.com/cancel",// da cambiare
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error("Errore Stripe:", err);
    res.status(500).json({ error: "Errore creazione sessione di pagamento" });
  }
});

//richiesta da fare quando viene reindirizzato nella nuova pagina per vedere lo stato del pagamento
app.get("/checkout-session/:id", async (req, res) => {
  const session = await stripe.checkout.sessions.retrieve(req.params.id);
  res.json(session); // contiene anche payment_status
});//se il pagamento va a buon fine il front deve fare un sendmail


//listen server
app.listen(port, () => {
    console.log(`server running on http://localhost:${port}`)
});