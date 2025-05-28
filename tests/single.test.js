//Singoli test di funzioni da aggiungere poi in server.test.js
//AVVIARE QUESTO FILE CON IL COMANDO: npx jest single
const request = require('supertest');
const path = require('path');
const fs = require('fs');
const { app, pool, generateToken } = require('../server2'); // Assicurati che app e generateToken siano esportati

describe('add item and update item', () => {
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

    it('update price of an item', async () => {
        const userId = 'A0001';
        const token = generateToken(userId);
        const response = await request(app)
            .put(`/update-price/${itemId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                price: 15.99,
            });
        expect(response.body).toHaveProperty('message', 'Price updated');
        expect(response.body).toHaveProperty('item');
        console.log(response.body);

    });
    it('should update quantity of an item', async () => {
        const userId = 'A0001';
        const token = generateToken(userId);
        const response = await request(app)
            .put(`/update-quantity/${itemId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                quantity: 10,
            });
        expect(response.body).toHaveProperty('message', 'Quantity updated');
        expect(response.body).toHaveProperty('item');
        console.log(response.body);
    });
    it('should update image of an item', async () => {
        const userId = 'A0001';
        const token = generateToken(userId);
        const imagePath = path.join(__dirname, 'test.jpeg');
        expect(fs.existsSync(imagePath)).toBe(true);
        const response = await request(app)
            .put(`/update-image/${itemId}`)
            .set('Authorization', `Bearer ${token}`)
            .attach('immagine', imagePath);
        expect(response.body).toHaveProperty('message', 'Image updated');
        expect(response.body).toHaveProperty('item');
        console.log(response.body);
    });
    it('should update name of an item', async () => {
        const userId = 'A0001';
        const token = generateToken(userId);
        const response = await request(app)
            .put(`/update-name/${itemId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'libroNuovo',
            });
            expect(response.body).toHaveProperty('message', 'Name updated');
            expect(response.body).toHaveProperty('item');
            console.log(response.body);
    });

    it('should update category of an item', async () => {
        const userId = 'A0001';
        const token = generateToken(userId);
        const response = await request(app)
            .put(`/update-category/${itemId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                category: 'food',
            });
            expect(response.body).toHaveProperty('message', 'Category updated');
            expect(response.body).toHaveProperty('item');
            console.log(response.body);

    });
    it('should update description of an item', async () => {
        const userId = 'A0001';
        const token = generateToken(userId);
        const response = await request(app)
            .put(`/update-description/${itemId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                description: 'This is a new description',
            });
            expect(response.body).toHaveProperty('message', 'Description updated');
            expect(response.body).toHaveProperty('item');
            console.log(response.body);
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
