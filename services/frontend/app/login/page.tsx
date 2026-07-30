"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { Moon, Sun } from "lucide-react";

/* ─── GITHUB ICON ─── */
const GitHubIcon = ({ color }: { color: string }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill={color}>
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.38.6.1.82-.26.82-.58
    0-.28-.01-1.02-.02-2-3.34.72-4.04-1.61-4.04-1.61-.55-1.38-1.34-1.75-1.34-1.75
    -1.1-.75.08-.74.08-.74 1.21.09 1.84 1.25 1.84 1.25 1.08 1.85 2.83 1.32 3.52 1.01
    .11-.78.42-1.32.76-1.62-2.66-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22
    -.12-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23.96-.27 1.98-.4 3-.41 1.02.01 2.04.14
    3 .41 2.28-1.55 3.29-1.23 3.29-1.23.66 1.66.24 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22
    0 4.61-2.81 5.62-5.49 5.92.43.37.81 1.1.81 2.22 0 1.6-.02 2.88-.02 3.27 0 .32.21.69
    .83.57C20.56 21.8 24 17.3 24 12 24 5.37 18.63 0 12 0z" />
  </svg>
);

/* ─── GOOGLE ICON ─── */
const GoogleIcon = () => (
  <svg width="22" height="22" viewBox="0 0 48 48">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.36 1.53 7.83 2.81l5.77-5.77C34.64 3.2 29.8 1 24 1 14.64 1 6.73 6.8 3.69 14.98l6.91 5.37C12.1 13.3 17.62 9.5 24 9.5z" />
    <path fill="#4285F4" d="M46.5 24.5c0-1.6-.14-3.13-.4-4.6H24v9h12.7c-.55 2.97-2.2 5.48-4.68 7.17l7.2 5.6C43.9 37.5 46.5 31.5 46.5 24.5z" />
    <path fill="#FBBC05" d="M10.6 28.35a14.5 14.5 0 010-8.7l-6.91-5.37A23.97 23.97 0 001 24c0 3.93.94 7.65 2.69 10.72l6.91-5.37z" />
    <path fill="#34A853" d="M24 47c6.48 0 11.92-2.14 15.89-5.83l-7.2-5.6c-2 1.35-4.56 2.15-8.69 2.15-6.38 0-11.9-3.8-13.84-9.85l-6.91 5.37C6.73 41.2 14.64 47 24 47z" />
  </svg>
);

/* ─── 42 ICON ─── */
const FortyTwoIcon = ({ color }: { color: string }) => (
  <Image
    src="/42_logo.png"
    width={22}
    height={22}
    alt="42 School"
    style={{
      objectFit: "contain",
      filter: color === "#f1f5f9" ? "invert(1)" : "none",
    }}
  />
);

