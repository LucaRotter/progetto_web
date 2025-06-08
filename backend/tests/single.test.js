//Singoli test di funzioni da aggiungere poi in server.test.js
//AVVIARE QUESTO FILE CON IL COMANDO: npx jest single
const request = require('supertest');
const path = require('path');
const fs = require('fs');
const { app, pool, generateToken, userState, categoryItemsCache } = require('../server2'); // Assicurati che app e generateToken siano esportati

const stripe = require('stripe')(process.env.SECRET_KEY_STRIPE);


it('should get all users for the admin', async () => {
    const userId=3;
    const token = generateToken(userId);
    const response = await request(app)
        .get('/users')
        .set('Authorization', `Bearer ${token}`)
    
    expect(response.body).toHaveProperty('users');
});
