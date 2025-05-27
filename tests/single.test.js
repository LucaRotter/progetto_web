//Singoli test di funzioni da aggiungere poi in server.test.js
//AVVIARE QUESTO FILE CON IL COMANDO: npx jest single
const request = require('supertest');
const path = require('path');
const fs = require('fs');
const { app,pool, generateToken } = require('../server2'); // Assicurati che app e generateToken siano esportati



describe('POST /add-category', () => {
    const categoryName = 'Test Category With Image';
beforeAll(() => {
    // Setta la chiave segreta usata per firmare/verificare il token
    process.env.JWT_SECRET = 'progetto_web_AbcDe1234';
  });
  afterAll(async () => {
    // Assicurati che il database sia connesso
    await pool.query("DELETE FROM categories WHERE name='Test Category'"); // Pulizia 
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
    // Verifica che la categoria sia davvero nel DB
    const result = await pool.query('SELECT * FROM categories WHERE name = $1', [categoryName]);
    expect(result.rows.length).toBe(1);
  });
});
