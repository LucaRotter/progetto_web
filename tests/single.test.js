//Singoli test di funzioni da aggiungere poi in server.test.js
//AVVIARE QUESTO FILE CON IL COMANDO: npx jest single
const request = require('supertest');
const path = require('path');
const fs = require('fs');
const { app, generateToken } = require('../server2'); // Assicurati che app e generateToken siano esportati
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