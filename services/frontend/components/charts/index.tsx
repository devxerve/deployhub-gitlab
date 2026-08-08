"use client";

import { useEffect, useRef, useState } from "react";
import type { Theme } from "@/lib/themes";
import type { Deploy } from "@/lib/api";
import { useLanguage } from "@/lib/i18n/context";
import type { Language } from "@/lib/i18n/translations";

// Measures the pixel width of a container so charts can be drawn with a
// viewBox that matches it 1:1. Without this, a small viewBox stretched to
// width:100% gets scaled up by the browser — text, strokes and spacing all
// balloon in proportion to how much wider the container is than the viewBox.
function useContainerWidth<T extends HTMLElement>(fallback: number) {
  const ref = useRef<T | null>(null);
  const [width, setWidth] = useState(fallback);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width;
      if (w) setWidth(w);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return [ref, width] as const;
}


export function SparklineArea({
  data, color, h = 36, w = 120,
}: { data: number[]; color: string; h?: number; w?: number }) {
  const min = Math.min(...data), max = Math.max(...data), rng = max - min || 1;
  const divisor = Math.max(1, data.length - 1);

const pts = data
  .map(
    (v, i) =>
      `${(i / divisor) * w},${h - ((v - min) / rng) * (h - 4) - 2}`,
  )
  .join(" ");
  const id = `sa-${color.replace(/[^a-z0-9]/gi, "")}`;
  return (
    <svg width={w} height={h} style={{ display: "block", overflow: "visible" }}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={`0,${h} ${pts} ${w},${h}`} fill={`url(#${id})`} />
      <polyline fill="none" stroke={color} strokeWidth="1.8" points={pts} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

 
export function DonutChart({
  value, max = 100, color, size = 80, stroke = 7,
}: { value: number; max?: number; color: string; size?: number; stroke?: number }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (value / max) * circ;
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(148,163,184,0.12)" strokeWidth={stroke} />
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={`${circ} ${circ}`} strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 0.8s ease", filter: `drop-shadow(0 0 4px ${color}66)` }}
      />
    </svg>
  );
}


import { HistoryPoint } from "@/lib/api";

export function MetricsChart({ t, data }: { t: Theme, data?: HistoryPoint[] }) {
  const chartData = data ?? [];
  const [containerRef, svgW] = useContainerWidth<HTMLDivElement>(600);
  const svgH = 110, pad = { l: 30, r: 10, t: 10, b: 20 };
  const w = svgW - pad.l - pad.r, h = svgH - pad.t - pad.b;

  const mkPath = (key: keyof HistoryPoint, min: number, max: number) => {
  if (chartData.length === 0) {
    return "";
  }

  const pts = chartData.map((d, i) => {
    const divisor = Math.max(1, chartData.length - 1);
    const x = pad.l + (i / divisor) * w;
    const y = pad.t + h - ((Number(d[key]) - min) / (max - min)) * h;
    return `${x},${y}`;
  });

  return `M${pts.join("L")}`;
};

  return (
    <div ref={containerRef} style={{ width: "100%" }}>
    <svg viewBox={`0 0 ${svgW} ${svgH}`} width={svgW} height={svgH} style={{ display: "block" }}>
      {[0, 25, 50, 75, 100].map((pct) => {
        const y = pad.t + h - (pct / 100) * h;
        return (
          <g key={pct}>
            <line x1={pad.l} x2={svgW - pad.r} y1={y} y2={y} stroke={t.border} strokeWidth="1" />
            <text x={pad.l - 4} y={y + 4} textAnchor="end" fontSize="9" fill={t.muted}>{pct}%</text>
          </g>
        );
      })}
      {chartData.length > 0 && (
        <>
          <path
            d={mkPath("cpu", 0, 100)}
            fill="none"
            stroke="#3b82f6"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d={mkPath("mem", 0, 100)}
            fill="none"
            stroke="#a855f7"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="5,3"
          />
        </>
      )}
      {chartData.filter((_, i) => i % Math.max(1, Math.floor(chartData.length / 6)) === 0).map((d, i) => (
        <text key={i} x={pad.l + (i * Math.max(1, Math.floor(chartData.length / 6)) / Math.max(1, chartData.length - 1)) * w} y={svgH - 4} textAnchor="middle" fontSize="9" fill={t.muted}>{d.hour}</text>
      ))}
    </svg>
    </div>
  );
}

 
const LOCALE_BY_LANGUAGE: Record<Language, string> = {
  en: "en-US",
  es: "es-ES",
  fr: "fr-FR",
};

export function DeployActivityChart({ t, deploys }: { t: Theme; deploys: Deploy[] }) {
  const { language } = useLanguage();
  const [containerRef, svgW] = useContainerWidth<HTMLDivElement>(600);
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d;
  });

  const labels = days.map((d) => new Intl.DateTimeFormat(LOCALE_BY_LANGUAGE[language], { weekday: "short" }).format(d));
  const success = days.map((day) => deploys.filter((dep) => dep.status.toLowerCase() === "success" && new Date(dep.createdAt).toDateString() === day.toDateString()).length);
  const fail = days.map((day) => deploys.filter((dep) => dep.status.toLowerCase() === "failed" && new Date(dep.createdAt).toDateString() === day.toDateString()).length);

  const h = 85, pad = 10, svgH = h + 30;
  const slot = (svgW - pad * 2) / days.length;
  const barW = Math.min(28, slot * 0.4);
  const maxVal = Math.max(1, ...success, ...fail);
  const x = (i: number) => pad + i * slot + (slot - barW * 2) / 2;

  return (
    <div ref={containerRef} style={{ width: "100%" }}>
    <svg width={svgW} height={svgH} viewBox={`0 0 ${svgW} ${svgH}`} style={{ display: "block" }}>
      {[0, 1, 2, 3, 4].map((i) => (
        <line key={i} x1={0} x2={svgW} y1={h - (i / 4) * (h - pad)} y2={h - (i / 4) * (h - pad)} stroke={t.border} strokeWidth="1" />
      ))}
      {success.map((v, i) => (
        <rect key={`s${i}`} x={x(i)} y={h - (v / maxVal) * (h - pad)} width={barW} height={(v / maxVal) * (h - pad)} fill={t.success} opacity="0.7" rx="3" />
      ))}
      {fail.map((v, i) => (
        <rect key={`f${i}`} x={x(i) + barW} y={h - (v / maxVal) * (h - pad)} width={barW} height={(v / maxVal) * (h - pad)} fill={t.danger} opacity="0.7" rx="3" />
      ))}
      {labels.map((l, i) => (
        <text key={i} x={pad + i * slot + slot / 2} y={h + 16} textAnchor="middle" fontSize="10" fill={t.muted}>{l}</text>
      ))}
    </svg>
    </div>
  );
}