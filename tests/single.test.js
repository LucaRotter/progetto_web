//Singoli test di funzioni da aggiungere poi in server.test.js
//AVVIARE QUESTO FILE CON IL COMANDO: npx jest single
const request = require('supertest');
const path = require('path');
const fs = require('fs');
const { app, pool, generateToken } = require('../server2'); // Assicurati che app e generateToken siano esportati

describe('get item', () => {
    it('should get an item by id', async () => {
        const itemId=2;
        const response = await request(app)
        .get(`/item/${itemId}`)
        expect(response.body).toHaveProperty('item');
        expect(response.body).toHaveProperty('category_name');
        console.log(response.body);
    });

    it('should get items by user id', async () => {
        const userId = 'A0001'; // Sostituisci con un ID utente valido
        const token = generateToken(userId);
        const response = await request(app)
        .get('/user-items/')
        .set('Authorization', `Bearer ${token}`)

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('items');
       
    });
    
});
