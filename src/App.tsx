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
    <div className="min-h-screen bg-[#0B1220] text-[#F3EEE2] flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-sm text-center rounded-2xl border border-[#26344C] bg-[#101A2C] p-8 sm:p-10">
        <FontAwesomeIcon icon={faPlaneArrival} className="text-[#F4A93E] text-3xl mb-4" />
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-[#8C9BB5] mb-2">
          Prossimo imbarco
        </p>
        <h2 className="text-2xl sm:text-3xl font-bold mb-6">Tocca a {playerName}</h2>
        <button
          type="button"
          onClick={onContinue}
          className="w-full rounded-lg bg-[#F4A93E] text-[#0B1220] font-mono font-black uppercase tracking-[0.2em] text-sm py-3.5 flex items-center justify-center gap-2 transition-transform hover:scale-[1.01] active:scale-[0.99] motion-reduce:transition-none"
        >
          Inizia il turno
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
