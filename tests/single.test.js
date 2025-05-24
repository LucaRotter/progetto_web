//Singoli test di funzioni da aggiungere poi in server.test.js
//AVVIARE QUESTO FILE CON IL COMANDO: npx jest single
const request = require('supertest');
const path = require('path');
const {app, pool} = require('../server2.js'); // o come importi la tua app



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
    expect(loginRes.body).toHaveProperty('user');
    expect(loginRes.body).toHaveProperty('permissions');

    // Verifica tipi e struttura
    expect(typeof loginRes.body.token).toBe('string');
    expect(typeof loginRes.body.user).toBe('object');
    expect(Array.isArray(loginRes.body.permissions)).toBe(true);
    console.log('Permissions:', loginRes.body.permissions);
    console.log('user:', loginRes.body.user);
    console.log('token:', loginRes.body.token);

    // Verifica che l'email corrisponda
    expect(loginRes.body.user.email).toBe(testUser.email);
  });
});

