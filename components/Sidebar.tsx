"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";

import {
	LayoutDashboard,
	Rocket,
	Box,
	BarChart,
	AlertTriangle,
	FileText,
	Terminal,
	Settings
} from "lucide-react";

function NeonLogo() {
	return (
		<svg width="50" height="50" viewBox="0 0 24 24" fill="none" xmlns="http://w3.org" style={{ filter: "drop-shadow(0 0 5px rgba(56, 189, 248, 0.6))" }}>
			{/* Cubo Morado (Base/Fondo) */}
			<path d="M12 21L4 16.5V7.5L12 3L20 7.5V16.5L12 21Z" fill="#a855f7" fillOpacity="0.3" stroke="#a855f7" strokeWidth="1"/>
			
			{/* Cubo Azul (Superior/Frente) */}
			<path d="M12 15L6 11.5V6.5L12 3L18 6.5V11.5L12 15Z" fill="#00d9ff" stroke="#00d9ff" strokeWidth="1.5" style={{ filter: "drop-shadow(0 0 3px #00d9ff)" }}/>
			
			{/* Líneas de profundidad del cubo azul */}
			<path d="M12 3V15M6 6.5L12 10L18 6.5" stroke="#020617" strokeWidth="0.5" opacity="0.5"/>
		</svg>
	);
}

export default function Sidebar() {

	const pathname = usePathname();

const menu = [
  {
    icon: <LayoutDashboard />,
    text: "Dashboard",
    path: "/dashboard"
  },
  {
    icon: <Rocket />,
    text: "Applications",
    path: "/applications"
  },
  {
    icon: <Box />,
    text: "Deployments",
    path: "/deployments"
  },
  {
    icon: <BarChart />,
    text: "Metrics",
    path: "/metrics"
  },
  {
    icon: <AlertTriangle />,
    text: "Alerts",
    path: "/alerts"
  },
  {
    icon: <FileText />,
    text: "Logs",
    path: "/logs"
  },
  {
    icon: <Terminal />,
    text: "Terminal",
    path: "/terminal"
  },
  {
    icon: <Settings />,
    text: "Settings",
    path: "/settings"
  }
];
	return (
		<div
			style={{
				width: "250px",
				background: "var(--sidebar)",
				padding: "20px",
				display: "flex",
				flexDirection: "column",
				justifyContent: "space-between",
				borderRight: "1px solid var(--border)",
        backdropFilter: "blur(14px)",
			}}
		>
			{/* TOP */}
<div>
	<div style={{ 
		display: "flex", 
		alignItems: "center", 
		gap: "12px", 
		marginBottom: "30px" 
	}}>
		<NeonLogo />
		<h2 style={{
			margin: 0,
			fontSize: "20px",
			fontWeight: "bold",
			color: "var(--primary)",
      textShadow: "0 0 12px rgba(124,58,237,0.25)",
			letterSpacing: "0.5px"
		}}>
			DeployMetrics
		</h2>
	</div>

				<div style={{ marginTop: "30px", display: "flex", flexDirection: "column", gap: "15px" }}>
					{menu.map((item) => (
  				<MenuItem
  				  key={item.text}
  				  icon={item.icon}
  				  text={item.text}
  				  path={item.path}
  				  active={pathname === item.path}
  				/>
					))}
				</div>
			</div>

			{/* USER */}
			<div style={{
				display: "flex",
				alignItems: "center",
				gap: "10px",
				background: "var(--card)",
        padding: "12px",
        borderRadius: "16px",
        border: "1px solid var(--border)",
        boxShadow: "var(--shadow)",
        backdropFilter: "blur(12px)",
			}}>
				<img
					src="https://i.pravatar.cc/40"
					style={{ borderRadius: "50%" }}
				/>
				<div>
					<p style={{ margin: 0 }}>Giselle</p>
					<small style={{ color: "var(--muted)" }}>Administrator</small>
				</div>
			</div>
		</div>
	);
}



function MenuItem({ icon, text, path, active }: any) {
	const [isHovered, setIsHovered] = useState(false);

	return (
  <Link href={path} style={{ textDecoration: "none" }}>
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "10px 15px",
        cursor: "pointer",
        borderRadius: "8px",
        transition: "all 0.3s ease",

        background:
          active || isHovered
            ? "var(--active)"
            : "var(--hover)",

        borderLeft:
          active || isHovered
            ? "4px solid var(--secondary)"
            : "4px solid transparent",

        boxShadow:
          active || isHovered
          ? "var(--glow)"
            : "none",
      }}
    >
      {/* ICON */}
      <div
        style={{
          color: active || isHovered
                  ? "var(--secondary)"
                  : "var(--primary)",
          transition: "0.3s",
          display: "flex",
          alignItems: "center"
        }}
      >
        {icon}
      </div>

      {/* TEXT */}
      <span
        style={{
          fontSize: "14px",
          color: active || isHovered
                  ? "var(--menu-active)"
                  : "var(--menu-text)",
          transition: "0.3s",
          textShadow:
            active || isHovered
              ? "0 0 10px rgba(124,58,237,0.25)"
              : "none"
        }}
      >
        {text}
      </span>
    </div>
  </Link>
);
}