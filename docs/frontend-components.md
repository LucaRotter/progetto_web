# Documentazione Componenti Frontend

## Introduzione

Questa documentazione descrive i componenti grafici utilizzati nel frontend del sito. Ogni componente è progettato per essere riutilizzabile, accessibile e facilmente personalizzabile.
L'obiettivo è fornire una guida chiara e completa che faciliti lo sviluppo, la manutenzione e l'integrazione dei componenti all'interno dei vari progetti frontend.

---

## Struttura generale della documentazione di un componente

Per ogni componente, la documentazione seguirà questa struttura:

### 1. Nome del componente
Il nome univoco del componente (es. `Button`, `Modal`, `UserCard`).

### 2. Descrizione
Breve spiegazione del ruolo del componente, del suo scopo e di quando utilizzarlo.

### 3. Props / API
Tabella dettagliata delle proprietà accettate dal componente:
- Nome della prop
- Tipo
- Valore di default (se presente)
- Descrizione dell’effetto o utilizzo

### 4. Best practices
Consigli pratici sull'uso corretto del componente, note su accessibilità, limiti e raccomandazioni.


## Componenti

# CarouselCategories
## Descrizione
Componente carousel che mostra diverse categorie in forma di card scorrevoli.
Utilizzato per presentare visivamente e dinamicamente le categorie principali con immagini e titoli cliccabili.
## Props / API
Nome Prop	Tipo	Default	Descrizione
data-bs-interval	number	5000	Tempo in ms per il cambio automatico slide
data-bs-ride	string	"carousel"	Abilita l'autoplay del carousel
card.title	string	—	Titolo della categoria
card.image_url	string	—	URL immagine della categoria
## Best practices
•	Assicurarsi che le immagini siano ottimizzate per il web per non rallentare il caricamento.
•	Utilizzare titoli chiari e significativi per ogni categoria.
•	Testare su dispositivi mobili per garantire la corretta visualizzazione e accessibilità.
•	Usare classi Bootstrap corrette per garantire responsive design.

---

# ProductCard
## Descrizione
Componente card per visualizzare un prodotto con immagine, nome e prezzo.
Utilizzato per mostrare i prodotti nella sezione "Products" con caricamento dinamico e lazy loading.
## Props / API
Nome Prop	Tipo	Default	Descrizione
image_url	string	—	URL immagine prodotto
name	string	—	Nome del prodotto
price	string/number	—	Prezzo del prodotto
onclick	function	—	Funzione da eseguire al click (es. redirect)
## Best practices
•	Assicurarsi che i dati provengano da fonti sicure e valide.
•	Gestire bene il caricamento delle immagini per evitare layout shift.
•	Implementare l'accessibilità con attributi alt per le immagini.
•	Usare truncation per i titoli lunghi per evitare rotture del layout.

---

# LoginFunction 
## Descrizione
Funzione che gestisce il login utente inviando le credenziali al server e salvando il token in localStorage.
Gestisce anche il redirect in base al ruolo utente.
## Props / API
Nome Parametro	Tipo	Default	Descrizione
event	Event	—	Evento submit del form login
email	string	—	Email inserita dall'utente
password	string	—	Password inserita dall'utente
ruolo	string	—	Ruolo utente (C=cliente, A=artigiano)
## Best practices
•	Validare i campi prima dell'invio.
•	Gestire errori server mostrando messaggi all’utente.
•	Proteggere il token con meccanismi di sicurezza (es. HttpOnly cookie, non solo localStorage).
•	Effettuare redirect solo dopo login riuscito.

---

# LazyLoadingProducts 
## Descrizione
Funzione che implementa il caricamento lazy dei prodotti nella lista, caricando solo un certo numero di prodotti visibili in base alla dimensione dello schermo.
Evita di caricare tutti i prodotti in una volta migliorando performance.
## Props / API
Nome Variabile	Tipo	Default	Descrizione
NItems	number	—	Numero di prodotti da caricare a ogni chiamata
token	string	—	Token per autorizzazione API
contenitore	DOM Element	—	Contenitore DOM dove inserire i prodotti
## Best practices
•	Controllare che non ci siano caricamenti concorrenti (caricamentoInCorso).
•	Implementare placeholder per migliorare UX durante il caricamento.
•	Gestire correttamente errori di rete.
•	Testare su diversi dispositivi e risoluzioni.

---

