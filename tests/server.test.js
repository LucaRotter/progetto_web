//PER ESEGUIRE IL TEST SU UNA describe specifica: npx jest -t "nome della describe"
const request = require('supertest');
const path = require('path');
const { app, pool } = require('../server2.js');  // Importa la tua app Express

let uploadedPublicId;  // variabile globale per salvare il publicId

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
describe('Register and Login for role C or A', () => {
  const testUser = {
    name: 'Test',
    surname: 'User',
    email: 'testuser@example.com',
    pwd: 'testpassword',
    role: 'C',
  };

  // Pulizia prima o dopo i test se necessario
  afterAll(async () => {
    await pool.query('DELETE FROM users WHERE email = $1', [testUser.email]);
    await pool.end(); // Chiudi connessione al DB
  });

  it('should register and then login a user with role C', async () => {
    // 1. REGISTRAZIONE
    const registerRes = await request(app)
      .post('/register')
      .send(testUser);

    expect(registerRes.statusCode).toBe(200); // o 200 a seconda della tua implementazione
    expect(registerRes.body).toHaveProperty('token');
    expect(registerRes.body).toHaveProperty('user');
    console.log('user_id:', registerRes.body.user.user_id);
    console.log('role_id:', registerRes.body.user.role_id);
    

    // 2. LOGIN
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

//FARE TEST PER LOGIN DI ADMIN
