// ============================================================================
// components/GameBoard.tsx
// Schermata di gioco per il turno del giocatore corrente: domanda, 3 opzioni
// con feedback verde/rosso a 500ms, barra del timer dei 60 secondi.
// ============================================================================

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faClock, faGlobe, faXmark } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import { AnswerOption, CurrentQuestion, FeedbackState, GameMode, Player, TURN_DURATION_SECONDS } from '../types';

interface GameBoardProps {
  player: Player;
  playerNumber: number;
  totalPlayers: number;
  question: CurrentQuestion;
  mode: GameMode;
  timeLeft: number;
  feedback: FeedbackState;
  onSelect: (optionId: string) => void;
}

const OPTION_LABELS = ['A', 'B', 'C'];

/** Determina le classi del pulsante in base allo stato del feedback. */
function getOptionClasses(option: AnswerOption, feedback: FeedbackState): string {
  const base = 'relative w-full text-left rounded-xl border px-4 py-4 sm:py-5 transition-all duration-150 flex items-center gap-3';

  if (feedback.status === 'idle') {
    return `${base} border-[#26344C] bg-[#101A2C] hover:border-[#F4A93E] hover:bg-[#15233A] active:scale-[0.99]`;
  }

  const isSelected = option.id === feedback.selectedOptionId;

  if (option.isCorrect) {
    // La risposta corretta è sempre evidenziata in verde durante il feedback,
    // sia che sia stata scelta sia che serva a mostrare l'errore.
    return `${base} border-[#36C28D] bg-[#36C28D]/15 text-[#EAFBF4]`;
  }
  if (isSelected && !option.isCorrect) {
    return `${base} border-[#E85C4A] bg-[#E85C4A]/15 text-[#FDEAE7]`;
  }
  return `${base} border-[#26344C] bg-[#101A2C] opacity-40`;
}

/**
 * Bandiera reale tramite flagcdn.com (gratuito, nessuna API key).
 * Formato URL: https://flagcdn.com/w160/{codice_iso_minuscolo}.png
 * Gestisce tre stati:
 *   - caricamento: shimmer animato
 *   - caricata:    immagine a tutto campo con ombra
 *   - errore:      riquadro fallback con icona + codice paese
 *
 * Riceve `key={question.country.id}` dal padre per resettare lo stato
 * interno (loading/error) ad ogni cambio di domanda senza useEffect.
 */