# ScrollHideHeader (funzione JS: scroll event)
## Descrizione
Funzione che nasconde la barra header quando si scrolla verso il basso e la mostra quando si scrolla verso l’alto.
Migliora l’uso dello spazio verticale e la UX di navigazione.
## Props / API
Nome Variabile	Tipo	Default	Descrizione
prevScroll	number	0	Posizione precedente dello scroll
currentScroll	number	—	Posizione attuale dello scroll
## Best practices
•	Evitare flickering o comportamenti troppo aggressivi.
•	Testare su dispositivi touch e desktop.
•	Garantire accessibilità e visibilità degli elementi essenziali.

---


# Navbar
## Descrizione
Barra di navigazione responsive che include logo testuale e immagine, form di ricerca con suggerimenti e filtri avanzati (categorie, prezzo, valutazione), link utente e carrello con visibilità dinamica basata sullo stato di login. Adatta per diversi dispositivi con layout e contenuti che si adattano da mobile a desktop.
## Props / API
Nome Prop / Attributo	Tipo	Default	Descrizione
navbar-expand-sm	string	—	Estende la navbar a partire da schermi ≥576px
btn btn-outline-secondary dropdown-toggle	string	—	Stile e comportamento bottone dropdown filtri
data-bs-toggle	string	"dropdown"	Abilita apertura dropdown tramite Bootstrap
data-bs-auto-close	string	"outside"	Permette di chiudere dropdown cliccando fuori
input[name="search"]	string	—	Campo testo per inserimento termine di ricerca
ul#suggestionsList	HTML element	—	Lista suggerimenti dinamici per autocompletamento
input[name="price-min"]	number	—	Prezzo minimo filtro
input[name="price-max"]	number	—	Prezzo massimo filtro
select[name="minVote"]	number	0	Valutazione minima filtro (da 1 a 5 stelle)
Classi .loggedUser, .notLogged, .loggedArtisan	CSS class	—	Controllano visibilità e comportamento dei link utente in base allo stato di autenticazione
## Best practices
•	Utilizzare immagini ottimizzate per logo per migliorare il caricamento.
•	Implementare il controllo visibilità con JS per mostrare/nascondere link in base a login utente.
•	Gestire dinamicamente la lista di suggerimenti nel campo di ricerca per migliorare UX.
•	Verificare accessibilità aggiungendo attributi ARIA e label esplicativi per form e pulsanti.
•	Testare la navbar su dispositivi di diverse dimensioni per assicurare un comportamento responsive corretto.
•	Utilizzare classi Bootstrap standard per mantenere coerenza stilistica e compatibilità cross-browser.

---

# FAQPage
## Descrizione
Componente pagina FAQ con elenco di domande frequenti visualizzate tramite un accordion Bootstrap.
Include un pulsante "Report" che apre una finestra modale per inviare segnalazioni di problemi.
## Props / API
Nome Elemento	Tipo	Default	Descrizione
accordion-item	HTML Element	—	Contiene una domanda e la sua risposta espandibile tramite accordion.
button.accordion-button	HTML Element	—	Pulsante che espande/chiude la risposta associata alla domanda.
button.shiny-blue-btn (Report)	HTML Button	—	Pulsante che apre la finestra modale per inviare un report.
#reportModal	HTML Element	display:none (init)	Finestra modale contenente il form per inviare un report.
#modalOverlay	HTML Element	display:none (init)	Overlay semi-trasparente che sfuma lo sfondo quando la modale è aperta.
select#type	HTML Select	—	Dropdown con tipi di segnalazione predefiniti caricati dinamicamente via JS.
textarea#description	HTML Textarea	—	Campo di testo per descrivere il problema da segnalare.			
## Best practices
• Assicurarsi che tutte le domande e risposte siano concise e chiare.
• Testare l’accordion su dispositivi mobili per garantire una buona usabilità.
• Usare etichette ARIA corrette per migliorare l’accessibilità.
• Caricare dinamicamente le opzioni del report via JS per facilitare aggiornamenti futuri.
• Validare sempre i campi del form prima di inviare i dati (gestito in JS).
• Evitare di sovraccaricare la pagina con troppe domande per mantenere una navigazione semplice.

---

