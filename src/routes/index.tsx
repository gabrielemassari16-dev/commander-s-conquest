import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Fantaguerra — Strategia di guerra a carte" },
      { name: "description", content: "Comanda il tuo esercito, conquista territori e domina la mappa in Fantaguerra, gioco strategico a carte." },
      { property: "og:title", content: "Fantaguerra — Strategia di guerra a carte" },
      { property: "og:description", content: "Costruisci il tuo deck, schiera truppe e conquista la mappa." },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <header className="px-6 py-4 flex items-center justify-between border-b border-border">
        <div className="flex items-center gap-2">
          <span className="text-2xl">⚔️</span>
          <span className="font-display text-xl tracking-widest">FANTAGUERRA</span>
        </div>
        <nav className="flex gap-2">
          <Link to="/collection" className="btn-ghost text-sm">Collezione</Link>
          <Link to="/how-to-play" className="btn-ghost text-sm">Come si gioca</Link>
        </nav>
      </header>

      <section className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="max-w-3xl text-center">
          <p className="text-[color:var(--gold)] tracking-[0.4em] text-xs mb-4">COMANDANTE SUPREMO</p>
          <h1 className="text-6xl md:text-7xl font-display font-bold leading-tight">
            Conquista la mappa.<br />
            <span className="text-[color:var(--gold)]">Comanda il fronte.</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-xl mx-auto">
            Recluta truppe, schiera mezzi corazzati, sfrutta i biomi e supera l'AI nemica
            in battaglie strategiche in tempo reale.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Link to="/battle" className="btn-primary">Inizia battaglia</Link>
            <Link to="/collection" className="btn-ghost">Costruisci deck</Link>
          </div>

          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-3 text-left">
            {[
              { e: "🃏", t: "10+ Carte", d: "Leader, soldati e mezzi" },
              { e: "🗺️", t: "Mappa dinamica", d: "Fog of war e villaggi" },
              { e: "🌍", t: "5 Biomi", d: "Ogni terreno conta" },
              { e: "🤖", t: "AI nemica", d: "Strategia in tempo reale" },
            ].map((f) => (
              <div key={f.t} className="panel p-4">
                <div className="text-3xl">{f.e}</div>
                <div className="font-display font-bold mt-2">{f.t}</div>
                <div className="text-xs text-muted-foreground">{f.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="px-6 py-4 text-center text-xs text-muted-foreground border-t border-border">
        Fantaguerra · Prototipo strategico
      </footer>
    </main>
  );
}
