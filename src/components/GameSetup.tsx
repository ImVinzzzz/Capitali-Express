// ============================================================================
// components/GameSetup.tsx
// Schermata iniziale: configurazione giocatori, difficoltà e modalità.
// Tema visivo: tabellone "Partenze" da stazione/aeroporto, coerente con il
// concept "Capitali del Mondo Express".
// ============================================================================

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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
} from '@fortawesome/free-solid-svg-icons';
import { useMemo, useState } from 'react';
import { Difficulty, GameConfig, GameMode, Player } from '../types';

const MIN_PLAYERS = 1;
const MAX_PLAYERS = 6;

const DIFFICULTY_OPTIONS: { value: Difficulty; label: string; hint: string; icon: typeof faSeedling }[] = [
  { value: 'facile', label: 'Facile', hint: 'Le grandi capitali note a tutti', icon: faSeedling },
  { value: 'medio', label: 'Medio', hint: 'Bisogna un po\u2019 pensarci', icon: faGaugeHigh },
  { value: 'avanzato', label: 'Avanzato', hint: 'Capitali trabocchetto', icon: faBolt },
];

const MODE_OPTIONS: { value: GameMode; label: string; hint: string; icon: typeof faSignsPost }[] = [
  { value: 'capital', label: 'Riconosci la capitale', hint: 'Vedi il paese, indovini la capitale', icon: faSignsPost },
  { value: 'country', label: 'Riconosci il paese', hint: 'Vedi la capitale, indovini il paese', icon: faEarthAmericas },
];

interface GameSetupProps {
  onStart: (config: GameConfig) => void;
}

function makeDefaultNames(count: number): string[] {
  return Array.from({ length: count }, (_, i) => `Giocatore ${i + 1}`);
}

