import React from "react";

export const LineChart = ({
  data,
  labels,
  color = "var(--accent)",
  height = 150,
}: {
  data: number[];
  labels?: string[];
  color?: string;
  height?: number;
}) => {
  const w = 320;
  const h = height;
  const pad = 22;
  const max = Math.max(1, ...data);
  const step = data.length > 1 ? (w - pad * 2) / (data.length - 1) : 0;
  const pts = data.map((v, i) => [pad + i * step, h - pad - (v / max) * (h - pad * 2)] as const);
  const path = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");
  const area = `${path} L${pad + (data.length - 1) * step},${h - pad} L${pad},${h - pad} Z`;

  return (
    <svg className="chart" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" role="img">
      <line x1={pad} y1={h - pad} x2={w - pad} y2={h - pad} stroke="var(--track)" />
      <path d={area} fill={color} opacity={0.12} />
      <path d={path} fill="none" stroke={color} strokeWidth={2.5} strokeLinejoin="round" />
      {pts.length > 0 && (
        <circle cx={pts[pts.length - 1][0]} cy={pts[pts.length - 1][1]} r={4} fill={color} />
      )}
      {labels &&
        labels.map((l, i) =>
          l ? (
            <text key={i} x={pad + i * step} y={h - 6} className="chart-label" textAnchor="middle">
              {l}
            </text>
          ) : null
        )}
    </svg>
  );
};

export const BarChart = ({
  data,
  labels,
  color = "var(--accent)",
  height = 150,
}: {
  data: number[];
  labels?: string[];
  color?: string;
  height?: number;
}) => {
  const w = 320;
  const h = height;
  const pad = 22;
  const max = Math.max(1, ...data);
  const bw = (w - pad * 2) / data.length;
  return (
    <svg className="chart" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" role="img">
      <line x1={pad} y1={h - pad} x2={w - pad} y2={h - pad} stroke="var(--track)" />
      {data.map((v, i) => {
        const bh = (v / max) * (h - pad * 2);
        return (
          <rect
            key={i}
            x={pad + i * bw + bw * 0.15}
            y={h - pad - bh}
            width={bw * 0.7}
            height={Math.max(v > 0 ? 2 : 0, bh)}
            rx={2}
            fill={color}
            opacity={0.85}
          />
        );
      })}
      {labels &&
        labels.map((l, i) =>
          l ? (
            <text key={i} x={pad + i * bw + bw / 2} y={h - 6} className="chart-label" textAnchor="middle">
              {l}
            </text>
          ) : null
        )}
    </svg>
  );
};

export interface Slice {
  label: string;
  value: number;
  color: string;
}

export const Donut = ({ slices, total }: { slices: Slice[]; total: number }) => {
  const size = 150;
  const stroke = 22;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const sum = Math.max(1, slices.reduce((a, s) => a + s.value, 0));
  let offset = 0;

  return (
    <div className="donut">
      <svg width={size} height={size}>
        <circle cx={size / 2} cy={size / 2} r={r} stroke="var(--track)" strokeWidth={stroke} fill="none" />
        {slices.map((s) => {
          const len = (s.value / sum) * c;
          const el = (
            <circle
              key={s.label}
              cx={size / 2}
              cy={size / 2}
              r={r}
              stroke={s.color}
              strokeWidth={stroke}
              fill="none"
              strokeDasharray={`${len} ${c - len}`}
              strokeDashoffset={-offset}
              transform={`rotate(-90 ${size / 2} ${size / 2})`}
            />
          );
          offset += len;
          return el;
        })}
      </svg>
      <div className="donut-center">
        <strong>{total}</strong>
        <span>Totali</span>
      </div>
    </div>
  );
};
