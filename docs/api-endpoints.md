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


-Metodo: POST
-URL: '/upload'
-Descrizione: cosa fa l’endpoint.,
-Autenticazione: se è necessario un token o meno.,
-Permessi: eventuali ruoli richiesti.,
-Parametri richiesti: query params, path params, body.,
-Risposta prevista: esempio di JSON restituito.,
-Codici di stato HTTP: successi ed errori gestiti.

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
