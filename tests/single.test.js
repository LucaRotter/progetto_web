//Singoli test di funzioni da aggiungere poi in server.test.js
//AVVIARE QUESTO FILE CON IL COMANDO: npx jest single
const request = require('supertest');
const path = require('path');
const fs = require('fs');
const { app, pool, generateToken, userState, categoryItemsCache } = require('../server2'); // Assicurati che app e generateToken siano esportati

test('get user',  async() => {
    const userId = '6';
    const token = generateToken(userId)
    const response = await request(app)
        .get('/user')
        .set('Authorization', `Bearer ${token}`)

        expect(response.body).toHaveProperty('user');
        console.log('User:', response.body.user);

});
test('change name user',  async() => {
    const userId = '6';
    const token = generateToken(userId)
    const response = await request(app)
        .put('/update-name')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'prova', surname: 'cliente' });

        expect(response.body).toHaveProperty('message', 'Name updated');
});
test('get user from admin',  async() => {
    const userId = '6';
    const adminId = '3'; // Assicurati che l'admin abbia ID 1
    const token = generateToken(adminId)
    const response = await request(app)
        .get(`/user/${userId}`)
        .set('Authorization', `Bearer ${token}`)

        expect(response.body).toHaveProperty('user');
        console.log('User:', response.body.user);

});
test('delete user',  async() => {
    const user_id = '7';
    const name = 'prova';
    const surname = 'cliente';
    const email = 'rotterluca@gmail.com';
    const hashedPassword = 'hashedPassword';
    const role_id = '1';
    pool.query('INSERT INTO users (user_id, name, surname, email, pwd, role_id) VALUES ($1, $2, $3, $4, $5, $6)',
        [user_id, name, surname, email, hashedPassword, role_id]);
    const userId = '7';
    const token = generateToken(userId)
    const response = await request(app)
        .delete('/user')
        .set('Authorization', `Bearer ${token}`)

        expect(response.body).toHaveProperty('message', 'User deleted');
});
test('delete user',  async() => {
    const user_id = '7';
    const name = 'prova';
    const surname = 'cliente';
    const email = 'rotterluca@gmail.com';
    const hashedPassword = 'hashedPassword';
    const role_id = '1';
    pool.query('INSERT INTO users (user_id, name, surname, email, pwd, role_id) VALUES ($1, $2, $3, $4, $5, $6)',
        [user_id, name, surname, email, hashedPassword, role_id]);
    const userId = '3';
    const token = generateToken(userId)
    const response = await request(app)
        .delete(`/user/${user_id}`)
        .set('Authorization', `Bearer ${token}`)

        expect(response.body).toHaveProperty('message', 'User deleted');
});
