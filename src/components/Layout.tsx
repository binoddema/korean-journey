import React from "react";
import { useStore } from "../store";
import { derive, levelInfo } from "../lib/progress";
import { Bar } from "./ui";

export type Page =
  | "home"
  | "courses"
  | "review"
  | "exercises"
  | "progress"
  | "goals"
  | "settings";

export const NAV: { id: Page; label: string; icon: string }[] = [
  { id: "home", label: "Home", icon: "🏠" },
  { id: "courses", label: "Corsi", icon: "📚" },
  { id: "review", label: "Ripasso", icon: "🧠" },
  { id: "exercises", label: "Esercizi", icon: "✏️" },
  { id: "progress", label: "Progressi", icon: "📊" },
  { id: "goals", label: "Obiettivi", icon: "⭐" },
  { id: "settings", label: "Impostazioni", icon: "⚙️" },
];

const BOTTOM: Page[] = ["home", "courses", "review", "exercises", "progress"];

export const StatChips = () => {
  const { state } = useStore();
  const lvl = levelInfo(state.xp);
  return (
    <div className="stat-chips">
      <div className="stat-chip">
        <span className="sc-emoji">🔥</span>
        <span>
          <strong>{state.streak}</strong>
          <small>Day Streak</small>
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
          <small>XP Totali</small>
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
  const [moreOpen, setMoreOpen] = React.useState(false);

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-flag">🇰🇷</span>
          <div>
            <strong>Korean Journey</strong>
            <small>Impara coreano un giorno alla volta</small>
          </div>
        </div>

        <nav>
          {NAV.map((n) => (
            <button
              key={n.id}
              className={`nav-item ${page === n.id ? "active" : ""}`}
              onClick={() => onNav(n.id)}
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

      <main className="main">{children}</main>

      <nav className="bottom-nav">
        {BOTTOM.map((id) => {
          const n = NAV.find((x) => x.id === id)!;
          return (
            <button
              key={id}
              className={page === id ? "active" : ""}
              onClick={() => {
                setMoreOpen(false);
                onNav(id);
              }}
            >
              <span>{n.icon}</span>
              {n.label}
            </button>
          );
        })}
        <button
          className={page === "goals" || page === "settings" ? "active" : ""}
          onClick={() => setMoreOpen((v) => !v)}
        >
          <span>•••</span>
          Altro
        </button>
        {moreOpen && (
          <div className="more-sheet">
            <button
              onClick={() => {
                onNav("goals");
                setMoreOpen(false);
              }}
            >
              ⭐ Obiettivi
            </button>
            <button
              onClick={() => {
                onNav("settings");
                setMoreOpen(false);
              }}
            >
              ⚙️ Impostazioni
            </button>
          </div>
        )}
      </nav>

      {d.dueWords > 0 && page !== "review" && (
        <button className="review-fab" onClick={() => onNav("review")}>
          🧠 {d.dueWords}
        </button>
      )}
    </div>
  );
};
