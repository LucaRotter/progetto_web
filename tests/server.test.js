//PER ESEGUIRE IL TEST SU UNA describe specifica: npx jest -t "nome della describe"
const request = require('supertest');
const path = require('path');
const fs = require('fs');
const { app, pool, generateToken, userState, categoryItemsCache } = require('../server2.js');  // Importa la tua app Express

afterAll(async () => {
  await pool.end(); // Chiudi connessione al DB
});

let uploadedPublicId;  // variabile globale per salvare il publicId

//TEST INSERIMENTO E RIMOZIONE STESSA IMMAGINE
describe('upload and delete image', () => {
  describe('POST /upload', () => {
    test('dovrebbe caricare un file e restituire una URL e publicId', async () => {
      const response = await request(app)
        .post('/upload')
        .attach('immagine', path.join(__dirname, 'test.jpeg')); // assicurati che test.jpeg esista

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('message', 'Upload riuscito!');
      expect(response.body).toHaveProperty('url');
      expect(response.body).toHaveProperty('public_id');  // assumendo che la tua API restituisca anche public_id

      uploadedPublicId = response.body.public_id; // salva il publicId per il test successivo
      console.log('URL caricata:', response.body.url);
      console.log('Public ID:', uploadedPublicId);
    });
  });

  describe('DELETE /delete-image', () => {
    test('elimina un\'immagine e risponde con successo', async () => {
      expect(uploadedPublicId).toBeDefined(); // assicura che upload abbia già girato e settato questo valore

      const res = await request(app)
        .delete('/delete-image')
        .send({ publicId: uploadedPublicId });

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({ message: 'Immagine eliminata con successo' });
    });
  });
});

//TEST REGISTRAZIONE UTENTE
describe('register', () => {
  // Pulizia: elimina utenti creati durante i test
  afterEach(async () => {
    await pool.query("DELETE FROM users WHERE email = 'testuser@example.com'");
  });

  test('registra un nuovo utente cliente (role_id = 1)', async () => {

    const res = await request(app)
      .post('/register')
      .send({
        name: 'Test',
        surname: 'User',
        email: 'testuser@example.com',
        pwd: 'testpassword',
        role: 'C'
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
    console.log('Token:', res.body.token);
    expect(res.body).toHaveProperty('user');

    const user = res.body.user;
    expect(user).toHaveProperty('user_id');
    expect(user.name).toBe('Test');
    expect(user.email).toBe('testuser@example.com');
  });

  test('impedisce registrazione se utente già esiste', async () => {
    // Crea utente iniziale
    await request(app).post('/register').send({
      name: 'Test',
      surname: 'User',
      email: 'testuser@example.com',
      pwd: 'testpassword',
      role: 'C'
    });

    // Prova a registrare di nuovo lo stesso utente
    const res = await request(app).post('/register').send({
      name: 'Test',
      surname: 'User',
      email: 'testuser@example.com',
      pwd: 'testpassword',
      role: 'C'
    });

    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ message: "User already exists" });
  });
});

//TEST REGISTRAZIONE E LOGIN PER RUOLO C o A
describe('Register and Login for role C or A', () => {
  const testUser = {
    name: 'Test',
    surname: 'User',
    email: 'testuser@example.com',
    pwd: 'testpassword',
    role: 'C',
  };

  // Pulizia dopo il test
  afterAll(async () => {
    await pool.query('DELETE FROM users WHERE email = $1', [testUser.email]);
  });

  it('should register and then login a user with role C', async () => {
    // 1. registrazione
    const registerRes = await request(app)
      .post('/register')
      .send(testUser);

    expect(registerRes.statusCode).toBe(200); // o 200 a seconda della tua implementazione
    expect(registerRes.body).toHaveProperty('token');
    expect(registerRes.body).toHaveProperty('user');
    console.log('user_id:', registerRes.body.user.user_id);
    console.log('role_id:', registerRes.body.user.role_id);


    // 2. login
    const loginRes = await request(app)
      .post('/login')
      .send({
        email: testUser.email,
        pwd: testUser.pwd,
        role: testUser.role
      });

    expect(loginRes.statusCode).toBe(200);
    expect(loginRes.body).toHaveProperty('token');

    // Verifica tipi e struttura
    expect(typeof loginRes.body.token).toBe('string');
    console.log('token:', loginRes.body.token);
  });
});

