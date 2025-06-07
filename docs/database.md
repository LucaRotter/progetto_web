

# Documentazione Database - Schema ER
## [SCHEMA ER](https://docs.google.com/drawings/d/11UnX9WPMfHiO6iH_f63zqhHhJoBWnxS1_4k8uv89z2E/edit?usp=sharing)

## Descrizione generale

Il database è struturato in modo organizzato per gestire ruoli, permessi, utenti, categorie di prodotti, articoli, ordini, carrelli, segnalazioni e recensioni.

Le tabelle principali sono correlate tra loro tramite chiavi esterne, garantendo integrità referenziale con comportamenti di `ON DELETE` e `ON UPDATE` a cascata ove necessario.

---

## Tabelle e Descrizione

### 1. `roles`

| Campo    | Tipo         | Note                       |
|----------|--------------|----------------------------|
| role_id  | VARCHAR(5)   | PK                         |
| name     | VARCHAR(100) | Nome ruolo, non nullo      |

Ruolo degli utenti (cliente, artigiano, admin).

---

### 2. `permissions`

| Campo          | Tipo         | Note                       |
|----------------|--------------|----------------------------|
| permission_id  | VARCHAR(5)   | PK                         |
| name           | VARCHAR(100) | Nome permesso, non nullo   |

Permessi che possono essere assegnati ai ruoli.

---

### 3. `roles_permissions`

| Campo         | Tipo       | Note                                                   |
|---------------|------------|--------------------------------------------------------|
| permission_id | VARCHAR(5) | FK → permissions(permission_id), PK composita          |
| role_id       | VARCHAR(5) | FK → roles(role_id), PK composita                       |

Tabella di associazione molti-a-molti tra ruoli e permessi.

---

### 4. `users`

| Campo     | Tipo         | Note                                  |
|-----------|--------------|---------------------------------------|
| user_id   | VARCHAR(5)   | PK                                    |
| name      | VARCHAR(100) | Nome utente, non nullo                 |
| surname   | VARCHAR(100) | Cognome utente, non nullo              |
| email     | VARCHAR(100) | Email, non nullo                       |
| pwd       | VARCHAR(120) | Password (hashed), non nullo           |
| image_url | TEXT         | URL immagine profilo (opzionale)      |
| role_id   | VARCHAR(5)   | FK → roles(role_id)                    |

Utenti registrati: clienti, artigiani, amministratori.

---

### 5. `categories`

| Campo       | Tipo         | Note                  |
|-------------|--------------|-----------------------|
| category_id | VARCHAR(5)   | PK                    |
| name        | VARCHAR(100) | Nome categoria, non nullo |
| image_url   | TEXT         | Immagine categoria (opzionale) |

Categorie di prodotti artigianali.

---

### 6. `items`

| Campo       | Tipo         | Note                                      |
|-------------|--------------|-------------------------------------------|
| item_id     | VARCHAR(5)   | PK                                        |
| name        | VARCHAR(100) | Nome prodotto, non nullo                   |
| price       | DECIMAL(10,2)| Prezzo, non nullo                          |
| description | TEXT         | Descrizione prodotto                       |
| quantity    | INT          | Quantità disponibile, non nullo            |
| image_url   | TEXT         | Immagine prodotto                          |
| category_id | VARCHAR(5)   | FK → categories(category_id)               |
| user_id     | VARCHAR(5)   | FK → users(user_id) (artigiano proprietario), ON DELETE/UPDATE CASCADE |

Prodotti venduti dagli artigiani.

---

### 7. `orders`

| Campo        | Tipo         | Note                                                                 |
|--------------|--------------|----------------------------------------------------------------------|
| order_id     | VARCHAR(5)   | Parte PK                                                             |
| item_id      | VARCHAR(5)   | Parte PK, FK → items(item_id)                                        |
| customer_id  | VARCHAR(5)   | FK → users(user_id) (cliente)                                        |
| artisan_id   | VARCHAR(5)   | FK → users(user_id) (artigiano)                                      |
| quantity     | INT          | Quantità ordinata, non nullo                                         |
| day          | DATE         | Data ordine, non nullo                                               |
| time         | TIME         | Ora ordine, non nullo                                                |
| state        | VARCHAR(100) | Stato ordine (es. "in elaborazione", "spedito"), non nullo           |
| address      | VARCHAR(255) | Indirizzo di consegna                                                |
| civic_number | VARCHAR(100) | Numero civico                                                        |
| city         | VARCHAR(100) | Città                                                                |
| postal_code  | VARCHAR(20)  | CAP                                                                  |
| province     | VARCHAR(100) | Provincia                                                            |
| country      | VARCHAR(100) | Paese                                                                |
| phone_number | VARCHAR(30)  | Numero telefono cliente                                              |