# ReportModal
## Descrizione
Script per la gestione della finestra modale di segnalazione problemi nella pagina FAQ.
Gestisce l’apertura, chiusura, validazione e invio del form di report.
## Funzioni / API
Nome Funzione	Parametri	Descrizione
openModal	—	Apre la finestra modale e mostra l’overlay.
closeModal	—	Chiude la finestra modale, l’overlay e resetta il form.
sendReport	—	Valida la descrizione e invia il report tramite fetch POST all’endpoint /free-reports.
DOMContentLoaded (listener)	—	Carica dinamicamente le opzioni nel menu a tendina "Type of Report".
## Best practices
• Validare sempre i campi input prima di inviare dati al server.
• Usare token di autenticazione (se presente) nell’header della richiesta.
• Gestire correttamente l’apertura/chiusura della modale per evitare problemi di UX.
• Popolare dinamicamente le opzioni per facilitare aggiornamenti senza modificare l’HTML.

---

# AdminAccessRequest
## Descrizione
Componente pagina di richiesta accesso per utenti admin con form multi-step.
Il primo step richiede email e password admin, il secondo step richiede l’inserimento del codice inviato via email.
Include navigazione tra step con indicatori di progresso e validazione codice di accesso.
## Props / API
Nome Elemento	Tipo	Default	Descrizione
form#step1form	HTML Form	—	Form per inserimento email e password admin. Gestisce la richiesta del codice di accesso.
input#emailAdmin	HTML Input	—	Campo email, con validazione formato email.
input#pwdAdmin	HTML Input	—	Campo password in testo (consigliabile cambiare a type="password" per sicurezza).
button[type="submit"]	HTML Button	—	Pulsante per procedere al passo successivo (invio form step1).
form#step2form	HTML Form	—	Form per inserire codice di verifica a 2 cifre inviato via email.
input.code-box	HTML Input	—	Input per ogni cifra del codice, con focus automatico al successivo e cancellazione.
ul#stepNav	HTML Element	—	Nav pills che indicano e consentono di switchare tra step, con stato attivo e disabilitato.
## Funzioni / API
Nome Funzione	Parametri	Descrizione
adminAccessRequest.nextStep	event, step	Gestisce il submit del primo form; invia email, password e ruolo admin al backend e riceve il codice; passa allo step successivo.
adminAccessRequest.CodeControl	event	Gestisce il submit del form di verifica codice; confronta codice inserito con quello ricevuto e, se corretto, salva login e reindirizza.
adminAccessRequest.setupCodeInputs	—	Imposta gli eventi sugli input codice per focus automatico al successivo e gestione del backspace per tornare indietro.
## Best practices
• Usare type="password" per il campo password per nascondere il testo.
• Validare email e password sia client che server side.
• Proteggere il codice di verifica, non esporlo in console in produzione.
• Bloccare l’accesso a step 2 finché step 1 non è completato correttamente.
• Implementare limiti per tentativi di inserimento codice per prevenire brute force.
• Migliorare accessibilità con label e attributi ARIA.

---

# CatalogPage
## Descrizione
Script per il caricamento dinamico del profilo artisan e dei prodotti associati.
Al caricamento della pagina recupera tramite fetch i dati del profilo e i prodotti dall’API, crea dinamicamente le card prodotto e popola la pagina.
## Funzioni / API
Nome Funzione	Parametri	Descrizione
initProfile	profile	Imposta nome e immagine del profilo artisan nella sezione header.
ProductCreation	Data	Crea e inserisce una card prodotto nel container, con immagine, nome e prezzo; imposta evento click per aprire dettaglio prodotto.
### Eventi
Evento	Descrizione
DOMContentLoaded	Al caricamento della pagina esegue fetch per ottenere prodotti e dati profilo tramite parametro URL "A" e chiama le funzioni di rendering.
## Best practices
• Validare sempre i dati ricevuti dal server prima di usarli nel DOM.
• Gestire gli errori di rete con messaggi o fallback UI chiari.
• Usare delega eventi o setAttribute per gestire eventi in modo pulito.
• Separare il più possibile la logica di fetch dalla manipolazione DOM.
• Ottimizzare il caricamento immagini con dimensioni e formati adeguati.

---

