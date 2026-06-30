// ============================================================================
// App.tsx
// Punto di ingresso dell'applicazione: coordina le 4 schermate (setup,
// gioco, transizione di turno, classifica finale) in base alla fase
// corrente restituita da useGameState.
// ============================================================================

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faPlaneArrival } from '@fortawesome/free-solid-svg-icons';
import GameSetup from './components/GameSetup';
import GameBoard from './components/GameBoard';
import Leaderboard from './components/Leaderboard';
import { useGameState } from './useGameState';

/**
 * Keyframes condivise dal "segnale visivo" del gioco (l'effetto a scatto
 * stile tabellone split-flap usato su punteggio e timer). Iniettate una
 * sola volta qui in App e richiamate dai componenti figli tramite le
 * classi Tailwind arbitrarie `animate-[flap-pop_...]` / `animate-[bar-pulse_...]`.
 */
const GLOBAL_KEYFRAMES = `
@keyframes flap-pop {
  0% { transform: scale(0.82); opacity: 0.3; }
  60% { transform: scale(1.08); opacity: 1; }
  100% { transform: scale(1); opacity: 1; }
}
@keyframes bar-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
`;

function TurnTransition({
  playerName,
  onContinue,
}: {
  playerName: string;
  onContinue: () => void;
}) {
  return (
    <div className="min-h-screen bg-[#030305] text-[#f3eee2] flex items-center justify-center p-4 sm:p-6 font-mono">
      <div className="w-full max-w-sm text-center border-4 border-[#1e293b] bg-[#090b10] rounded-lg p-6 sm:p-8 shadow-[0_0_30px_rgba(0,0,0,0.8)]">
        <FontAwesomeIcon icon={faPlaneArrival} className="text-[#ffe600] text-3xl mb-4" />
        <p className="text-xs uppercase tracking-[0.25em] text-[#00d8ff] font-bold mb-2">
          BOARDING NOW / PROSSIMO IMBARCO
        </p>
        <h2 className="text-xl sm:text-2xl font-bold mb-6 text-[#ffe600] uppercase">Tocca a {playerName}</h2>
        <button
          type="button"
          onClick={onContinue}
          className="w-full rounded bg-[#ffe600] text-black font-black uppercase tracking-[0.2em] text-sm py-3.5 flex items-center justify-center gap-2 transition-transform hover:scale-[1.01] active:scale-[0.99] shadow-[0_0_15px_rgba(255,230,0,0.2)]"
        >
          INIZIA TURNO / GO ▶
          <FontAwesomeIcon icon={faArrowRight} />
        </button>
      </div>
    </div>
  );
}


export default function App() {
  const {
    phase,
    players,
    currentPlayerIndex,
    currentPlayer,
    nextPlayer,
    currentQuestion,
    timeLeft,
    feedback,
    mode,
    startGame,
    selectAnswer,
    beginNextTurn,
    resetGame,
  } = useGameState();

  return (
    <>
      <style>{GLOBAL_KEYFRAMES}</style>

      {phase === 'setup' && <GameSetup onStart={startGame} />}

      {phase === 'playing' && currentPlayer && currentQuestion && mode && (
        <GameBoard
          player={currentPlayer}
          playerNumber={currentPlayerIndex + 1}
          totalPlayers={players.length}
          question={currentQuestion}
          mode={mode}
          timeLeft={timeLeft}
          feedback={feedback}
          onSelect={selectAnswer}
        />
      )}

      {phase === 'turn-transition' && nextPlayer && (
        <TurnTransition playerName={nextPlayer.name} onContinue={beginNextTurn} />
      )}

      {phase === 'results' && <Leaderboard players={players} onRestart={resetGame} />}
    </>
  );
}
