# Documentazione backend-code

## STRUTTURA GENERALE DEL BACKEND

```plaintext
📁 project-root/
├── tests/                     # Test automatici
│   ├── single.test            # Test unitari
│   ├── server.test            # Test di integrazione
│   └── test.jpeg              # Immagine di test
├── .env                       # Variabili d'ambiente
├── Dockerfile                 # Immagine Docker
├── package.json               # Dipendenze e script (per Node.js)
├── start.js                   # Start del server
└── server2.js                 # Logica del server
```

## DESCRIZIONE DEL PROGETTO

Questo backend fornisce un'API REST per la gestione di una piattaforma di e-commerce. Le funzionalità principali includono:

- Autenticazione e gestione degli utenti (JWT)
- Autorizzazione degli utente(ruoli-permessi e bcryptjs)
- Gestione del numero di richieste
- Catalogo prodotti
- Carrello e ordini
- Recensioni e segnalazioni
- Integrazione con sistemi di pagamento (Stripe)
- Gestione email (nomademailer)
- Gestione cloud immagini (cloudinary)
- Dashboard amministrativa

Il backend è sviluppato con Node.js e Express, con persistenza dei dati tramite PostgreSQL.

##  Dipendenze

| Pacchetto              | Descrizione                                                                 |
|------------------------|-----------------------------------------------------------------------------|
| **dotenv**             | Carica le variabili d’ambiente da un file `.env` per la configurazione sicura di chiavi ecredenziali. |
| **express**            | Framework web per la creazione di server e API RESTful in Node.js.         |
| **pg**                 | Driver per la connessione e l'interazione con un database PostgreSQL.       |
| **bcryptjs**           | Libreria per l’hashing sicuro delle password, utilizzata durante la registrazione e l'autenticazione. |
| **jsonwebtoken**       | Permette la creazione e verifica di token JWT per la gestione dell'autenticazione. |
| **cors**               | Middleware che consente richieste da origini diverse (Cross-Origin Resource Sharing). |
| **nodemailer**         | Libreria per l'invio di email tramite SMTP, utile per notifiche, conferme e reset password. |
| **cloudinary**         | SDK per l'integrazione con il servizio Cloudinary, per il caricamento e la gestione di immagini. |
| **multer**             | Middleware per la gestione dell’upload di file tramite form-data (es. immagini, documenti). |
| **stripe**             | SDK per l'integrazione con la piattaforma di pagamenti Stripe.              |
| **fs** *(modulo built-in)* | Modulo nativo di Node.js per operazioni sul filesystem (lettura/scrittura file). |
| **http.get** *(modulo built-in)* | Metodo del modulo `http` di Node.js per effettuare richieste HTTP semplici. |


##  Moduli Chiave
Le specifiche tecniche degli endpoint sono descritte nel [api-endpoints.md](api-endpoints.md)

### Gestioni richieste
Gestisce il numero massime di richieste che vengono effettuate al server in modo che ogni IP possa effettuare al massimo 100 richieste al minuto per evitare attacchi Ddos.

### Autenticazione - Middleware `protect`

Il middleware `protect` viene utilizzato per proteggere le rotte che richiedono autenticazione. Riceve il token assegnato al momento della registrazione e verifica se corrisponde all'id dell'utente. Successivamente ne viene generato uno nuovo in modo da reimpostare il tempo di scadenza del token.

### Gestione immagini - `uploadToCloudinary`

Sruttando il middleware `uploadMiddleware.single('immagine')` che riceve un immagine, la funzione asincrona `uploadToCloudinary` carica la relativa immagine in cloudinary e poi restituisce l'url generato dal cloud che sarà poi salvato del database. Nel caso di cancellazione immagine si sfrutta la funzione `deleteFromCloudinary(publicId)` che elimina l'immagine dal cloud.

### Gestione email - `sendEmail(to, subject, text)`

La funzione `sendEmail(to, subject, text)` permette di inviare le email al destinatario specificato nei casi di registrazione, ordine e cancellazione account.

### Gestione ruoli_permessi - `hasPermission(Permission_name)`

Middleware che controlla se l’utente autenticato ha un determinato permesso per accedere a una risorsa protetta.