# CartPage
## Descrizione
Script per la gestione dinamica del carrello. Recupera i dati del carrello dal backend, visualizza i prodotti con quantità modificabile, consente la rimozione di prodotti, aggiorna il totale e gestisce la navigazione all’acquisto.
## Funzioni / API
Funzione	Parametri	Descrizione
createCartElement	CartContent	Crea la card di un prodotto nel carrello con immagine, nome, categoria, prezzo, quantità e pulsanti per aumento, diminuzione e rimozione.
getInfo	product	Fa fetch del dettaglio prodotto per id, aggiorna localStorage e chiama createCartElement.
updateCartReview	—	Calcola e aggiorna il numero totale di prodotti e il prezzo complessivo nel carrello.
buyCart	—	Reindirizza alla pagina Pay.html per procedere con l’acquisto.
### Eventi
Evento	Descrizione
DOMContentLoaded	Recupera il carrello autenticato via fetch, gestisce visibilità sezioni "empty/full", carica prodotti.
## Best practices
• Gestire correttamente token di autenticazione negli header.
• Usare classi Bootstrap e id per nascondere/mostrare sezioni in base al contenuto.
• Aggiornare localStorage e UI in modo sincronizzato.
• Gestire errori di rete con messaggi appropriati (da migliorare).
• Separare logica di fetch da manipolazione DOM per manutenzione futura.

---

# CategoriesPage
## Descrizione 
Pagina che mostra prodotti di una categoria specifica, con caricamento dinamico (lazy loading) durante lo scroll e creazione dinamica delle card prodotto.

## Props / API delle funzioni principali
Funzione	Parametri	Descrizione
ProductCreation	Data (object)	Crea una card prodotto DOM completa. Data contiene info prodotto (es. item_id, name, image_url, price). Ritorna l’elemento DOM card.
CardPlaceholderCreation	—	Crea una card placeholder (scheletro) durante il caricamento. Ritorna l’elemento DOM placeholder.
Loadingcard	—	Gestisce il caricamento prodotti via fetch con lazy loading, inserisce placeholder e poi sostituisce con card reali. Usa product estratto da URL.
getCardCountByScreenWidth	—	Restituisce il numero di card da caricare in base alla larghezza della finestra (responsive).

## Best practices
•	Validare sempre i dati ricevuti dal server prima di usarli nel DOM, per evitare problemi di sicurezza e dati inconsistenti.
•	Gestire gli errori di rete e di fetch mostrando messaggi di errore chiari o UI alternative che informino l’utente.
•	Separare la logica di fetch dei dati dalla manipolazione del DOM per migliorare la manutenibilità e leggibilità del codice.
•	Usare delega eventi o setAttribute per assegnare eventi agli elementi dinamici in modo pulito e performante.
•	Ottimizzare il caricamento delle immagini utilizzando formati moderni (es. WebP) e dimensioni appropriate per evitare caricamenti eccessivi.
•	Assicurarsi che le immagini abbiano sempre un attributo alt descrittivo per migliorare l’accessibilità.
•	Gestire il caricamento asincrono con attenzione, evitando richieste duplicate e gestendo correttamente lo stato di caricamento.
•	Gestire il caso in cui i dati ricevuti siano vuoti o mancanti, mostrando messaggi o layout alternativi.
•	Usare nomi di funzioni e variabili chiari e coerenti per facilitare la lettura e il debugging.
•	Testare il comportamento su diversi dispositivi e risoluzioni per garantire una UX coerente e responsive.

---

# ManageProducts
## Descrizione
Pagina per la gestione dinamica dei prodotti di un utente/artisan.
Al caricamento recupera tramite fetch la lista prodotti associati all’utente e li rende come card cliccabili. Permette inoltre di aggiungere o modificare prodotti tramite un modal con form e upload immagine.
## Funzioni / API
Nome Funzione	Parametri	Descrizione
renderProductCard	productData	Crea e inserisce una card prodotto nel container con dati nome, categoria, prezzo, quantità, immagine e descrizione.
addNewProduct	—	Invia i dati del nuovo prodotto all’API via POST e aggiorna la UI con la nuova card.
updateProduct	productId	Aggiorna i dati prodotto esistenti tramite richieste PUT multiple e aggiorna la card corrispondente nel DOM.
renderCarousel	isEditing	Mostra l’immagine caricata nel carousel del modal, con possibilità di rimuoverla in fase di modifica.
openModalForEdit	productId	Apre il modal popolando i campi del prodotto selezionato per modificarlo.
resetFormAndCarousel	—	Pulisce il form e il carousel immagini, resettando lo stato del modal.
### Eventi
Evento	Descrizione
DOMContentLoaded	Carica i prodotti dall’API e li mostra in pagina.
change (su uploader immagini)	Gestisce il caricamento di una sola immagine e la visualizza nel carousel.
submit (form prodotto)	Valida i campi e decide se aggiungere un nuovo prodotto o aggiornare uno esistente.
click (su card prodotto)	Apre il modal per modificare il prodotto cliccato.
hidden.bs.modal (modal)	Resetta form e stato quando il modal viene chiuso.

