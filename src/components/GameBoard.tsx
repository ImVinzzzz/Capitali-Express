// ============================================================================
// components/GameBoard.tsx
// Schermata di gioco per il turno del giocatore corrente: domanda, 3 opzioni
// con feedback verde/rosso a 500ms, barra del timer dei 60 secondi.
// ============================================================================

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faClock, faGlobe, faXmark } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { AnswerOption, CurrentQuestion, FeedbackState, GameMode, Player, TURN_DURATION_SECONDS } from "../types";

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

const OPTION_LABELS = ["A", "B", "C"];

/** Determina le classi del pulsante in base allo stato del feedback. */
function getOptionClasses(option: AnswerOption, feedback: FeedbackState): string {
  const base = "relative w-full text-left border px-4 py-3 sm:py-4 transition-all duration-150 flex items-center justify-between gap-3 font-mono font-bold uppercase rounded";

  if (feedback.status === "idle") {
    return base + " border-[#1e293b] bg-[#090b10] hover:border-[#ffe600] text-[#f3eee2] hover:bg-[#0f131c] active:scale-[0.99]";
  }

  const isSelected = option.id === feedback.selectedOptionId;

  if (option.isCorrect) {
    // La risposta corretta è sempre evidenziata in verde durante il feedback,
    // sia che sia stata scelta sia che serva a mostrare l'errore.
    return base + " border-[#00ff66] bg-[#00ff66]/10 text-[#00ff66]";
  }
  if (isSelected && !option.isCorrect) {
    return base + " border-[#ff2d55] bg-[#ff2d55]/10 text-[#ff2d55]";
  }
  return base + " border-[#1e293b]/30 bg-[#050608] text-[#8c9bb5] opacity-40";
}

/**
 * Bandiera reale tramite flagcdn.com (gratuito, nessuna API key).
 * Formato URL: https://flagcdn.com/w160/{codice_iso_minuscolo}.png
 */
function FlagImage({ flagCode }: { flagCode: string }) {
  const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>("loading");
  const isCustom = flagCode.endsWith("-FLAG");
  const src = isCustom
    ? "/assets/" + flagCode + ".svg"
    : "https://flagcdn.com/w160/" + flagCode.toLowerCase() + ".png";
  const src2x = isCustom
    ? src
    : "https://flagcdn.com/w320/" + flagCode.toLowerCase() + ".png";

  return (
    <div className="relative mx-auto w-36 sm:w-44 border-2 border-[#1e293b] bg-[#050608] rounded" style={{ aspectRatio: "3/2" }}>
      {/* Shimmer visibile finché l'immagine non è pronta */}
      {status === "loading" && (
        <div className="absolute inset-0 bg-[#1e293b] animate-pulse" />
      )}

      {/* Fallback su errore di rete / codice non valido */}
      {status === "error" && (
        <div className="absolute inset-0 bg-[#050608] flex flex-col items-center justify-center gap-1 text-[#8c9bb5]">
          <FontAwesomeIcon icon={faGlobe} className="text-[#ffe600] text-lg" />
          <span className="font-mono font-black text-lg tracking-widest text-[#f3eee2]">{flagCode}</span>
        </div>
      )}

      <img
        src={src}
        srcSet={src + " 1x, " + src2x + " 2x"}
        alt={"Bandiera " + flagCode}
        loading="eager"
        decoding="async"
        onLoad={() => setStatus("loaded")}
        onError={() => setStatus("error")}
        className={"w-full h-full object-cover transition-opacity duration-300 " + (
          status === "loaded" ? "opacity-100" : "opacity-0"
        )}
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
    <div className="mx-auto w-36 sm:w-44 flex flex-col items-center justify-center gap-1 border-2 border-dashed border-[#3a4b66] bg-[#050608] text-[#8c9bb5] rounded" style={{ aspectRatio: "3/2" }}>
      <span className="text-3xl font-black text-[#3a4b66] select-none">?</span>
      <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.2em] text-[#ffe600]">ROTTA COPERTA</span>
    </div>
  );
}

/**
 * Carica l'immagine dal percorso locale /assets/{countryId}.jpg.
 * Se l'immagine non è disponibile o fallisce il caricamento, mostra il placeholder MysteryDestination.
 */
function CountryImage({ countryId }: { countryId: string }) {
  const [status, setStatus] = useState<"loading" | "loaded" | "error">("loading");
  const src = "/assets/" + countryId.toLowerCase() + ".jpg";

  if (status === "error") {
    return <MysteryDestination />;
  }

  return (
    <div className="relative mx-auto w-36 sm:w-44 border-2 border-[#1e293b] bg-[#050608] rounded" style={{ aspectRatio: "3/2" }}>
      {status === "loading" && (
        <div className="absolute inset-0 bg-[#1e293b] animate-pulse" />
      )}
      <img
        src={src}
        alt={"Paese " + countryId}
        loading="eager"
        decoding="async"
        onLoad={() => setStatus("loaded")}
        onError={() => setStatus("error")}
        className={"w-full h-full object-cover transition-opacity duration-300 " + (
          status === "loaded" ? "opacity-100" : "opacity-0"
        )}
      />
    </div>
  );
}

