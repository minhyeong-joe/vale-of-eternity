import { useState } from "react";
import type { Card, Player, Phase, StoneCount } from "../types/game";
import { CardStack, CardImage } from "./CardStack";
import { StoneRow } from "./StoneRow";
import { PaymentModal } from "./PaymentModal";

// ─── Player avatar sprite ──────────────────────────────────────────────────

function PlayerAvatar({ color, size }: { color: string; size: number }) {
	const scale = size / 90; // 90 is the sprite's native size
	return (
		<div
			style={{
				width: size,
				height: size,
				overflow: "hidden",
				position: "relative",
				flexShrink: 0,
			}}
			className="rounded-full"
		>
			<div
				className={`sprite player-${color} absolute`}
				style={{ transform: `scale(${scale})`, transformOrigin: "top left" }}
			/>
		</div>
	);
}

// ─── Shared types ─────────────────────────────────────────────────────────

interface PlayerAreaProps {
	player: Player;
	isSelf: boolean;
	isMyTurn?: boolean;
	/** True when this player is the active player (derived from activePlayerId) */
	isActive?: boolean;
	/** Current game phase — needed to decide which actions are available */
	phase?: Phase | "";
	/** Called with cardId + payment when player summons a hand card */
	onSummon?: (cardId: number, payment: StoneCount) => void;
	/** Called with cardId + payment when player removes a summoned card */
	onRemove?: (cardId: number, payment: StoneCount) => void;
	/** Called with cardId when player activates a summoned card's active effect */
	onActivate?: (cardId: number) => void;
	/** Called when player ends their turn */
	onEndTurn?: () => void;
}

// ─── Compact opponent card ────────────────────────────────────────────────

function CompactPlayerArea({
	player,
	isActive,
}: {
	player: Player;
	isActive: boolean;
}) {
	// For opponents: hand is face-down, modelled as N placeholder cards
	const handPlaceholders: Card[] = Array.from(
		{ length: player.handCount },
		(_, i) => ({
			id: -i - 1,
			name: "?",
			family: "fire" as const,
			cost: 0,
			effects: [],
			imagePath: "",
		}),
	);

	return (
		<div
			className={`
                bg-slate-700/50 backdrop-blur-sm rounded-lg border p-2.5 flex flex-col gap-2
                ${
									isActive
										? "border-amber-500/60 ring-1 ring-amber-500/30"
										: "border-slate-600/50"
								}
            `}
		>
			{/* Top row: avatar + name + score */}
			<div className="flex items-center gap-2">
				<PlayerAvatar color={player.color} size={34} />
				<div className="flex flex-col min-w-0 flex-1">
					<div className="flex items-center gap-1.5 flex-wrap">
						<span className="text-white text-xs font-semibold truncate">
							{player.username}
						</span>
						{player.isFirstPlayer && (
							<span className="text-yellow-400 text-[9px] font-bold">★1st</span>
						)}
						{isActive && (
							<span className="inline-block w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse flex-shrink-0" />
						)}
					</div>
					<span
						className="text-slate-400 text-[10px]"
						data-anim={`score-${player.id}`}
					>
						{player.score} pts
					</span>
				</div>
			</div>

			{/* Stones */}
			<div data-anim={`stones-${player.id}`}>
				<StoneRow stones={player.stones} size="sm" />
			</div>

			{/* Cards row */}
			<div className="flex items-start gap-2 min-w-0">
				{/* Summoned — flex-1 so it fills the available space */}
				<div className="flex flex-col gap-1 flex-1 min-w-0">
					<span className="text-slate-400 text-[9px] uppercase tracking-wide">
						Summoned ({player.summonedCards.length})
					</span>
					<CardStack
						cards={player.summonedCards}
						faceDown={false}
						label={`${player.username}'s Summoned Cards`}
						emptyText="none"
						stretch={true}
					/>
				</div>

				{/* Hand (hidden) */}
				<div
					className="flex flex-col gap-1 flex-shrink-0"
					data-anim={`hand-${player.id}`}
				>
					<span className="text-slate-400 text-[9px] uppercase tracking-wide">
						Hand ({player.handCount})
					</span>
					<CardStack
						cards={handPlaceholders}
						faceDown={true}
						label={`${player.username}'s Hand`}
						emptyText="none"
						maxVisible={3}
						noExpand={true}
					/>
				</div>
			</div>
		</div>
	);
}