/* ─── BOLT ICON ─── */
const BoltIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
  </svg>
);

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isDark, setIsDark] = useState(true);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (email === "admin@deployhub.com" && password === "1234") {
      router.push("/dashboard");
    } else {
      alert("Usuario incorrecto");
    }
  }

  const t = isDark ? dark : light;

  return (
    <>
      <style>{fonts}</style>
      <div style={{ ...styles.page, background: t.pageBg, fontFamily: "'Space Grotesk', sans-serif" }}>

        {/* GRID */}
        <div style={{ ...styles.gridBg, backgroundImage: t.gridImg }} />

        {/* GLOWS */}
        <div style={{ ...styles.glow1, background: t.glow1 }} />
        <div style={{ ...styles.glow2, background: t.glow2 }} />

        {/* THEME TOGGLE */}
        <button
          onClick={() => setIsDark(!isDark)}
          style={{ ...styles.themeToggle, ...t.toggleStyle }}
        >
          {isDark ? (
            <>
              <Sun size={14} aria-hidden="true" />
              Light
            </>
              ) : (
            <>
              <Moon size={14} aria-hidden="true" />
              Dark
            </>
          )}
        </button>

        {/* CARD */}
        <form
          onSubmit={handleLogin}
          style={{ ...styles.card, ...t.cardStyle }}
        >
          {/* VERSION TAG */}
          <div style={{ ...styles.tag, ...t.tagStyle }}>v1.0.1</div>

          {/* LOGO */}
          <div style={styles.logoRow}>
            <div style={{ ...styles.logoIcon, background: t.logoIconBg }}>
              <BoltIcon />
            </div>
            <div style={{ ...styles.logoText, color: t.logoTextColor, fontFamily: "'JetBrains Mono', monospace" }}>
              Deploy<span style={{ color: t.accent }}>Hub</span>
            </div>
          </div>
          <div style={{ ...styles.subtitle, color: t.subtitleColor }}>
            Intelligent deployment monitoring platform
          </div>

          {/* OAUTH */}
          <div style={styles.oauthGrid}>
            {[
              { id: "github", label: "GitHub", icon: <GitHubIcon color={t.githubFill} /> },
              { id: "google", label: "Google", icon: <GoogleIcon /> },
              { id: "42-school", label: "42 Intra", icon: <FortyTwoIcon color={t.githubFill} /> },
            ].map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => signIn(p.id)}
                style={{ ...styles.oauthBtn, ...t.oauthBtnStyle }}
                onMouseEnter={(e) => {
                  Object.assign(e.currentTarget.style, t.oauthBtnHover);
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  Object.assign(e.currentTarget.style, t.oauthBtnStyle);
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                {p.icon}
                <span style={{ ...styles.btnLabel, color: t.oauthLabelColor }}>{p.label}</span>
              </button>
            ))}
          </div>

          {/* DIVIDER */}
          <div style={styles.divider}>
            <div style={{ ...styles.divLine, background: t.divLineColor }} />
            <span style={{ ...styles.divText, color: t.divTextColor }}>or email</span>
            <div style={{ ...styles.divLine, background: t.divLineColor }} />
          </div>

          {/* INPUTS */}
          <div style={styles.field}>
            <label style={{ ...styles.fieldLabel, color: t.labelColor }}>Email</label>
            <input
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ ...styles.input, ...t.inputStyle }}
              onFocus={(e) => Object.assign(e.currentTarget.style, t.inputFocus)}
              onBlur={(e) => Object.assign(e.currentTarget.style, t.inputStyle)}
            />
          </div>

          <div style={styles.field}>
            <label style={{ ...styles.fieldLabel, color: t.labelColor }}>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ ...styles.input, ...t.inputStyle }}
              onFocus={(e) => Object.assign(e.currentTarget.style, t.inputFocus)}
              onBlur={(e) => Object.assign(e.currentTarget.style, t.inputStyle)}
            />
          </div>

          <div style={styles.forgot}>
            <a href="#" style={{ ...styles.forgotLink, color: t.accent }}>Forgot password?</a>
          </div>

          <button
            type="submit"
            style={{ ...styles.btnLogin, background: t.btnLoginBg }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-1px)";
              e.currentTarget.style.boxShadow = t.btnLoginShadow;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            Sign in to DeployHub
          </button>

          <div style={{ ...styles.footerNote, color: t.footerColor }}>
            No account?{" "}
            <a href="#" style={{ color: t.accent, textDecoration: "none" }}>Request access</a>
          </div>
        </form>
      </div>
    </>
  );
}

