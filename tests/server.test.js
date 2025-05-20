const request = require('supertest');
const app = require('../server'); // il tuo server Express

describe('Test API CRUD', () => {
  let createdId;

  // CREATE
  test('POST /items crea un nuovo item', async () => {
    const response = await request(app)
      .post('/items')
      .send({ name: 'Test Item', description: 'Descrizione' });
    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('id');
    createdId = response.body.id; // salva id per altri test
  });

  // READ
  test('GET /items/:id legge un item', async () => {
    const response = await request(app)
      .get(`/items/${createdId}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.name).toBe('Test Item');
  });

  // UPDATE
  test('PUT /items/:id aggiorna un item', async () => {
    const response = await request(app)
      .put(`/items/${createdId}`)
      .send({ name: 'Test Item Aggiornato' });
    expect(response.statusCode).toBe(200);
    expect(response.body.name).toBe('Test Item Aggiornato');
  });

  // DELETE
  test('DELETE /items/:id elimina un item', async () => {
    const response = await request(app)
      .delete(`/items/${createdId}`);
    expect(response.statusCode).toBe(204);
  });
});