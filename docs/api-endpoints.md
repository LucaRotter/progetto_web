# descrizione su tutti gli endpoint, anche non crud del backend, descrivendo parametri, errori e risposte
# dettagli tecnici

# documentazione degli api-endpoints

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

