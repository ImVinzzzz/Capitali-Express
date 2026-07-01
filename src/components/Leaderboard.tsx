// ============================================================================
// components/Leaderboard.tsx
// Schermata finale: podio "Arrivi" strutturato come tabella dei voli
// atterrati (Arrivals) del tabellone aeroportuale.
// ============================================================================

import { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlane } from "@fortawesome/free-solid-svg-icons";
import { Player } from "../types";

interface LeaderboardProps {
  players: Player[];
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

export default function Leaderboard({ players }: LeaderboardProps) {
  useEffect(() => {
    const urlWinner = import.meta.env.BASE_URL + "assets/sounds/winner.mp3";
    console.log("Leaderboard: creazione/avvio di winnerAudio con: " + urlWinner);
    const audio = new Audio(urlWinner);
    audio.play()
      .then(() => console.log("Leaderboard: riproduzione winnerAudio avviata con successo"))
      .catch((e) => console.log("Leaderboard: Errore riproduzione winnerAudio: " + e.message, e));

    return () => {
      console.log("Leaderboard: arresto di winnerAudio");
      audio.pause();
      audio.currentTime = 0;
    };
  }, []);

  const ranked = rankPlayers(players);
  const winners = ranked.filter((p) => p.rank === 1);
  const isTie = winners.length > 1;

  return (
    <div className="min-h-screen bg-[#030305] text-[#f3eee2] flex items-center justify-center p-4 sm:p-6 font-mono">
      <div className="w-full max-w-xl border-4 border-[#1e293b] bg-[#090b10] rounded-lg shadow-[0_0_30px_rgba(0,0,0,0.8)] overflow-hidden">
        {/* Header Giallo Arrivals */}
        <div className="bg-[#ffe600] text-black py-3 px-4 flex items-center justify-between border-b-4 border-[#1e293b]">
          <h1 className="text-xl sm:text-3xl font-black uppercase tracking-[0.2em] flex items-center gap-3">
            <FontAwesomeIcon icon={faPlane} className="rotate-180 text-black" />
            ARRIVALS / ARRIVI
          </h1>
          <span className="text-sm sm:text-base font-bold bg-black text-[#ffe600] px-2 py-0.5 rounded">
            FINE CORSA
          </span>
        </div>

        <div className="p-4 sm:p-6 space-y-6">
          {/* Tabellone Arrivi dei Giocatori */}
          <section className="border border-[#1e293b] rounded bg-[#050608] p-4">
            <div className="border-b border-[#1e293b] pb-3 mb-4">
              <h2 className="text-xs sm:text-sm uppercase tracking-[0.2em] text-[#00d8ff] font-bold text-center">
                {isTie ? "EX-AEQUO IN VETTA!" : "STATO ATTERRAGGIO PASSEGGERI"}
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-[#1e293b] text-[#8c9bb5] text-[10px] uppercase tracking-widest">
                    <th className="py-2 px-2">POS</th>
                    <th className="py-2 px-2">VOLO</th>
                    <th className="py-2 px-2">PASSEGGERO</th>
                    <th className="py-2 px-2 text-right">PUNTI</th>
                    <th className="py-2 px-2 text-right">STATO</th>
                  </tr>
                </thead>
                <tbody>
                  {ranked.map((player, idx) => {
                    const isWinner = player.rank === 1;
                    let remark = "ATTERRATO";
                    if (player.rank === 1) {
                      remark = "1° CLASSIFICATO";
                    } else if (player.rank === 2) {
                      remark = "2° CLASSIFICATO";
                    } else if (player.rank === 3) {
                      remark = "3° CLASSIFICATO";
                    }

                    return (
                      <tr key={player.id} className="border-b border-[#1e293b]/50 hover:bg-[#090b10] transition-colors">
                        <td className={"py-3 px-2 font-bold " + (isWinner ? "text-[#ffe600]" : "text-[#8c9bb5]")}>
                          {String(player.rank).padStart(2, "0")}
                        </td>
                        <td className="py-3 px-2 text-[#00d8ff]">
                          CX{" " + (101 + idx)}
                        </td>
                        <td className={"py-3 px-2 uppercase font-bold " + (isWinner ? "text-[#ffe600]" : "text-[#f3eee2]")}>
                          {player.name}
                        </td>
                        <td className="py-3 px-2 text-right text-[#ffe600] font-bold tabular-nums">
                          {player.score} pt
                        </td>
                        <td className="py-3 px-2 text-right">
                          <span className={"font-bold text-[10px] sm:text-xs tracking-wider " + (isWinner ? "text-[#00ff66]" : "text-[#8c9bb5]")}>
                            {remark}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>

          {/* Pulsante Rigioca - Commentato come richiesto per favorire il riavvio manuale
          {showButton && (
            <div>
              <button
                type="button"
                onClick={onRestart}
                className="w-full rounded bg-transparent border-2 border-[#ffe600] hover:bg-[#ffe600]/10 text-[#ffe600] font-black uppercase tracking-[0.2em] text-sm py-3.5 flex items-center justify-center gap-2 transition-colors shadow-[0_0_15px_rgba(255,230,0,0.1)]"
              >
                <FontAwesomeIcon icon={faArrowRotateLeft} />
                NUOVA TRATTA / RE-FLIGHT
              </button>
            </div>
          )}
          */}
        </div>
      </div>
    </div>
  );
}
