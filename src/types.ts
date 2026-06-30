// ============================================================================
// types.ts
// Definizioni dei tipi condivisi per "Capitali del Mondo Express".
// ============================================================================

/** Livelli di difficoltà selezionabili in fase di setup. */
export type Difficulty = 'facile' | 'medio' | 'avanzato';

/**
 * Modalità di gioco:
 * - 'capital' -> viene mostrato il PAESE, il giocatore indovina la CAPITALE
 * - 'country' -> viene mostrata la CAPITALE, il giocatore indovina il PAESE
 */
export type GameMode = 'capital' | 'country';

/** Le fasi attraversate dall'applicazione, una per ogni schermata. */
export type GamePhase = 'setup' | 'playing' | 'turn-transition' | 'results';

/** Singola voce del database di paesi/capitali. */
export interface CountryData {
  /** Identificativo univoco e stabile (slug). */
  id: string;
  /** Nome del paese in italiano. */
  country: string;
  /** Nome della capitale in italiano. */
  capital: string;
  /** Livello di difficoltà a cui appartiene la coppia paese/capitale. */
  difficulty: Difficulty;
  /**
   * Codice ISO 3166-1 alpha-2 del paese (es. "IT", "FR").
   * Usato oggi come segnaposto grafico (box con sigla), pronto in futuro
   * per essere sostituito con un'immagine reale o una chiamata a un'API
   * di bandiere (es. flagcdn.com/{flagCode}.svg).
   */
  flagCode: string;
}

/** Un giocatore registrato in fase di setup. */
export interface Player {
  id: string;
  name: string;
  score: number;
  /** true una volta che il giocatore ha esaurito il proprio turno di 60s. */
  hasPlayed: boolean;
}

/** Una delle tre opzioni di risposta mostrate a schermo. */
export interface AnswerOption {
  id: string;
  /** Testo mostrato sul pulsante (capitale o paese, in base alla modalità). */
  text: string;
  isCorrect: boolean;
}

/** La domanda correntemente in gioco, già pronta per il render. */
export interface CurrentQuestion {
  /** Il paese/capitale bersaglio da cui è stata generata la domanda. */
  country: CountryData;
  /** Le 3 opzioni, già mescolate. */
  options: AnswerOption[];
  /** Testo della domanda, già composto in base alla modalità. */
  prompt: string;
}

/** Stato del feedback visivo dei 500ms dopo una risposta. */
export interface FeedbackState {
  status: 'idle' | 'correct' | 'incorrect';
  /** id dell'opzione cliccata dal giocatore (null quando 'idle'). */
  selectedOptionId: string | null;
}

/** Configurazione di partita scelta nella schermata di setup. */
export interface GameConfig {
  players: Player[];
  difficulty: Difficulty;
  mode: GameMode;
}

/** Durata di un turno, in secondi. */
export const TURN_DURATION_SECONDS = 60;

/** Durata del feedback visivo verde/rosso dopo una risposta, in ms. */
export const FEEDBACK_DURATION_MS = 500;

/** Punteggio assegnato per risposta corretta/errata. */
export const SCORE_CORRECT = 10;
export const SCORE_WRONG = -5;
