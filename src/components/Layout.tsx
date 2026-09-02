import React from "react";
import { useStore } from "../store";
import { derive, levelInfo } from "../lib/progress";
import { Bar } from "./ui";

export type Page =
  | "home"
  | "coreano"
  | "design"
  | "sport"
  | "courses"
  | "vocab"
  | "review"
  | "exercises"
  | "progress"
  | "goals"
  | "settings"
  | "calendario"
  | "diario"
  | "portfolio";

export const NAV: { id: Page; label: string; icon: string }[] = [
  { id: "home", label: "Oggi", icon: "⌂" },
  { id: "coreano", label: "Coreano", icon: "한" },
  { id: "design", label: "Design", icon: "✎" },
  { id: "sport", label: "Sport", icon: "🏋" },
];

const MENU_UTENTE: { id: Page; label: string; icon: string }[] = [
  { id: "calendario", label: "Calendario", icon: "🗓" },
  { id: "diario", label: "Diario", icon: "📓" },
  { id: "portfolio", label: "Portfolio", icon: "🖼" },
  { id: "progress", label: "Progressi", icon: "📊" },
  { id: "goals", label: "Obiettivi", icon: "⭐" },
  { id: "settings", label: "Impostazioni", icon: "⚙️" },
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
  const [coachOpen, setCoachOpen] = React.useState(false);

  const vai = (p: Page) => {
    setMenuOpen(false);
    setCoachOpen(false);
    onNav(p);
  };

  const attiva = (id: Page) =>
    page === id || (id === "coreano" && DENTRO_COREANO.includes(page));

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
          {NAV.map((n) => (
            <button
              key={n.id}
              className={`nav-item ${attiva(n.id) ? "active" : ""}`}
              onClick={() => vai(n.id)}
            >
              <span className="nav-icon">{n.icon}</span>
              {n.label}
            </button>
          ))}
          <div className="nav-sep" />
          {MENU_UTENTE.map((n) => (
            <button
              key={n.id}
              className={`nav-item ${page === n.id ? "active" : ""}`}
              onClick={() => vai(n.id)}
            >
              <span className="nav-icon">{n.icon}</span>
              {n.label}
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
          aria-label="Apri menu utente"
          onClick={() => setMenuOpen((v) => !v)}
        >
          {(state.name || "🙂").slice(0, 1).toUpperCase()}
        </button>
        <div className="tm-testo">
          <strong>{[...NAV, ...MENU_UTENTE].find((n) => n.id === page)?.label ?? "Oggi"}</strong>
          <small>{state.name || "Ospite"}</small>
        </div>
      </div>

      {menuOpen && (
        <>
          <div className="velo" onClick={() => setMenuOpen(false)} />
          <div className="menu-utente">
            {MENU_UTENTE.map((n) => (
              <button key={n.id} onClick={() => vai(n.id)}>
                <span className="mi">{n.icon}</span>
                {n.label}
              </button>
            ))}
          </div>
        </>
      )}

      <main className="main">{children}</main>

      <button
        className="fab-coach"
        aria-label="Apri il coach"
        onClick={() => setCoachOpen((v) => !v)}
      >
        💬
      </button>

      {coachOpen && (
        <div className="pannello-coach">
          <div className="pc-testata">
            <span>Coach</span>
            <button aria-label="Chiudi" onClick={() => setCoachOpen(false)}>
              ✕
            </button>
          </div>
          <p>
            {d.dueWords > 0
              ? `Hai ${d.dueWords} parole da ripassare. Il ripasso viene prima delle parole nuove: senza, quelle di ieri si perdono.`
              : "Ripasso in pari. Oggi puoi aggiungere parole nuove."}
          </p>
        </div>
      )}

      {d.dueWords > 0 && page !== "review" && (
        <button className="review-fab" onClick={() => vai("review")}>
          🧠 {d.dueWords}
        </button>
      )}

      <nav className="bottom-nav">
        {NAV.map((n) => (
          <button
            key={n.id}
            className={attiva(n.id) ? "active" : ""}
            onClick={() => vai(n.id)}
          >
            <span>{n.icon}</span>
            {n.label}
          </button>
        ))}
      </nav>
    </div>
  );
};
