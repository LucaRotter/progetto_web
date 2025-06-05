# descrizione su tutti gli endpoint, anche non crud del backend, descrivendo parametri, errori e risposte
# dettagli tecnici

# documentazione degli api-endpoints

## funzioni 

### generazione token
```js
const generateToken = (id) => {
    //codice
};
```
A partire da un id, si genera e restituisce il token per permettere autenticazione e sicurezza

### estrazione utente o ip
```js
const getUserKey = (req) => {
    //codice
};
```
si utilizza per restituire un valore tra id e ip in base a se è stato passato o meno un token nella richiesta: se il token è presente
allora viene estratto l'id, altrimenti si richiede l'ip dalla richiesta e si restituisce

### caricamento immagine
```js
async function uploadToCloudinary(filePath, folder) {
    //codice
};
```
prendendo in input il percorso del file e il folder in cui caricarlo, carica l'immagine su cloudinary e genera l'url pubblico
che viene poi restituito
può dare errore durante il caricamento dell'immagine se riscontra problemi

### eliminazione immagine
```js
async function deleteFromCloudinary(publicId) {
    //codice
};
```
a partire dall'url di dominio pubblico, elimina da cloudinary il file corrispondente: può generare errore sull'eliminazioine del
file in caso l'azione non vada a buon fine per motivi legati alla piattaforma o connessione

### invio di una mail
```js
async function sendEmail(to, subject, text){
    //codice
};
```
prende in input la mail del destinatario, l'oggetto e il testo della mail da inviare e automatizza l'invio della mail
restituisce le informazioni riguardanti essa e può generare errore durante l'invio se qualcosa va storto


## middleware

### gestione di richieste massime
```js 
setInterval(() => {
    //codice
}, int);

app.use((req, res, next) => {
    const ip = req.ip || req.socket.remoteAddress;
    //codice
});

```
La funzione permette di contare un numero massimo di richieste per ogni dispositivo che si collega al servizio, ogni minuto
viene resettato il numero di richieste attraverso la funzione setInterval e vengono rifiutate quelle che eccedono il numero
massimo relativo all'indirizzo ip che la esegue

### protect
```js 
const protect = async (req, res, next) => {
    //codice per la verifica
};
```
Questo middleware permette sicurezza alle crud in cui serve avere un accesso limitato a determinati utenti: se il token non è
presente o non rispetta i parametri, allora la richiesta viene rifiutata, altrimenti (dopo aver superato i controlli) la next() permette
di proseguire con la richiesta

### verifica delle permissions
```js 
function hasPermission(Permission_name) {
    //codice
}

async function getUserPermissions(user_id) {
    //codice
};
```
hasPermission(string) prende come input una stringa che rappresenta la permission che deve avere l'utente che sta provando
a fare la richiesta specifica ad una crud, all'interno di questa funzione si chiama la getUserPermission(id) che si occupa di restituire l'elenco delle permissions relative ad un utente, che verrà poi utilizzato dalla funzione iniziale per controllare se all'interno di esso
è presente o meno la permission richiesta
restituisce la possibilità di continuare se i controlli vanno a buon fine, altrimenti nega la richiesta ttraverso lo status 403
può generare errori durante il recupero dei permessi, restituendo uno status 500


## CRUD --permessi 403, protect 401, post 201

### upload di un'immagine
-Metodo: `POST`
-URL: `/upload`
-Descrizione: carica una nuova immagine su cloudinary
-Autenticazione: non richiesta
-Permessi: nessuno
-Parametri richiesti:
    - file : path
-Risposta prevista: { message: 'Upload riuscito!',public_id, url }
-Codici di stato HTTP:
    - 201 (Created)
    - 500 (Errore caricamento foto)

### eliminazione di un immagine
-Metodo: `DELETE`
-URL: `/delete-image`
-Descrizione: elimina un'immagine a scelta da cloudinary
-Autenticazione: non richiesta
-Permessi: nessuno
-Parametri richiesti:
    - body : publicId
-Risposta prevista: { message: 'Immagine eliminata con successo' }
-Codici di stato HTTP:
    - 500 (Errore eliminazione foto)

