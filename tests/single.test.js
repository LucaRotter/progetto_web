//Singoli test di funzioni da aggiungere poi in server.test.js
//AVVIARE QUESTO FILE CON IL COMANDO: npx jest single
const request = require('supertest');
const path = require('path');
const fs = require('fs');
const { app, pool, generateToken, userState, categoryItemsCache } = require('../server2'); // Assicurati che app e generateToken siano esportati

describe('Single Function Tests', () => {
it('return  4 shuffled items by category', async() => {
    category = 'books';
    userId= '6';
    const token = generateToken(userId);
    const response = await request(app)
        .get(`/category-items/${category}`)
        .set('Authorization', `Bearer ${token}`)
        .query({ nItems: 4 });
        
   
        expect(response.body).toHaveProperty('selectedItems');
        expect(response.body.selectedItems).toHaveLength(4);
        console.log(response.body.selectedItems);
        console.log(categoryItemsCache);
 
});
it('return  1 shuffled items by category', async() => {
    category = 'books';
    userId= '6';
    const token = generateToken(userId);
    const response = await request(app)
        .get(`/category-items/${category}`)
        .set('Authorization', `Bearer ${token}`)
        .query({ nItems: 5 });
        
   
        expect(response.body).toHaveProperty('selectedItems');
        expect(response.body.selectedItems).toHaveLength(1);
        console.log(response.body.selectedItems);
        console.log(categoryItemsCache);
 
});
it('return error items by category', async() => {
    category = 'books';
    userId= '6';
    const token = generateToken(userId);
    const response = await request(app)
        .get(`/category-items/${category}`)
        .set('Authorization', `Bearer ${token}`)
        .query({ nItems: 3 });
        
        expect(response.body).toHaveProperty('error','Nessun altro elemento disponibile');
        
 
});
it('return  4 shuffled items by category by a guest', async() => {
    category = 'books';
    
    
    const response = await request(app)
        .get(`/category-items/${category}`)
        .query({ nItems: 4 });
        
   
        expect(response.body).toHaveProperty('selectedItems');
        expect(response.body.selectedItems).toHaveLength(4);
        console.log(response.body.selectedItems);
        console.log(categoryItemsCache);
 
});
it('return  1 shuffled items by category by a guest', async() => {
    category = 'books';
    
    
    const response = await request(app)
        .get(`/category-items/${category}`)
        .query({ nItems: 5 });
        
   
        expect(response.body).toHaveProperty('selectedItems');
        expect(response.body.selectedItems).toHaveLength(1);
        console.log(response.body.selectedItems);
        console.log(categoryItemsCache);
 
});
it('deletes shuffled items of user', async () => {
    category = 'books';
    userId= '6';
    const token = generateToken(userId);
    
    const response = await request(app)
      .delete(`/reset-category-items/${category}`)
      .set('Authorization', `Bearer ${token}`);
    expect(response.body).toHaveProperty('message', 'Lista resettata');
  });
  it('deletes shuffled items of user', async () => {
    category = 'books';
    const response = await request(app)
      .delete(`/reset-category-items/${category}`)
    expect(response.body).toHaveProperty('message', 'Lista resettata');
  });

});