// ─── Small card tile with overlaid action button ──────────────────────────

interface CardTileProps {
	card: Card;
	/** Label for the action button — if undefined, no button is shown */
	actionLabel?: string;
	actionClass?: string;
	onAction?: () => void;
	secondaryLabel?: string;
	secondaryClass?: string;
	onSecondary?: () => void;
}

function CardTile({
	card,
	actionLabel,
	actionClass = "bg-amber-600/90 hover:bg-amber-500",
	onAction,
	secondaryLabel,
	secondaryClass = "bg-slate-600/90 hover:bg-slate-500",
	onSecondary,
}: CardTileProps) {
	const W = 64 * 1.5,
		H = 95 * 1.5;
	return (
		<div className="relative flex-shrink-0 flex flex-col" style={{ width: W }}>
			<CardImage card={card} width={W} height={H} />
			{(actionLabel || secondaryLabel) && (
				<div className="flex flex-col gap-1 pt-1.5">
					{actionLabel && (
						<button
							onClick={(e) => {
								e.stopPropagation();
								onAction?.();
							}}
							className={`w-full text-xs font-bold py-1.5 rounded-md ${actionClass} text-white transition-colors cursor-pointer`}
						>
							{actionLabel}
						</button>
					)}
					{secondaryLabel && (
						<button
							onClick={(e) => {
								e.stopPropagation();
								onSecondary?.();
							}}
							className={`w-full text-xs font-bold py-1.5 rounded-md ${secondaryClass} text-white transition-colors cursor-pointer`}
						>
							{secondaryLabel}
						</button>
					)}
				</div>
			)}
		</div>
	);
}

// ─── Full self area ───────────────────────────────────────────────────────

