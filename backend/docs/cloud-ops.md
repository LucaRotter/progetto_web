# Configurazione e Deploy

## Esecuzione locale con Docker

Il progetto è stato sviluppato per l’esecuzione in locale utilizzando **Docker**, garantendo portabilità e coerenza dell’ambiente tra diversi sistemi operativi.

## Requisiti

Per clonare ed eseguire il progetto in locale, assicurati di avere installato:

### 1. Git
Per scaricare il repository:
- Sito ufficiale: [https://git-scm.com/](https://git-scm.com/)
- Verifica: `git --version`

### 2. Docker
Per eseguire l’applicazione in un container isolato:
- Sito ufficiale: [https://www.docker.com/get-started](https://www.docker.com/get-started)
- Verifica: `docker --version`

### 3. (Facoltativo) Docker Compose
Per orchestrare più servizi (es. frontend + backend):
- Incluso in Docker Desktop (nella maggior parte dei casi)
- Verifica: `docker compose version`

---

## 🛠️ Clonazione e Avvio del Progetto

Esegui questi comandi nel terminale:

```bash
git clone https://github.com/LucaRotter/progetto_web.git
cd progetto_web
docker-compose up