### registrazione utente
- Metodo: `POST`
- URL: `/register`
- Descrizione: Crea un nuovo utente
- Autenticazione: non richiesta
- Permessi: nessuno
- Parametri richiesti:
    - body :  name, surname, email, pwd, role
- Risposta Prevista: { token: generateToken(newUser.user_id)}
- Codici di stato HTTP: 
    - 201 (Created)
    - 400 (Ruolo non valido / User già esistente)
    - 500 (Errore nell'invio della mail)

### login utente
- Metodo: `POST`
- URL: `/login`
- Descrizione: autenticazione utente
- Autenticazione: non richiesta
- Permessi: nessuno
- Parametri richiesti:
    - body :  email, pwd, role
- Risposta Prevista: { token } (e un numero in caso il tuolo sia admin per l'autenticazione a due fattori)
- Codici di stato HTTP: 
    - 201 (Created)
    - 401 (Invalid credential)
    - 500 (Errore nell'invio della mail) (in caso di admin)

### modifica foto profilo utente
- Metodo: `PUT`
- URL: `/profile-picture`
- Descrizione: aggiunge / modifica la foto profilo di un utente
- Autenticazione: Richiesta (`Bearer token`)
- Permessi: `update_profile`
- Parametri richiesti:
    - header : Authorization: Bearer <token JWT>
    - file :  path
- Risposta Prevista: { message: "Profile picture updated" }
- Codici di stato HTTP: 
    - 400 (User not found)
    - 401 (Unathorized)
    - 403 (Permission denied)

### get utente
- Metodo: `GET`
- URL: `/user`
- Descrizione: restituisce i dati relativi all'utente
- Autenticazione: Richiesta (`Bearer token`)
- Permessi: `update_profile`
- Parametri richiesti:
    - header : Authorization: Bearer <token JWT>
- Risposta Prevista: {user: result.rows[0]}
- Codici di stato HTTP: 
    - 400 (User not found)
    - 401 (Unathorized)
    - 403 (Permission denied)

### modifica nome utente
- Metodo: `PUT`
- URL: `/update-name`
- Descrizione: modifica nome e cognome di un utente
- Autenticazione: Richiesta (`Bearer token`)
- Permessi: `update_profile`
- Parametri richiesti:
    - header : Authorization: Bearer <token JWT>
    - body :  name, surname
- Risposta Prevista: { message: "Name updated" }
- Codici di stato HTTP: 
    - 400 (User not found)
    - 401 (Unathorized)
    - 403 (Permission denied)

### get user per admin
- Metodo: `GET`
- URL: `/user/:id`
- Descrizione: restituisce ad un admin le informazioni sull'utente desiderato a partire dall'id
- Autenticazione: Richiesta (`Bearer token`)
- Permessi: `manage_users`
- Parametri richiesti:
    - header : Authorization: Bearer <token JWT>
    - params : id 
- Risposta Prevista: {user: result.rows[0]}
- Codici di stato HTTP: 
    - 400 (User not found)
    - 401 (Unathorized)
    - 403 (Permission denied)

### get user_id per admin ma con email e ruolo
- Metodo: `GET`
- URL: `/user-by-email`
- Descrizione: restituisce ad un admin l'id utente desiderato a partire da mail e ruolo
- Autenticazione: Richiesta (`Bearer token`)
- Permessi: `manage_users`
- Parametri richiesti:
    - header : Authorization: Bearer <token JWT>
    - body : email, role 
- Risposta Prevista: { user_id: result.rows[0].user_id }
- Codici di stato HTTP: 
    - 400 (User not found)
    - 401 (Unathorized)
    - 403 (Permission denied)

### eliminazione user per sua volontà
- Metodo: `DELETE`
- URL: `/user`
- Descrizione: elimina l'account dell'utente che fa la richiesta
- Autenticazione: Richiesta (`Bearer token`)
- Permessi: `update_profile`
- Parametri richiesti:
    - header : Authorization: Bearer <token JWT>
- Risposta Prevista: { message: "User deleted" }
- Codici di stato HTTP: 
    - 400 (User not found)
    - 401 (Unathorized)
    - 403 (Permission denied)
    - 500 (Errore nell'invio della mail)

### eliminazione user da parte dell'admin
- Metodo: `DELETE`
- URL: `/user/:id`
- Descrizione: elimina l'account dell'utente da parte di una richiesta dell'admin
- Autenticazione: Richiesta (`Bearer token`)
- Permessi: `delete_user`
- Parametri richiesti:
    - header : Authorization: Bearer <token JWT>
    - params : id
- Risposta Prevista: { message: "User deleted" }
- Codici di stato HTTP: 
    - 400 (User not found)
    - 401 (Unathorized)
    - 403 (Permission denied)
    - 500 (Errore nell'invio della mail)

### password dimenticata
- Metodo: `POST`
- URL: `/forgot-password`
- Descrizione: manda una mail all'utente per il reset della password
- Autenticazione: non richiesta
- Permessi: nessuno
- Parametri richiesti:
    - body :  email, role
- Risposta Prevista: { message: "Email sent"}
- Codici di stato HTTP: 
    - 201 (Created)
    - 400 (User not found)
    - 500 (Errore nell'invio della mail) (in caso di admin)

### reimporta password
- Metodo: `POST`
- URL: `/reset-password`
- Descrizione: permette all'utente di aggiornare la propria password dopo averla dimenticata
- Autenticazione: non richiesta
- Permessi: nessuno
- Parametri richiesti:
    - body :  email, newPassword, role
- Risposta Prevista: { message: "Password updated" }
- Codici di stato HTTP: 
    - 201 (Created)
    - 400 (User not found)

### aggiorna password
- Metodo: `PUT`
- URL: `/update-password`
- Descrizione: modifica la password dell'utente con una nuova da lui inserita
- Autenticazione: Richiesta (`Bearer token`)
- Permessi: `update_profile`
- Parametri richiesti:
    - header : Authorization: Bearer <token JWT>
    - body :  oldPassword, newPassword
- Risposta Prevista: { message: "Password updated" }
- Codici di stato HTTP: 
    - 400 (User not found)
    - 401 (Old password is incorrect)
    - 401 (Unathorized)
    - 403 (Permission denied)

### Crea recensione
- Metodo: `POST`
- URL: `/add-review`
- Descrizione: Crea una nuova recensione relativa al un prodotto
- Autenticazione: Richiesta (`Bearer token`)
- Permessi: 'add_review'
- Parametri richiesti: 
    - header : Authorization: Bearer <token JWT>
    - body : item_id, description, evaluation
- Risposta Prevista: { message: "Review added", review: result.rows[0] }
- Codici di stato HTTP: 
    - 201 (Created)
    - 400 (Review already exists)
    - 401 (Unathorized)
    - 403 (Permission denied)

### Elimina recensione
- Metodo: `DELETE`
- URL: `/delete-review/:id`
- Descrizione: Elimina una recensione relativa al un prodotto
- Autenticazione: Richiesta (`Bearer token`)
- Permessi: 'delete_review'
- Parametri richiesti: 
    - header : Authorization: Bearer <token JWT>
    - body : user_id (opzionale)
    - params : id
- Risposta Prevista: { message: "Review deleted" }
- Codici di stato HTTP: 
    - 201 (Created)
    - 400 (Review not found)
    - 401 (Unathorized)
    - 403 (Permission denied)

### restituisce le recensioni di un articolo
- Metodo: `GET`
- URL: `/reviews/:id`
- Descrizione: restiruisce le recensioni relative al prodotto selezionato per id
- Autenticazione: non richiesta
- Permessi: nessuno
- Parametri richiesti: 
    - params : id
- Risposta Prevista: {reviews:result.rows}

### restituisce la valutazione media di un articolo
- Metodo: `GET`
- URL: `/average-rating/:id`
- Descrizione: restiruisce la valutazione media relativa al prodotto selezionato per id
- Autenticazione: non richiesta
- Permessi: nessuno
- Parametri richiesti: 
    - params : id
- Risposta Prevista: { average: result.rows[0].average }
- Codici di stato HTTP: 
    - 400 (No reviews found)

### restituisce id recensione grazie ad articolo e utente
- Metodo: `GET`
- URL: `/review-id`
- Descrizione: restiruisce l'id della recensione identificata dall'utente e dall'articolo
- Autenticazione: Richiesta (`Bearer token`)
- Permessi: 'moderate_reviews'
- Parametri richiesti: 
    - header : Authorization: Bearer <token JWT>
    - params : id
    - body : item_id, user_id
- Risposta Prevista: { review_id: result.rows[0].review_id }
- Codici di stato HTTP: 
    - 400 (Review not found)
    - 401 (Unathorized)
    - 403 (Permission denied)

### recensione per id
- Metodo: `GET`
- URL: `/review/:id`
- Descrizione: restiruisce la recensione relativa all'id passato per parametro
- Autenticazione: Richiesta (`Bearer token`)
- Permessi: 'moderate_reviews'
- Parametri richiesti: 
    - header : Authorization: Bearer <token JWT>
    - params : id
- Risposta Prevista: {review:result.rows[0]}
- Codici di stato HTTP: 
    - 400 (Review not found)
    - 401 (Unathorized)
    - 403 (Permission denied)

### insermento nel carrello
- Metodo: `POST`
- URL: `/cart`
- Descrizione: aggiunge un articolo nel carrello (ne aumenta la quantità se già presente)
- Autenticazione: Richiesta (`Bearer token`)
- Permessi: 'update_cart'
- Parametri richiesti:
    - header : Authorization: Bearer <token JWT>
    - body : item_id, quantity
- Risposta Prevista: { message: "Item added to cart" }
- Codici di stato HTTP: 
    - 201 (OK)
    - 401 (Unathorized)
    - 403 (Permission denied)
    - 500 (Internal server error)

### get articoli
- Metodo: `GET`
- URL: `/cart`
- Descrizione: restituisce tutti gli articoli nel carrello del cliente
- Autenticazione: Richiesta (`Bearer token`)
- Permessi: nessuno
- Parametri richiesti:
    - header : Authorization: Bearer <token JWT>
- Risposta Prevista: {items:result.rows}
- Codici di stato HTTP: 
    - 201 (OK)
    - 401 (Unathorized)

### modifica quantità
- Metodo: `PUT`
- URL: `/cart/:id`
- Descrizione: permette di modificare la quantità di un prodotto nel carrello
- Autenticazione: Richiesta (`Bearer token`)
- Permessi: 'update_cart'
- Parametri richiesti:
    - header : Authorization: Bearer <token JWT>
    - params : id
    - body : quantity
- Risposta Prevista: { message: "Item updated in cart" }
- Codici di stato HTTP:
    - 400 (Item not found in cart)
    - 401 (Unathorized)
    - 403 (Permission denied)

### Elimina una categoria
- Metodo: `DELETE`
- URL: `/delete-category/:id`
- Descrizione: Elimina una categoria
- Autenticazione: Authorization: Bearer <token JWT>
- Permessi: 'manage_categories'
- Parametri richiesti:
    - header : Authorization: Bearer <token JWT>
    - param : category_id
- Risposta Prevista: {message: "Category deleted"}
- Codici di stato HTTP: 
    - 201 (OK)
    - 400 (Category not found)
    - 401 (Unathorized)
    - 403 (Permission denied)

### Aggiunge articolo
- Metodo: `POST`
- URL: `/add-item`
- Descrizione: Aggiunge un articolo
- Autenticazione: Authorization: Bearer <token JWT>
- Permessi: 'update_item'
- Parametri richiesti:
    - header : Authorization: Bearer <token JWT>
    - body : name, category, description, price, quantity, image_url
- Risposta Prevista: {message: "Item added", item: result.rows[0]}
- Codici di stato HTTP: 
    - 201 (OK)
    - 401 (Unathorized)
    - 403 (Permission denied)

### Modifica prezzo articolo
- Metodo: `PUT`
- URL: `/update-price/:id`
- Descrizione: Modifica prezzo di un articolo
- Autenticazione: Authorization: Bearer <token JWT>
- Permessi: 'update_item'
- Parametri richiesti:
    - header : Authorization: Bearer <token JWT>
    - param : item_id
    - body : price
- Risposta Prevista: {message: "Price updated", item: result.rows[0]}
- Codici di stato HTTP: 
    - 200 (OK)
    - 400 (Item not found)
    - 401 (Unathorized)
    - 403 (Permission denied)

### Modifica quantità articolo
- Metodo: `PUT`
- URL: `/update-quantity/:id`
- Descrizione: Modifica quantità di un articolo
- Autenticazione: Authorization: Bearer <token JWT>
- Permessi: 'update_item'
- Parametri richiesti:
    - header : Authorization: Bearer <token JWT>
    - param : item_id
    - body : quantity
- Risposta Prevista: {message: "Quantity updated", item: result.rows[0]}
- Codici di stato HTTP: 
    - 200 (OK)
    - 400 (Item not found)
    - 401 (Unathorized)
    - 403 (Permission denied)

### Modifica immagine articolo
- Metodo: `PUT`
- URL: `/update-image/:id`
- Descrizione: Modifica l'immagine di un articolo
- Autenticazione: Authorization: Bearer <token JWT>
- Permessi: 'update_item'
- Parametri richiesti:
    - header : Authorization: Bearer <token JWT>
    - param : item_id
    - file : path
- Risposta Prevista: {message: "Image updated", item: result.rows[0]}
- Codici di stato HTTP: 
    - 200 (OK)
    - 400 (Item not found)
    - 401 (Unathorized)
    - 403 (Permission denied)

### Modifica nome articolo
- Metodo: `PUT`
- URL: `/update-name/:id`
- Descrizione: Modifica la categoria di un articolo
- Autenticazione: Authorization: Bearer <token JWT>
- Permessi: 'update_item'
- Parametri richiesti:
    - header : Authorization: Bearer <token JWT>
    - param : item_id
    - body : name
- Risposta Prevista: {message: "Name updated", item: result.rows[0]}
- Codici di stato HTTP: 
    - 200 (OK)
    - 400 (Item not found)
    - 401 (Unathorized)
    - 403 (Permission denied)

### Modifica categoria articolo
- Metodo: `PUT`
- URL: `/update-category/:id`
- Descrizione: Modifica la categoria di un articolo
- Autenticazione: Authorization: Bearer <token JWT>
- Permessi: 'update_item'
- Parametri richiesti:
    - header : Authorization: Bearer <token JWT>
    - param : item_id
    - body : category
- Risposta Prevista: {message: "Category updated", item: result.rows[0]}
- Codici di stato HTTP: 
    - 200 (OK)
    - 400 (Item not found)
    - 401 (Unathorized)
    - 403 (Permission denied)

### Modifica descrizione articolo
- Metodo: `PUT`
- URL: `/update-description/:id`
- Descrizione: Modifica la descrizione di un articolo
- Autenticazione: Authorization: Bearer <token JWT>
- Permessi: 'update_item'
- Parametri richiesti:
    - header : Authorization: Bearer <token JWT>
    - param : item_id
    - body : description
- Risposta Prevista: {message: "Description updated", item: result.rows[0]}
- Codici di stato HTTP: 
    - 200 (OK)
    - 400 (Item not found)
    - 401 (Unathorized)
    - 403 (Permission denied)

### Elimina un'articolo
- Metodo: `DELETE`
- URL: `/delete-item/:id`
- Descrizione: Elimina un'articolo
- Autenticazione: Authorization: Bearer <token JWT>
- Permessi: 'delete_item'
- Parametri richiesti:
    - header : Authorization: Bearer <token JWT>
    - param : item_id
- Risposta Prevista: {message: "Item deleted"}
- Codici di stato HTTP: 
    - 200 (OK)
    - 400 (Item not found)
    - 401 (Unathorized)
    - 403 (Permission denied)


### Recupera l'articolo dal id
- Metodo: `GET`
- URL: `/item/:id`
- Descrizione: Recupera l'articolo dal id
- Autenticazione: No
- Permessi: No
- Parametri richiesti:
    - param : item_id
- Risposta Prevista: {item: result.rows, category_name: category_name}
- Codici di stato HTTP: 
    - 200 (OK)

### Recupera l'articolo dal nome, prezzo, categoria e descrizione
- Metodo: `GET`
- URL: `/itemgetId`
- Descrizione: Recupera l'articolo dal nome, prezzo, categoria e descrizione
- Autenticazione: No
- Permessi: No
- Parametri richiesti:
    - body : name, price, description, category
- Risposta Prevista: {item_id: result.rows[0]}
- Codici di stato HTTP: 
    - 200 (OK)

### Restituisce gli articoli di un artigiano
- Metodo: `GET`
- URL: `/user-items/`
- Descrizione: Restituisce tutti gli articoli di un artigiano.
- Autenticazione: Richiesta (`Bearer token`)
- Permessi: 'update_item'
- Parametri richiesti:
    - header : Authorization: Bearer <token JWT>
- Risposta Prevista: {items: result.rows}
- Codici di stato HTTP: 
    - 200 (OK)
    - 401 (Unathorized)
    - 403 (Permission denied)
    

### Restituisce gli articoli mischiati
- Metodo: `DELETE`
- URL: `/reset-items`
- Descrizione: Elimina gli item che vengono restituiti in modo casuale dell'utente che sta facendo la richiesta.
- Autenticazione: Richiesta (`Bearer token`) oppure non richiesta
- Permessi: No
- Parametri richiesti:
    - header : userKey
- Risposta Prevista: {message: "Lista resettata"}
- Codici di stato HTTP: 
    - 200 (OK)
    - 401 (Unathorized)
    - 500 (Errore interno del server)

### Restituisce gli articoli mischiati
- Metodo: `GET`
- URL: `/random-items`
- Descrizione: Restiusce gli item in modo casuale. Il modo in cui vengono restituti gli articolo in modo causale è unico per ogni utente registrato e non(se l'utente non è registrato si prende il suo ip come chiave).
- Autenticazione: Richiesta (`Bearer token`) oppure non richiesta
- Permessi: No
- Parametri richiesti:
    - header : userKey
    - query :nItems
- Risposta Prevista: {selectedItems: selectedItems.rows }
- Codici di stato HTTP: 
    - 200 (OK)
    - 400 (Parametro 'nItems' non valido)
    - 401 (Unathorized)
    - 404 (Nessun altro elemento disponibile)
    - 500 (Errore interno del server)

### Elimina gli articoli mischiati per categoria di un utente
- Metodo: `DELETE`
- URL: `/reset-category-items/:name`
- Descrizione: Elimina gli item della categoria specificata e del utente che sta effettuando la richiesta
- Autenticazione: Richiesta (`Bearer token`) oppure non richiesta
- Permessi: No
- Parametri richiesti:
    - header : userKey
    - param : name_category

- Risposta Prevista: {message: "Lista resettata" }
- Codici di stato HTTP: 
    - 200 (OK)
    - 401 (Unathorized)
    - 404 (Categoria non trovata)
    - 500 (Errore interno del server)

### Restituisce gli articoli mischiati per categoria
- Metodo: `GET`
- URL: `/category-items/:name`
- Descrizione: Restiusce gli item in modo casuale della categoria specificata. Il modo in cui vengono restituti gli articolo in modo causale è unico per ogni utente registrato e non(se l'utente non è registrato si prende il suo ip come chiave).
- Autenticazione: Richiesta (`Bearer token`) oppure non richiesta
- Permessi: No
- Parametri richiesti:
    - header : userKey
    - param : name_category
    - query : numItems

- Risposta Prevista: {items: result.rows}
- Codici di stato HTTP: 
    - 200 (OK)
    - 400 (Parametro 'nItems' non valido)
    - 401 (Unathorized)
    - 404 (Categoria non trovata)
    - 500 (Errore interno del server)

### Restituisce gli articoli con filtri
- Metodo: `GET`
- URL: `/items`
- Descrizione: Restiusce gli item che rispettano i filtri sul nome, categoria, prezzo e valutazione minima. I filtri non devono essere per forza tutti presenti
- Autenticazione: No
- Permessi: No
- Parametri richiesti:
    - query : name, category, minPrice, maxPrice, minEvaluation
- Risposta Prevista: {items: result.rows}
- Codici di stato HTTP: 
    - 200 (OK)
    - 500 (Errore interno del server)

### Crea un ordine
- Metodo: `POST`
- URL: `/add-order`
- Descrizione: Crea un ordine
- Autenticazione: Richiesta (`Bearer token`)
- Permessi: 'place_order'
- Parametri richiesti:
    - header : Authorization: Bearer <token JWT>
    - body : items, address, civic_number, postal_code, province, country, phone_number
- Risposta Prevista: {message: "Order added", order_id: order_id}
- Codici di stato HTTP: 
    - 201 (OK)
    - 401 (Unathorized)
    - 403 (Permission denied)

### Aggiorna lo stato di un ordine
- Metodo: `PUT`
- URL: `/update-order/:id`
- Descrizione: Aggiorna lo stato dell'ordine specificato a shipped
- Autenticazione: Richiesta (`Bearer token`)
- Permessi: 'manage_orders'
- Parametri richiesti:
    - header : Authorization: Bearer <token JWT>
    - param : order_id
- Risposta Prevista: {message: "Order updated"}
- Codici di stato HTTP: 
    - 200 (OK)
    - 401 (Unathorized)
    - 400 (Order not found)
    - 403 (Permission denied)

### Recupera ordine per artigiano
- Metodo: `GET`
- URL: `/customer-orders`
- Descrizione: Recupera gli ordini di un cliente
- Autenticazione: Richiesta (`Bearer token`)
- Permessi: 'view_orders'
- Parametri richiesti:
    - header : Authorization: Bearer <token JWT>
- Risposta Prevista: {orders:result.rows}
- Codici di stato HTTP: 
    - 200 (OK)
    - 401 (Unathorized)
    - 403 (Permission denied)

### Recupera ordine per artigiano
- Metodo: `GET`
- URL: `/artisan-orders`
- Descrizione: Recupera gli ordini di un artigiano
- Autenticazione: Richiesta (`Bearer token`)
- Permessi: 'view_manage_orders'
- Parametri richiesti:
    - header : Authorization: Bearer <token JWT>
- Risposta Prevista: {orders:result.rows}
- Codici di stato HTTP: 
    - 200 (OK)
    - 401 (Unathorized)
    - 403 (Permission denied)

### Recupera ordine per admin
- Metodo: `GET`
- URL: `/admin-orders/:id`
- Descrizione: Recupera un ordine specifico da parte di un admin
- Autenticazione: Richiesta (`Bearer token`)
- Permessi: 'view_manage_orders'
- Parametri richiesti:
    - header : Authorization: Bearer <token JWT>
    - param : order_id
- Risposta Prevista: {orders:result.rows}
- Codici di stato HTTP: 
    - 200 (OK)
    - 400 (Order not found)
    - 401 (Unathorized)
    - 403 (Permission denied)

### Elimina ordine
- Metodo: `DELETE`
- URL: `/delete-orders/:id`
- Descrizione: Elimina un ordine specifico
- Autenticazione: Richiesta (`Bearer token`)
- Permessi: 'view_manage_orders'
- Parametri richiesti:
    - header : Authorization: Bearer <token JWT>
    - param : order_id
- Risposta Prevista: {message: "Order deleted"}
- Codici di stato HTTP: 
    - 200 (OK)
    - 400 (Order not found)
    - 401 (Unathorized)
    - 403 (Permission denied)

### Crea segnalazione
- Metodo: `POST`
- URL: `/create-report`
- Descrizione: Crea una nuova segnalazione
- Autenticazione: Richiesta (`Bearer token`) oppure anonima
- Permessi: 'manage_report'
- Parametri richiesti: 
    - header : Authorization: Bearer <token JWT>
    - body :  item_id, category, description
- Risposta Prevista: {message: "Report created", report: result.rows[0]}
- Codici di stato HTTP: 
    - 201 (Created)
    - 401 (Unathorized)
    - 403 (Permission denied)

### Aggiunge l'admin alla segnalazione
- Metodo: ` PUT`
- URL: `/add-admin-report/:id`
- Descrizione: aggiunge admin nella segnalazione,dopo che recupera le free-reports
- Autenticazione: Richiesta (`Bearer token`)
- Permessi: 'moderate_reports'
- Parametri richiesti:
    - header : Authorization: Bearer <token JWT>
    - param : report_id
- Risposta Prevista: {message: "Admin added to report"}
- Codici di stato HTTP: 
    - 200 (OK)
    - 400 (Report not found)
    - 401 (Unathorized)
    - 403 (Permission denied)

### Recupera le segnalazione per admin_id
- Metodo: `GET`
- URL: `/admin-reports`
- Descrizione: Recupera tutte le segnalazioni con admin_id
- Autenticazione: Richiesta (`Bearer token`)
- Permessi: 'moderate_reports'
- Parametri richiesti:
    - header : Authorization: Bearer <token JWT>
- Risposta Prevista: {reports:result.rows}
- Codici di stato HTTP: 
    - 200 (OK)
    - 401 (Unathorized)
    - 403 (Permission denied)

### Recupera le segnalazioni senza admin_id
- Metodo: `GET`
- URL: `/free-reports`
- Descrizione: Recupera tutte le segnalazioni senza admin_id
- Autenticazione: Richiesta (`Bearer token`)
- Permessi: 'moderate_reports'
- Parametri richiesti:
    - header : Authorization: Bearer <token JWT>
- Risposta Prevista: {reports:result.rows}
- Codici di stato HTTP: 
    - 200 (OK)
    - 401 (Unathorized)
    - 403 (Permission denied)

### Elimina segnalazione
- Metodo: `DELETE`
- URL: `/delete-report/:id`
- Descrizione: Elimina una segnalazione specifica da parte di un admin
- Autenticazione: Richiesta (`Bearer token`)
- Permessi: 'moderate_reports'
- Parametri richiesti: 
    - header : Authorization: Bearer <token JWT>
    - param : report_id
- Risposta Prevista: {message: "Report deleted"}
- Codici di stato HTTP: 
    - 200 (OK)
    - 400 (Report not found)
    - 401 (Unathorized)
    - 403 (Permission denied)

### Creazione sessione di pagamento
- Metodo: `POST`
- URL: `/create-checkout-session`
- Descrizione: Crea un sessione di pagamento con stripe per acquistare dei prodotti in un carrello
- Autenticazione: Richiesta (`Bearer token`)
- Permessi: 'place_order'
- Parametri richiesti: 
    - header : Authorization: Bearer <token JWT>
    - body : items
- Risposta Prevista: {url: session.url, id: session.id, paymentStatus: session.payment_status}
- Codici di stato HTTP: 
    - 200 (OK)
    - 500 (Errore creazione sessione di pagamento)
    - 401 (Unathorized)
    - 403 (Permission denied)

### Richiesta informazioni sessione pagamento
- Metodo: `GET`
- URL: `/checkout-session/:id`
- Descrizione: richiesta per ricevere informazioni come lo stato del pagamento quando viene reindirizzato nella nuova pagina per vedere lo stato del pagamento.
- Autenticazione: Nessuna
- Permessi: Nessuno
- Parametri richiesti: 
    - param : id_sessione
- Risposta Prevista: {session: session}
- Codici di stato HTTP: 
    - 200 (OK)

### Invia Email di Conferma Ordine

- Metodo: `POST`
- URL: `/send-confirmation-email`
- Descrizione: Invia un'email di conferma ordine all'utente autenticato.
- Autenticazione: Richiesta (`Bearer token`)
- Permessi: Nessuno specifico, solo utente autenticato
- Parametri richiesti: 
    - header : Authorization: Bearer <token JWT>
    - body : orderDetails
- Risposta Prevista: {"message": "Email di conferma inviata"}
- Codici di stato HTTP: 
    - 200 (OK)
    - 500 (errore invio email)
    - 401 (Unathorized)
---