## Best practices
• Validare sempre i dati inseriti dall’utente (nome, categoria, prezzo, quantità, immagine) con messaggi di errore chiari.
• Gestire errori di rete con catch e log per debug.
• Limitare il caricamento immagini a una per prodotto, prevenendo upload multipli accidentali.
• Separare la logica di fetch e aggiornamento API dalla manipolazione del DOM per mantenere codice pulito e manutenibile.
• Usare dataset HTML per mantenere dati associati alle card e facilitare modifiche dinamiche.
• Ottimizzare la visualizzazione delle immagini usando dimensioni fisse e object-fit per evitare distorsioni.
• Pulire lo stato del form e immagini quando si apre/chiude il modal per evitare dati residui indesiderati.
• Usare Bootstrap per modali, bottoni e responsive design per garantire buona usabilità su tutti i dispositivi.

---

# OrdersPage
## Descrizione
Pagina che mostra gli ordini effettuati dall’utente autenticato, con caricamento dinamico degli elementi tramite fetch alle API locali. Per ogni ordine recupera i dettagli del prodotto e crea dinamicamente gli elementi DOM che mostrano le informazioni dell’ordine. È presente una modale per inviare recensioni o segnalazioni sugli articoli acquistati.
## Props / API delle funzioni principali
Funzione	Parametri	Descrizione
getInfo	product (oggetto ordine)	Recupera informazioni dettagliate di un prodotto tramite API usando l'item_id.
createCartElement	CartContent (oggetto prodotto), Category (stringa)	Crea un elemento DOM rappresentante un prodotto nell’ordine, con immagine, nome, categoria, prezzo, quantità e bottone per recensioni.
openModal	item (item_id)	Apre la modale per la segnalazione o recensione, impostando l’item_id corrente.
closeModal	—	Chiude la modale e resetta i campi del form.
sendReview	event (evento submit form)	Gestisce l’invio della recensione/segna-lazione tramite POST, con validazione del campo descrizione e invio dati al server.
(inline) DOMContentLoaded handler	—	Popola la select delle valutazioni con opzioni da 1 a 5 stelle all’avvio della pagina.

## Best practices
•	Gestione autenticazione: usa il token salvato in localStorage per autorizzare le richieste API.
•	Validazione input: prima di inviare una recensione, verifica che la descrizione non sia vuota e fornisce un feedback visivo (bordo rosso).
•	Gestione asincrona: usa fetch con .then() e .catch() per recuperare dati e gestire errori in modo user-friendly.
•	Separazione funzioni: divide chiaramente le responsabilità: recupero dati (getInfo), creazione DOM (createCartElement), gestione modale (openModal, closeModal), invio dati (sendReview).
•	UI dinamica: genera dinamicamente elementi DOM senza ricaricare la pagina, mantenendo la UI reattiva.
•	Accessibilità: i campi del form hanno label associate e placeholder descrittivi.
•	Manutenzione: evita duplicazioni (ad esempio la quantità viene mostrata una volta sola correttamente) e pulisce il form dopo invio o chiusura della modale.

---

# PayPage
## Descrizione
Script per la gestione del processo di pagamento.
Al caricamento della pagina prepara il form di pagamento, valida i dati inseriti dall’utente e invia la richiesta al server tramite fetch o API dedicata. Gestisce risposte di successo o errore mostrando messaggi appropriati.
## Funzioni / API
Nome Funzione	Parametri	Descrizione
initPaymentForm	none	Inizializza il form di pagamento, setta event listener per la validazione e invio del form.
validateInput	formData	Controlla che i dati del pagamento siano corretti e completi prima di inviare la richiesta.
submitPayment	paymentData	Invia i dati di pagamento al server e gestisce la risposta (successo o errore).
### Eventi
Evento	Descrizione
submit (form)	Alla submit del form valida i dati, se corretti invia la richiesta di pagamento al server.
## Best practices
•	Validare sempre i dati di pagamento lato client e lato server.
•	Mostrare messaggi chiari in caso di errore o conferma.
•	Usare HTTPS per la sicurezza della trasmissione dati.
•	Non memorizzare mai dati sensibili in locale o nel DOM.
•	Gestire correttamente timeout o errori di rete per non bloccare l’interfaccia.