export default function GameSetup({ onStart }: GameSetupProps) {
  const [playerCount, setPlayerCount] = useState(2);
  const [names, setNames] = useState<string[]>(makeDefaultNames(2));
  const [difficulty, setDifficulty] = useState<Difficulty>('medio');
  const [mode, setMode] = useState<GameMode>('capital');

  const canStart = useMemo(
    () => names.slice(0, playerCount).every((n) => n.trim().length > 0),
    [names, playerCount],
  );

  function updatePlayerCount(next: number) {
    const clamped = Math.min(MAX_PLAYERS, Math.max(MIN_PLAYERS, next));
    setPlayerCount(clamped);
    setNames((prev) => {
      const grown = [...prev];
      while (grown.length < clamped) grown.push(`Giocatore ${grown.length + 1}`);
      return grown;
    });
  }

  function updateName(index: number, value: string) {
    setNames((prev) => prev.map((n, i) => (i === index ? value : n)));
  }

  function handleSubmit() {
    if (!canStart) return;
    const players: Player[] = names.slice(0, playerCount).map((name, i) => ({
      id: `player-${i}-${Date.now()}`,
      name: name.trim(),
      score: 0,
      hasPlayed: false,
    }));
    onStart({ players, difficulty, mode });
  }

  return (
    <div className="min-h-screen bg-[#0B1220] text-[#F3EEE2] flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-2xl">
        {/* Header stile tabellone */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-2 text-[#F4A93E] text-xs sm:text-sm font-mono tracking-[0.3em] uppercase mb-3">
            <FontAwesomeIcon icon={faPlane} className="rotate-45" />
            <span>Partenze — Binario 60s</span>
          </div>
          <h1 className="font-mono font-black text-3xl sm:text-5xl uppercase tracking-tight text-[#F4A93E] [text-shadow:0_0_24px_rgba(244,169,62,0.35)]">
            Capitali del Mondo
            <span className="block text-[#F3EEE2]">Express</span>
          </h1>
          <p className="mt-3 text-[#8C9BB5] text-sm sm:text-base">
            Quante capitali riconosci in meno di 60 secondi?
          </p>
        </div>

        {/* Tabellone principale */}
        <div className="rounded-2xl border border-[#26344C] bg-[#101A2C] shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6)] overflow-hidden">
          {/* Sezione giocatori */}
          <section className="p-5 sm:p-6 border-b border-dashed border-[#26344C]">
            <div className="flex items-center justify-between mb-4">
              <h2 className="flex items-center gap-2 font-mono text-xs sm:text-sm uppercase tracking-[0.2em] text-[#8C9BB5]">
                <FontAwesomeIcon icon={faUserGroup} className="text-[#F4A93E]" />
                Manifesto passeggeri
              </h2>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => updatePlayerCount(playerCount - 1)}
                  disabled={playerCount <= MIN_PLAYERS}
                  aria-label="Riduci numero di giocatori"
                  className="h-8 w-8 rounded-full border border-[#3A4B66] text-[#F3EEE2] flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed hover:border-[#F4A93E] hover:text-[#F4A93E] transition-colors"
                >
                  <FontAwesomeIcon icon={faMinus} className="text-xs" />
                </button>
                <span className="font-mono font-bold w-6 text-center tabular-nums">{playerCount}</span>
                <button
                  type="button"
                  onClick={() => updatePlayerCount(playerCount + 1)}
                  disabled={playerCount >= MAX_PLAYERS}
                  aria-label="Aumenta numero di giocatori"
                  className="h-8 w-8 rounded-full border border-[#3A4B66] text-[#F3EEE2] flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed hover:border-[#F4A93E] hover:text-[#F4A93E] transition-colors"
                >
                  <FontAwesomeIcon icon={faPlus} className="text-xs" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {names.slice(0, playerCount).map((name, idx) => (
                <label key={idx} className="flex items-center gap-3 bg-[#0B1220] border border-[#26344C] rounded-lg px-3 py-2 focus-within:border-[#F4A93E] transition-colors">
                  <span className="font-mono text-[#F4A93E] text-xs shrink-0">
                    GATE {String(idx + 1).padStart(2, '0')}
                  </span>
                  <input
                    type="text"
                    value={name}
                    maxLength={20}
                    onChange={(e) => updateName(idx, e.target.value)}
                    placeholder={`Giocatore ${idx + 1}`}
                    className="bg-transparent outline-none text-sm w-full placeholder:text-[#4B5A75]"
                  />
                </label>
              ))}
            </div>
          </section>

          {/* Sezione difficoltà */}
          <section className="p-5 sm:p-6 border-b border-dashed border-[#26344C]">
            <h2 className="flex items-center gap-2 font-mono text-xs sm:text-sm uppercase tracking-[0.2em] text-[#8C9BB5] mb-4">
              <FontAwesomeIcon icon={faGaugeHigh} className="text-[#F4A93E]" />
              Classe di viaggio (difficoltà)
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
                    className={`text-left rounded-lg border px-4 py-3 transition-all ${
                      active
                        ? 'border-[#F4A93E] bg-[#F4A93E]/10 shadow-[0_0_0_1px_rgba(244,169,62,0.4)]'
                        : 'border-[#26344C] hover:border-[#3A4B66]'
                    }`}
                  >
                    <span className="flex items-center gap-2 font-semibold text-sm">
                      <FontAwesomeIcon icon={opt.icon} className={active ? 'text-[#F4A93E]' : 'text-[#8C9BB5]'} />
                      {opt.label}
                    </span>
                    <span className="block mt-1 text-xs text-[#8C9BB5]">{opt.hint}</span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Sezione modalità */}
          <section className="p-5 sm:p-6 border-b border-dashed border-[#26344C]">
            <h2 className="flex items-center gap-2 font-mono text-xs sm:text-sm uppercase tracking-[0.2em] text-[#8C9BB5] mb-4">
              <FontAwesomeIcon icon={faRoute} className="text-[#F4A93E]" />
              Tratta di gioco (modalità)
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
                    className={`text-left rounded-lg border px-4 py-3 transition-all ${
                      active
                        ? 'border-[#F4A93E] bg-[#F4A93E]/10 shadow-[0_0_0_1px_rgba(244,169,62,0.4)]'
                        : 'border-[#26344C] hover:border-[#3A4B66]'
                    }`}
                  >
                    <span className="flex items-center gap-2 font-semibold text-sm">
                      <FontAwesomeIcon icon={opt.icon} className={active ? 'text-[#F4A93E]' : 'text-[#8C9BB5]'} />
                      {opt.label}
                    </span>
                    <span className="block mt-1 text-xs text-[#8C9BB5]">{opt.hint}</span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* CTA */}
          <div className="p-5 sm:p-6">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!canStart}
              className="w-full rounded-lg bg-[#F4A93E] text-[#0B1220] font-mono font-black uppercase tracking-[0.2em] text-sm sm:text-base py-3.5 transition-transform hover:enabled:scale-[1.01] active:enabled:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed motion-reduce:transition-none"
            >
              Imbarco — Parti ▶
            </button>
            {!canStart && (
              <p className="mt-2 text-center text-xs text-[#E85C4A]">
                Inserisci un nome per ogni giocatore prima di partire.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
