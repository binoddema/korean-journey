import React from "react";
import { useStore } from "../store";
import { derive, levelInfo } from "../lib/progress";
import { Bar } from "./ui";
import { SEZIONI, sezione, type Page } from "../pagine";

export type { Page };

const BASSO: { id: Page; label: string; icona: string }[] = [
  { id: "home", label: "Oggi", icona: "⌂" },
  { id: "coreano", label: "Coreano", icona: "한" },
  { id: "design", label: "Design", icona: "✎" },
  { id: "sport", label: "Sport", icona: "🏋" },
];

const DENTRO_COREANO: Page[] = ["courses", "vocab", "review", "exercises"];

export const StatChips = () => {
  const { state } = useStore();
  const lvl = levelInfo(state.xp);
  return (
    <div className="stat-chips">
      <div className="stat-chip">
        <span className="sc-emoji">🔥</span>
        <span>
          <strong>{state.streak}</strong>
          <small>Giorni di fila</small>
        </span>
      </div>
      <div className="stat-chip">
        <span className="sc-emoji">🏆</span>
        <span>
          <strong>{lvl.level}</strong>
          <small>Livello</small>
        </span>
      </div>
      <div className="stat-chip">
        <span className="sc-emoji">⭐</span>
        <span>
          <strong>{state.xp}</strong>
          <small>XP totali</small>
        </span>
      </div>
    </div>
  );
};

export const PageHeader = ({
  icon,
  title,
  sub,
}: {
  icon?: string;
  title: React.ReactNode;
  sub?: string;
}) => (
  <header className="page-head">
    <div className="ph-left">
      {icon && <span className="ph-icon">{icon}</span>}
      <div>
        <h1>{title}</h1>
        {sub && <p className="muted">{sub}</p>}
      </div>
    </div>
    <StatChips />
  </header>
);

export const Layout = ({
  page,
  onNav,
  children,
}: {
  page: Page;
  onNav: (p: Page) => void;
  children: React.ReactNode;
}) => {
  const { state } = useStore();
  const lvl = levelInfo(state.xp);
  const d = derive(state);
  const [menuOpen, setMenuOpen] = React.useState(false);

  const vai = (p: Page) => {
    setMenuOpen(false);
    onNav(p);
  };

  const attiva = (id: Page) =>
    page === id || (id === "coreano" && DENTRO_COREANO.includes(page));

  const titoloPagina =
    page === "home" ? "Oggi" : sezione(page)?.label ?? "Korean Journey";

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-flag">🇰🇷</span>
          <div>
            <strong>Korean Journey</strong>
            <small>Un giorno alla volta</small>
          </div>
        </div>

        <nav>
          <button
            className={`nav-item ${page === "home" ? "active" : ""}`}
            onClick={() => vai("home")}
          >
            <span className="nav-icon">⌂</span>
            Oggi
          </button>
          <div className="nav-sep" />
          {SEZIONI.map((s) => (
            <button
              key={s.id}
              className={`nav-item ${attiva(s.id) ? "active" : ""}`}
              onClick={() => vai(s.id)}
            >
              <span className="nav-icon">{s.icona}</span>
              {s.label}
            </button>
          ))}
        </nav>

        <div className="sidebar-foot">
          <div className="profile">
            <span className="avatar">{(state.name || "🙂").slice(0, 1)}</span>
            <div>
              <strong>{state.name || "Ospite"}</strong>
              <small>Livello {lvl.level}</small>
              <small>{lvl.name}</small>
            </div>
          </div>
          <div className="xp-box">
            <div className="xp-top">
              <strong>{state.xp}</strong> XP
            </div>
            <small>
              {lvl.next ? `Prossimo livello: ${lvl.next} XP` : "Livello massimo raggiunto"}
            </small>
            <Bar value={lvl.pct} color="linear-gradient(90deg,#ff8ac4,#8a6cff)" height={7} />
          </div>
        </div>
      </aside>

      <div className="testata-mobile">
        <button
          className="avatar-btn"
          aria-haspopup="true"
          aria-expanded={menuOpen}
          aria-label="Apri il menu delle sezioni"
          onClick={() => setMenuOpen((v) => !v)}
        >
          {(state.name || "🙂").slice(0, 1).toUpperCase()}
        </button>
        <div className="tm-testo">
          <strong>{titoloPagina}</strong>
          <small>{state.name || "Ospite"}</small>
        </div>
      </div>

      {menuOpen && (
        <>
          <div className="velo" onClick={() => setMenuOpen(false)} />
          <div className="menu-utente">
            {SEZIONI.map((s) => (
              <button key={s.id} onClick={() => vai(s.id)}>
                <span className="mi">{s.icona}</span>
                {s.label}
              </button>
            ))}
          </div>
        </>
      )}

      <main className="main">{children}</main>

      <button className="fab-coach" aria-label="Apri il coach" onClick={() => vai("coach")}>
        🧭
      </button>

      {d.dueWords > 0 && page !== "review" && (
        <button className="review-fab" onClick={() => vai("review")}>
          🧠 {d.dueWords}
        </button>
      )}

      <nav className="bottom-nav">
        {BASSO.map((n) => (
          <button key={n.id} className={attiva(n.id) ? "active" : ""} onClick={() => vai(n.id)}>
            <span>{n.icona}</span>
            {n.label}
          </button>
        ))}
        <button className={menuOpen ? "active" : ""} onClick={() => setMenuOpen((v) => !v)}>
          <span>☰</span>
          Tutto
        </button>
      </nav>
    </div>
  );
};
