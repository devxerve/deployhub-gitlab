import { Bell, Menu } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

export default function TopBar() {
	return (
		<div
			style={{
				display: "flex",
				justifyContent: "space-between",
				alignItems: "center",
				flexWrap: "wrap",
				gap: "15px",
				marginBottom: "20px",
				background: "var(--card)",
				borderRadius: "20px",
				border: "1px solid var(--border)",
				backdropFilter: "blur(16px)",
				boxShadow: "var(--shadow)",
				padding: "18px 22px",
			}}
		>
			{/* LEFT */}
			<div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
				<Menu
					size={22}
					color="var(--primary)"
				/>

				<input
					placeholder="Search deployments, logs, metrics..."
					style={{
						width: "320px",
						background: "var(--hover)",
						border: "1px solid var(--border)",
						color: "var(--text)",
						padding: "12px 16px",
						borderRadius: "12px",
						outline: "none",
						fontSize: "14px",
						transition: "0.3s ease"
					}}
				/>
			</div>

			{/* RIGHT */}
			<div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
				<div
					style={{
						background: "var(--hover)",
						border: "1px solid var(--border)",
						width: "42px",
						height: "42px",
						borderRadius: "12px",
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						cursor: "pointer"
					}}
				>
					<Bell
						size={18}
						color="var(--primary)"
					/>
			</div>

				<div style={{
					display: "flex",
					alignItems: "center",
					gap: "10px",
					background: "var(--hover)",
					padding: "8px 14px",
					borderRadius: "14px",
					border: "1px solid var(--border)",
					backdropFilter: "blur(10px)",
				}}>
					<img
						src="https://i.pravatar.cc/30"
						style={{ borderRadius: "50%" }}
					/>
					<ThemeToggle />
					<span
						style={{
							color: "var(--text)",
							fontWeight: 500,
							fontSize: "14px"
							}}
						>
						DeployHub Team
					</span>					
				</div>
			</div>
		</div>
	);
}