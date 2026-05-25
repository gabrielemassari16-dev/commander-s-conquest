import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/credits")({
  head: () => ({
    meta: [
      { title: "Crediti · Fantaguerra" },
      { name: "description", content: "Le menti dietro Fantaguerra: il team di sviluppo e design." },
    ],
  }),
  component: CreditsPage,
});

const TEAM = [
  { name: "Gabriele Massari", role: "Game Design & Direzione Creativa", icon: "⚔️" },
  { name: "Edoardo Russo", role: "Sistema di Battaglia & Bilanciamento", icon: "🛡️" },
  { name: "Gad Malak", role: "Strategia & AI Nemica", icon: "🤖" },
  { name: "Anni Riccardo", role: "Mappe, Biomi & Visual", icon: "🗺️" },
];

function CreditsPage() {
  return (
    <main className="min-h-screen px-6 py-10 max-w-4xl mx-auto">
      <header className="flex items-center justify-between mb-10 flex-wrap gap-2">
        <Link to="/" className="font-display tracking-widest text-xl">⚔️ FANTAGUERRA</Link>
        <nav className="flex gap-2 text-sm">
          <Link to="/battle" className="btn-primary">Battaglia</Link>
          <Link to="/" className="btn-ghost">Home</Link>
        </nav>
      </header>

      <section className="text-center mb-12">
        <p className="text-[color:var(--gold)] tracking-[0.4em] text-xs mb-3">QUARTIER GENERALE</p>
        <h1 className="font-display text-5xl md:text-6xl">Il Comando Supremo</h1>
        <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
          Fantaguerra nasce dalle ore di lavoro, dalle notti di playtesting e dalle infinite
          discussioni strategiche di un piccolo gruppo di comandanti. Senza di loro,
          questa mappa non esisterebbe.
        </p>
      </section>

      <div className="grid sm:grid-cols-2 gap-4">
        {TEAM.map((m) => (
          <div key={m.name} className="card-handdrawn p-6">
            <div className="flex items-center gap-4">
              <div
                className="text-3xl w-14 h-14 rounded-full flex items-center justify-center shrink-0"
                style={{
                  background: "color-mix(in oklab, var(--gold) 18%, transparent)",
                  border: "1.5px solid color-mix(in oklab, var(--gold) 50%, transparent)",
                }}
              >
                {m.icon}
              </div>
              <div>
                <div className="font-display text-xl">{m.name}</div>
                <div className="text-sm text-muted-foreground">{m.role}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <section className="mt-14 panel p-6 text-center">
        <h2 className="font-display text-2xl text-[color:var(--gold)]">Ringraziamenti</h2>
        <p className="text-muted-foreground text-sm mt-2 max-w-xl mx-auto">
          A chiunque abbia perso, riprovato, e vinto. A chi ha schierato la fanteria
          sapendo di non avere chance. A chi crede ancora che una buona strategia valga
          più di mille soldati.
        </p>
        <p className="text-xs text-[color:var(--gold)] tracking-widest mt-6">— FANTAGUERRA · 2026 —</p>
      </section>

      <div className="mt-10 text-center">
        <Link to="/battle" className="btn-primary">Torna al fronte</Link>
      </div>
    </main>
  );
}