**Funzionalità:**
- Riceve come parametro il nome del permesso richiesto.
- Verifica se l'utente dispone di `req.permissions` (recuperati all'autenticazione).
- Se assenti, richiama la funzione `getUserPermissions()` per caricarli dal database.
- Se il permesso specificato non è presente, restituisce errore **403 Forbidden**.
- Se il permesso è valido, prosegue con il middleware/rotta successiva (`next()`).

### Gestione utenti

Ci sono 3 tipi di utenti: clienti, artigiani, admin. Le funzionalità principali per gli utenti sono:
- Registrazione nel ruolo di cliente o artigiano
- Login
- Recupero password e modifica
- Modifica del proprio account
- Cancellazione account da parte del proprietario oppure da un admin

### Gestione prodotti

I prodotti creati sono strettamente correlati ad un artigiano ed appartengono ad una sola categoria della piattaforma. Le operazioni possibili sui prodotti sono:
- Aggiungere articolo
- Modificare prezzo, quantità, immagine, nome, categoria, descrione
- Recuperare le informazioni su un articolo
- Recuperare tutti gli articoli relativi ad un artigiano
- Cercare gli articoli con i filtri relativi al prezzo, categoria, nome e valutazione
- Eliminare articolo

### Gestione del carrello

I prodotti possono essere aggiunti ed eliminati dal carrello. Inoltre è possibile:
- Aggiornare la quantità di prodotti
- Recuperare il numero di articoli da un carrello
- Recuperare il totale del prezzo di un carrello

### Gestione categorie

La gestione delle categorie è interamente dedicata agli admin che possono:
- Aggiungere una nuova categoria
- Modificare nome e immagine
- Eliminare una categoria


### Gestione ordini

Gli ordini vengono creati al momento del pagamento effettuato con successo da parte di un cliente che ha acquisto uno o piu prodotti. Al momento della creazione dell'ordine vengono salvati i dati degli articoli acquistati, data e ora dell'acquisto e lo stato dell'ordine risulta confermato.
Inoltre:
- L'artigiano può aggiornare lo stato dell'ordine a spedito
- L'artigiano e il cliente posso vedere i propri ordini effettuati/ricevuti
- L'admin può recuperare le informazioni di un ordine

### Gestione delle recesioni

I clienti che hanno acquistato un articolo possono inserire una sola recensione per quel prodotto. Le operazioni relative alle recensioni sono:
- Inserire valutazione e descrizione per un articolo acquistato
- Eliminare una recensione
- Recuperare le recensioni relative ad un articolo
- Recuperare la media delle valutazioni di un articolo
- Recuperare una recensione specifica da parte di un admin

### Gestione delle segnalazioni

Le segnalazioni posso essere effettuate da chiunque(utenti non registrati, clienti e artigiani) relativemente ad un prodotto specifico oppure riguardante ad un altro problema.
- Le segnalazioni vengono collegate a chi le effettua(a meno che a farla non sia un utente non registrato)
- Gli admin recuperano le segnalazioni nuove e si incaricano di risolverle
- Eliminazione di una segnalazione da parte di un admin

### Gestione dei pagamenti

I pagamenti vengono gestiti da Stripe che crea un sessione dedicata. Il pagamento può essere simulato inserendo come dati della carta 4242 4242 4242 4242 e automaticamente a fine del pagamento eseguito con successo si viene reindirizzati alla pagina di conferma dell'ordine.
Successivamente si possono recuperare le informazioni della sessione e viene inviata un email di conferma.


## Flussi di utilizzo principali

Questa sezione descrive i principali flussi funzionali supportati dal backend, dalla registrazione utente alle funzionalità avanzate come recensioni, segnalazioni e pagamenti. Ogni flusso coinvolge più moduli e dipendenze.

---

### 1. Registrazione e Autenticazione

**Flusso:**
1. L’utente invia i dati a `POST /register`
2. Il backend:
   - Cifra la password con `bcryptjs`
   - Salva l’utente nel DB
   - invia un’email di conferma con `nodemailer`
3. L’utente effettua il login su `POST /login`
4. Il backend:
   - Verifica le credenziali
   - Restituisce un token JWT valido 1h
   - Recupera i permessi via `getUserPermissions()`

**Middleware coinvolti:**  
`protect`, `hasPermission`, `rateLimiter`

---

### 2. Navigazione e Acquisto Prodotti

