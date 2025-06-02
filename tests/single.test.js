//Singoli test di funzioni da aggiungere poi in server.test.js
//AVVIARE QUESTO FILE CON IL COMANDO: npx jest single
const request = require('supertest');
const path = require('path');
const fs = require('fs');
const { app, pool, generateToken, userState, categoryItemsCache } = require('../server2'); // Assicurati che app e generateToken siano esportati

const stripe = require('stripe')(process.env.SECRET_KEY_STRIPE);


it('should update password', async () => {
    const userId=6;
    const token = generateToken(userId);
    const response = await request(app)
        .put('/update-password')
        .set('Authorization', `Bearer ${token}`)
        .send({
            oldPassword: 'prova1',
            newPassword: 'prova1'
        });
    
    expect(response.body.message).toBe('Password updated');
});