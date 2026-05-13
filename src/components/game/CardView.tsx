import type { Card } from "@/game/types";

const TYPE_LABEL: Record<Card["type"], string> = {
  leader: "Leader",
  soldier: "Soldato",
  vehicle: "Mezzo",
};

const TYPE_BADGE: Record<Card["type"], string> = {
  leader: "bg-[color:var(--gold)] text-[color:var(--primary-foreground)]",
  soldier: "bg-[color:var(--faction-player)] text-white",
  vehicle: "bg-[color:var(--accent)] text-[color:var(--accent-foreground)]",
};

export function CardView({
  card,
  selected,
  onClick,
  compact,
  disabled,
}: {
  card: Card;
  selected?: boolean;
  onClick?: () => void;
  compact?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={[
        "panel text-left p-3 w-full transition-all",
        selected ? "gold-border ring-2 ring-[color:var(--gold)]" : "hover:border-[color:var(--gold)]",
        disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{card.emoji}</span>
          <div>
            <div className="font-display font-bold leading-tight">{card.name}</div>
            <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${TYPE_BADGE[card.type]}`}>
              {TYPE_LABEL[card.type]}
            </span>
          </div>
        </div>
        <span className="stat-pill text-[color:var(--gold)]">💰 {card.cost}</span>
      </div>
      {!compact && <p className="text-xs text-muted-foreground mt-2 italic">{card.description}</p>}
      <div className="grid grid-cols-4 gap-1 mt-2 text-xs">
        <div className="stat-pill justify-center" title="Vita">❤️ {card.hp}</div>
        <div className="stat-pill justify-center" title="Attacco">⚔️ {card.attack}</div>
        <div className="stat-pill justify-center" title="Difesa">🛡️ {card.defense}</div>
        <div className="stat-pill justify-center" title="Velocità">⚡ {card.speed}</div>
      </div>
      {card.ability && !compact && (
        <div className="mt-2 text-xs">
          <span className="font-bold text-[color:var(--gold)]">Abilità:</span>{" "}
          <span className="text-muted-foreground">{card.abilityDesc}</span>
        </div>
      )}
      {!compact && (
        <div className="mt-2 text-[11px] text-muted-foreground">
          Punteggio <span className="text-foreground font-bold">{card.score}</span> · Range {card.range}
        </div>
      )}
    </button>
  );
}
