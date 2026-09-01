import React from "react";
import { speak, speechState } from "../lib/speech";
import { useStore } from "../store";
import type { Vocab } from "../types";

export const Card = ({
  children,
  className = "",
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={`card ${className}`} {...rest}>
    {children}
  </div>
);

export const CardTitle = ({
  emoji,
  title,
  sub,
  action,
}: {
  emoji?: string;
  title: string;
  sub?: string;
  action?: React.ReactNode;
}) => (
  <div className="card-title">
    <div>
      <h3>
        {emoji && <span className="ct-emoji">{emoji}</span>}
        {title}
      </h3>
      {sub && <p className="muted">{sub}</p>}
    </div>
    {action}
  </div>
);

export const Bar = ({
  value,
  color,
  height = 8,
}: {
  value: number;
  color?: string;
  height?: number;
}) => (
  <div className="bar" style={{ height }}>
    <div
      className="bar-fill"
      style={{ width: `${Math.min(100, Math.max(0, value))}%`, background: color }}
    />
  </div>
);

export const Ring = ({
  value,
  size = 88,
  stroke = 10,
  color = "var(--accent)",
  label,
  sub,
}: {
  value: number;
  size?: number;
  stroke?: number;
  color?: string;
  label?: string;
  sub?: string;
}) => {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div className="ring" style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        <circle cx={size / 2} cy={size / 2} r={r} stroke="var(--track)" strokeWidth={stroke} fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={color}
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={c}
          strokeDashoffset={c - (c * Math.min(100, value)) / 100}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <div className="ring-label">
        <strong>{label ?? `${Math.round(value)}%`}</strong>
        {sub && <span>{sub}</span>}
      </div>
    </div>
  );
};

export const AudioButton = ({
  text,
  size = "md",
}: {
  text: string;
  size?: "sm" | "md";
}) => {
  const { state } = useStore();
  const [warn, setWarn] = React.useState<string | null>(null);
  const onClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const st = speak(text, state.settings.slowAudio);
    if (st === "unsupported") setWarn("Audio non disponibile su questo browser");
    else if (st === "no-korean-voice") setWarn("Nessuna voce coreana installata");
    else setWarn(null);
    if (st !== "ok") setTimeout(() => setWarn(null), 2600);
  };
  return (
    <span className="audio-wrap">
      <button
        type="button"
        className={`audio-btn ${size}`}
        onClick={onClick}
        aria-label={`Ascolta ${text}`}
        title="Ascolta"
      >
        🔊
      </button>
      {warn && <span className="audio-warn">{warn}</span>}
    </span>
  );
};

export const Chip = ({ children, tone = "" }: { children: React.ReactNode; tone?: string }) => (
  <span className={`chip ${tone}`}>{children}</span>
);

export const VocabCard = ({ v, index }: { v: Vocab; index?: number }) => {
  const { state } = useStore();
  const { showRomanization, showHooks, autoAudio, slowAudio } = state.settings;

  React.useEffect(() => {
    if (autoAudio && !v.letter && speechState() === "ok") speak(v.ko, slowAudio);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [v.id]);

  return (
    <div className="vocab-card">
      <div className="vocab-head">
        <div>
          {index !== undefined && <span className="vocab-index">{index + 1}</span>}
          <span className="ko-big">{v.ko}</span>
          {showRomanization && <span className="romanization">{v.ro}</span>}
        </div>
        <AudioButton text={v.ko} />
      </div>
      <p className="vocab-it">
        {v.emoji && <span className="vocab-emoji">{v.emoji}</span>} {v.it}
        {v.reg && <Chip tone={`reg-${v.reg}`}>{v.reg}</Chip>}
      </p>
      {showHooks && (
        <p className="hook">
          <span>🧠</span> {v.hook}
        </p>
      )}
      <div className="vocab-example">
        <p className="ko">
          {v.exKo} <AudioButton text={v.exKo} size="sm" />
        </p>
        <p className="muted">= {v.exIt}</p>
      </div>
    </div>
  );
};

export const Empty = ({
  emoji,
  title,
  text,
  action,
}: {
  emoji: string;
  title: string;
  text: string;
  action?: React.ReactNode;
}) => (
  <div className="empty">
    <div className="empty-emoji">{emoji}</div>
    <h3>{title}</h3>
    <p className="muted">{text}</p>
    {action}
  </div>
);
