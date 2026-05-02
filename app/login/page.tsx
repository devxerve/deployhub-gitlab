"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import ThemeToggle from "@/components/ThemeToggle";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleLogin(e: any) {
    e.preventDefault();

    // luego conectarás backend para conectarlo
   /* if (email && password) {
      router.push("/dashboard");
    }*/
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
    <div
        style={{
        position: "absolute",
        top: "20px",
        right: "20px"
        }}
    >
  <ThemeToggle />
</div>
      <div
  style={{
    position: "absolute",
    width: "400px",
    height: "400px",
    borderRadius: "50%",
    background: "rgba(168,85,247,0.15)",
    filter: "blur(120px)",
    top: "-100px",
    left: "-100px"
  }}
/>

<div
  style={{
    position: "absolute",
    width: "350px",
    height: "350px",
    borderRadius: "50%",
    background: "rgba(56,189,248,0.12)",
    filter: "blur(120px)",
    bottom: "-120px",
    right: "-120px"
  }}
/>
      <form
        onSubmit={handleLogin}
        style={{
         background: "var(--card)",
        padding: "45px",
        borderRadius: "24px",
        width: "380px",
        border: "1px solid var(--border)",
        backdropFilter: "blur(16px)",
        boxShadow:
          "0 0 30px rgba(168,85,247,0.12)",
        animation: "fadeIn 0.5s ease",
        }}
      >
        <div style={{ marginBottom: "10px" }}>
          <h1
            style={{
              margin: 0,
              fontSize: "34px",
              fontWeight: "bold",
              color: "var(--text)",
              letterSpacing: "1px"
            }}
          >
            DeployMetrics
          </h1>
          
          <p
            style={{
              color: "var(--muted)",
              marginTop: "10px",
              fontSize: "14px"
            }}
          >
            Intelligent deployment monitoring platform
          </p>
        </div>

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
	          width: "100%",
	          padding: "14px",
	          marginTop: "20px",
	          borderRadius: "12px",
	          border: "1px solid var(--border)",
	          background: "var(--input-bg)",
	          color: "var(--text)",
	          outline: "none"
          }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
          	width: "100%",
          	padding: "14px",
          	marginTop: "20px",
          	borderRadius: "12px",
          	border: "1px solid var(--border)",
          	background: "var(--input-bg)",
          	color: "var(--text)",
          	outline: "none"
          }}
        />

        <button
          type="submit"
          style={{
            width: "100%",
            marginTop: "20px",
            padding: "12px",
            background: "linear-gradient(135deg, #7c3aed, #8b5cf6)",
            border: "none",
            borderRadius: "12px",
            fontWeight: "bold",
            cursor: "pointer",
            boxShadow:"0 10px 30px rgba(124,58,237,0.35)",
            transition: "0.3s ease",
            color: "white"
          }}
        >
          Login
        </button>
      </form>
    </div>
  );
}