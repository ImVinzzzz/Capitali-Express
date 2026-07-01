# Capitali del Mondo Express 🚄🌍

**Capitali del Mondo Express** è un gioco web a turni rapido e dinamico. Una serie di domande a risposta multipla sulle capitali di tutto il mondo, dalle più note alle più insidiose. Pensato per partite veloci, con un timer stretto che premia chi ha la mappa in testa.

Il design e l'interfaccia si ispirano ai tabelloni delle partenze e degli arrivi (Split-Flap) delle stazioni ferroviarie e degli aeroporti, regalando un'atmosfera da viaggio in tempo reale.

---

## 🎮 Come si gioca

1. **Configurazione Passeggeri**: Supporta da 1 a 6 giocatori. Inserisci i nomi dei passeggeri pronti all'imbarco.
2. **Scelta della Classe (Difficoltà)**:
   - 🛫 **ECONOMY CLASS** (*Facile*): Le grandi capitali note a tutti... o quasi! Perfetta per riscaldarsi o per sfide accessibili.
   - ⚡ **FIRST CLASS** (*Avanzato*): Capitali impossibili, territori dipendenti e isole remote... solo per veri esperti di geografia!
3. **Selezione della Tratta (Modalità)**:
   - **Riconosci la Capitale**: Ti viene mostrato il Paese e devi indovinare la sua capitale tra 3 opzioni.
   - **Riconosci il Paese**: Ti viene mostrata la Capitale e devi individuare il Paese corrispondente.
4. **Il Viaggio (Turno)**:
   - Ogni passeggero ha a disposizione **60 secondi** a tempo di musica con un timer tensivo per rispondere a quante più domande possibili.
   - Ogni risposta corretta assegna **+10 punti**.
   - Ogni risposta errata penalizza di **-5 punti**.
5. **Classifica Finale (Arrivi)**:
   - Allo scadere dei turni di tutti i giocatori, viene mostrato il tabellone degli arrivi con la proclamazione del vincitore, accompagnata da una musica trionfale. Il pulsante per una nuova partita si sblocca dopo 15 secondi di attesa per permettere di godersi il podio!

---

## 🔊 Effetti Sonori Immersivi

Il gioco include una serie di file audio per arricchire l'esperienza:
- **Annuncio di Imbarco**: All'avvio della schermata di configurazione, all'interazione dell'utente viene riprodotto un segnale acustico seguito dall'annuncio vocale di un pilota.
- **Timer di Bordo**: Durante la fase attiva di gioco per ciascun passeggero, un sottofondo tensivo scandisce i 60 secondi, culminando con un suono di alert allo scadere del tempo.
- **Cerimonia di Atterraggio**: All'arrivo dei passeggeri sulla schermata della classifica finale, una fanfara celebra i punteggi ottenuti.

---

## 🛠️ Stack Tecnologico

- **Core**: React 18 & TypeScript
- **Styling**: TailwindCSS per layout responsive e stile dark mode futuristico ad alto contrasto
- **Icone**: FontAwesome (React FontAwesome)
- **Bandiere**: Integrazione ibrida dinamica tramite l'API di *Flagcdn* per i paesi standard e file locali `.svg` (in `/public/assets`) per i territori non-ISO personalizzati.
- **Build Tool**: Vite
