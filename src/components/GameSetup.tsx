// ============================================================================
// components/GameSetup.tsx
// Schermata iniziale: configurazione giocatori, difficoltà e modalità.
// Tema visivo: tabellone "Partenze" da stazione/aeroporto, coerente con il
// concept "Capitali del Mondo Express".
// ============================================================================

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBolt,
  faEarthAmericas,
  faGaugeHigh,
  faMinus,
  faPlane,
  faPlus,
  faRoute,
  faSeedling,
  faSignsPost,
  faUserGroup,
} from "@fortawesome/free-solid-svg-icons";
import { useMemo, useState } from "react";
import { Difficulty, GameConfig, GameMode, Player } from "../types";

const MIN_PLAYERS = 1;
const MAX_PLAYERS = 6;

const DIFFICULTY_OPTIONS: { value: Difficulty; label: string; hint: string; icon: typeof faSeedling }[] = [
  { value: "facile", label: "Facile / Economy", hint: "Grandi capitali note a tutti", icon: faSeedling },
  { value: "medio", label: "Medio / Business", hint: "Bisogna un po' pensarci", icon: faGaugeHigh },
  { value: "avanzato", label: "Avanzato / First", hint: "Capitali trabocchetto", icon: faBolt },
];

const MODE_OPTIONS: { value: GameMode; label: string; hint: string; icon: typeof faSignsPost }[] = [
  { value: "capital", label: "Riconosci la capitale", hint: "Vedi il paese -> indovini la capitale", icon: faSignsPost },
  { value: "country", label: "Riconosci il paese", hint: "Vedi la capitale -> indovini il paese", icon: faEarthAmericas },
];

interface GameSetupProps {
  onStart: (config: GameConfig) => void;
}

function makeDefaultNames(count: number): string[] {
  return Array.from({ length: count }, (_, i) => "PASSEGGERO " + (i + 1));
}

