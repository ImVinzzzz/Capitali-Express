// ============================================================================
// useGameState.ts
// Custom hook che possiede e governa tutto lo stato della partita:
// - configurazione (giocatori, difficoltà, modalità)
// - turno corrente e timer dei 60 secondi
// - generazione dinamica della domanda corrente e delle 3 opzioni
// - punteggio (+10 / -5)
// - feedback visivo di 500ms dopo ogni risposta
// ============================================================================

import { useCallback, useEffect, useRef, useState } from 'react';
import { getCountriesByDifficulty } from './mockData';
import {
  AnswerOption,
  CountryData,
  CurrentQuestion,
  Difficulty,
  FEEDBACK_DURATION_MS,
  FeedbackState,
  GameConfig,
  GameMode,
  GamePhase,
  Player,
  SCORE_CORRECT,
  SCORE_WRONG,
  TURN_DURATION_SECONDS,
} from './types';

/** Fisher–Yates shuffle, non muta l'array originale. */
function shuffle<T>(items: T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/** Compone il testo della domanda in base alla modalità selezionata. */
function buildPrompt(country: CountryData, mode: GameMode): string {
  return mode === 'capital'
    ? `Qual è la capitale di ${country.country}?`
    : `Quale paese ha come capitale ${country.capital}?`;
}

/**
 * Genera una nuova domanda pescando dal pool del livello di difficoltà
 * indicato. La risposta corretta è il paese "target" passato in input;
 * i 2 distrattori sono scelti a caso fra gli altri paesi dello stesso
 * livello, per garantire un livello di difficoltà coerente.
 */
function buildQuestion(
  target: CountryData,
  pool: CountryData[],
  mode: GameMode,
): CurrentQuestion {
  const correctText = mode === 'capital' ? target.capital : target.country;

  const distractorPool = pool.filter((c) => c.id !== target.id);
  const distractors = shuffle(distractorPool).slice(0, 2);

  const options: AnswerOption[] = shuffle([
    { id: `${target.id}-correct`, text: correctText, isCorrect: true },
    ...distractors.map((d, idx) => ({
      id: `${d.id}-wrong-${idx}`,
      text: mode === 'capital' ? d.capital : d.country,
      isCorrect: false,
    })),
  ]);

  return { country: target, options, prompt: buildPrompt(target, mode) };
}

export interface UseGameStateResult {
  phase: GamePhase;
  players: Player[];
  currentPlayerIndex: number;
  currentPlayer: Player | null;
  nextPlayer: Player | null;
  currentQuestion: CurrentQuestion | null;
  timeLeft: number;
  feedback: FeedbackState;
  difficulty: Difficulty | null;
  mode: GameMode | null;
  /** Avvia una nuova partita con la configurazione scelta nel setup. */
  startGame: (config: GameConfig) => void;
  /** Gestisce il click su una delle 3 opzioni di risposta. */
  selectAnswer: (optionId: string) => void;
  /** Fa partire il turno del prossimo giocatore dalla schermata di transizione. */
  beginNextTurn: () => void;
  /** Riporta l'app alla schermata di setup per una nuova partita. */
  resetGame: () => void;
}

export function useGameState(): UseGameStateResult {
  const [phase, setPhase] = useState<GamePhase>('setup');
  const [players, setPlayers] = useState<Player[]>([]);
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [mode, setMode] = useState<GameMode | null>(null);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState<CurrentQuestion | null>(null);
  const [timeLeft, setTimeLeft] = useState(TURN_DURATION_SECONDS);
  const [feedback, setFeedback] = useState<FeedbackState>({
    status: 'idle',
    selectedOptionId: null,
  });

  // Coda mescolata di paesi ancora da proporre per il livello scelto.
  // Viene ricostruita/ricaricata ogni volta che si esaurisce, così da
  // attraversare l'intero pool prima di ripetere una capitale.
  const queueRef = useRef<CountryData[]>([]);
  const poolRef = useRef<CountryData[]>([]);
  const feedbackTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const timerAudioRef = useRef<HTMLAudioElement | null>(null);

  // Specchio "live" di timeLeft/phase, letto dentro al setTimeout del
  // feedback (500ms) per evitare di agire su un valore ormai stantio nel
  // raro caso in cui il turno termini proprio durante il feedback.
  const timeLeftRef = useRef(timeLeft);
  const phaseRef = useRef(phase);
  useEffect(() => {
    timeLeftRef.current = timeLeft;
  }, [timeLeft]);
  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  const clearFeedbackTimeout = useCallback(() => {
    if (feedbackTimeoutRef.current !== null) {
      clearTimeout(feedbackTimeoutRef.current);
      feedbackTimeoutRef.current = null;
    }
  }, []);

  // Estrae il prossimo paese dalla coda, ricostruendola quando si esaurisce.
  const drawNextCountry = useCallback((): CountryData => {
    if (queueRef.current.length === 0) {
      queueRef.current = shuffle(poolRef.current);
    }
    // L'asserzione è sicura: poolRef contiene sempre almeno una voce
    // per ogni difficoltà definita in mockData.ts.
    return queueRef.current.shift() as CountryData;
  }, []);

  const generateNextQuestion = useCallback(
    (currentMode: GameMode) => {
      const target = drawNextCountry();
      setCurrentQuestion(buildQuestion(target, poolRef.current, currentMode));
    },
    [drawNextCountry],
  );

  const startGame = useCallback(
    (config: GameConfig) => {
      clearFeedbackTimeout();
      poolRef.current = getCountriesByDifficulty(config.difficulty);
      queueRef.current = shuffle(poolRef.current);

      setPlayers(config.players.map((p) => ({ ...p, score: 0, hasPlayed: false })));
      setDifficulty(config.difficulty);
      setMode(config.mode);
      setCurrentPlayerIndex(0);
      setFeedback({ status: 'idle', selectedOptionId: null });
      setTimeLeft(TURN_DURATION_SECONDS);
      generateNextQuestion(config.mode);

      const urlTimer = import.meta.env.BASE_URL + "sounds/timer.mp3";
      console.log("startGame: creazione/avvio di timerAudio con: " + urlTimer);
      if (!timerAudioRef.current) {
        timerAudioRef.current = new Audio(urlTimer);
      }
      timerAudioRef.current.currentTime = 0;
      timerAudioRef.current.play()
        .then(() => console.log("startGame: riproduzione timerAudio avviata con successo"))
        .catch((e) => console.log("startGame: Errore riproduzione timerAudio: " + e.message, e));

      setPhase('playing');
    },
    [clearFeedbackTimeout, generateNextQuestion],
  );

  // Chiude il turno del giocatore corrente quando il tempo finisce.
  const endTurn = useCallback(() => {
    clearFeedbackTimeout();
    setPlayers((prev) =>
      prev.map((p, idx) => (idx === currentPlayerIndex ? { ...p, hasPlayed: true } : p)),
    );
    setFeedback({ status: 'idle', selectedOptionId: null });

    console.log("endTurn: arresto di timerAudio");
    if (timerAudioRef.current) {
      timerAudioRef.current.pause();
      timerAudioRef.current.currentTime = 0;
    }

    const isLastPlayer = currentPlayerIndex >= players.length - 1;
    if (isLastPlayer) {
      setPhase('results');
    } else {
      setCurrentPlayerIndex((idx) => idx + 1);
      setPhase('turn-transition');
    }
  }, [clearFeedbackTimeout, currentPlayerIndex, players.length]);

  // Countdown del turno: un tick al secondo, attivo solo durante 'playing'.
  useEffect(() => {
    if (phase !== 'playing') return;

    if (timeLeft <= 0) {
      endTurn();
      return;
    }

    const id = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(id);
  }, [phase, timeLeft, endTurn]);

  // Pulizia di eventuali timeout pendenti allo smontaggio del componente.
  useEffect(() => clearFeedbackTimeout, [clearFeedbackTimeout]);

  // Clean-up dell'audio allo smontaggio del componente
  useEffect(() => {
    return () => {
      if (timerAudioRef.current) {
        timerAudioRef.current.pause();
      }
    };
  }, []);

  const selectAnswer = useCallback(
    (optionId: string) => {
      // Ignora i click se siamo già in fase di feedback, se il tempo è
      // scaduto o se non c'è una domanda attiva.
      if (feedback.status !== 'idle' || timeLeft <= 0 || !currentQuestion || !mode) return;

      const chosen = currentQuestion.options.find((o) => o.id === optionId);
      if (!chosen) return;

      const isCorrect = chosen.isCorrect;
      setFeedback({ status: isCorrect ? 'correct' : 'incorrect', selectedOptionId: optionId });

      setPlayers((prev) =>
        prev.map((p, idx) =>
          idx === currentPlayerIndex
            ? { ...p, score: p.score + (isCorrect ? SCORE_CORRECT : SCORE_WRONG) }
            : p,
        ),
      );

      clearFeedbackTimeout();
      feedbackTimeoutRef.current = setTimeout(() => {
        setFeedback({ status: 'idle', selectedOptionId: null });
        // Se il turno è già terminato durante i 500ms di feedback (caso
        // limite quando si risponde a ridosso dello scadere del tempo),
        // non generiamo una nuova domanda: il turno è già passato oltre.
        if (phaseRef.current === 'playing' && timeLeftRef.current > 0) {
          generateNextQuestion(mode);
        }
      }, FEEDBACK_DURATION_MS);
    },
    [
      feedback.status,
      timeLeft,
      currentQuestion,
      mode,
      currentPlayerIndex,
      clearFeedbackTimeout,
      generateNextQuestion,
    ],
  );

  const beginNextTurn = useCallback(() => {
    if (!mode) return;
    setFeedback({ status: 'idle', selectedOptionId: null });
    setTimeLeft(TURN_DURATION_SECONDS);
    generateNextQuestion(mode);

    const urlTimer = import.meta.env.BASE_URL + "sounds/timer.mp3";
    console.log("beginNextTurn: creazione/avvio di timerAudio con: " + urlTimer);
    if (!timerAudioRef.current) {
      timerAudioRef.current = new Audio(urlTimer);
    }
    timerAudioRef.current.currentTime = 0;
    timerAudioRef.current.play()
      .then(() => console.log("beginNextTurn: riproduzione timerAudio avviata con successo"))
      .catch((e) => console.log("beginNextTurn: Errore riproduzione timerAudio: " + e.message, e));

    setPhase('playing');
  }, [mode, generateNextQuestion]);

  const resetGame = useCallback(() => {
    clearFeedbackTimeout();
    setPhase('setup');
    setPlayers([]);
    setDifficulty(null);
    setMode(null);
    setCurrentPlayerIndex(0);
    setCurrentQuestion(null);
    setTimeLeft(TURN_DURATION_SECONDS);
    setFeedback({ status: 'idle', selectedOptionId: null });
    queueRef.current = [];
    poolRef.current = [];

    console.log("resetGame: arresto di timerAudio");
    if (timerAudioRef.current) {
      timerAudioRef.current.pause();
      timerAudioRef.current.currentTime = 0;
    }
  }, [clearFeedbackTimeout]);

  const currentPlayer = players[currentPlayerIndex] ?? null;
  const nextPlayer = phase === 'turn-transition' ? players[currentPlayerIndex] ?? null : null;

  return {
    phase,
    players,
    currentPlayerIndex,
    currentPlayer,
    nextPlayer,
    currentQuestion,
    timeLeft,
    feedback,
    difficulty,
    mode,
    startGame,
    selectAnswer,
    beginNextTurn,
    resetGame,
  };
}
