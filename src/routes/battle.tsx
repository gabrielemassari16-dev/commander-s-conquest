import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { CARDS, CARD_BY_ID } from "@/game/cards";
import { generateMap, biomeColor, biomeIcon, biomeLabel, MAP_W, MAP_H } from "@/game/map";
import {
  newBattle,
  canPlace,
  placeUnit,
  step,
  aiSpawn,
  recomputeVisibility,
  type BattleState,
} from "@/game/engine";
import { loadDeck, deckCards } from "@/game/deck-storage";
import { CardView } from "@/components/game/CardView";
import type { Card } from "@/game/types";

export const Route = createFileRoute("/battle")({
  head: () => ({
    meta: [
      { title: "Battaglia · Fantaguerra" },
      { name: "description", content: "Schiera le truppe e conquista la mappa contro l'AI." },
    ],
  }),
  component: BattlePage,
});

type Phase = "deploy" | "battle" | "end";

function BattlePage() {
  const [seed, setSeed] = useState(() => Math.floor(Math.random() * 1e6));
  const [state, setState] = useState<BattleState>(() => {
    const s = newBattle(generateMap(seed));
    recomputeVisibility(s);
    return s;
  });
  const [phase, setPhase] = useState<Phase>("deploy");
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [hover, setHover] = useState<{ x: number; y: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const tickRef = useRef<number | null>(null);

  const deck = useMemo<Card[]>(() => deckCards(CARDS, loadDeck()), []);
  const aiDeck = useMemo<Card[]>(() => CARDS, []);

  const selected = selectedCardId ? deck.find((c) => c.id === selectedCardId) ?? null : null;

  // Battle tick loop
  useEffect(() => {
    if (phase !== "battle") return;
    const id = window.setInterval(() => {
      setState((prev) => {
        let s = step(prev);
        if (s.tick % 4 === 0) s = aiSpawn(s, aiDeck);
        if (s.winner) setPhase("end");
        return s;
      });
    }, 700);
    tickRef.current = id;
    return () => { if (tickRef.current) window.clearInterval(tickRef.current); };
  }, [phase, aiDeck]);

  function tryPlace(x: number, y: number) {
    if (phase !== "deploy" || !selected) return;
    const err = canPlace(state, selected, x, y, "player");
    if (err) { setError(err); setTimeout(() => setError(null), 1800); return; }
    setState((s) => {
      const ns = placeUnit(s, selected, x, y, "player");
      recomputeVisibility(ns);
      return ns;
    });
  }

  function startBattle() {
    if (state.units.filter((u) => u.faction === "player").length === 0) {
      setError("Schiera almeno un'unità!"); setTimeout(() => setError(null), 1800); return;
    }
    // Initial enemy deployment
    setState((s) => {
      let ns = aiSpawn(s, aiDeck);
      ns = aiSpawn(ns, aiDeck);
      ns = aiSpawn(ns, aiDeck);
      recomputeVisibility(ns);
      return ns;
    });
    setPhase("battle");
  }

  function restart() {
    const newSeed = Math.floor(Math.random() * 1e6);
    setSeed(newSeed);
    const s = newBattle(generateMap(newSeed));
    recomputeVisibility(s);
    setState(s);
    setPhase("deploy");
    setSelectedCardId(null);
  }

  const playerUnits = state.units.filter((u) => u.faction === "player").length;
  const enemyVisibleUnits = state.units.filter(
    (u) => u.faction === "enemy" && state.visibility[Math.round(u.y)]?.[Math.round(u.x)]
  ).length;

  return (
    <main className="min-h-screen flex flex-col">
      <header className="px-4 py-3 flex items-center justify-between border-b border-border flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <Link to="/" className="font-display tracking-widest">⚔️ FANTAGUERRA</Link>
          <span className="stat-pill">Tick {state.tick}</span>
          <span className="stat-pill text-[color:var(--gold)]">💰 {state.playerGold}</span>
          <span className="stat-pill text-[color:var(--faction-player)]">🟦 {playerUnits}</span>
          <span className="stat-pill text-[color:var(--faction-enemy)]">🟥 visibili {enemyVisibleUnits}</span>
          <span className="stat-pill">🏘️ {state.villagesPlayer} / {state.villagesEnemy}</span>
        </div>
        <div className="flex gap-2">
          {phase === "deploy" && (
            <button onClick={startBattle} className="btn-primary text-sm">Inizia battaglia</button>
          )}
          <button onClick={restart} className="btn-ghost text-sm">Nuova partita</button>
        </div>
      </header>

      <div className="flex-1 grid lg:grid-cols-[1fr_320px] gap-3 p-3">
        {/* MAP */}
        <section className="panel p-3 overflow-auto">
          <div className="flex items-center justify-between mb-2 text-xs text-muted-foreground">
            <span>{phase === "deploy" ? "🟦 Schiera nelle prime 4 colonne" : phase === "battle" ? "Battaglia in corso..." : state.winner === "player" ? "🏆 Vittoria!" : "💀 Sconfitta"}</span>
            {selected && phase === "deploy" && <span>Selezionato: <b>{selected.name}</b> ({selected.cost}💰)</span>}
            {error && <span className="text-[color:var(--blood)] font-bold">{error}</span>}
          </div>

          <div
            className="grid mx-auto"
            style={{
              gridTemplateColumns: `repeat(${MAP_W}, minmax(34px, 48px))`,
              gap: "2px",
              maxWidth: "100%",
            }}
          >
            {state.map.flatMap((row, y) =>
              row.map((tile, x) => {
                const visible = state.visibility[y][x];
                const unit = state.units.find((u) => Math.round(u.x) === x && Math.round(u.y) === y);
                const showUnit = unit && (unit.faction === "player" || visible);
                const isPlayerZone = x < 4;
                const isEnemyZone = x >= MAP_W - 4;
                const isHover = hover?.x === x && hover?.y === y;
                return (
                  <button
                    key={`${x}-${y}`}
                    onMouseEnter={() => setHover({ x, y })}
                    onMouseLeave={() => setHover(null)}
                    onClick={() => tryPlace(x, y)}
                    className="relative aspect-square flex items-center justify-center text-sm select-none transition-all"
                    style={{
                      background: visible
                        ? biomeColor(tile.biome)
                        : `color-mix(in oklab, ${biomeColor(tile.biome)} 25%, oklch(0.12 0 0))`,
                      outline: isHover && phase === "deploy" && selected ? "2px solid var(--gold)" : undefined,
                      boxShadow: isPlayerZone
                        ? "inset 0 0 0 1px color-mix(in oklab, var(--faction-player) 35%, transparent)"
                        : isEnemyZone
                        ? "inset 0 0 0 1px color-mix(in oklab, var(--faction-enemy) 30%, transparent)"
                        : undefined,
                      cursor: phase === "deploy" && selected ? "crosshair" : "default",
                    }}
                    title={`${biomeLabel(tile.biome)} (${x},${y})`}
                  >
                    {!visible && <span className="absolute inset-0 bg-black/40" />}
                    {visible && tile.village && (
                      <span className="absolute top-0 left-0.5 text-[10px]">🏘️</span>
                    )}
                    {visible && !showUnit && !tile.village && (
                      <span className="opacity-40 text-xs">{biomeIcon(tile.biome)}</span>
                    )}
                    {showUnit && unit && (
                      <UnitChip unit={unit} />
                    )}
                  </button>
                );
              })
            )}
          </div>

          {hover && (
            <div className="mt-3 text-xs text-muted-foreground">
              {biomeIcon(state.map[hover.y][hover.x].biome)} {biomeLabel(state.map[hover.y][hover.x].biome)}
              {state.map[hover.y][hover.x].village && " · 🏘️ Villaggio (genera monete)"}
            </div>
          )}
        </section>

        {/* SIDEBAR */}
        <aside className="panel p-3 flex flex-col gap-3 max-h-[calc(100vh-120px)] overflow-hidden">
          {phase === "end" && (
            <div className="panel p-3 text-center">
              <div className="text-3xl">{state.winner === "player" ? "🏆" : "💀"}</div>
              <div className="font-display text-xl">
                {state.winner === "player" ? "Vittoria!" : "Sconfitta"}
              </div>
              <button onClick={restart} className="btn-primary text-sm mt-2">Nuova battaglia</button>
            </div>
          )}

          <div>
            <h2 className="font-display text-lg mb-2">
              {phase === "deploy" ? "Schiera truppe" : "Rinforzi"}
            </h2>
            {deck.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Nessuna carta nel deck. <Link to="/collection" className="underline">Costruiscine uno</Link>.
              </p>
            ) : (
              <div className="space-y-2 overflow-y-auto pr-1" style={{ maxHeight: "calc(60vh)" }}>
                {deck.map((c) => (
                  <CardView
                    key={c.id}
                    card={c}
                    compact
                    selected={selectedCardId === c.id}
                    disabled={phase === "end" || c.cost > state.playerGold}
                    onClick={() => {
                      if (phase === "battle") {
                        // mid-battle reinforcement: drop into first valid player-zone tile
                        for (let yy = 0; yy < MAP_H; yy++) {
                          for (let xx = 0; xx < 4; xx++) {
                            const e = canPlace(state, c, xx, yy, "player");
                            if (!e) {
                              setState((s) => {
                                const ns = placeUnit(s, c, xx, yy, "player");
                                recomputeVisibility(ns);
                                return ns;
                              });
                              return;
                            }
                          }
                        }
                        setError("Nessuno spazio libero nella tua zona");
                        setTimeout(() => setError(null), 1500);
                      } else {
                        setSelectedCardId(selectedCardId === c.id ? null : c.id);
                      }
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="border-t border-border pt-2">
            <h3 className="font-display text-sm mb-1">Diario</h3>
            <div className="text-[11px] text-muted-foreground space-y-0.5 overflow-y-auto max-h-32">
              {state.log.slice().reverse().map((l, i) => (
                <div key={i}>{l}</div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}

function UnitChip({ unit }: { unit: { cardId: string; faction: "player" | "enemy"; hp: number } }) {
  const card = CARD_BY_ID(unit.cardId);
  const hpPct = Math.max(0, Math.min(100, (unit.hp / card.hp) * 100));
  const ring = unit.faction === "player" ? "var(--faction-player)" : "var(--faction-enemy)";
  return (
    <div
      className="relative w-full h-full flex items-center justify-center rounded"
      style={{ boxShadow: `inset 0 0 0 2px ${ring}`, background: `color-mix(in oklab, ${ring} 25%, transparent)` }}
      title={`${card.name} HP ${unit.hp}/${card.hp}`}
    >
      <span className="text-base leading-none">{card.emoji}</span>
      <span
        className="absolute bottom-0 left-0 h-0.5"
        style={{ width: `${hpPct}%`, background: hpPct > 50 ? "var(--gold)" : "var(--blood)" }}
      />
    </div>
  );
}