**Flusso:**
1. L’utente visualizza i prodotti tramite `GET /items`
2. Aggiunge articoli al carrello lato frontend
3. Al checkout, viene chiamato `POST /create-checkout-session` (Stripe)
4. Stripe elabora il pagamento
5. In caso di successo, viene salvato un ordine e notificato via email

**Integrazione esterna:**  
- `stripe` per i pagamenti
- `nodemailer` per conferma ordine

---

### 3.  Recensione di un Prodotto

**Flusso:**
1. L’utente autenticato accede a `POST /add-review`
2. Il backend:
   - Verifica che l'utente non abbia già una recensione per questo prodotto
   - Salva rating, testo
3. Le recensioni vengono moderate manualmente

**Middleware:** `protect`

---

### 4.  Segnalazione Contenuti

**Flusso:**
1. L’utente autenticato invia una segnalazione via `POST /create-report`
2. Il backend:
   - Registra la segnalazione con admin_id = null
3. Un admin visualizza il report da `GET /free-reports`
4. Succesivamente un admin può gestire i propri report
---

### 5.  Gestione Profilo Utente

**Flusso:**
1. L’utente accede al profilo tramite `GET /user`
2. Può aggiornare i propri dati via `PUT /update-user`
3. Il backend verifica l’identità tramite `protect` e aggiorna i dati nel DB

---

### 6.  Autorizzazione e Permessi

**Flusso trasversale:**
- Ogni rotta protetta utilizza `protect` per verificare l'autenticazione
- Alcune rotte usano anche `hasPermission('nome_permesso')`
- I permessi sono caricati da `getUserPermissions()` in base al ruolo dell’utente

---
## SICUREZZA

Il sistema backend implementa diverse misure di sicurezza per proteggere dati sensibili, autenticazione, accesso alle API e gestione delle autorizzazioni.


### Variabili d’Ambiente (`.env`)

Le variabili sensibili (come chiavi API e segreti crittografici) sono salvate nel file `.env`, che **non deve mai essere incluso nel versionamento** (`.gitignore`).

**Esempi:**
JWT_SECRET=supersecretkey
DATABASE_URL=postgres://user:pass@localhost:5432/dbname
SECRET_KEY_STRIPE=sk_test_xxx

### Controllo Numero di Richieste (Rate Limiting)

Per prevenire abusi (es. attacchi brute-force o denial-of-service), il backend utilizza un middleware per limitare il numero di richieste da un singolo IP. Mappa tutte le richieste salvando ip e numero di richieste di ogni utente e verifica che il numero di richieste non sia maggiore a quello stabilito

### Autenticazione con JWT
Il sistema utilizza JSON Web Tokens (JWT) per gestire le sessioni utente in modo stateless. Il token viene verificato nella rotta `protect`. Ad ogni richiesta protetta, viene emesso un nuovo token con intestazione x-refresh-token.

### Ruoli e Permessi
- Il backend utilizza un sistema RBAC (Role-Based Access Control):
- Ogni utente ha un ruolo (client, artisan e admin)
- I ruoli sono associati a permessi specifici
- I permessi vengono recuperati dinamicamente da DB con getUserPermissions()
- Middleware hasPermission() controlla i permessi per accedere a determinate rotte

### Hashing delle password

Le password sono mai salvate in chiaro. Al momento della registrazione vengono cifrate usando bcryptjs Questo garantisce la sicurezza anche in caso di compromissione del database.

### Altre misure di sicurezza

- Le rotte sensibili sono protette da protect e hasPermission
- Le password non vengono mai restituite nelle risposte delle API
- Gli errori restituiscono codici HTTP corretti (401, 403, 500, ecc.)
- CORS configurato per accettare richieste solo da domini sicuri
- Upload delle immagini protetto tramite cloudinary con validazioni lato server
- Stripe utilizza una chiave privata e una callback server-side sicura

Il sistema è progettato con un'architettura modulare e sicura. Tutte le funzionalità critiche sono protette da controlli di accesso, e il flusso di autenticazione è basato su standard consolidati.

## TESTING

Il progetto include una suite di test automatizzati per garantire l'affidabilità e il corretto funzionamento delle API. I test sono scritti utilizzando un framework di testing (es. Jest o simile) e organizzati all'interno della cartella `tests`.

