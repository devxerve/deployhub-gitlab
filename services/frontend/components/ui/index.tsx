"use client";

import React from "react";
import { ChevronDown, X } from "lucide-react";
import type { Theme } from "@/lib/themes";


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


export function Bar({ pct, color, h = 6 }: { pct: number; color: string; h?: number }) {
  return (
    <div style={{ background: "rgba(148,163,184,0.12)", borderRadius: 999, height: h, overflow: "hidden", width: "100%" }}>
      <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: 999, transition: "width 0.6s" }} />
    </div>
  );
}


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
            aria-label="Close modal"
            style={{ width: 30, height: 30, borderRadius: 8, background: t.hover, border: `1px solid ${t.border}`, color: t.muted, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            <X size={14} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}


export function ConfirmDialog({
  t, title, message, confirmLabel, cancelLabel, onConfirm, onCancel, danger = true,
}: {
  t: Theme;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
  danger?: boolean;
}) {
  return (
    <Modal t={t} title={title} onClose={onCancel}>
      <p style={{ margin: "0 0 22px", color: t.muted, fontSize: 13.5, lineHeight: 1.6 }}>{message}</p>
      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
        <Btn t={t} variant="ghost" onClick={onCancel}>{cancelLabel}</Btn>
        <Btn t={t} variant={danger ? "danger" : "primary"} onClick={onConfirm}>{confirmLabel}</Btn>
      </div>
    </Modal>
  );
}


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


export function Select({
  t, value, onChange, options, placeholder, icon, disabled = false, style = {},
}: {
  t: Theme; value: string; onChange: (v: string) => void;
  options: { value: string; label: string }[]; placeholder?: string;
  icon?: React.ReactNode; disabled?: boolean; style?: React.CSSProperties;
}) {
  return (
    <div style={{ position: "relative", ...style }}>
      {icon && (
        <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", display: "flex", color: t.accent, pointerEvents: "none" }}>
          {icon}
        </span>
      )}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        style={{
          width: "100%", padding: `10px 34px 10px ${icon ? 36 : 12}px`, borderRadius: 10,
          border: `1px solid ${t.border}`, background: t.inputBg, color: t.text,
          fontSize: 13, fontWeight: 600, outline: "none", boxSizing: "border-box",
          fontFamily: "inherit", cursor: disabled ? "not-allowed" : "pointer",
          opacity: disabled ? 0.6 : 1, appearance: "none", WebkitAppearance: "none", MozAppearance: "none",
          transition: "border-color 0.2s",
        }}
        onFocus={(e) => { e.target.style.borderColor = t.accent; }}
        onBlur={(e)  => { e.target.style.borderColor = t.border; }}
      >
        {placeholder && <option value="" disabled>{placeholder}</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
      <ChevronDown size={15} style={{ position: "absolute", right: 11, top: "50%", transform: "translateY(-50%)", color: t.muted, pointerEvents: "none" }} />
    </div>
  );
}


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