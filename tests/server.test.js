//PER ESEGUIRE IL TEST SU UNA describe specifica: npx jest -t "nome della describe"
const request = require('supertest');
const path = require('path');
const fs = require('fs');
const { app, pool, generateToken } = require('../server2.js');  // Importa la tua app Express

afterAll(async () => {
  await pool.end(); // Chiudi connessione al DB
});

let uploadedPublicId;  // variabile globale per salvare il publicId

//TEST INSERIMENTO E RIMOZIONE STESSA IMMAGINE
describe('upload and delete image', () => {
  describe('POST /upload', () => {
    test('dovrebbe caricare un file e restituire una URL e publicId', async () => {
      const response = await request(app)
        .post('/upload')
        .attach('immagine', path.join(__dirname, 'test.jpeg')); // assicurati che test.jpeg esista

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('message', 'Upload riuscito!');
      expect(response.body).toHaveProperty('url');
      expect(response.body).toHaveProperty('public_id');  // assumendo che la tua API restituisca anche public_id

      uploadedPublicId = response.body.public_id; // salva il publicId per il test successivo
      console.log('URL caricata:', response.body.url);
      console.log('Public ID:', uploadedPublicId);
    });
  });

  describe('DELETE /delete-image', () => {
    test('elimina un\'immagine e risponde con successo', async () => {
      expect(uploadedPublicId).toBeDefined(); // assicura che upload abbia già girato e settato questo valore

      const res = await request(app)
        .delete('/delete-image')
        .send({ publicId: uploadedPublicId });

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({ message: 'Immagine eliminata con successo' });
    });
  });
});

//TEST REGISTRAZIONE UTENTE
describe('POST /register', () => {
  // Pulizia: elimina utenti creati durante i test
  afterEach(async () => {
    await pool.query("DELETE FROM users WHERE email = 'testuser@example.com'");
  });

  test('registra un nuovo utente cliente (role_id = 1)', async () => {

    const res = await request(app)
      .post('/register')
      .send({
        name: 'Test',
        surname: 'User',
        email: 'testuser@example.com',
        pwd: 'testpassword',
        role: 'C'
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
    console.log('Token:', res.body.token);
    expect(res.body).toHaveProperty('user');

    const user = res.body.user;
    expect(user).toHaveProperty('user_id');
    expect(user.name).toBe('Test');
    expect(user.email).toBe('testuser@example.com');
  });

  test('impedisce registrazione se utente già esiste', async () => {
    // Crea utente iniziale
    await request(app).post('/register').send({
      name: 'Test',
      surname: 'User',
      email: 'testuser@example.com',
      pwd: 'testpassword',
      role: 'C'
    });

    // Prova a registrare di nuovo lo stesso utente
    const res = await request(app).post('/register').send({
      name: 'Test',
      surname: 'User',
      email: 'testuser@example.com',
      pwd: 'testpassword',
      role: 'C'
    });

    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ message: "User already exists" });
  });
});

//TEST REGISTRAZIONE E LOGIN PER RUOLO C o A
describe('Register and Login for role C or A', () => {
  const testUser = {
    name: 'Test',
    surname: 'User',
    email: 'testuser@example.com',
    pwd: 'testpassword',
    role: 'C',
  };

  // Pulizia dopo il test
  afterAll(async () => {
    await pool.query('DELETE FROM users WHERE email = $1', [testUser.email]);
  });

  it('should register and then login a user with role C', async () => {
    // 1. registrazione
    const registerRes = await request(app)
      .post('/register')
      .send(testUser);

    expect(registerRes.statusCode).toBe(200); // o 200 a seconda della tua implementazione
    expect(registerRes.body).toHaveProperty('token');
    expect(registerRes.body).toHaveProperty('user');
    console.log('user_id:', registerRes.body.user.user_id);
    console.log('role_id:', registerRes.body.user.role_id);


    // 2. login
    const loginRes = await request(app)
      .post('/login')
      .send({
        email: testUser.email,
        pwd: testUser.pwd,
        role: testUser.role
      });

    expect(loginRes.statusCode).toBe(200);
    expect(loginRes.body).toHaveProperty('token');

    // Verifica tipi e struttura
    expect(typeof loginRes.body.token).toBe('string');
    console.log('token:', loginRes.body.token);
  });
});