---

# PasswordReset
## Descrizione
Gestisce il flusso di reset password in due step: verifica email e cambio password.
Al primo step invia la richiesta di reset password tramite email all’API; al secondo step consente di inserire la nuova password, inviandola all’API per aggiornamento.
Salva temporaneamente l’email nel localStorage per mantenere stato tra step.
## Funzioni / API
Nome Funzione	Parametri	Descrizione
emailForm submit	email	Invia richiesta di reset password per email tramite POST a /forgot-password.
formReset submit	email, newPassword	Invia nuova password per aggiornamento tramite POST a /reset-password.
### Eventi
Evento	Descrizione
submit (step1)	Invio email per reset password. Salva email in localStorage.
submit (step2)	Invio nuova password per email salvata nel localStorage.
## Best practices
• Validare l’email e le password prima dell’invio.
• Gestire errori fetch con messaggi chiari per l’utente.
• Usare localStorage solo per dati temporanei e non sensibili.
• Proteggere endpoint API con autenticazione e rate limiting.

---

# RegistrationPage
## Descrizione
Pagina di registrazione utente che raccoglie nome, cognome, email, password e conferma password.
Al submit del form valida che la password corrisponda alla conferma e invia i dati tramite POST all’endpoint /register.
Il ruolo utente viene recuperato dal localStorage. In caso di successo, imposta flag di login e modalità nel localStorage e reindirizza alla homepage.
## Funzioni / API
Nome Funzione	Parametri	Descrizione
formReg submit	name, surname, email, pwd, role	Invia dati registrazione all’API /register via POST.
document ready	—	Recupera messaggio da localStorage e lo visualizza nella pagina.
primarysearchform submit	searchQuery	Gestisce ricerca da form principale (solo reset form).
### Eventi
Evento	Descrizione
submit (formReg)	Valida password e conferma, invia dati registrazione.
document ready	Carica messaggio di registrazione da localStorage.
submit (primarysearchform)	Previene comportamento default e resetta form.
## Best practices
• Validare i campi lato client, in particolare password e conferma password.
• Gestire errori fetch con messaggi chiari per l’utente.
• Non salvare mai password in localStorage o in chiaro.
• Assicurarsi che endpoint API abbia sicurezza adeguata (HTTPS, validazione lato server).
• Usare tipi input adeguati (es. type="email" per email, type="password" per password).

---

# ProductList
## Descrizione
Lista prodotti con caricamento dinamico (lazy loading) e placeholder durante il fetch.
I prodotti sono mostrati in una griglia responsive che si adatta alla larghezza dello schermo.
Supporta filtri tramite query string (categorie, prezzo minimo/massimo, valutazione minima, ricerca testuale).
Ogni prodotto è rappresentato da una card cliccabile che porta alla pagina di dettaglio prodotto.
## Funzioni / API
Nome funzione	Parametri	Descrizione
ProductCreation	Data (oggetto prodotto)	Crea e ritorna una card prodotto DOM basata su Data.
CardPlaceholderCreation	—	Crea e ritorna un placeholder card per caricamento.
Loadingcard	—	Inserisce placeholder e effettua fetch prodotti filtrati, sostituendo placeholder con card prodotto.
getCardCountByScreenWidth	—	Ritorna il numero di card da mostrare in base alla larghezza schermo.
## Props / Api
Parametro	Descrizione	Tipo
categories[]	Categorie da filtrare (può essere multiplo)	array di stringhe
minPrice	Prezzo minimo filtro	numero
maxPrice	Prezzo massimo filtro	numero
minEval	Valutazione minima filtro (es. stelle)	numero
primarysearch	Testo ricerca principale	stringa
### Eventi
Evento	Descrizione
DOMContentLoaded	Al caricamento pagina avvia caricamento prodotti
Click su card prodotto	Reindirizza a dettaglio prodotto con id in URL
## Best Practices
• Utilizzare placeholder con aria-hidden e classi Bootstrap placeholder-glow per migliorare UX durante il caricamento.
• Usare URLSearchParams per gestire parametri filtro in modo flessibile.
• Gestire fetch e risposta in modo asincrono per non bloccare l’interfaccia.
• Assicurarsi che immagini prodotto siano ottimizzate e abbiano alt descrittivi per accessibilità.
• Gestire click su card tramite attributo onclick inline con id prodotto per navigazione dettagliata.
• Adattare numero card caricate dinamicamente in base alla larghezza schermo per ottimizzazione layout.
• Separare chiaramente funzioni di creazione DOM da logica di caricamento dati per manutenzione e riuso.