export default function GameSetup({ onStart }: GameSetupProps) {
  const [playerCount, setPlayerCount] = useState(2);
  const [names, setNames] = useState<string[]>(makeDefaultNames(2));
  const [difficulty, setDifficulty] = useState<Difficulty>("medio");
  const [mode, setMode] = useState<GameMode>("capital");

  const canStart = useMemo(
    () => names.slice(0, playerCount).every((n) => n.trim().length > 0),
    [names, playerCount],
  );

  function updatePlayerCount(next: number) {
    const clamped = Math.min(MAX_PLAYERS, Math.max(MIN_PLAYERS, next));
    setPlayerCount(clamped);
    setNames((prev) => {
      const grown = [...prev];
      while (grown.length < clamped) grown.push("PASSEGGERO " + (grown.length + 1));
      return grown;
    });
  }

  function updateName(index: number, value: string) {
    setNames((prev) => prev.map((n, i) => (i === index ? value : n)));
  }

  function handleSubmit() {
    if (!canStart) return;
    const players: Player[] = names.slice(0, playerCount).map((name, i) => ({
      id: "player-" + i + "-" + Date.now(),
      name: name.trim().toUpperCase(),
      score: 0,
      hasPlayed: false,
    }));
    onStart({ players, difficulty, mode });
  }

  return (
    <div className="min-h-screen bg-[#030305] text-[#f3eee2] flex items-center justify-center p-4 sm:p-6 font-mono">
      <div className="w-full max-w-2xl border-4 border-[#1e293b] bg-[#090b10] rounded-lg shadow-[0_0_30px_rgba(0,0,0,0.8)] overflow-hidden">
        {/* Header Giallo Departures */}
        <div className="bg-[#ffe600] text-black py-3 px-4 flex items-center justify-between border-b-4 border-[#1e293b]">
          <h1 className="text-xl sm:text-3xl font-black uppercase tracking-[0.2em] flex items-center gap-3">
            <FontAwesomeIcon icon={faPlane} className="rotate-45 text-black" />
            DEPARTURES / PARTENZE
          </h1>
          <span className="text-sm sm:text-base font-bold bg-black text-[#ffe600] px-2 py-0.5 rounded">
            BINARIO 60S
          </span>
        </div>

        {/* Tabellone principale */}
        <div className="p-4 sm:p-6 space-y-6">
          {/* Sezione passeggeri in stile tabella voli */}
          <section className="border border-[#1e293b] rounded bg-[#050608] p-4">
            <div className="flex items-center justify-between border-b border-[#1e293b] pb-3 mb-4">
              <h2 className="flex items-center gap-2 text-xs sm:text-sm uppercase tracking-[0.2em] text-[#00d8ff] font-bold">
                <FontAwesomeIcon icon={faUserGroup} />
                MANIFESTO VOLO / PASSEGGERI
              </h2>
              <div className="flex items-center gap-3 bg-[#090b10] border border-[#1e293b] rounded px-2 py-1">
                <span className="text-[10px] text-[#8c9bb5] uppercase tracking-wider">PASSEGGERI:</span>
                <button
                  type="button"
                  onClick={() => updatePlayerCount(playerCount - 1)}
                  disabled={playerCount <= MIN_PLAYERS}
                  aria-label="Riduci numero di giocatori"
                  className="h-6 w-6 border border-[#3a4b66] text-[#f3eee2] flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed hover:border-[#ffe600] hover:text-[#ffe600] transition-colors rounded"
                >
                  <FontAwesomeIcon icon={faMinus} className="text-xs" />
                </button>
                <span className="font-bold w-4 text-center text-[#ffe600] text-sm tabular-nums">{playerCount}</span>
                <button
                  type="button"
                  onClick={() => updatePlayerCount(playerCount + 1)}
                  disabled={playerCount >= MAX_PLAYERS}
                  aria-label="Aumenta numero di giocatori"
                  className="h-6 w-6 border border-[#3a4b66] text-[#f3eee2] flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed hover:border-[#ffe600] hover:text-[#ffe600] transition-colors rounded"
                >
                  <FontAwesomeIcon icon={faPlus} className="text-xs" />
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-[#1e293b] text-[#8c9bb5] text-[10px] uppercase tracking-widest">
                    <th className="py-2 px-2">GATE</th>
                    <th className="py-2 px-2">VOLO</th>
                    <th className="py-2 px-2">PASSEGGERO</th>
                    <th className="py-2 px-2 text-right">STATO</th>
                  </tr>
                </thead>
                <tbody>
                  {names.slice(0, playerCount).map((name, idx) => {
                    const isReady = name.trim().length > 0;
                    return (
                      <tr key={idx} className="border-b border-[#1e293b]/50 hover:bg-[#090b10] transition-colors">
                        <td className="py-3 px-2 text-[#ffe600] font-bold">
                          {String(idx + 1).padStart(2, "0")}
                        </td>
                        <td className="py-3 px-2 text-[#00d8ff]">
                          CX{" " + (101 + idx)}
                        </td>
                        <td className="py-2 px-2">
                          <input
                            type="text"
                            value={name}
                            maxLength={20}
                            onChange={(e) => updateName(idx, e.target.value)}
                            placeholder={"INSERISCI COGNOME / NOME"}
                            className="bg-transparent border-b border-dashed border-[#3a4b66] focus:border-[#ffe600] outline-none text-[#ffe600] uppercase font-bold w-full max-w-[15rem] py-0.5 transition-colors"
                          />
                        </td>
                        <td className="py-3 px-2 text-right">
                          <span className={isReady ? "text-[#00ff66] font-bold" : "text-[#ff2d55] font-bold animate-pulse"}>
                            {isReady ? "IMBARCO" : "COMPILARE"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>

          {/* Sezione classe di viaggio / difficoltà */}
          <section className="border border-[#1e293b] rounded bg-[#050608] p-4">
            <h2 className="flex items-center gap-2 text-xs sm:text-sm uppercase tracking-[0.2em] text-[#00d8ff] font-bold border-b border-[#1e293b] pb-2 mb-3">
              <FontAwesomeIcon icon={faGaugeHigh} />
              CLASSE DI VIAGGIO / DIFFICOLTÀ
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {DIFFICULTY_OPTIONS.map((opt) => {
                const active = difficulty === opt.value;
                return (
                  <button
                    type="button"
                    key={opt.value}
                    onClick={() => setDifficulty(opt.value)}
                    aria-pressed={active}
                    className={"text-left rounded border p-3 transition-all " + (
                      active
                        ? "border-[#ffe600] bg-[#ffe600]/10 text-[#ffe600] shadow-[0_0_10px_rgba(255,230,0,0.15)]"
                        : "border-[#1e293b] hover:border-[#8c9bb5] text-[#8c9bb5]"
                    )}
                  >
                    <span className="flex items-center gap-2 font-bold text-sm uppercase">
                      <FontAwesomeIcon icon={opt.icon} className={active ? "text-[#ffe600]" : "text-[#8c9bb5]"} />
                      {opt.label}
                    </span>
                    <span className="block mt-1 text-[11px] opacity-80">{opt.hint}</span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Sezione tratta di gioco / modalità */}
          <section className="border border-[#1e293b] rounded bg-[#050608] p-4">
            <h2 className="flex items-center gap-2 text-xs sm:text-sm uppercase tracking-[0.2em] text-[#00d8ff] font-bold border-b border-[#1e293b] pb-2 mb-3">
              <FontAwesomeIcon icon={faRoute} />
              ROTA / TRATTA DI GIOCO
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {MODE_OPTIONS.map((opt) => {
                const active = mode === opt.value;
                return (
                  <button
                    type="button"
                    key={opt.value}
                    onClick={() => setMode(opt.value)}
                    aria-pressed={active}
                    className={"text-left rounded border p-3 transition-all " + (
                      active
                        ? "border-[#ffe600] bg-[#ffe600]/10 text-[#ffe600] shadow-[0_0_10px_rgba(255,230,0,0.15)]"
                        : "border-[#1e293b] hover:border-[#8c9bb5] text-[#8c9bb5]"
                    )}
                  >
                    <span className="flex items-center gap-2 font-bold text-sm uppercase">
                      <FontAwesomeIcon icon={opt.icon} className={active ? "text-[#ffe600]" : "text-[#8c9bb5]"} />
                      {opt.label}
                    </span>
                    <span className="block mt-1 text-[11px] opacity-80">{opt.hint}</span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* CTA */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!canStart}
              className="w-full rounded bg-[#ffe600] text-black font-black uppercase tracking-[0.2em] text-sm sm:text-base py-4 transition-transform hover:enabled:scale-[1.01] active:enabled:scale-[0.99] disabled:opacity-30 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(255,230,0,0.2)]"
            >
              INIZIA IMBARCO (DECOLLO) ▶
            </button>
            {!canStart && (
              <p className="mt-2 text-center text-xs text-[#ff2d55] font-bold animate-pulse">
                INSERISCI IL NOME DI TUTTI I PASSEGGERI PRIMA DEL DECOLLO.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