Ordini effettuati dai clienti per i prodotti degli artigiani.

---

### 8. `carts`

| Campo    | Tipo       | Note                                                  |
|----------|------------|-------------------------------------------------------|
| quantity | INT        | Quantità del prodotto nel carrello, non nullo         |
| item_id  | VARCHAR(5) | PK composita, FK → items(item_id), ON DELETE CASCADE  |
| user_id  | VARCHAR(5) | PK composita, FK → users(user_id), ON DELETE CASCADE  |

Prodotti temporaneamente aggiunti al carrello da un utente.

---

### 9. `reports`

| Campo       | Tipo         | Note                                                  |
|-------------|--------------|-------------------------------------------------------|
| report_id   | VARCHAR(5)   | PK                                                    |
| category    | VARCHAR(100) | Categoria segnalazione, non nullo                     |
| description | TEXT         | Descrizione della segnalazione                        |
| customer_id | VARCHAR(5)   | FK → users(user_id) cliente, ON DELETE CASCADE        |
| artisan_id  | VARCHAR(5)   | FK → users(user_id) artigiano, ON DELETE CASCADE      |
| item_id     | VARCHAR(5)   | FK → items(item_id)                                   |
| admin_id    | VARCHAR(5)   | FK → users(user_id) amministratore                    |

Segnalazioni di problemi o contestazioni da parte di clienti, artigiani.

---

### 10. `reviews`

| Campo       | Tipo         | Note                                                  |
|-------------|--------------|-------------------------------------------------------|
| review_id   | VARCHAR(5)   | PK                                                    |
| item_id     | VARCHAR(5)   | FK → items(item_id), ON DELETE CASCADE                |
| user_id     | VARCHAR(5)   | FK → users(user_id), ON DELETE CASCADE                |
| evaluation  | INT          | Valutazione numerica, non nullo                       |
| description | TEXT         | Recensione testuale                                   |

Recensioni lasciate dagli utenti sui prodotti.

---

### 11. `shuffled`

| Campo       | Tipo         | Note                                                  |
|-------------|--------------|-------------------------------------------------------|
| item_index  | INTEGER      | PK                                                    |
| item_id     | VARCHAR(5)   | FK → items(item_id), ON DELETE CASCADE                |
| user_key    | VARCHAR(16)  | Chiave identificativa utente                          |
| category_id | VARCHAR(5)   | FK → categories(category_id), ON DELETE CASCADE       |

Tabella per gestione interna di shuffle o ordinamento personalizzato di prodotti(basato anche su categoria) per utente registrati e non.

---

# Documentazione Inserimenti di Default nel Database

## 1. Ruoli (`roles`)

Ruoli base creati con ID e nome abbreviato:

| role_id | name | Descrizione             |
|---------|-------|-------------------------|
| 1       | C     | Cliente                 |
| 2       | A     | Artigiano               |
| 3       | Ad    | Amministratore (Admin)  |

---

## 2. Permessi (`permissions`)

Permessi definiti per le diverse azioni possibili nel sistema, associati a ruoli specifici:

| permission_id | name               | Descrizione                                      | Ruolo di riferimento       |
|---------------|--------------------|-------------------------------------------------|----------------------------|
| 1             | update_cart        | Modificare il carrello                           | Cliente                    |
| 2             | place_order        | Effettuare un ordine                             | Cliente                    |
| 3             | view_orders        | Visualizzare gli ordini                           | Cliente                    |
| 4             | add_review         | Aggiungere recensioni                            | Cliente                    |
| 5             | update_item        | Modificare i propri articoli                      | Artigiano                  |
| 6             | manage_orders      | Gestire gli ordini                               | Artigiano                  |
| 7             | manage_users       | Gestire gli utenti                               | Admin                      |
| 8             | manage_permissions | Gestire i permessi                               | Admin                      |
| 9             | view_manage_orders | Visualizzare e gestire tutti gli ordini         | Admin                      |
| 10            | delete_user        | Eliminare utenti                                 | Admin                      |
| 11            | moderate_reviews   | Moderare le recensioni                           | Admin                      |
| 12            | moderate_reports   | Moderare le segnalazioni                         | Admin                      |
| 13            | manage_categories  | Gestire le categorie                             | Admin                      |
| 14            | delete_item        | Eliminare articoli                               | Artigiano e Admin          |
| 15            | manage_report      | Gestire le segnalazioni                          | Cliente e Artigiano        |
| 16            | update_profile     | Aggiornare il profilo                            | Cliente e Artigiano        |
| 17            | delete_review      | Eliminare recensioni                             | Cliente e Admin            |

---

## 3. Associazione Ruoli-Permessi (`roles_permissions`)