function FlagDisplay({ question, mode }: { question: CurrentQuestion; mode: GameMode }) {
  if (mode === "country") {
    return <CountryImage key={question.country.id} countryId={question.country.id} />;
  }
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
  useEffect(() => {
    const audio = new Audio(import.meta.env.BASE_URL + "sounds/timer.mp3");
    audio.play().catch((e) => console.log("Errore riproduzione timer.mp3:", e));
    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, []);

  const progress = Math.max(0, Math.min(100, (timeLeft / TURN_DURATION_SECONDS) * 100));
  const isUrgent = timeLeft <= 10;
  const barColor = isUrgent ? "#ff2d55" : timeLeft <= 20 ? "#ffe600" : "#00d8ff";

  return (
    <div className="min-h-screen bg-[#030305] text-[#f3eee2] flex flex-col font-mono">
      {/* Top bar: informazioni sul gate e passeggero */}
      <header className="border-b-4 border-[#1e293b] bg-[#090b10] px-4 sm:px-6 py-3.5 flex items-center justify-between shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
        <div>
          <p className="text-[10px] uppercase tracking-[0.25em] text-[#00d8ff] font-bold">
            GATE / PORTA {" " + String(playerNumber).padStart(2, "0") + " / " + String(totalPlayers).padStart(2, "0")}
          </p>
          <h2 className="text-base sm:text-xl font-bold uppercase truncate max-w-[50vw] text-[#ffe600]">
            PASSEGGERO: {player.name}
          </h2>
        </div>
        <div className="text-right">
          <p className="text-[10px] uppercase tracking-[0.25em] text-[#00d8ff] font-bold">MIGLIA / SCORE</p>
          <span
            key={player.score}
            className="block font-black text-xl sm:text-3xl text-[#ffe600] tabular-nums motion-safe:animate-[flap-pop_0.35s_ease-out]"
          >
            {String(player.score).padStart(4, "0")}
          </span>
        </div>
      </header>

      {/* Corpo principale */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-xl border-2 border-[#1e293b] bg-[#090b10] rounded shadow-[0_10px_30px_rgba(0,0,0,0.8)] overflow-hidden">
          {/* Header del tabellone info rotte */}
          <div className="bg-[#1e293b] px-4 py-2 text-[10px] uppercase tracking-[0.2em] text-[#00d8ff] font-bold flex justify-between">
            <span>INFORMAZIONI DI VOLO</span>
            <span>DIFFICOLTÀ: {question.country.difficulty.toUpperCase()}</span>
          </div>

          <div className="p-4 sm:p-6 text-center space-y-4">
            <FlagDisplay question={question} mode={mode} />

            <div className="border-t border-[#1e293b] pt-4">
              <p className="text-base sm:text-xl font-bold uppercase tracking-tight text-[#ffe600] leading-snug">
                {question.prompt}
              </p>
            </div>

            {/* Tabella opzioni di volo */}
            <div className="mt-4 space-y-2 text-left">
              <div className="hidden sm:flex border-b border-[#1e293b] pb-1 text-[9px] uppercase tracking-widest text-[#8c9bb5] font-bold px-3">
                <span className="w-16">OPZIONE</span>
                <span className="flex-1">ROTTA / DESTINAZIONE</span>
                <span className="w-24 text-right">STATO</span>
              </div>

              {question.options.map((option, idx) => {
                const showIcon = feedback.status !== "idle";
                const isSelected = option.id === feedback.selectedOptionId;

                // Stato dinamico della riga del tabellone
                let statusText = "IN ATTESA";
                if (showIcon) {
                  if (option.isCorrect) {
                    statusText = "CONFERMATO";
                  } else if (isSelected) {
                    statusText = "CANCELLATO";
                  } else {
                    statusText = "STANDBY";
                  }
                }

                return (
                  <button
                    key={option.id}
                    type="button"
                    disabled={feedback.status !== "idle"}
                    onClick={() => onSelect(option.id)}
                    className={getOptionClasses(option, feedback)}
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <span className="text-[#ffe600] font-bold w-6 shrink-0">
                        {OPTION_LABELS[idx]}
                      </span>
                      <span className="truncate text-xs sm:text-sm uppercase tracking-wide">
                        {option.text}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] sm:text-xs uppercase tracking-wider font-bold">
                        {statusText}
                      </span>
                      {showIcon && option.isCorrect && (
                        <FontAwesomeIcon icon={faCheck} className="text-[#00ff66]" />
                      )}
                      {showIcon && isSelected && !option.isCorrect && (
                        <FontAwesomeIcon icon={faXmark} className="text-[#ff2d55]" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </main>

      {/* Footer barra d'imbarco (timer) */}
      <footer className="border-t border-[#1e293b] bg-[#090b10] px-4 sm:px-6 py-4 shadow-[0_-4px_20px_rgba(0,0,0,0.5)]">
        <div className="max-w-xl mx-auto">
          <div className="flex items-center justify-between mb-1">
            <span className="flex items-center gap-1.5 text-[10px] sm:text-xs uppercase tracking-[0.2em] text-[#00d8ff] font-bold">
              <FontAwesomeIcon icon={faClock} />
              BOARDING TIME LEFT / TEMPO RIMASTO
            </span>
            <span
              className={"font-black text-sm sm:text-base tabular-nums " + (
                isUrgent ? "text-[#ff2d55] animate-pulse" : "text-[#ffe600]"
              )}
            >
              {timeLeft}S
            </span>
          </div>
          <div className="h-3 rounded border border-[#1e293b] bg-[#050608] overflow-hidden p-0.5">
            <div
              className="h-full rounded transition-[width] duration-1000 ease-linear"
              style={{ width: progress + "%", backgroundColor: barColor }}
            />
          </div>
        </div>
      </footer>
    </div>
  );
}