---

# Artisan Order Dashboard
## Descrizione
Dashboard per visualizzare gli ordini artigiani con stato aggiornabile da "purchased" a "shipped".
Utilizza token JWT da localStorage per autenticare le chiamate API.
Mostra ogni ordine in una card con stato, e permette di cambiare stato tramite bottone "Ship Order".
## Funzioni / Api
Nome funzione	Parametri	Descrizione
renderOrders	Order (array ordini)	Riceve lista ordini e costruisce dinamicamente il DOM mostrando card ordini e stato di spedizione.
getStatusClass	order (boolean)	Ritorna la classe CSS per badge stato: "purchased" o "shipped".
getStatusText	order (boolean)	Ritorna il testo visualizzato sul badge stato: "purchased" o "shipped".
getStatusIcon	order (boolean)	Ritorna l’icona emoji da mostrare nel badge stato: 🛒 per acquistato, 📦 per spedito.


## Best Practices
•	Conserva il token JWT in localStorage per autenticazione API.
•	Gestisci errori di fetch con blocco catch per logging e UX migliorata.
•	Usa classi CSS semantiche (status-badge purchased/shipped) per facilità di styling.
•	Ottimizza la gestione dello stato locale (purchased boolean) per riflettere cambiamenti di stato.
•	Evita duplicati di card per lo stesso order_id usando variabile pastOrder per confronto.
•	Mantieni separata la logica di rendering UI da chiamate API.

---

# PaymentConfirmed
## Descrizione
Script per la gestione della conferma dell’ordine dopo il completamento del pagamento.
Al caricamento della pagina preleva i dati dell’ordine salvati nella sessione, invia una richiesta POST per aggiungere l’ordine nel sistema, quindi elimina il carrello dell’utente tramite una richiesta DELETE. Gestisce errori e pulisce la sessione dopo l’operazione.

## Funzioni / API
Nome Funzione	Parametri	Descrizione
(esecuzione automatica)	-	Preleva dati da sessionStorage e localStorage, invia fetch POST per aggiungere ordine e fetch DELETE per svuotare il carrello.

## Descrizione 
•	Recupera il token di autenticazione da localStorage.
•	Recupera e fa il parsing dei dati cliente dall’oggetto JSON in sessionStorage (chiave "infoClient").
•	Estrae i dati dell’ordine e le informazioni di spedizione (indirizzo, numero civico, CAP, provincia, paese, telefono).
•	Esegue una richiesta POST su /add-order inviando i dati dell’ordine con header di autorizzazione.
•	Alla risposta positiva, esegue una richiesta DELETE su /delete-cart per svuotare il carrello.
•	Rimuove la chiave "infoClient" dalla sessionStorage.
•	Gestisce eventuali errori loggandoli in console e mostrando un messaggio d’errore nella pagina.

---

# UserPage
## Descrizione
Script per la gestione e visualizzazione dei dettagli utente.
Al caricamento della pagina recupera e mostra nome, cognome e email dell’utente tramite fetch verso l’API.
Permette di aprire una modale per modificare nome e cognome, con validazione base, e inviare la modifica al server via fetch PUT.
## Funzioni / API
Nome Funzione	Parametri	Descrizione
openModal	modalId, overlayId	Mostra la modale di modifica specificata e l’overlay.
closeModal	none	Nasconde la modale e l’overlay.
saveChanges	event	Valida i dati inseriti nel form, invia la richiesta PUT per aggiornare nome e cognome e chiude la modale se tutto ok.

### Eventi
Evento	Descrizione
DOMContentLoaded	Al caricamento della pagina recupera dati utente via API e aggiorna il contenuto HTML.
click su #details	Apre la modale di modifica dati.
click su #modalOverlay	Chiude la modale di modifica.
## Best practices
•	Validare i dati lato client prima di inviarli al server.
•	Proteggere le API con token di autorizzazione.
•	Gestire errori di rete e fornire feedback chiari all’utente.
•	Pulire i campi del form dopo il salvataggio.
•	Usare HTTPS per proteggere i dati sensibili.
•	Limitare la modifica solo ai campi necessari per sicurezza.

