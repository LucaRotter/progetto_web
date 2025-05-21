
const request = require('supertest');
const path = require('path');
const app = require('../server2.js');  // Importa la tua app Express

describe('POST /upload', () => {
  test('dovrebbe caricare un file e restituire una URL', async () => {
    const response = await request(app)
      .post('/upload')
      .attach('immagine', path.join(__dirname, 'test.jpeg'));  // assicurati che test.jpeg esista

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('message', 'Upload riuscito!');
    expect(response.body).toHaveProperty('url');
    console.log('URL caricata:', response.body.url);
  });
});
