// ============================================================================
// components/Leaderboard.tsx
// Schermata finale: podio "Arrivi" con il/i primo/i classificato/i in
// evidenza (gestendo correttamente gli ex-equo) e classifica completa sotto.
// ============================================================================

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRotateLeft, faMedal, faTrophy } from '@fortawesome/free-solid-svg-icons';
import { Player } from '../types';

interface LeaderboardProps {
  players: Player[];
  onRestart: () => void;
}

interface RankedPlayer extends Player {
  rank: number;
}

/** Assegna un rank "1224": i pari merito condividono la stessa posizione. */
function rankPlayers(players: Player[]): RankedPlayer[] {
  const sorted = [...players].sort((a, b) => b.score - a.score);
  let lastScore: number | null = null;
  let lastRank = 0;

  return sorted.map((player, idx) => {
    const rank = player.score === lastScore ? lastRank : idx + 1;
    lastScore = player.score;
    lastRank = rank;
    return { ...player, rank };
  });
}

export default function Leaderboard({ players, onRestart }: LeaderboardProps) {
  const ranked = rankPlayers(players);
  const winners = ranked.filter((p) => p.rank === 1);
  const others = ranked.filter((p) => p.rank !== 1);
  const isTie = winners.length > 1;

  return (
    <div className="min-h-screen bg-[#0B1220] text-[#F3EEE2] flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-xl">
        <div className="text-center mb-6">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-[#F4A93E] mb-2">Tabellone arrivi</p>
          <h1 className="font-mono font-black text-2xl sm:text-4xl uppercase tracking-tight">
            {isTie ? 'Pari merito in vetta!' : 'Fine corsa'}
          </h1>
        </div>

        {/* Primo/i classificato/i */}
        <div
          className={`grid gap-3 mb-4 ${
            winners.length > 1 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'
          }`}
        >
          {winners.map((player) => (
            <div
              key={player.id}
              className="relative rounded-2xl border-2 border-[#E8B84B] bg-gradient-to-b from-[#E8B84B]/15 to-transparent p-5 sm:p-6 text-center overflow-hidden"
            >
              <FontAwesomeIcon icon={faTrophy} className="text-[#E8B84B] text-3xl sm:text-4xl mb-2" />
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#E8B84B] mb-1">
                {isTie ? '1\u00b0 posto \u2014 ex aequo' : '1\u00b0 posto'}
              </p>
              <h2 className="text-xl sm:text-2xl font-bold truncate">{player.name}</h2>
              <p className="font-mono font-black text-2xl sm:text-3xl text-[#E8B84B] mt-1 tabular-nums">
                {player.score} pt
              </p>
            </div>
          ))}
        </div>

        {/* Resto della classifica */}
        {others.length > 0 && (
          <div className="rounded-2xl border border-[#26344C] bg-[#101A2C] divide-y divide-[#26344C] overflow-hidden">
            {others.map((player) => (
              <div key={player.id} className="flex items-center justify-between px-4 sm:px-5 py-3 sm:py-3.5">
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-[#8C9BB5] w-7 text-center tabular-nums">
                    {player.rank}
                    {player.rank === 2 || player.rank === 3 ? (
                      <FontAwesomeIcon icon={faMedal} className="ml-1 text-[#5B6B85] text-xs" />
                    ) : null}
                  </span>
                  <span className="font-medium text-sm sm:text-base">{player.name}</span>
                </div>
                <span className="font-mono font-bold tabular-nums text-sm sm:text-base">{player.score} pt</span>
              </div>
            ))}
          </div>
        )}

        <button
          type="button"
          onClick={onRestart}
          className="mt-6 w-full rounded-lg border border-[#3A4B66] hover:border-[#F4A93E] text-[#F3EEE2] hover:text-[#F4A93E] font-mono uppercase tracking-[0.2em] text-sm py-3 flex items-center justify-center gap-2 transition-colors"
        >
          <FontAwesomeIcon icon={faArrowRotateLeft} />
          Nuova partita
        </button>
      </div>
    </div>
  );
}
