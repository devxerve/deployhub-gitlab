"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import ThemeToggle from "@/components/ThemeToggle";
import { signIn } from "next-auth/react";
import { Globe, Mail } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleLogin(e: any) {
    e.preventDefault();

    if (email === "admin" && password === "1234") {
      router.push("/dashboard");
    } else {
      alert("Usuario incorrecto");
    }
  }

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "var(--bg)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* THEME */}
      <div style={{ position: "absolute", top: 20, right: 20 }}>
        <ThemeToggle />
      </div>

      {/* BACKGROUND GLOW */}
      <div style={{
        position: "absolute",
        width: 400,
        height: 400,
        borderRadius: "50%",
        background: "rgba(168,85,247,0.15)",
        filter: "blur(120px)",
        top: -100,
        left: -100
      }} />

      <div style={{
        position: "absolute",
        width: 350,
        height: 350,
        borderRadius: "50%",
        background: "rgba(56,189,248,0.12)",
        filter: "blur(120px)",
        bottom: -120,
        right: -120
      }} />

      <form
        onSubmit={handleLogin}
        style={{
          background: "var(--card)",
          padding: "40px",
          borderRadius: "24px",
          width: "380px",
          border: "1px solid var(--border)",
          backdropFilter: "blur(16px)",
          boxShadow: "var(--shadow)",
        }}
      >
        {/* HEADER */}
        <h1 style={{ margin: 0 }}>DeployHub</h1>
        <p style={{ color: "var(--muted)", fontSize: 14 }}>
          Intelligent deployment monitoring platform
        </p>

        {/* OAUTH BUTTONS */}
        <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 10 }}>
        
          <button
  type="button"
  onClick={() => signIn("github")}
  style={btnOAuth}
	 onMouseEnter={(e) => {
    e.currentTarget.style.transform = "translateY(-2px)";
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.transform = "translateY(0)";
  }}
>
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.38.6.1.82-.26.82-.58 
    0-.28-.01-1.02-.02-2-3.34.72-4.04-1.61-4.04-1.61-.55-1.38-1.34-1.75-1.34-1.75
    -1.1-.75.08-.74.08-.74 1.21.09 1.84 1.25 1.84 1.25 1.08 1.85 2.83 1.32 3.52 1.01
    .11-.78.42-1.32.76-1.62-2.66-.3-5.47-1.33-5.47-5.93 
    0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23
    .96-.27 1.98-.4 3-.41 1.02.01 2.04.14 3 .41 2.28-1.55 3.29-1.23 3.29-1.23
    .66 1.66.24 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 
    0 4.61-2.81 5.62-5.49 5.92.43.37.81 1.1.81 2.22 
    0 1.6-.02 2.88-.02 3.27 0 .32.21.69.83.57C20.56 21.8 24 17.3 24 12
    24 5.37 18.63 0 12 0z"/>
  </svg>

  Continue with GitHub
</button>

          <button
  type="button"
  onClick={() => signIn("google")}
  style={btnOAuth}
	 onMouseEnter={(e) => {
    e.currentTarget.style.transform = "translateY(-2px)";
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.transform = "translateY(0)";
  }}
>
  <svg width="18" height="18" viewBox="0 0 48 48">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.36 1.53 7.83 2.81l5.77-5.77C34.64 3.2 29.8 1 24 1 14.64 1 6.73 6.8 3.69 14.98l6.91 5.37C12.1 13.3 17.62 9.5 24 9.5z"/>
    <path fill="#4285F4" d="M46.5 24.5c0-1.6-.14-3.13-.4-4.6H24v9h12.7c-.55 2.97-2.2 5.48-4.68 7.17l7.2 5.6C43.9 37.5 46.5 31.5 46.5 24.5z"/>
    <path fill="#FBBC05" d="M10.6 28.35a14.5 14.5 0 010-8.7l-6.91-5.37A23.97 23.97 0 001 24c0 3.93.94 7.65 2.69 10.72l6.91-5.37z"/>
    <path fill="#34A853" d="M24 47c6.48 0 11.92-2.14 15.89-5.83l-7.2-5.6c-2 1.35-4.56 2.15-8.69 2.15-6.38 0-11.9-3.8-13.84-9.85l-6.91 5.37C6.73 41.2 14.64 47 24 47z"/>
  </svg>

  Continue with Google
</button>

          <button
  type="button"
  onClick={() => signIn("42")}
  style={btnOAuth}
	 onMouseEnter={(e) => {
    e.currentTarget.style.transform = "translateY(-2px)";
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.transform = "translateY(0)";
  }}
>
  <img src="/42_logo.png" width="18"/>
  Continue with 42
</button>
        </div>

        {/* DIVIDER */}
        <div style={divider}>
          <div style={line} />
          <span style={{ color: "var(--muted)", fontSize: 12 }}>
            or continue with email
          </span>
          <div style={line} />
        </div>

        {/* INPUTS */}
        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={input}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={input}
        />

        <button type="submit" style={btnLogin}>
          Login
        </button>
      </form>
    </div>
  );
}

/* STYLES */
const btnOAuth = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "10px",
  padding: "12px",
  borderRadius: "12px",
  border: "1px solid var(--border)",
  background: "var(--card)",
  cursor: "pointer",
  transition: "all 0.2s ease",
  color: "var(--text)"
};

const input = {
  width: "100%",
  padding: "14px",
  marginTop: "15px",
  borderRadius: "12px",
  border: "1px solid var(--border)",
  background: "var(--input-bg)",
  color: "var(--text)",
  outline: "none"
};

const btnLogin = {
  width: "100%",
  marginTop: "20px",
  padding: "12px",
  background: "linear-gradient(135deg, #2563eb, #3b82f6)",
	boxShadow: "0 10px 30px rgba(15,23,42,0.2)",
  border: "none",
  borderRadius: "12px",
  color: "white",
  cursor: "pointer"
};

const divider = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  margin: "20px 0"
};

const line = {
  flex: 1,
  height: "1px",
  background: "var(--border)"
};