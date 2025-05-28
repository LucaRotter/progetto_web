//Singoli test di funzioni da aggiungere poi in server.test.js
//AVVIARE QUESTO FILE CON IL COMANDO: npx jest single
const request = require('supertest');
const path = require('path');
const fs = require('fs');
const { app,pool, generateToken } = require('../server2'); // Assicurati che app e generateToken siano esportati

describe('add item', () => {
     beforeAll(() => {
      // Setta la chiave segreta per JWT
      process.env.JWT_SECRET = 'progetto_web_AbcDe1234';
    });
   let itemId;

    it('should add an item', async () => {
        const userId = 'A0001';
        const token = generateToken(userId);
        const response = await request(app)
            .post('/add-item')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'libroProva',
                category: 'books',
                description: 'This is a test item',
                price: 10.99,
                quantity: 5,
                image_url: null,
            });
            expect(response.statusCode).toBe(200);
            expect(response.body).toHaveProperty('message', 'Item added');
            expect(response.body).toHaveProperty('item');
            itemId = response.body.item.item_id;
            console.log(itemId);
            
       
    });
    it('should delete an item', async () => {
        const userId = 'A0001';
        const token = generateToken(userId);
        const response = await request(app)
        .delete(`/delete-item/${itemId}`)
        .set('Authorization', `Bearer ${token}`)
        
        
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('message', 'Item deleted');
    });
    
});
