import { createPortal } from "react-dom";
import type { Player } from "../types/game";
import { CardImage } from "./CardStack";
import { PlayerAvatar } from "./PlayerArea";

const RANK_MEDAL = ["", "🥇", "🥈", "🥉"];

function rankPlayers(players: Player[]): Array<Player & { rank: number }> {
	const sorted = [...players].sort((a, b) => {
		if (b.score !== a.score) return b.score - a.score;
		return b.summonedCards.length - a.summonedCards.length;
	});

	const ranked: Array<Player & { rank: number }> = [];
	for (let i = 0; i < sorted.length; i++) {
		const p = sorted[i];
		let rank: number;
		if (i === 0) {
			rank = 1;
		} else {
			const prev = ranked[i - 1];
			const sameAsPrev =
				prev.score === p.score &&
				prev.summonedCards.length === p.summonedCards.length;
			rank = sameAsPrev ? prev.rank : i + 1;
		}
		ranked.push({ ...p, rank });
	}
	return ranked;
}

interface GameOverModalProps {
	players: Player[];
	onClose: () => void;
}

export function GameOverModal({ players, onClose }: GameOverModalProps) {
	const ranked = rankPlayers(players);

	return createPortal(
		<div
			className="fixed inset-0 z-50 flex items-center justify-center p-4"
			onClick={onClose}
		>
			<div className="absolute inset-0 bg-black/75 backdrop-blur-sm" />
			<div
				className="relative bg-slate-900 border border-slate-600/80 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
				onClick={(e) => e.stopPropagation()}
			>
				{/* Header */}
				<div className="px-6 py-4 border-b border-slate-700/60 flex items-center justify-between">
					<h2 className="text-white font-bold text-lg">Game Over</h2>
					<button
						onClick={onClose}
						className="text-slate-400 hover:text-white transition-colors cursor-pointer"
					>
						<i className="fa-solid fa-xmark" />
					</button>
				</div>

				{/* Rankings */}
				<div className="px-6 py-4 flex flex-col gap-3">
					{ranked.map((p) => {
						const medal = RANK_MEDAL[p.rank] ?? `#${p.rank}`;
						const rankLabel =
							p.rank === 1
								? "1st"
								: p.rank === 2
									? "2nd"
									: p.rank === 3
										? "3rd"
										: `${p.rank}th`;

						return (
							<div
								key={p.id}
								className="bg-slate-800/60 border border-slate-700/50 rounded-lg p-4"
							>
								{/* Top row: rank + avatar + name + score */}
								<div className="flex items-center gap-3 mb-3">
									<span className="text-xl w-5 text-center flex-shrink-0">
										{medal}
									</span>
									<span className="text-slate-300 text-xs uppercase tracking-wider flex-shrink-0">
										{rankLabel}
									</span>
									<PlayerAvatar color={p.color} size={28} />
									<span className="text-white font-semibold text-sm flex-1 truncate">
										{p.username}
									</span>
									<div className="text-right flex-shrink-0">
										<span className="text-yellow-300 font-bold text-lg">
											{p.score}
										</span>
										<span className="text-slate-400 text-xs ml-1">pts</span>
									</div>
								</div>

								{/* Summoned cards */}
								<div>
									<span className="text-slate-500 text-[10px] uppercase tracking-wider block mb-2">
										Summoned ({p.summonedCards.length})
									</span>
									{p.summonedCards.length === 0 ? (
										<span className="text-slate-600 text-xs">None</span>
									) : (
										<div className="flex flex-wrap gap-1.5">
											{p.summonedCards.map((card) => (
												<CardImage
													key={card.id}
													card={card}
													width={56}
													height={82}
												/>
											))}
										</div>
									)}
								</div>
							</div>
						);
					})}
				</div>

				{/* Footer */}
				<div className="px-6 py-4 border-t border-slate-700/60 flex justify-end">
					<button
						onClick={onClose}
						className="px-5 py-2 bg-slate-700 hover:bg-slate-600 border border-slate-600/70 text-white text-sm font-medium rounded-lg transition-colors cursor-pointer"
					>
						Close
					</button>
				</div>
			</div>
		</div>,
		document.body,
	);
}
