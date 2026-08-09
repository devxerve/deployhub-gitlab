"use client";

import { useEffect, useState } from "react";
import type { Theme } from "@/lib/themes";
import { logColor } from "@/lib/themes";
import { getLogs, type LogEntry } from "@/lib/api";
import { Card } from "@/components/ui";
import { Download, Search } from "lucide-react";
import { useTranslation } from "@/lib/i18n/context";

export function LogsModule({ t }: { t: Theme }) {
  const { t: tr } = useTranslation();
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]  = useState("");
  const [filter, setFilter]  = useState("ALL");
  const [page, setPage]      = useState(1);
  const PER_PAGE = 8;

  useEffect(() => {
    let cancelled = false;

    function load() {
      getLogs()
        .then((fresh) => { if (!cancelled) setLogs(fresh); })
        .catch(() => undefined)
        .finally(() => { if (!cancelled) setLoading(false); });
    }

    load();
    const interval = window.setInterval(load, 8000);
    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, []);

  const allLogs = logs.map((l, i) => ({ ...l, id: i }));

  const filtered = allLogs.filter((l) => {
    const q = search.toLowerCase();
    return (l.msg.toLowerCase().includes(q) || l.app.toLowerCase().includes(q))
      && (filter === "ALL" || l.level === filter);
  });

  const total     = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  function exportLogs() {
    const csv = ["Timestamp,Level,App,Message", ...filtered.map((l) => `${l.ts},${l.level},${l.app},"${l.msg}"`)].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "deployhub-logs.csv";
    a.click();
  }

  return (
    <div>
      <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
        <div
          style={{
            position: "relative",
            flex: 1,
            minWidth: 200,
          }}
        >
          <Search
            size={16}
            aria-hidden="true"
            style={{
              position: "absolute",
              left: 13,
              top: "50%",
              transform: "translateY(-50%)",
              color: t.muted,
              pointerEvents: "none",
            }}
          />

          <input
            id="logs-search"
            name="logs-search"
            autoComplete="off"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder={tr("logs.searchPlaceholder")}
            aria-label={tr("logs.searchAriaLabel")}
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: "10px 14px 10px 39px",
              borderRadius: 10,
              border: `1px solid ${t.border}`,
              background: t.inputBg,
              color: t.text,
              fontSize: 13,
              outline: "none",
              fontFamily: "inherit",
            }}
          />
        </div>
        {["ALL", "INFO", "WARN", "ERROR"].map((lv) => (
          <button key={lv} onClick={() => { setFilter(lv); setPage(1); }} style={{
            padding: "10px 14px", borderRadius: 10, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
            background: filter === lv ? (lv === "ERROR" ? "rgba(239,68,68,0.15)" : lv === "WARN" ? "rgba(250,204,21,0.12)" : t.accentSoft) : "transparent",
            border: filter === lv ? `1px solid ${lv === "ERROR" ? "rgba(239,68,68,0.4)" : lv === "WARN" ? "rgba(250,204,21,0.35)" : t.accentBorder}` : `1px solid ${t.border}`,
            color: filter === lv ? (lv === "ERROR" ? t.danger : lv === "WARN" ? t.warning : t.accent) : t.muted,
            transition: "all 0.2s",
          }}>
            {lv === "ALL" ? tr("logs.filterAll") : lv}
          </button>
        ))}
        <button
          onClick={exportLogs}
          style={{
            padding: "10px 14px",
            borderRadius: 10,
            background: t.hover,
            border: `1px solid ${t.border}`,
            color: t.text,
            fontSize: 12,
            cursor: "pointer",
            fontFamily: "inherit",
            display: "inline-flex",
            alignItems: "center",
            gap: 7,
          }}
        >
          <Download size={14} aria-hidden="true" />
          {tr("logs.exportCsv")}
        </button>
              </div>
        
              <Card t={t}>
                {loading && (
                  <div style={{ padding: 24, textAlign: "center", color: t.muted, fontSize: 13 }}>{tr("logs.loading")}</div>
                )}
                {!loading && filtered.length === 0 && (
                  <div style={{ padding: 24, textAlign: "center", color: t.muted, fontSize: 13 }}>{tr("logs.empty")}</div>
                )}
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12 }}>
                  {paginated.map((l) => {
                    const c = logColor(t, l.level);
                    return (
                      <div key={l.id}
                        style={{ display: "grid", gridTemplateColumns: "160px 54px 160px 1fr", gap: 8, alignItems: "center", padding: "8px 4px", borderBottom: `1px solid ${t.border}`, transition: "background 0.2s" }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = t.hover; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}>
                        <span style={{ color: t.muted, fontSize: 11 }}>{l.ts}</span>
                        <span style={{ padding: "2px 7px", borderRadius: 4, background: `${c}22`, color: c, fontSize: 10, fontWeight: 700, textAlign: "center" }}>{l.level}</span>
                        <span style={{ color: t.accent, fontSize: 11 }}>{l.app}</span>
                        <span style={{ color: t.text, fontSize: 12 }}>{l.msg}</span>
                      </div>
                    );
                  })}
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 16, paddingTop: 12, borderTop: `1px solid ${t.border}` }}>
          <span style={{ fontSize: 12, color: t.muted }}>
            {tr("logs.showing", { from: (page - 1) * PER_PAGE + 1, to: Math.min(page * PER_PAGE, filtered.length), total: filtered.length })}
          </span>
          <div style={{ display: "flex", gap: 6 }}>
            {Array.from({ length: Math.min(total, 5) }, (_, i) => i + 1).map((p) => (
              <button key={p} onClick={() => setPage(p)} style={{
                width: 30, height: 30, borderRadius: 8,
                background: page === p ? t.accentSoft : "transparent",
                border: page === p ? `1px solid ${t.accentBorder}` : `1px solid ${t.border}`,
                color: page === p ? t.accent : t.muted, fontSize: 12, cursor: "pointer", fontFamily: "inherit",
              }}>
                {p}
              </button>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}