Collegamenti tra ruoli e permessi (ruolo, permesso):

- Cliente (role_id=1) ha permessi: 1, 2, 3, 4, 15, 16, 17
- Artigiano (role_id=2) ha permessi: 5, 6, 14, 15, 16
- Admin (role_id=3) ha permessi: 7, 8, 9, 10, 11, 12, 13, 14, 17

---

## 4. Utenti Admin di Default (`users`)

Utenti amministratori con dati di esempio:

| user_id | name       | surname  | email                          | pwd (hashed)                                               | role_id |
|---------|------------|----------|--------------------------------|------------------------------------------------------------|---------|
| 1       | Alessandro | Grassi   | alessandro.grassi24062003@gmail.com | bcrypt hash                                                | 3       |
| 2       | Aleksandar | Kastratovic | aleks.kastratovic@gmail.com    | bcrypt hash                                                | 3       |
| 3       | Luca       | Rotter   | marketrader69@gmail.com          | bcrypt hash                                                | 3       |
| 4       | Davide     | Bilora   | davidebilora03pc@gmail.com       | bcrypt hash                                                | 3       |

> **Nota:** Le password sono criptate con bcrypt, non visibili in chiaro.

---

## 5. Categorie di Default (`categories`)

Categorie di prodotti:

| category_id | name        |
|-------------|-------------|
| 1           | books       |
| 2           | electronics |
| 3           | clothing    |
| 4           | home        |
| 5           | gardern     |
| 6           | tech        |
| 7           | sports      |
| 8           | beauty      |
| 9           | food        |

---

## 6. Utenti di Test (`users`)

Due utenti per testare ruoli differenti, con password "password123" (bcrypt hash):

| user_id | name    | surname   | email                     | pwd (hashed)                                              | role_id |
|---------|---------|-----------|---------------------------|-----------------------------------------------------------|---------|
| 5       | prova   | artigiano | marketrader69@gmail.com   | $2b$10$N7dSkM15kwW3pwm3KT5Yue0lO8rpviTnB/Dwv5sF5s0ZaKT1ujABi | 2       |
| 6       | prova   | cliente   | marketrader69@gmail.com   | $2b$10$N7dSkM15kwW3pwm3KT5Yue0lO8rpviTnB/Dwv5sF5s0ZaKT1ujABi | 1       |

---

## 7. Articoli di Test (`items`)

Esempi di prodotti inseriti per test, appartenenti all'artigiano con `user_id = 5`:

| item_id | name    | price | description              | quantity | category_id | user_id |
|---------|---------|-------|--------------------------|----------|-------------|---------|
| 1       | Item 1  | 10.50 | Description for item 1   | 5        | 1           | 5       |
| 2       | Item 2  | 10.50 | Description for item 2   | 5        | 1           | 5       |
| 3       | Item 3  | 25.00 | Description for item 3   | 10       | 2           | 5       |
| ...     | ...     | ...   | ...                      | ...      | ...         | ...     |
| 30      | Item 30 | 42.00 | Description for item 30  | 4        | 2           | 5       |

(La lista completa contiene 30 item con varie categorie e quantità.)

---

# Backup e Ripristino del Database con pgAdmin

Questa guida descrive come eseguire il **backup** e il **ripristino** di un database PostgreSQL utilizzando l'interfaccia grafica di **pgAdmin**.

---

##  Backup del Database

### Passaggi:

1. Apri **pgAdmin** e connettiti al tuo server PostgreSQL.
2. Nella barra laterale sinistra, **clic con il tasto destro sul database** da salvare.
3. Seleziona **"Backup..."** dal menu a comparsa.
4. Compila i campi nella finestra che appare:
   - **Filename**: scegli il percorso e il nome del file, ad esempio:
     ```
     /home/utente/backup/backup_mio_database.sql
     ```
   - **Format**:
     - `Plain` → file SQL leggibile (consigliato per revisioni)
     - `Custom` → formato binario, adatto per restore parziale
     - `Tar` → archivio compresso
   - Altri parametri possono essere lasciati con i valori predefiniti.
5. Clicca su **"Backup"** per avviare il salvataggio.

---

## Ripristino del Database (Restore)

### Prerequisiti:

- Avere già un file di backup `.sql`, `.backup` o `.tar`.
- (Opzionale) Creare un nuovo database vuoto per il ripristino.

### Passaggi:

1. In pgAdmin, clic con il tasto destro sul database di destinazione.
2. Seleziona **"Restore..."** dal menu.
3. Nella finestra di ripristino:
   - **Filename**: seleziona il file di backup precedentemente salvato.
   - **Format**: scegli lo stesso formato usato nel backup (`Plain`, `Custom`, `Tar`).
4. Clicca su **"Restore"** per avviare l'importazione.

---
