"use client";
import { usePathname } from "next/navigation";
import Image from "next/image";

import {
  Bell,
  Menu,
  Search,
  Sparkles
} from "lucide-react";

import ThemeToggle from "./ThemeToggle";



export default function TopBar() {
	const pathname = usePathname();

const titles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/applications": "Applications",
  "/deployments": "Deployments",
  "/metrics": "Metrics",
  "/alerts": "Alerts",
  "/logs": "Logs",
  "/terminal": "Terminal",
  "/settings": "Settings",
};

const title = titles[pathname] || "Dashboard";
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",

        marginBottom: "24px",

        padding: "18px 22px",

        background: "var(--card)",

        border: "1px solid var(--border)",

        borderRadius: "22px",

        backdropFilter: "blur(16px)",

        boxShadow: "var(--shadow)"
      }}
    >
      {/* LEFT */}
     <div
  style={{
    display: "flex",
    alignItems: "center",
    gap: "18px"
  }}
>
  {/* MENU */}
  <div
    style={{
      width: "42px",
      height: "42px",
      borderRadius: "12px",
      background: "transparent",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      border: "1px solid var(--border)",
      cursor: "pointer",
    }}
  >
    <Menu size={18} color="var(--text)" />
  </div>

  {/* NUEVO BLOQUE (TÍTULO) */}
  <div>
    <h1
      style={{
        margin: 0,
        fontSize: "20px",
        fontWeight: 600,
        color: "var(--text)",
      }}
    >
      {title}
    </h1>

    <span
      style={{
        fontSize: "12px",
        color: "var(--muted)"
      }}
    >
      Manage your infrastructure
    </span>
  </div>

  {/* SEARCH */}
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: "12px",
      background: "var(--input-bg)",
      border: "1px solid var(--border)",
      borderRadius: "14px",
      padding: "12px 16px",
      width: "280px"
    }}
  >
    <Search size={18} color="var(--muted)" />

          <input
            placeholder="Search deployments, metrics..."
			onFocus={(e) =>
  (e.currentTarget.parentElement!.style.border =
    "1px solid var(--primary)")
}
onBlur={(e) =>
  (e.currentTarget.parentElement!.style.border =
    "1px solid var(--border)")
}
            style={{
              border: "none",
              outline: "none",
              background: "transparent",

              width: "100%",

              color: "var(--text)",

              fontSize: "14px",
			  
            }}
          />
        </div>
      </div>

      {/* RIGHT */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "14px"
        }}
      >
        {/* AI STATUS */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",

            padding: "10px 14px",

            background: "var(--hover)",

            borderRadius: "12px",

            border: "1px solid var(--border)"
          }}
        >
          <Sparkles
            size={16}
            color="var(--secondary)"
          />

          <span
            style={{
              fontSize: "13px",
              color: "var(--text)",
              fontWeight: 500
            }}
          >
            AI Monitoring Active
          </span>
        </div>

        {/* NOTIFICATION */}
        <div
          style={{
            width: "42px",
            height: "42px",

            borderRadius: "12px",

            background: "var(--hover)",

            border: "1px solid var(--border)",

            display: "flex",
            justifyContent: "center",
            alignItems: "center",

            position: "relative",

            cursor: "pointer"
          }}
        >
          <Bell size={18} color="var(--text)" />

          {/* DOT */}
          <div
            style={{
              position: "absolute",
              top: "10px",
              right: "10px",

              width: "8px",
              height: "8px",

              borderRadius: "50%",

              background: "#ef4444",

              boxShadow: "0 0 10px #ef4444"
            }}
          />
        </div>

        {/* PROFILE */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",

            background: "var(--hover)",

            border: "1px solid var(--border)",

            padding: "8px 14px",

            borderRadius: "14px"
          }}
        >
          <Image
            src="https://i.pravatar.cc/40"
            width={40}
            height={40}
            alt="DeployHub team profile"
            style={{
              borderRadius: "50%",
              border: "2px solid var(--primary)",
            }}
          />

          <div>
            <div
              style={{
                fontSize: "14px",
                fontWeight: 600,
                color: "var(--text)"
              }}
            >
              DeployHub
            </div>

            <div
              style={{
                fontSize: "12px",
                color: "var(--muted)"
              }}
            >
              Production Team
            </div>
          </div>

          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}