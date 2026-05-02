import PerformanceChart from "./PerformanceChart";
import ComparisonCard from "./ComparisonCard";

export default function PerformanceSection() {
	return (
		<div
			style={{
				flex: 2,
				background: "var(--card)",
				padding: "24px",
				borderRadius: "24px",
				border: "1px solid var(--border)",
				backdropFilter: "blur(16px)",
				boxShadow: "var(--shadow)",
				position: "relative",
				overflow: "hidden"
			}}
		>
			{/* BACKGROUND GLOW */}
			<div
				style={{
					position: "absolute",
					top: "-100px",
					right: "-100px",
					width: "240px",
					height: "240px",
					background:
						"radial-gradient(circle, rgba(124,58,237,0.12), transparent 70%)",
					filter: "blur(50px)"
				}}
			/>

			{/* HEADER */}
			<div
				style={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
					marginBottom: "24px",
					position: "relative",
					zIndex: 1
				}}
			>
				{/* TITLE */}
				<div>
					<h2
						style={{
							margin: 0,
							fontSize: "22px",
							fontWeight: "700",
							color: "var(--text)"
						}}
					>
						Performance Overview
					</h2>

					<p
						style={{
							marginTop: "6px",
							color: "var(--muted)",
							fontSize: "14px"
						}}
					>
						Infrastructure performance before and after deployment
					</p>
				</div>

				{/* FILTER */}
				<select
					style={{
						background: "var(--sidebar)",
						color: "var(--text)",
						border: "1px solid var(--border)",
						padding: "10px 14px",
						borderRadius: "12px",
						outline: "none",
						fontSize: "14px",
						cursor: "pointer",
						transition: "0.3s",
						boxShadow: "0 4px 12px rgba(15,23,42,0.04)"
					}}
				>
					<option>Last Deploy</option>
					<option>Last 24h</option>
					<option>Last 7 Days</option>
				</select>
			</div>

			{/* LEGEND */}
			<div
				style={{
					display: "flex",
					gap: "24px",
					alignItems: "center",
					marginBottom: "20px",
					position: "relative",
					zIndex: 1
				}}
			>
				{/* BEFORE */}
				<div
					style={{
						display: "flex",
						alignItems: "center",
						gap: "10px"
					}}
				>
					<div
						style={{
							width: "12px",
							height: "12px",
							borderRadius: "50%",
							background: "#3b82f6",
							boxShadow: "0 0 10px #3b82f6"
						}}
					/>

					<span
						style={{
							color: "var(--muted)",
							fontSize: "14px"
						}}
					>
						Before Deploy
					</span>
				</div>

				{/* AFTER */}
				<div
					style={{
						display: "flex",
						alignItems: "center",
						gap: "10px"
					}}
				>
					<div
						style={{
							width: "12px",
							height: "12px",
							borderRadius: "50%",
							background: "#f43f5e",
							boxShadow: "0 0 10px #f43f5e"
						}}
					/>

					<span
						style={{
							color: "var(--muted)",
							fontSize: "14px"
						}}
					>
						After Deploy
					</span>
				</div>
			</div>

			{/* CHART */}
			<div
				style={{
					background: "rgba(255,255,255,0.02)",
					border: "1px solid var(--border)",
					borderRadius: "18px",
					padding: "16px",
					position: "relative",
					zIndex: 1
				}}
			>
				<PerformanceChart />
			</div>

			{/* COMPARISON CARDS */}
			<div
				style={{
					display: "grid",
					gridTemplateColumns: "repeat(4, 1fr)",
					gap: "16px",
					marginTop: "24px",
					position: "relative",
					zIndex: 1
				}}
			>
				<ComparisonCard
					title="CPU"
					before={30}
					after={78}
				/>

				<ComparisonCard
					title="Memory"
					before={80}
					after={62}
				/>

				<ComparisonCard
					title="Disk"
					before={33}
					after={33}
				/>

				<ComparisonCard
					title="Network"
					before={15}
					after={32}
				/>
			</div>
		</div>
	);
}