/* ─── FONTS ─── */
const fonts = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');
`;

/* ─── BASE STYLES ─── */
const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
    padding: "40px 20px",
    transition: "background 0.4s",
  },
  gridBg: {
    position: "absolute",
    inset: 0,
    backgroundSize: "40px 40px",
    pointerEvents: "none",
  },
  glow1: {
    position: "absolute",
    width: 500,
    height: 500,
    borderRadius: "50%",
    top: -150,
    left: -150,
    pointerEvents: "none",
  },
  glow2: {
    position: "absolute",
    width: 400,
    height: 400,
    borderRadius: "50%",
    bottom: -100,
    right: -100,
    pointerEvents: "none",
  },
  themeToggle: {
    position: "absolute",
    top: 16,
    right: 16,
    zIndex: 10,
    display: "flex",
    alignItems: "center",
    gap: 6,
    borderRadius: 20,
    padding: "5px 12px",
    cursor: "pointer",
    fontSize: 12,
    fontFamily: "'Space Grotesk', sans-serif",
    fontWeight: 500,
    transition: "all 0.2s",
    border: "none",
  },
  card: {
    position: "relative",
    width: 400,
    borderRadius: 20,
    padding: 36,
    transition: "background 0.3s, border 0.3s, box-shadow 0.3s",
  },
  tag: {
    position: "absolute",
    top: 16,
    right: 16,
    borderRadius: 6,
    padding: "3px 8px",
    fontSize: 10,
    fontFamily: "'JetBrains Mono', monospace",
    letterSpacing: "0.5px",
  },
  logoRow: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginBottom: 6,
  },
  logoIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  logoText: {
    fontSize: 17,
    fontWeight: 500,
    letterSpacing: "-0.3px",
  },
  subtitle: {
    fontSize: 13,
    marginBottom: 28,
    fontWeight: 300,
    letterSpacing: "0.2px",
  },
  oauthGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: 8,
    marginBottom: 20,
  },
  oauthBtn: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    padding: "13px 8px",
    borderRadius: 12,
    cursor: "pointer",
    transition: "all 0.2s ease",
    fontFamily: "'Space Grotesk', sans-serif",
  },
  btnLabel: {
    fontSize: 11,
    fontWeight: 500,
    letterSpacing: "0.3px",
    textTransform: "uppercase" as const,
  },
  divider: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    margin: "20px 0",
  },
  divLine: {
    flex: 1,
    height: 1,
  },
  divText: {
    fontSize: 11,
    letterSpacing: "0.5px",
    textTransform: "uppercase" as const,
    fontWeight: 500,
    whiteSpace: "nowrap" as const,
  },
  field: {
    marginBottom: 12,
  },
  fieldLabel: {
    fontSize: 11,
    letterSpacing: "0.5px",
    textTransform: "uppercase" as const,
    fontWeight: 500,
    marginBottom: 6,
    display: "block",
  },
  input: {
    width: "100%",
    padding: "12px 14px",
    borderRadius: 10,
    fontSize: 14,
    fontFamily: "'Space Grotesk', sans-serif",
    outline: "none",
    transition: "all 0.2s ease",
    boxSizing: "border-box" as const,
  },
  forgot: {
    textAlign: "right" as const,
    marginTop: -4,
    marginBottom: 18,
  },
  forgotLink: {
    fontSize: 12,
    textDecoration: "none",
    opacity: 0.85,
  },
  btnLogin: {
    width: "100%",
    padding: 13,
    borderRadius: 10,
    border: "none",
    color: "white",
    fontSize: 14,
    fontWeight: 500,
    fontFamily: "'Space Grotesk', sans-serif",
    cursor: "pointer",
    transition: "all 0.2s ease",
    letterSpacing: "0.2px",
  },
  footerNote: {
    textAlign: "center" as const,
    marginTop: 20,
    fontSize: 12,
  },
};

/* ─── DARK THEME ─── */
const dark = {
  pageBg: "#020617",
  gridImg: "linear-gradient(rgba(59,130,246,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(59,130,246,0.05) 1px,transparent 1px)",
  glow1: "radial-gradient(circle,rgba(59,130,246,0.13) 0%,transparent 70%)",
  glow2: "radial-gradient(circle,rgba(37,99,235,0.09) 0%,transparent 70%)",
  accent: "#3b82f6",
  logoIconBg: "linear-gradient(135deg,#2563eb,#3b82f6)",
  logoTextColor: "#f1f5f9",
  subtitleColor: "#475569",
  githubFill: "#f1f5f9",
  oauthLabelColor: "#e2e8f0",
  labelColor: "#64748b",
  divLineColor: "rgba(148,163,184,0.12)",
  divTextColor: "#475569",
  footerColor: "#475569",
  btnLoginBg: "linear-gradient(135deg,#1d4ed8,#3b82f6)",
  btnLoginShadow: "0 8px 24px rgba(59,130,246,0.35)",
  cardStyle: {
    background: "rgba(11,18,32,0.97)",
    border: "1px solid rgba(59,130,246,0.18)",
    backdropFilter: "blur(24px)",
  } as React.CSSProperties,
  tagStyle: {
    background: "rgba(59,130,246,0.12)",
    border: "1px solid rgba(59,130,246,0.25)",
    color: "#3b82f6",
  } as React.CSSProperties,
  toggleStyle: {
    background: "rgba(30,41,59,0.9)",
    border: "1px solid rgba(148,163,184,0.2)",
    color: "#94a3b8",
  } as React.CSSProperties,
  oauthBtnStyle: {
    border: "1px solid rgba(148,163,184,0.22)",
    background: "rgba(30,41,59,0.9)",
  } as React.CSSProperties,
  oauthBtnHover: {
    border: "1px solid rgba(59,130,246,0.5)",
    background: "rgba(59,130,246,0.1)",
  } as React.CSSProperties,
  inputStyle: {
    border: "1px solid rgba(148,163,184,0.18)",
    background: "rgba(15,23,42,0.8)",
    color: "#f1f5f9",
  } as React.CSSProperties,
  inputFocus: {
    border: "1px solid rgba(59,130,246,0.5)",
    background: "rgba(15,23,42,1)",
    color: "#f1f5f9",
  } as React.CSSProperties,
};

/* ─── LIGHT THEME ─── */
const light = {
  pageBg: "linear-gradient(145deg,#e0f7f4 0%,#dbeafe 45%,#d1fae5 100%)",
  gridImg: "linear-gradient(rgba(6,182,212,0.07) 1px,transparent 1px),linear-gradient(90deg,rgba(6,182,212,0.07) 1px,transparent 1px)",
  glow1: "radial-gradient(circle,rgba(56,189,248,0.18) 0%,transparent 70%)",
  glow2: "radial-gradient(circle,rgba(52,211,153,0.15) 0%,transparent 70%)",
  accent: "#0891b2",
  logoIconBg: "linear-gradient(135deg,#0891b2,#06b6d4)",
  logoTextColor: "#0c4a6e",
  subtitleColor: "#0891b2",
  githubFill: "#0c4a6e",
  oauthLabelColor: "#0c4a6e",
  labelColor: "#0891b2",
  divLineColor: "rgba(6,182,212,0.18)",
  divTextColor: "#7dd3e8",
  footerColor: "#7dd3e8",
  btnLoginBg: "linear-gradient(135deg,#0369a1,#06b6d4)",
  btnLoginShadow: "0 8px 24px rgba(6,182,212,0.3)",
  cardStyle: {
    background: "rgba(255,255,255,0.68)",
    border: "1px solid rgba(6,182,212,0.2)",
    backdropFilter: "blur(20px)",
    boxShadow: "0 8px 40px rgba(6,182,212,0.12),0 2px 8px rgba(52,211,153,0.08)",
  } as React.CSSProperties,
  tagStyle: {
    background: "rgba(6,182,212,0.1)",
    border: "1px solid rgba(6,182,212,0.25)",
    color: "#0891b2",
  } as React.CSSProperties,
  toggleStyle: {
    background: "rgba(255,255,255,0.7)",
    border: "1px solid rgba(6,182,212,0.3)",
    color: "#0891b2",
  } as React.CSSProperties,
  oauthBtnStyle: {
    border: "1px solid rgba(6,182,212,0.25)",
    background: "rgba(255,255,255,0.7)",
  } as React.CSSProperties,
  oauthBtnHover: {
    border: "1px solid rgba(6,182,212,0.5)",
    background: "rgba(224,247,244,0.95)",
  } as React.CSSProperties,
  inputStyle: {
    border: "1px solid rgba(6,182,212,0.22)",
    background: "rgba(255,255,255,0.7)",
    color: "#0c4a6e",
  } as React.CSSProperties,
  inputFocus: {
    border: "1px solid rgba(6,182,212,0.55)",
    background: "rgba(255,255,255,0.95)",
    color: "#0c4a6e",
  } as React.CSSProperties,
};
