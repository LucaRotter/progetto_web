//Singoli test di funzioni da aggiungere poi in server.test.js
//AVVIARE QUESTO FILE CON IL COMANDO: npx jest single
const request = require('supertest');
const path = require('path');
const fs = require('fs');
const { app, pool, generateToken, userState, categoryItemsCache } = require('../server2'); // Assicurati che app e generateToken siano esportati


describe('rewies',() => {
    it('should create a review', async () => {
        const userId = 6;
        const token = generateToken(userId);
        const response = await request(app)
          .post('/add-review')
          .set('Authorization', `Bearer ${token}`)
          .send({
            item_id: 1,
            description: 'great product',
            evaluation: 5
          });

        
        expect(response.body).toHaveProperty('message', 'Review added');
        expect(response.body).toHaveProperty('review');
    });

 });
