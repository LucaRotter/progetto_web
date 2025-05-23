//TEST DI SINGOLE FUNZIONI DA AGGIUNGERE POI IN server.test.js
const request = require('supertest');
const app = require('../app'); // importa la tua app Express
const pool = require('../db');

describe('POST /register (integrazione)', () => {
  // Pulizia: elimina utenti creati durante i test
  afterEach(async () => {
    await pool.query("DELETE FROM users WHERE email = 'testuser@example.com'");
  });

  it('registra un nuovo utente cliente (role_id = 1)', async () => {
    // Assumiamo che il ruolo "cliente" esista con role_id = 1
    const res = await request(app)
      .post('/register')
      .send({
        name: 'Test',
        surname: 'User',
        email: 'testuser@example.com',
        pwd: 'testpassword',
        role: 'cliente'
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body).toHaveProperty('user');

    const user = res.body.user;
    expect(user).toHaveProperty('user_id');
    expect(user.name).toBe('Test');
    expect(user.email).toBe('testuser@example.com');
  });

  it('impedisce registrazione se utente già esiste', async () => {
    // Crea utente iniziale
    await request(app).post('/register').send({
      name: 'Test',
      surname: 'User',
      email: 'testuser@example.com',
      pwd: 'testpassword',
      role: 'cliente'
    });

    // Prova a registrare di nuovo lo stesso utente
    const res = await request(app).post('/register').send({
      name: 'Test',
      surname: 'User',
      email: 'testuser@example.com',
      pwd: 'testpassword',
      role: 'cliente'
    });

    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ message: "User already exists" });
  });
});