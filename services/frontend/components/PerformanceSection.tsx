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
			{ }
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

			{ }
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
				{ }
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

				{ }
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
						boxShadow: "var(--shadow)"
					}}
				>
					<option>Last Deploy</option>
					<option>Last 24h</option>
					<option>Last 7 Days</option>
				</select>
			</div>

			{ }
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
				{ }
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
							boxShadow: "var(--shadow)"
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

				{ }
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
							boxShadow: "var(--shadow)"
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

			{ }
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

			{ }
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