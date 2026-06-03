"use client";

import React from "react";
import type { Theme } from "@/lib/themes";

/* ─── SPARKLINE ──────────────────────────────────────────────────────────── */
export function Sparkline({
  data, color, h = 28, w = 80,
}: { data: number[]; color: string; h?: number; w?: number }) {
  const min = Math.min(...data), max = Math.max(...data), rng = max - min || 1;
  const pts = data
    .map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / rng) * (h - 4) - 2}`)
    .join(" ");
  return (
    <svg width={w} height={h} style={{ display: "block" }}>
      <polyline fill="none" stroke={color} strokeWidth="2" points={pts} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ─── PROGRESS BAR ───────────────────────────────────────────────────────── */
export function Bar({ pct, color, h = 6 }: { pct: number; color: string; h?: number }) {
  return (
    <div style={{ background: "rgba(148,163,184,0.12)", borderRadius: 999, height: h, overflow: "hidden", width: "100%" }}>
      <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: 999, transition: "width 0.6s" }} />
    </div>
  );
}

/* ─── BADGE ──────────────────────────────────────────────────────────────── */
export function Badge({ label, color }: { label: string; color: string }) {
  return (
    <span style={{
      padding: "3px 10px", borderRadius: 999,
      background: `${color}22`, color, fontSize: 11, fontWeight: 700,
      border: `1px solid ${color}33`, letterSpacing: "0.3px",
    }}>
      {label}
    </span>
  );
}

/* ─── CARD ───────────────────────────────────────────────────────────────── */
export function Card({
  t, children, style, onClick, onMouseEnter, onMouseLeave,
}: {
  t: Theme; children: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  onMouseEnter?: React.MouseEventHandler<HTMLDivElement>;
  onMouseLeave?: React.MouseEventHandler<HTMLDivElement>;
}) {
  return (
    <div
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{
        background: t.card, border: `1px solid ${t.border}`,
        borderRadius: 20, padding: 24,
        backdropFilter: "blur(16px)", boxShadow: t.shadow, ...style,
      }}
    >
      {children}
    </div>
  );
}

/* ─── MODAL ──────────────────────────────────────────────────────────────── */
export function Modal({
  t, title, onClose, children,
}: { t: Theme; title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div
      style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)",
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 1000, padding: 20,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: t.card, border: `1px solid ${t.border}`, borderRadius: 20,
          padding: 28, width: "100%", maxWidth: 460,
          backdropFilter: "blur(24px)", boxShadow: t.shadow,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h3 style={{ margin: 0, color: t.text, fontSize: 16, fontWeight: 700 }}>{title}</h3>
          <button
            onClick={onClose}
            style={{ width: 30, height: 30, borderRadius: 8, background: t.hover, border: `1px solid ${t.border}`, color: t.muted, cursor: "pointer", fontSize: 14 }}
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

/* ─── BUTTON ─────────────────────────────────────────────────────────────── */
type BtnVariant = "primary" | "secondary" | "danger" | "ghost";
export function Btn({
  t, children, onClick, variant = "primary", style = {}, disabled = false,
}: {
  t: Theme; children: React.ReactNode; onClick?: () => void;
  variant?: BtnVariant; style?: React.CSSProperties; disabled?: boolean;
}) {
  const vars: Record<BtnVariant, React.CSSProperties> = {
    primary:   { background: "linear-gradient(135deg,#1d4ed8,#3b82f6)", border: "none", color: "white" },
    secondary: { background: t.hover, border: `1px solid ${t.border}`, color: t.text },
    danger:    { background: `${t.danger}15`, border: `1px solid ${t.danger}40`, color: t.danger },
    ghost:     { background: "transparent", border: `1px solid ${t.border}`, color: t.muted },
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: "9px 16px", borderRadius: 10, fontSize: 13, fontWeight: 600,
        cursor: disabled ? "not-allowed" : "pointer", transition: "all 0.2s",
        opacity: disabled ? 0.6 : 1, fontFamily: "inherit",
        ...vars[variant], ...style,
      }}
    >
      {children}
    </button>
  );
}

/* ─── TEXT INPUT ─────────────────────────────────────────────────────────── */
export function TextInput({
  t, value, onChange, placeholder, type = "text", style = {},
}: {
  t: Theme; value: string; onChange: (v: string) => void;
  placeholder?: string; type?: string; style?: React.CSSProperties;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      style={{
        width: "100%", padding: "10px 12px", borderRadius: 8,
        border: `1px solid ${t.border}`, background: t.inputBg, color: t.text,
        fontSize: 13, outline: "none", boxSizing: "border-box",
        fontFamily: "inherit", ...style,
      }}
      onFocus={(e) => { e.target.style.borderColor = t.accent; }}
      onBlur={(e)  => { e.target.style.borderColor = t.border; }}
    />
  );
}

/* ─── SECTION HEADER ─────────────────────────────────────────────────────── */
export function SectionHeader({
  t, title, subtitle, action,
}: { t: Theme; title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
      <div>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: t.text }}>{title}</h2>
        {subtitle && <p style={{ margin: "4px 0 0", fontSize: 13, color: t.muted }}>{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

/* ─── STATUS DOT BADGE ───────────────────────────────────────────────────── */
export function StatusBadge({ label, color }: { label: string; color: string }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      padding: "3px 10px", borderRadius: 999,
      background: `${color}18`, color, fontSize: 11, fontWeight: 700,
      border: `1px solid ${color}33`,
    }}>
      <span style={{ width: 5, height: 5, borderRadius: "50%", background: color, boxShadow: `0 0 4px ${color}` }} />
      {label}
    </span>
  );
}