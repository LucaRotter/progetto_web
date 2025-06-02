//Singoli test di funzioni da aggiungere poi in server.test.js
//AVVIARE QUESTO FILE CON IL COMANDO: npx jest single
const request = require('supertest');
const path = require('path');
const fs = require('fs');
const { app, pool, generateToken, userState, categoryItemsCache } = require('../server2'); // Assicurati che app e generateToken siano esportati


describe('cart', () => {
    
  it('should add an item to the cart', async () => {
    const userId = 6;
    const token = generateToken(userId);
    const response = await request(app)
      .post('/cart')
      .set('Authorization', `Bearer ${token}`)
      .send({ item_id: 1, quantity: 2 });

    expect(response.body).toHaveProperty('message', 'Item added to cart');
  });
});