---
### Struttura della Cartella `tests/`
La cartella `tests/` contiene i file relativi ai test delle principali funzionalità del backend:
tests/
├──test.jpeg // Immagine di test
├── single.test.js // Test scritti e verificati uno alla volta
└── server.test.js // Test organizzati e raggruppati per moduli

###  `single.test.js`

Questo file è utilizzato per scrivere, eseguire e debuggare i test uno alla volta. È utile durante la fase di sviluppo per testare rapidamente una singola funzione, endpoint o comportamento.

### Contenuto tipico:
- Test isolati di API
- Debugging di risposte e codici di stato
- Verifica dei payload in input/output

---

###  `server.test.js`

Questo file rappresenta l'insieme completo dei test dell'intero sistema, suddivisi per modulo.
Tutti i test sono stati eseguiti senza mock per verificare il giusto funzionamento dei servizi esterni come Stripe e Cloudinary e Nodemailer e anche del database. Si sono utilizzati gli utenti e gli item inseriti di default nel database e nel caso che in alcuni test vengano inseriti ulteriori elementi questi vengono eliminati a fine di ogni test in modo da non "sporcare" il database.
I test sono indipendenti dall'inserimento di altri utenti, articoli, ordini... nel database.

---


### Contenuto tipico:

### Struttura:
I test sono organizzati utilizzando blocchi `describe()` che rappresentano i principali moduli del backend:

```js
describe('upload and delete image', () => {
    //test per inserire e cancellare immagini dal cloudinary
});

describe('register', () => {
    //test per registrazione utente e controllo di non potersi registrare con email già utilizzata
});

describe('Register and Login for role C or A', () => {
  // Test di registrazione e login per client o artisan
});

describe('Login for role Ad', () => {
  // Test di per admin con invio email
});

describe('Profile Picture Update', () => {
  // Test di aggiornamento immagine di profilo
});

describe('GET user and DELETE user', () => {
  // Test per trovare utenti e eliminarli
});

describe('POST /forgot-password and reset-password', () => {
  // Test per recupero password e modifica
});

describe('categories', () => {
  // Test CRUD categorie
});

describe('items', () => {
  // Test CRUD articoli
});

describe('orders', () => {
  // Test CRUD ordini
});

describe('reviews', () => {
  // Test CRUD recensioni
});

describe('reports', () => {
  // Test CRUD segnalazioni
});

describe('payments', () => {
  // Test per pagamenti
});
```
### Esecuzione dei Test
- eseguire: npm install

- per eseguire un singolo file: npx jest server

- per eseguire un singol describe: npx jest server -t "nome_describe"

### Risultati test

Questo report riassume i risultati dei test automatici eseguiti sul backend tramite il file `server.test.js`.

---

### Test Suite Eseguita

- **File**: `tests/server.test.js`
- **Durata Totale**: 18.876 secondi
- **Suite Totali**: 1
- **Test Totali**: 73
- **Test Passati**: 73
- **Test Falliti**: 0
- **Snapshots**: 0

---

### 🔍 Moduli Testati

### Upload Immagini
- ✅ Upload di un file restituisce URL e publicId
- ✅ Eliminazione immagine riuscita

### Registrazione e Login
- ✅ Registrazione utente cliente
- ✅ Prevenzione registrazione duplicata
- ✅ Login per ruoli C e A
- ✅ Login come admin

### Immagine Profilo
- ✅ Aggiornamento riuscito

### Utenti
- ✅ Recupero e modifica utente
- ✅ Cancellazione da parte di utente e admin

### Recupero Password
- ✅ Invio email reset
- ✅ Reset e aggiornamento password

### Categorie
- ✅ Elenco, aggiunta, rinomina, aggiornamento immagine e cancellazione

### Items
- ✅ CRUD completo di item
- ✅ Recupero per ID, filtro, utente
- ✅ Item mescolati per utenti e ospiti, per categoria

### Ordini
- ✅ Aggiunta, aggiornamento stato, recupero per ruolo e cancellazione

### Recensioni
- ✅ Creazione, recupero per item, media voti
- ✅ Recupero e cancellazione review da utente e admin

### Carrello
- ✅ Aggiunta, aggiornamento, recupero, cancellazione item e carrello

### Segnalazioni
- ✅ Creazione e gestione report da cliente, artigiano, admin

### Pagamenti
- ✅ Creazione sessione Stripe
- ✅ Invio email conferma

---