function FlagImage({ flagCode }: { flagCode: string }) {
  const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>('loading');
  const src = `https://flagcdn.com/w160/${flagCode.toLowerCase()}.png`;
  const src2x = `https://flagcdn.com/w320/${flagCode.toLowerCase()}.png`;

  return (
    <div className="relative mx-auto w-40 sm:w-48" style={{ aspectRatio: '3/2' }}>
      {/* Shimmer visibile finché l'immagine non è pronta */}
      {status === 'loading' && (
        <div className="absolute inset-0 rounded-lg bg-[#26344C] animate-pulse" />
      )}

      {/* Fallback su errore di rete / codice non valido */}
      {status === 'error' && (
        <div className="absolute inset-0 rounded-lg border-2 border-dashed border-[#3A4B66] bg-[#0B1220] flex flex-col items-center justify-center gap-1 text-[#8C9BB5]">
          <FontAwesomeIcon icon={faGlobe} className="text-[#F4A93E] text-lg" />
          <span className="font-mono font-black text-lg tracking-widest text-[#F3EEE2]">{flagCode}</span>
        </div>
      )}

      <img
        src={src}
        srcSet={`${src} 1x, ${src2x} 2x`}
        alt={`Bandiera ${flagCode}`}
        loading="eager"
        decoding="async"
        onLoad={() => setStatus('loaded')}
        onError={() => setStatus('error')}
        className={`w-full h-full object-cover rounded-lg shadow-[0_4px_20px_rgba(0,0,0,0.5)] transition-opacity duration-300 ${
          status === 'loaded' ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  );
}

/**
 * In modalità "paese" la bandiera rivelerebbe immediatamente la risposta
 * corretta, quindi mostriamo un riquadro "incognita" con animazione pulsante.
 */
function MysteryDestination() {
  return (
    <div className="mx-auto w-40 sm:w-48 flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-[#3A4B66] bg-[#0B1220] text-[#8C9BB5]" style={{ aspectRatio: '3/2' }}>
      <span className="text-3xl font-black text-[#3A4B66] select-none">?</span>
      <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.2em]">Destinazione ignota</span>
    </div>
  );
}

function FlagDisplay({ question, mode }: { question: CurrentQuestion; mode: GameMode }) {
  if (mode === 'country') {
    return <MysteryDestination />;
  }
  // key=flagCode assicura il remount (e il reset dello stato loading/error)
  // ogni volta che arriva un paese con un codice diverso.
  return <FlagImage key={question.country.flagCode} flagCode={question.country.flagCode} />;
}

export default function GameBoard({
  player,
  playerNumber,
  totalPlayers,
  question,
  mode,
  timeLeft,
  feedback,
  onSelect,
}: GameBoardProps) {
  const progress = Math.max(0, Math.min(100, (timeLeft / TURN_DURATION_SECONDS) * 100));
  const isUrgent = timeLeft <= 10;
  const barColor = isUrgent ? '#E85C4A' : timeLeft <= 20 ? '#F4A93E' : '#36C28D';

  return (
    <div className="min-h-screen bg-[#0B1220] text-[#F3EEE2] flex flex-col">
      {/* Top bar: giocatore + punteggio */}
      <header className="px-4 sm:px-6 pt-5 sm:pt-6 pb-3 flex items-center justify-between">
        <div>
          <p className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.25em] text-[#8C9BB5]">
            Gate {String(playerNumber).padStart(2, '0')} / {String(totalPlayers).padStart(2, '0')}
          </p>
          <h2 className="text-lg sm:text-xl font-bold truncate max-w-[55vw]">{player.name}</h2>
        </div>
        <div className="text-right">
          <p className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.25em] text-[#8C9BB5]">Punti</p>
          <span
            key={player.score}
            className="block font-mono font-black text-2xl sm:text-3xl text-[#F4A93E] tabular-nums motion-safe:animate-[flap-pop_0.35s_ease-out]"
          >
            {player.score}
          </span>
        </div>
      </header>

      {/* Corpo: domanda + opzioni */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 pb-6">
        <div className="w-full max-w-xl">
          <div className="rounded-2xl border border-[#26344C] bg-[#101A2C] p-5 sm:p-8 text-center">
            <FlagDisplay question={question} mode={mode} />

            <p className="mt-5 text-xl sm:text-2xl font-semibold leading-snug">{question.prompt}</p>

            <div className="mt-6 grid grid-cols-1 gap-3">
              {question.options.map((option, idx) => {
                const showIcon = feedback.status !== 'idle';
                const isSelected = option.id === feedback.selectedOptionId;
                return (
                  <button
                    key={option.id}
                    type="button"
                    disabled={feedback.status !== 'idle'}
                    onClick={() => onSelect(option.id)}
                    className={getOptionClasses(option, feedback)}
                  >
                    <span className="font-mono font-bold text-[#F4A93E] w-6 shrink-0">
                      {OPTION_LABELS[idx]}
                    </span>
                    <span className="flex-1 font-medium text-sm sm:text-base">{option.text}</span>
                    {showIcon && option.isCorrect && (
                      <FontAwesomeIcon icon={faCheck} className="text-[#36C28D]" />
                    )}
                    {showIcon && isSelected && !option.isCorrect && (
                      <FontAwesomeIcon icon={faXmark} className="text-[#E85C4A]" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </main>

      {/* Barra timer in basso */}
      <footer className="px-4 sm:px-6 pb-5 sm:pb-6">
        <div className="max-w-xl mx-auto">
          <div className="flex items-center justify-between mb-1.5">
            <span className="flex items-center gap-1.5 font-mono text-[10px] sm:text-xs uppercase tracking-[0.2em] text-[#8C9BB5]">
              <FontAwesomeIcon icon={faClock} />
              Tempo rimasto
            </span>
            <span
              className={`font-mono font-black text-sm sm:text-base tabular-nums ${
                isUrgent ? 'text-[#E85C4A] motion-safe:animate-[bar-pulse_1s_ease-in-out_infinite]' : 'text-[#F3EEE2]'
              }`}
            >
              {timeLeft}s
            </span>
          </div>
          <div className="h-2.5 sm:h-3 rounded-full bg-[#101A2C] border border-[#26344C] overflow-hidden">
            <div
              className="h-full rounded-full transition-[width] duration-1000 ease-linear"
              style={{ width: `${progress}%`, backgroundColor: barColor }}
            />
          </div>
        </div>
      </footer>
    </div>
  );
}
