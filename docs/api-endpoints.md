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