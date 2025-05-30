//Singoli test di funzioni da aggiungere poi in server.test.js
//AVVIARE QUESTO FILE CON IL COMANDO: npx jest single
const request = require('supertest');
const path = require('path');
const fs = require('fs');
const { app, pool, generateToken } = require('../server2'); // Assicurati che app e generateToken siano esportati

describe('get items', () => {
    it('should items with filters', async () => {
        const response = await request(app)
            .get('/items')
            .query({
                name: 'item',
                category: 'electronics',
                maxPrice: '43',
                
            });
            

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('items');
        console.log(response.body);
    });
    
});