function FullPlayerArea({
	player,
	isMyTurn,
	phase,
	onSummon,
	onRemove,
	onActivate,
	onEndTurn,
}: {
	player: Player;
	isMyTurn: boolean;
	phase: Phase | "";
	onSummon?: (cardId: number, payment: StoneCount) => void;
	onRemove?: (cardId: number, payment: StoneCount) => void;
	onActivate?: (cardId: number) => void;
	onEndTurn?: () => void;
}) {
	const [pendingSummon, setPendingSummon] = useState<Card | null>(null);
	const [pendingRemove, setPendingRemove] = useState<Card | null>(null);

	const canAct = isMyTurn;
	const isAction = phase === "action";
	const isResolution = phase === "resolution";

	return (
		<div
			className={`
                bg-slate-700/40 backdrop-blur-sm rounded-lg border p-3 flex flex-col gap-3
                ${
									isMyTurn
										? "border-amber-500/50 ring-1 ring-amber-500/20"
										: "border-slate-600/50"
								}
            `}
		>
			{/* Header */}
			<div className="flex items-center gap-3">
				<PlayerAvatar color={player.color} size={46} />
				<div className="flex flex-col gap-0.5">
					<div className="flex items-center gap-2 flex-wrap">
						<span className="text-white font-bold">{player.username}</span>
						{player.isFirstPlayer && (
							<span className="text-yellow-400 text-xs font-bold">
								★ 1st Player
							</span>
						)}
						{isMyTurn && (
							<span className="text-amber-300 text-xs font-bold animate-pulse">
								<i className="fa-solid fa-bolt mr-1 text-[10px]" />
								Your Turn
							</span>
						)}
					</div>
					<div className="flex items-center gap-3">
						<span
							className="text-slate-300 text-sm font-semibold"
							data-anim={`score-${player.id}`}
						>
							{player.score} pts
						</span>
						<div data-anim={`stones-${player.id}`}>
							<StoneRow stones={player.stones} size="sm" showEmpty />
						</div>
					</div>
				</div>
			</div>

			{/* Cards area — both sections fill width evenly */}
			<div className="flex gap-4">
				{/* Summoned / area cards */}
				<div className="flex flex-col gap-1.5 flex-1 min-w-0">
					<span className="text-slate-300 text-xs font-medium">
						Summoned ({player.summonedCards.length})
					</span>
					{player.summonedCards.length === 0 ? (
						<span className="text-slate-500 text-xs italic">
							No summoned cards
						</span>
					) : (
						<div className="flex flex-wrap gap-1.5">
							{player.summonedCards.map((card) => {
								const hasActive = card.effects.some((e) => e.type === "active");
								const activeUsed = player.activeEffectsUsed.includes(card.id);
								return (
									<CardTile
										key={card.id}
										card={card}
										actionLabel={canAct && isAction ? "Remove" : undefined}
										actionClass="bg-rose-700/90 hover:bg-rose-600"
										onAction={() => setPendingRemove(card)}
										secondaryLabel={
											canAct && isResolution && hasActive && !activeUsed
												? "Activate"
												: undefined
										}
										secondaryClass="bg-violet-600/90 hover:bg-violet-500"
										onSecondary={() => onActivate?.(card.id)}
									/>
								);
							})}
						</div>
					)}
				</div>

				<div className="w-px bg-slate-600/50 self-stretch" />

				{/* Hand (visible to self) */}
				<div
					className="flex flex-col gap-1.5 flex-1 min-w-0"
					data-anim={`hand-${player.id}`}
				>
					<span className="text-slate-300 text-xs font-medium">
						Hand ({player.hand.length})
						<span className="text-slate-500 font-normal ml-1.5 text-[10px]">
							— secret from others
						</span>
					</span>
					{player.hand.length === 0 ? (
						<span className="text-slate-500 text-xs italic">Empty hand</span>
					) : (
						<div className="flex flex-wrap gap-1.5">
							{player.hand.map((card) => (
								<CardTile
									key={card.id}
									card={card}
									actionLabel={canAct && isAction ? "Summon" : undefined}
									actionClass="bg-amber-600/90 hover:bg-amber-500"
									onAction={() => setPendingSummon(card)}
								/>
							))}
						</div>
					)}
				</div>
			</div>

			{/* End Turn button — hidden during hunting (turn advances server-side on pick) */}
			{isMyTurn && phase !== "hunting" && (
				<div className="flex gap-2 pt-2 border-t border-slate-600/50">
					<button
						onClick={onEndTurn}
						className="ml-auto text-xs py-1.5 px-4 rounded-lg bg-amber-600/80 hover:bg-amber-600 border border-amber-500/70 text-white font-semibold transition-colors cursor-pointer"
					>
						End Turn
					</button>
				</div>
			)}

			{/* Summon payment modal */}
			{pendingSummon && (
				<PaymentModal
					card={pendingSummon}
					requiredValue={Math.max(
						0,
						pendingSummon.cost
							- (player.costReductionByFamily?.[pendingSummon.family] ?? 0)
							- (player.costReductionAll ?? 0),
					)}
					playerStones={player.stones}
					stoneValueBonus={player.stoneValueBonus}
					stoneOverrides={player.stoneOverrides}
					title="Summon — choose payment"
					confirmLabel="Summon"
					onConfirm={(payment) => {
						onSummon?.(pendingSummon.id, payment);
						setPendingSummon(null);
					}}
					onCancel={() => setPendingSummon(null)}
				/>
			)}

			{/* Remove payment modal (cost = round number, stored on card context) */}
			{pendingRemove && (
				<PaymentModal
					card={pendingRemove}
					requiredValue={1}
					playerStones={player.stones}
					stoneValueBonus={player.stoneValueBonus}
					stoneOverrides={player.stoneOverrides}
					title="Remove — pay stones (value ≥ round)"
					confirmLabel="Remove"
					onConfirm={(payment) => {
						onRemove?.(pendingRemove.id, payment);
						setPendingRemove(null);
					}}
					onCancel={() => setPendingRemove(null)}
				/>
			)}
		</div>
	);
}

// ─── Public export ─────────────────────────────────────────────────────────

export function PlayerArea({
	player,
	isSelf,
	isMyTurn = false,
	isActive = false,
	phase = "",
	onSummon,
	onRemove,
	onActivate,
	onEndTurn,
}: PlayerAreaProps) {
	if (isSelf) {
		return (
			<FullPlayerArea
				player={player}
				isMyTurn={isMyTurn}
				phase={phase}
				onSummon={onSummon}
				onRemove={onRemove}
				onActivate={onActivate}
				onEndTurn={onEndTurn}
			/>
		);
	}
	return <CompactPlayerArea player={player} isActive={isActive} />;
}