//TEST LOGIN PER ADMIN, se lancia un warning, perché manda l'email dopo la fine del test, ma funziona lo stesso
describe('Login for role Ad', () => {
  const testAdmin = {
    email: 'marketrader69@gmail.com',
    pwd: 'admin3',
    role: 'Ad',
  };
  it('should login as admin and return user info', async () => {
    const loginRes = await request(app)
      .post('/login')
      .send({
        email: testAdmin.email,
        pwd: testAdmin.pwd,
        role: testAdmin.role
      });

    expect(loginRes.statusCode).toBe(200);
    expect(loginRes.body).toHaveProperty('number');
    expect(loginRes.body).toHaveProperty('user');
    console.log('user:', loginRes.body.number);
    console.log('token:', loginRes.body.user);

    // Verifica che l'email corrisponda
    expect(loginRes.body.user.email).toBe(testAdmin.email);
  });
});

//TEST AGGIORNAMENTO IMMAGINE PROFILO
describe('Profile Picture Update', () => {
  beforeAll(() => {
    // Setta la chiave segreta usata per firmare/verificare il token
    process.env.JWT_SECRET = 'progetto_web_AbcDe1234';
  });

  test('PUT /profile-picture - should update profile picture successfully', async () => {
    const userId = 'C1000'; // 👈 ID utente già esistente nel DB
    const token = generateToken(userId); // Deve generare un JWT con { id: 'C1000' }
    const imagePath = path.join(__dirname, 'test.jpeg');

    // Verifica che il file immagine di test esista
    expect(fs.existsSync(imagePath)).toBe(true);

    const response = await request(app)
      .put('/profile-picture')
      .set('Authorization', `Bearer ${token}`)
      .attach('immagine', imagePath);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ message: 'Profile picture updated' });
  });

});

//FORGOT PASSWORD E RESET PASSWORD CON LA STESSA NEL DB

describe('POST /forgot-password and reset-password', () => {
  const testUser = {
    email: 'marketrader69@gmail.com',
    role: 'C'
  };
  test('should send reset email if user exists', async () => {
    const response = await request(app)
      .post('/forgot-password')
      .send(testUser)
      .expect(200);

    expect(response.body).toEqual({ message: 'Email sent' });
  });
  const testUserPdw = {
    email: 'marketrader69@gmail.com',
    newPassword: 'prova1',
    role: 'C'
  };
  test('should reset password', async () => {
    const response = await request(app)
      .post('/reset-password')
      .send(testUserPdw)
      .expect(200);

    expect(response.body).toEqual({ message: 'Password updated' });
  });
});

//CATEGORIE

describe('categories', () => {
  beforeAll(() => {
    // Setta la chiave segreta usata per firmare/verificare il token
    process.env.JWT_SECRET = 'progetto_web_AbcDe1234';
  });
  test('should return all categories', async () => {
    const response = await request(app)
      .get('/categories');
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.status).toBe(200);
  });
  describe('Category add and update', () => {
    const categoryName = 'Test Category';
    const updatedCategoryName = 'Updated Category Name';
    const categoryId = 'cat10'; // Assicurati che esista questa categoria per il test di update

    beforeAll(() => {
      // Setta la chiave segreta per JWT
      process.env.JWT_SECRET = 'progetto_web_AbcDe1234';
    });

    it('should add a new category', async () => {
      const userId = 'ad003'; // ID utente già esistente nel DB
      const token = generateToken(userId);
      const imagePath = path.join(__dirname, 'test.jpeg');
      expect(fs.existsSync(imagePath)).toBe(true);

      const response = await request(app)
        .post('/add-category')
        .set('Authorization', `Bearer ${token}`)
        .field('name', categoryName)
        .attach('immagine', imagePath);

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({ message: 'Category added' });

      const result = await pool.query('SELECT * FROM categories WHERE name = $1', [categoryName]);
      expect(result.rows.length).toBe(1);
    });

    it('should rename category', async () => {
      const userId = 'ad003';
      const token = generateToken(userId);

      const response = await request(app)
        .put(`/update-category-name/${categoryId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ name: updatedCategoryName });

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({ message: 'Category name updated' });

      const result = await pool.query('SELECT * FROM categories WHERE name = $1', [updatedCategoryName]);
      expect(result.rows.length).toBe(1);
    });

    //AGGIUNGERE LE ALTRE DESCRIBE QUI PRIMA DEL 'afterAll'

    afterAll(async () => {
      await pool.query("DELETE FROM categories WHERE name = $1", [categoryName]);
      await pool.query("DELETE FROM categories WHERE name = $1", [updatedCategoryName]);
    });
  });
});