//TEST LOGIN PER ADMIN, se lancia un warning, perché manda l'email dopo la fine del test, ma funziona lo stesso
describe('Login for role Ad', () => {
  const testAdmin = {
    email: 'marketrader69@gmail.com',
    pwd: 'admin3',
    role: 'Ad',
  };
  it('should login as admin and return user info', async () => {
    const loginRes = await request(app)
      .post('/login')
      .send({
        email: testAdmin.email,
        pwd: testAdmin.pwd,
        role: testAdmin.role
      });

    expect(loginRes.statusCode).toBe(200);
    expect(loginRes.body).toHaveProperty('number');
    expect(loginRes.body).toHaveProperty('user');
    console.log('user:', loginRes.body.number);
    console.log('token:', loginRes.body.user);

    // Verifica che l'email corrisponda
    expect(loginRes.body.user.email).toBe(testAdmin.email);
  });
});

//TEST AGGIORNAMENTO IMMAGINE PROFILO
describe('Profile Picture Update', () => {
  beforeAll(() => {
    // Setta la chiave segreta usata per firmare/verificare il token
    process.env.JWT_SECRET = 'progetto_web_AbcDe1234';
  });

  test('PUT /profile-picture - should update profile picture successfully', async () => {
    const userId = '6'; // 👈 ID utente già esistente nel DB
    const token = generateToken(userId); // Deve generare un JWT con { id: 'C1000' }
    const imagePath = path.join(__dirname, 'test.jpeg');

    // Verifica che il file immagine di test esista
    expect(fs.existsSync(imagePath)).toBe(true);

    const response = await request(app)
      .put('/profile-picture')
      .set('Authorization', `Bearer ${token}`)
      .attach('immagine', imagePath);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ message: 'Profile picture updated' });
  });

});
//TEST GET USER E DELETE
describe('GET user and DELETE user', () => {
  test('get user', async () => {
    const userId = '6';
    const token = generateToken(userId)
    const response = await request(app)
      .get('/user')
      .set('Authorization', `Bearer ${token}`)

    expect(response.body).toHaveProperty('user');
    console.log('User:', response.body.user);

  });
  test('change name user', async () => {
    const userId = '6';
    const token = generateToken(userId)
    const response = await request(app)
      .put('/update-name')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'prova', surname: 'cliente' });

    expect(response.body).toHaveProperty('message', 'Name updated');
  });
  test('get user from admin', async () => {
    const userId = '6';
    const adminId = '3'; // Assicurati che l'admin abbia ID 1
    const token = generateToken(adminId)
    const response = await request(app)
      .get(`/user/${userId}`)
      .set('Authorization', `Bearer ${token}`)

    expect(response.body).toHaveProperty('user');
    console.log('User:', response.body.user);

  });
  it('get item by email e and role', async () => {
    const userId = 3;
    const token = generateToken(userId);
    const email = 'marketrader69@gmail.com';
    const role = 'C';
    const response = await request(app)
      .get('/user-by-email')
      .set('Authorization', `Bearer ${token}`)
      .send({ email, role });


    expect(response.body).toHaveProperty('user_id');
    console.log('Response body:', response.body);

  });

  test('delete user', async () => {
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
  test('delete user', async () => {
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
});
//FORGOT PASSWORD E RESET PASSWORD CON LA STESSA NEL DB

describe('POST /forgot-password and reset-password', () => {
  const testUser = {
    email: 'marketrader69@gmail.com',
    role: 'C'
  };
  test('should send reset email if user exists', async () => {
    const response = await request(app)
      .post('/forgot-password')
      .send(testUser)
      .expect(200);

    expect(response.body).toEqual({ message: 'Email sent' });
  });
  const testUserPdw = {
    email: 'marketrader69@gmail.com',
    newPassword: 'prova1',
    role: 'C'
  };
  test('should reset password', async () => {
    const response = await request(app)
      .post('/reset-password')
      .send(testUserPdw)
      .expect(200);

    expect(response.body).toEqual({ message: 'Password updated' });
  });
});

//CATEGORIE

describe('categories', () => {
  beforeAll(() => {
    // Setta la chiave segreta usata per firmare/verificare il token
    process.env.JWT_SECRET = 'progetto_web_AbcDe1234';
  });
  test('should return all categories', async () => {
    const response = await request(app)
      .get('/categories');
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.status).toBe(200);
  });
  describe('Category add and update', () => {
    const categoryName = 'Test Category';
    const updatedCategoryName = 'Updated Category Name';
    let categoryId; // Variabile per memorizzare l'ID della categoria

    beforeAll(() => {
      // Setta la chiave segreta per JWT
      process.env.JWT_SECRET = 'progetto_web_AbcDe1234';
    });

    it('should add a new category', async () => {
      const userId = '3'; // ID utente già esistente nel DB
      const token = generateToken(userId);
      const imagePath = path.join(__dirname, 'test.jpeg');
      expect(fs.existsSync(imagePath)).toBe(true);

      const response = await request(app)
        .post('/add-category')
        .set('Authorization', `Bearer ${token}`)
        .field('name', categoryName)
        .attach('immagine', imagePath);

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('message', 'Category added');
      expect(response.body).toHaveProperty('category_id');
      categoryId = response.body.category_id;
      console.log('Category ID:', categoryId); // Log per verificare l'ID della categoria

      const result = await pool.query('SELECT * FROM categories WHERE name = $1', [categoryName]);
      expect(result.rows.length).toBe(1);
    });
    it('should rename category', async () => {
      const userId = '3';
      const token = generateToken(userId);

      const response = await request(app)
        .put(`/update-category-name/${categoryId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ name: updatedCategoryName });

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({ message: 'Category name updated' });

      const result = await pool.query('SELECT * FROM categories WHERE name = $1', [updatedCategoryName]);
      expect(result.rows.length).toBe(1);
    });

    it('should update category image', async () => {
      const userId = '3'; // ID utente già esistente nel DB
      const token = generateToken(userId);
      const imagePath = path.join(__dirname, 'test.jpeg');
      expect(fs.existsSync(imagePath)).toBe(true);

      const response = await request(app)
        .put(`/update-category-image/${categoryId}`)
        .set('Authorization', `Bearer ${token}`)
        .attach('immagine', imagePath);

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({ message: 'Category image updated' });

      const result = await pool.query('SELECT * FROM categories WHERE category_id = $1', [categoryId]);
      expect(result.rows.length).toBe(1);
    });
    test('should delete category', async () => {
      const userId = '3';
      const token = generateToken(userId);

      const response = await request(app)
        .delete(`/delete-category/${categoryId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({ message: 'Category deleted' });

      const result = await pool.query('SELECT * FROM categories WHERE category_id = $1', [categoryId]);
      expect(result.rows.length).toBe(0);
    });

  });
});

//TEST ITEMS

describe('items', () => {
  describe('add item and update item', () => {
    beforeAll(() => {
      // Setta la chiave segreta per JWT
      process.env.JWT_SECRET = 'progetto_web_AbcDe1234';
    });
    let itemId;

    it('should add an item', async () => {
      const userId = '5';
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
      const userId = '5';
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
      const userId = '5';
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
      const userId = '5';
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
      const userId = '5';
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
      const userId = '5';
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
      const userId = '5';
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
      const userId = '5';
      const token = generateToken(userId);
      const response = await request(app)
        .delete(`/delete-item/${itemId}`)
        .set('Authorization', `Bearer ${token}`)


      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('message', 'Item deleted');
    });

  });
  describe('get item', () => {
    it('should get an item by id', async () => {
      const itemId = 2;
      const response = await request(app)
        .get(`/item/${itemId}`)
      expect(response.body).toHaveProperty('item');
      expect(response.body).toHaveProperty('category_name');
      console.log(response.body);
    });
    it('get item by name, price, category and description', async () => {
      const response = await request(app)
        .get('/itemgetId')
        .send({
          name: 'Item 1',
          price: 10.50,
          category: 'books',
          description: 'Description for item 1'
        });


      expect(response.body).toHaveProperty('item_id');

    });

    it('should get items by user id', async () => {
      const userId = '5';
      const token = generateToken(userId);
      const response = await request(app)
        .get('/user-items/')
        .set('Authorization', `Bearer ${token}`)

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('items');

    });

  });
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
  describe('shuffled items', () => {
    const userId = 6;
    const token = generateToken(userId);

    it('should return two batches of items for same user', async () => {
      const response1 = await request(app)
        .get('/random-items')
        .set('Authorization', `Bearer ${token}`)
        .query({ nItems: 27 });

      expect(response1.body.selectedItems).toHaveLength(27);

      const response2 = await request(app)
        .get('/random-items')
        .set('Authorization', `Bearer ${token}`)
        .query({ nItems: 5 });

      expect(response2.body.selectedItems).toHaveLength(3);

      const response3 = await request(app)
        .get('/random-items')
        .set('Authorization', `Bearer ${token}`)
        .query({ nItems: 5 });

      expect(response3.body).toHaveProperty('error', 'Nessun altro elemento disponibile');
    });

    it('should return two batches for guest user', async () => {
      const response1 = await request(app)
        .get('/random-items')
        .query({ nItems: 5 });

      expect(response1.body.selectedItems).toHaveLength(5);
      console.log(response1.body.selectedItems);

      const response2 = await request(app)
        .get('/random-items')
        .query({ nItems: 5 });

      expect(response2.body.selectedItems).toHaveLength(5);
      console.log(response2.body.selectedItems);
    });
    it('deletes shuffled items of user', async () => {
      const response = await request(app)
        .delete('/reset-items')
        .set('Authorization', `Bearer ${token}`);
      expect(response.body).toHaveProperty('message', 'Lista resettata');
    });
    it('deletes shuffled items of guest', async () => {
      const response = await request(app)
        .delete('/reset-items')
      expect(response.body).toHaveProperty('message', 'Lista resettata');
    });
  });



  afterAll(async () => {
    userState.clear();
    await pool.query('DELETE FROM shuffled');
  });
  describe('shuffled items category', () => {
    it('return  4 shuffled items by category', async () => {
      category = 'books';
      userId = '6';
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
    it('return  1 shuffled items by category', async () => {
      category = 'books';
      userId = '6';
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
    it('return error items by category', async () => {
      category = 'books';
      userId = '6';
      const token = generateToken(userId);
      const response = await request(app)
        .get(`/category-items/${category}`)
        .set('Authorization', `Bearer ${token}`)
        .query({ nItems: 3 });

      expect(response.body).toHaveProperty('error', 'Nessun altro elemento disponibile');


    });
    it('return  4 shuffled items by category by a guest', async () => {
      category = 'books';


      const response = await request(app)
        .get(`/category-items/${category}`)
        .query({ nItems: 4 });


      expect(response.body).toHaveProperty('selectedItems');
      expect(response.body.selectedItems).toHaveLength(4);
      console.log(response.body.selectedItems);
      console.log(categoryItemsCache);

    });
    it('return  1 shuffled items by category by a guest', async () => {
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
      userId = '6';
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


});

//TEST ORDINI

describe('orders', () => {
  let orderId1;
  it('should add an order', async () => {
    const userId = '6';
    const token = generateToken(userId);
    const response = await request(app)

      .post('/add-order')
      .set('Authorization', `Bearer ${token}`)
      .send({
        items: [
          { item_id: '30', quantity: 2 },
          { item_id: '7', quantity: 5 },
          { item_id: '13', quantity: 1 }
        ],
        address: 'Via Roma',
        civic_number: '10A',
        postal_code: '21100',
        province: 'VA',
        country: 'Italia',
        phone_number: '34567890127'
      });

    expect(response.body).toHaveProperty('message', 'Order added');
    expect(response.body).toHaveProperty('order_id');
    orderId1 = response.body.order_id;
    console.log(orderId1);

  });
  describe('should change order state', () => {
    it('should update order state', async () => {
      const userId = '5';
      const token = generateToken(userId);
      const OrderId = '1';
      const response = await request(app)

        .put(`/update-order/${OrderId}`)
        .set('Authorization', `Bearer ${token}`)
      expect(response.body).toHaveProperty('message', 'Order updated');

    });
    afterAll(async () => {
      //rimetti lo stato iniziale dell'ordine
      const OrderId = '1';
      const resetOrderQuery = 'UPDATE orders SET state = $1 WHERE order_id = $2';
      await pool.query(resetOrderQuery, ['confirmed', OrderId]);
    });
  });
  describe('get orders', () => {
    it('should get orders by customer', async () => {
      const userId = '6';
      const token = generateToken(userId);
      const response = await request(app)

        .get('/customer-orders')
        .set('Authorization', `Bearer ${token}`)
      expect(response.body).toHaveProperty('orders');


    });
    it('should get orders by artisan', async () => {
      const userId = '5';
      const token = generateToken(userId);
      const response = await request(app)

        .get('/artisan-orders')
        .set('Authorization', `Bearer ${token}`)
      expect(response.body).toHaveProperty('orders');

    });
    it('should get orders by admin', async () => {
      const OrderId = '1';
      const userId = '3';
      const token = generateToken(userId);
      const response = await request(app)

        .get(`/admin-orders/${OrderId}`)
        .set('Authorization', `Bearer ${token}`)
      expect(response.body).toHaveProperty('orders');

    });
    it('should delete order', async () => {
      const userId = '3';
      const token = generateToken(userId);
      const response = await request(app)
        .delete(`/delete-orders/${orderId1}`)
        .set('Authorization', `Bearer ${token}`);
      expect(response.body).toHaveProperty('message', 'Order deleted');
    });

  });


});

//REVIEWS

describe('reviews', () => {
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
  it('should get reviews for an item', async () => {
    const itemId = 1;
    const response = await request(app)
      .get(`/reviews/${itemId}`);
    expect(response.body).toHaveProperty('reviews');
    console.log(response.body.reviews);
  });
  it('should get avarage rating for an item', async () => {
    const itemId = 1;
    await pool.query(
      'INSERT INTO reviews (review_id, item_id, user_id, description, evaluation) VALUES ($1, $2, $3, $4, $5)',
      [2, 1, 6, 'test review', 3]
    );
    const response = await request(app)
      .get(`/average-rating/${itemId}`);
    expect(response.body).toHaveProperty('average');
    console.log(response.body.average);
    await pool.query(
      'DELETE FROM reviews WHERE review_id = $1',
      [2]
    );
  });
  it('get id review', async () => {
    const userId = 3;
    const token = generateToken(userId);
    const response = await request(app)
      .get('/review-id')
      .send({
        item_id: 1,
        user_id: 6
      })
      .set('Authorization', `Bearer ${token}`);
    expect(response.body).toHaveProperty('review_id');
  });
  it('should get review by id', async () => {
    const UserId = 3;
    const token = generateToken(UserId);
    const reviewId = 1;
    const response = await request(app)
      .get(`/review/${reviewId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(response.body).toHaveProperty('review');

  });

  it('should delete a review from user', async () => {
    const userId = 6;
    const itemId = 1;
    const token = generateToken(userId);
    const response = await request(app)
      .delete(`/delete-review/${itemId}`)
      .set('Authorization', `Bearer ${token}`)
    expect(response.body).toHaveProperty('message', 'Review deleted');
  });
  it('should delete a review from admin', async () => {
    await pool.query(
      'INSERT INTO reviews (review_id, item_id, user_id, description, evaluation) VALUES ($1, $2, $3, $4, $5)',
      [1, 1, 6, 'test review', 5]
    );
    const userId = 3;
    const itemId = 1;
    const token = generateToken(userId);
    const response = await request(app)
      .delete(`/delete-review/${itemId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        user_id: 6
      });

    expect(response.body).toHaveProperty('message', 'Review deleted');
  });

});

//CARRELLO

describe('carts', () => {

  it('should add an item to the cart', async () => {
    const userId = 6;
    const token = generateToken(userId);
    const response = await request(app)
      .post('/cart')
      .set('Authorization', `Bearer ${token}`)
      .send({ item_id: 1, quantity: 2 });

    expect(response.body).toHaveProperty('message', 'Item added to cart');
  });
  it('should get the cart items', async () => {
    const userId = 6;
    const token = generateToken(userId);
    const response = await request(app)
      .get('/cart')
      .set('Authorization', `Bearer ${token}`);

    expect(response.body).toHaveProperty('items');
    expect(Array.isArray(response.body.items)).toBe(true);
  });
  it('should update the quantity of an item in the cart', async () => {
    const userId = 6;
    const itemId = 1;
    const token = generateToken(userId);
    const response = await request(app)
      .put(`/cart/${itemId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ quantity: 3 });

    expect(response.body).toHaveProperty('message', 'Item updated in cart');
  });
  it('should get number of items in the cart', async () => {
    await pool.query('INSERT INTO carts (user_id, item_id, quantity) VALUES ($1, $2, $3)', [6, 2, 2]);
    const userId = 6;
    const token = generateToken(userId);
    const response = await request(app)
      .get('/cart-count')
      .set('Authorization', `Bearer ${token}`);

    expect(response.body).toHaveProperty('count');
    console.log('Cart count:', response.body.count);

  });
  it('should get the total number of items in the cart', async () => {

    const userId = 6;
    const token = generateToken(userId);
    const response = await request(app)
      .get('/cart-total')
      .set('Authorization', `Bearer ${token}`);

    expect(response.body).toHaveProperty('total');
    console.log('Cart total:', response.body.total);
    await pool.query('DELETE FROM carts WHERE item_id = $1', [3]);
  });
  it('should get the total price of items in the cart', async () => {
    const userId = 6;
    const token = generateToken(userId);
    const response = await request(app)
      .get('/cart-price')
      .set('Authorization', `Bearer ${token}`);

    expect(response.body).toHaveProperty('totalPrice');
    console.log('Cart total price:', response.body.totalPrice);
  });

  it('deletes an item from the cart', async () => {
    const userId = 6;
    const itemId = 1;
    const token = generateToken(userId);
    const response = await request(app)
      .delete(`/cart/${itemId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.body).toHaveProperty('message', 'Item removed from cart');
  });
  it('should remove all items from the cart', async () => {
    await pool.query('INSERT INTO carts (user_id, item_id, quantity) VALUES ($1, $2, $3)', [6, 1, 2]);
    const userId = 6;
    const token = generateToken(userId);
    const response = await request(app)
      .delete('/delete-cart')
      .set('Authorization', `Bearer ${token}`);

    expect(response.body).toHaveProperty('message', 'Items removed from cart');
  });
});

// REPORT

describe('report', () => {
  
});