---

# ProductDetailPage
## Descrizione
Script per il caricamento dinamico delle informazioni dettagliate di un prodotto, inclusi dati prodotto, categoria, recensioni e informazioni sul venditore. Gestisce inoltre le azioni utente come l’aggiunta al carrello e l’invio di segnalazioni tramite modale.
Al caricamento della pagina, tramite fetch, recupera i dati necessari dall’API e popola la pagina in modo dinamico.
## Funzioni / API
Nome funzione	Parametri	Descrizione
appdateItem	itemData, categoryData	Aggiorna la pagina con nome, prezzo, descrizione, immagine, categoria e valutazione media prodotto.
getRating	—	Recupera la valutazione media del prodotto dall’API.
addToCart	—	Aggiunge il prodotto al carrello dell’utente autenticato tramite POST all’API.
addToReview	—	Recupera e mostra le recensioni associate al prodotto.
openModal	—	Mostra la finestra modale per la segnalazione di problemi.
closeModal	—	Nasconde la finestra modale.
sendReport	—	Invia la segnalazione compilata dall’utente tramite POST all’API.
createReview	ReviewContent	Crea un blocco DOM per visualizzare una singola recensione nella sezione recensioni.
sendToArtisan	—	Reindirizza alla pagina catalogo dell’artigiano venditore.
initProfile	profile	Imposta nome e immagine del venditore nella sezione dedicata.
### Eventi
Evento	Descrizione
DOMContentLoaded	Al caricamento della pagina esegue fetch per ottenere dati prodotto, recensioni e venditore.
## Best practices
•	Validare sempre i dati ricevuti dal server prima di inserirli nel DOM.
•	Gestire gli errori di rete mostrando messaggi chiari o UI di fallback.
•	Separare la logica di fetch dalla manipolazione del DOM per mantenere il codice ordinato.
•	Usare classi CSS o attributi per mostrare/nascondere modali, evitando stili inline.
•	Garantire l’accessibilità, soprattutto per modali e pulsanti (focus management, ARIA).
•	Ottimizzare le immagini per migliorare i tempi di caricamento e l’esperienza utente.

---

#AdminPage
##Descrizione
Per la gestione di un pannello di amministrazione web, permette di  gestire e visualizzare segnalazioni (report) ricevute e prese in carico, visualizzare, modificare ed eliminare utenti, effettuare logout 
Funzioni / API
Nome Funzione	Parametri	Descrizione	
Nome Funzione	Parametri	Descrizione
openModal	modalId (string), overlayId (string)	Mostra la modale di modifica specificata e l’overlay.
closeModal	nessuno	Nasconde la modale e l’overlay.
saveChanges	event (Event)	Valida i dati inseriti nel form, invia richiesta PUT per aggiornare dati utente.
showSection	sectionId (string)	Mostra una sezione della pagina nascondendo le altre.
deleteReport	id (number	Elimina i report
takeCharge	id (number	Permette di prendere in carico un report
creationReport	reports (Array)	Crea dinamicamente la lista di report ricevuti e li inserisce nel DOM.
createMyReports	reports (Array)	Mostra i report presi in carico dall’admin nella propria lista.
logout	nessuno	Effettua logout pulendo token e reindirizzando alla pagina principale.
renderUsers	users (Array)	Popola la lista utenti con i dati ottenuti dal backend.
modifyUser	user (Object)	Mostra il modal di modifica utente con dati precompilati.
deleteUser	user (Object)	Elimina un utente dopo conferma e aggiorna la UI.
toggleField	fieldId (string), button (Element)	Attiva/disattiva un campo input e modifica testo del bottone associato.
Best Practices

•	Autenticazione: Verifica sempre il token all’avvio e reindirizza se assente.
•	Chiamate API: Sempre protette con token via header.
•	Gestione errori: Implementare catch per tutte le promise e mostrare messaggi user-friendly.
•	UI Update: Aggiornare il DOM dopo modifiche al backend per mantenere coerenza.
•	Conferme: Usare confirm() per azioni distruttive come eliminazioni.
•	Modularità: Funzioni specifiche per ogni tipo di operazione (CRUD utenti, report).
•	Accessibilità: Focus sugli input abilitati per migliorare UX.
•	Modalità disabilitata: I campi sono disabilitati di default per evitare modifiche accidentali.




