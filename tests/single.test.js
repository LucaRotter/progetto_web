//Singoli test di funzioni da aggiungere poi in server.test.js
//AVVIARE QUESTO FILE CON IL COMANDO: npx jest single
const request = require('supertest');
const path = require('path');
const { app, pool } = require('../server2.js'); // o come importi la tua app



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


