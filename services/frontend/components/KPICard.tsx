"use client";

import type { ReactNode } from "react";
import { ArrowUp, ArrowDown } from "lucide-react";

interface KPICardProps {
  title: string;
  value: number;
  color: string;
  trend: "up" | "down";
  percent: number;
  icon: ReactNode;
}

export default function KPICard({
  title,
  value,
  color,
  trend,
  percent,
  icon,
}: KPICardProps) {
	const radius = 38;
	const stroke = 6;
	const normalizedRadius = radius - stroke;
	const circumference = normalizedRadius * 2 * Math.PI;
	const offset = circumference - (value / 100) * circumference;
	const gradientId =
  title.replace(/\s+/g, "").toLowerCase();
	return (
		<div
			style={{
				flex: 1,
				minWidth: "220px",
				background: "var(--card)",
				padding: "22px",
				borderRadius: "22px",
				backdropFilter: "blur(16px)",
				border: "1px solid var(--border)",
				boxShadow: `
				  0 10px 35px rgba(15,23,42,0.15),
				  0 0 18px ${color}18
					`,
				transition: "0.3s",
				transform: "translateY(0px) scale(1)",
				animation: "fadeIn 0.6s ease",
			}}
			onMouseEnter={(e) => {
	e.currentTarget.style.transform = "translateY(-4px) scale(1.02)";
}}
onMouseLeave={(e) => {
	e.currentTarget.style.transform = "translateY(0px) scale(1)";
}}
		>
			{/* TOP */}
			<div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
				<div
					style={{
						background: `${color}22`,
						width: "42px",
						height: "42px",
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						borderRadius: "14px",
						border: `1px solid ${color}33`,
						boxShadow: "0 10px 20px rgba(15,23,42,0.15)"
					}}
					
				>
					{icon}
				</div>
				<span
				  style={{
				    color: "var(--muted)",
				    fontSize: "14px",
				    fontWeight: 500,
				    letterSpacing: "0.3px"
				  }}
				>
				  {title}
				</span>
			</div>

			{/* MINI GRAPH */}
			<div style={{ marginTop: "10px" }}>
				<svg width="100%" height="40">
					<defs>
					  <linearGradient
						  id={`gradient-${gradientId}`}
						  x1="0"
						  y1="0"
						  x2="0"
						  y2="1"
						>
					    <stop offset="0%" stopColor={color} stopOpacity="0.2" />
					    <stop offset="100%" stopColor={color} stopOpacity="0" />
					  </linearGradient>
					</defs>
					<path
					  d="
					    M0 30
					    L20 25
					    L40 28
					    L60 18
					    L80 22
					    L100 10
					    L120 15
					    L140 12
					    L140 40
					    L0 40
					    Z
					  "
					  fill={`url(#gradient-${gradientId})`}
					/>
					<polyline
						fill="none"
						stroke={color}
						strokeWidth="3"
						points="0,30 20,25 40,28 60,18 80,22 100,10 120,15 140,12"
						style={{
							filter: `drop-shadow(0 0 6px ${color})`
						}}
					/>
				</svg>
			</div>

			{/* CIRCLE */}
			<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
				<svg height={90} width={90}>
					<circle
						stroke="rgba(148,163,184,0.15)"
						fill="transparent"
						strokeWidth={stroke}
						r={normalizedRadius}
						cx="45"
						cy="45"
					/>

					<circle
						stroke={color}
						fill="transparent"
						strokeWidth={stroke}
						strokeDasharray={`${circumference} ${circumference}`}
						style={{
							strokeDashoffset: offset,
							transition: "all 0.8s ease",
							strokeLinecap: "round",
							filter: `drop-shadow(0 0 6px ${color})`
						}}
						r={normalizedRadius}
						cx="45"
						cy="45"
					/>
				</svg>

				<div
					  style={{
					    fontSize: "30px",
					    fontWeight: "bold",
					    color,
					    textShadow: `0 0 12px ${color}55`
					  }}
					>
				</div>
			</div>

			{/* TREND */}
			<div style={{ marginTop: "16px", display: "flex", alignItems: "center", gap: "5px" }}>
				{trend === "up" ? (
					<ArrowUp size={16} color={color} />
				) : (
					<ArrowDown size={16} color={color} />
				)}
				<span
					  style={{
					    color,
					    fontWeight: 600,
					    fontSize: "13px"
					  }}
					>
					{percent}% vs last deploy
				</span>
			</div>
		</div>
	);
}