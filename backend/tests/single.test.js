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

it('should update name of user by admin', async () => {
    const userId=3;
    const user_id = 6;
    const name= "prova";
    const surname= "cliente";
    const token = generateToken(userId);
    const response = await request(app)
        .put(`/update-name/${user_id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({name: name, surname: surname})
    
    expect(response.body).toEqual({ message: 'Name updated' });
});
it('should update pwd of user by admin', async () => {
    const userId=3;
    const user_id = 6;
    const newPassword= "password1";
    
    const token = generateToken(userId);
    const response = await request(app)
        .put(`/update-password/${user_id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({newPassword: newPassword})
    
    expect(response.body).toEqual({ message: 'Password updated' });
});

it('should update email of user by admin', async () => {
    const userId=3;
    const user_id = 6;
    const email= "marketrader69@gmail.com";
    
    const token = generateToken(userId);
    const response = await request(app)
        .put(`/update-email/${user_id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({newEmail: email})
    
    expect(response.body).toEqual({ message: 'Email updated' });
});


