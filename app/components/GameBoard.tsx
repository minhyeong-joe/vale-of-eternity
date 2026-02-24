import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import type {
	FamilyZone,
	Family,
	Card,
	PlayerColor,
	Player,
	Phase,
} from "../types/game";
import { CardImage, CardBack } from "./CardStack";

// ─── Card dimensions in the hunting-ground zone ────────────────────────────

const ZONE_CARD_W = 80 * 1.3;
const ZONE_CARD_H = 118 * 1.3;

// ─── Mini player avatar (for placed markers and flying token) ───────────────

function MiniAvatar({ color, size }: { color: PlayerColor; size: number }) {
	const scale = size / 90; // sprite native size is 90×90
	return (
		<div
			style={{
				width: size,
				height: size,
				overflow: "hidden",
				position: "relative",
				borderRadius: "50%",
			}}
		>
			<div
				className={`sprite player-${color} absolute`}
				style={{ transform: `scale(${scale})`, transformOrigin: "top left" }}
			/>
		</div>
	);
}

// ─── Family zone header sprites ────────────────────────────────────────────
// Original: 250×85px. At scale 0.42 → 105×36px visual.

const FAMILY_SPRITE: Record<Family, string> = {
	fire: "fire-cards-header",
	water: "water-cards-header",
	earth: "earth-cards-header",
	wind: "wind-cards-header",
	dragon: "dragon-cards-header",
};

const SELL_REWARD: Record<Family, string> = {
	fire: "3 red",
	earth: "4 red",
	water: "1 blue",
	wind: "1 red + 1 blue",
	dragon: "1 purple",
};

function FamilyZoneHeader({ family }: { family: Family }) {
	const SCALE = 0.45;
	const W = Math.round(250 * SCALE);
	const H = Math.round(85 * SCALE);
	return (
		<div
			style={{
				width: W,
				height: H,
				overflow: "hidden",
				position: "relative",
				flexShrink: 0,
			}}
		>
			<div
				className={`sprite ${FAMILY_SPRITE[family]} absolute`}
				style={{ transform: `scale(${SCALE})`, transformOrigin: "top left" }}
			/>
		</div>
	);
}

// ─── Flying token animation state ──────────────────────────────────────────

type FlyToken = {
	cardId: number;
	color: PlayerColor;
	/** Fixed-position origin (center of confirm button) */
	fromX: number;
	fromY: number;
	/** Fixed-position destination (center of target card) */
	toX: number;
	toY: number;
	phase: "init" | "flying";
};

const TOKEN_SIZE = 28;

// ─── Individual zone card ──────────────────────────────────────────────────

interface ZoneCardProps {
	card: Card;
	claimedBy: PlayerColor | undefined;
	canClaim: boolean;
	/** True when this card has the current player's marker and it's the action phase */
	isMine: boolean;
	showClaimButton: boolean;
	onClaim: (card: Card) => void;
	onSell: (card: Card) => void;
	onTame: (card: Card) => void;
	isAction: boolean;
	myUserId?: string;
	isMyTurn?: boolean;
	animKey?: string;
}

function ZoneCard({
	card,
	claimedBy,
	canClaim,
	isMine,
	showClaimButton,
	onClaim,
	onSell,
	onTame,
	isAction,
	myUserId,
	isMyTurn,
	animKey,
}: ZoneCardProps) {
	const isClaimed = claimedBy !== undefined;
	// Show action buttons only if it's action phase, card is marked by current user, and current user is the active action player
	const showActionButtons = isAction && isMine && isMyTurn;

	return (
		<div
			data-anim={animKey}
			className={`relative flex-shrink-0 flex flex-col rounded group ${showClaimButton && canClaim && !isClaimed ? "" : isClaimed ? "cursor-default" : "cursor-not-allowed"}`}
			style={{ width: ZONE_CARD_W }}
		>
			{/* Card face */}
			<div
				className="relative"
				style={{ width: ZONE_CARD_W, height: ZONE_CARD_H }}
			>
				<CardImage card={card} width={ZONE_CARD_W} height={ZONE_CARD_H} />

				{/* Claimed: dim overlay + marker badge */}
				{isClaimed && (
					<>
						<div className="absolute inset-0 rounded bg-black/45 pointer-events-none" />
						<div className="absolute bottom-1 right-1 z-10 rounded-full ring-2 ring-white/70 shadow-lg">
							<MiniAvatar color={claimedBy} size={(TOKEN_SIZE - 6) * 2} />
						</div>
					</>
				)}
			</div>

			{/* Hunting-phase: claim button below card */}
			{showClaimButton && canClaim && !isClaimed && (
				<button
					onClick={() => onClaim(card)}
					className="w-full text-xs font-bold py-1.5 rounded-md bg-amber-600/90 hover:bg-amber-500 text-white transition-colors cursor-pointer mt-1"
				>
					Claim
				</button>
			)}

			{/* Action-phase: sell / tame buttons below card */}
			{showActionButtons && (
				<div className="flex flex-col gap-1 pt-1.5">
					<button
						onClick={(e) => {
							e.stopPropagation();
							onSell(card);
						}}
						className="w-full text-xs font-bold py-1.5 rounded-md bg-amber-600/90 hover:bg-amber-500 text-white transition-colors cursor-pointer"
					>
						Sell
					</button>
					<button
						onClick={(e) => {
							e.stopPropagation();
							onTame(card);
						}}
						className="w-full text-xs font-bold py-1.5 rounded-md bg-sky-600/90 hover:bg-sky-500 text-white transition-colors cursor-pointer"
					>
						Tame
					</button>
				</div>
			)}
		</div>
	);
}

// ─── GameBoard ─────────────────────────────────────────────────────────────

interface GameBoardProps {
	zones: FamilyZone[];
	drawPileCount: number;
	discardPileCount: number;
	myPlayerColor?: PlayerColor;
	/** The socket userId of the current UI user */
	myUserId?: string;
	/** All players (for resolving userId → PlayerColor for board markers) */
	players?: Player[];
	/** cardId → userId who placed a marker on it */
	boardMarkers?: Record<number, string>;
	phase?: Phase | "";
	/** userId whose hunt turn it is (null outside hunting phase) */
	activeHunterUserId?: string | null;
	isMyTurn?: boolean;
	onHuntPick?: (cardId: number) => void;
	onSell?: (cardId: number) => void;
	onTame?: (cardId: number) => void;
}

export function GameBoard({
	zones,
	drawPileCount,
	discardPileCount,
	myPlayerColor,
	myUserId,
	players = [],
	boardMarkers = {},
	phase = "",
	activeHunterUserId,
	isMyTurn,
	onHuntPick,
	onSell,
	onTame,
}: GameBoardProps) {
	/** Build a lookup: cardId → PlayerColor using boardMarkers + players array */
	const markerColors = new Map<number, PlayerColor>();
	for (const [cidStr, uid] of Object.entries(boardMarkers)) {
		const p = players.find((pl) => pl.id === uid);
		if (p) markerColors.set(Number(cidStr), p.color);
	}

	const isHunting = phase === "hunting";
	const isAction = phase === "action";
	const canClaimNow =
		isHunting && !!myUserId && activeHunterUserId === myUserId;

	const handleClaim = (card: Card) => {
		// Emit to server
		onHuntPick?.(card.id);
	};

	return (
		<>
			<div className="bg-slate-800/50 backdrop-blur-sm rounded-lg border border-slate-700/50 p-3">
				<div className="flex items-stretch gap-3 overflow-x-auto pr-2">
					{/* Draw pile */}
					<div className="flex flex-col items-center justify-center gap-1.5 flex-shrink-0">
						<span className="text-slate-500 text-[10px] uppercase tracking-widest">
							Draw
						</span>
						<div className="relative" data-anim="draw-pile">
							<CardBack width={72} height={118} />
							<div
								className="absolute bg-slate-700 text-white font-bold rounded-full border border-slate-500 flex items-center justify-center"
								style={{
									top: -5,
									right: -7,
									minWidth: 18,
									height: 18,
									fontSize: 9,
									paddingInline: 2,
								}}
							>
								{drawPileCount}
							</div>
						</div>
					</div>

					{/* Divider */}
					<div className="w-px bg-slate-700/50 self-stretch flex-shrink-0" />

					{/* Family zones — cards spread flat */}
					<div className="flex gap-6 flex-1 justify-center">
						{zones.map((zone) => (
							<div
								key={zone.family}
								className="flex flex-col items-center gap-1.5 flex-shrink-0"
							>
								{/* Header centred over the card row */}
								<FamilyZoneHeader family={zone.family} />

								{/* Cards spread in a row */}
								{zone.cards.length === 0 ? (
									<div
										className="flex items-center justify-center rounded border border-dashed border-slate-700/60"
										style={{ width: ZONE_CARD_W, height: ZONE_CARD_H }}
									>
										<span className="text-slate-600 text-[10px]">empty</span>
									</div>
								) : (
									<div className="flex gap-1.5">
										{zone.cards.map((card) => (
											<ZoneCard
												key={card.id}
												animKey={`board-card-${card.id}`}
												card={card}
												claimedBy={markerColors.get(card.id)}
												canClaim={canClaimNow}
												isMine={isAction && boardMarkers[card.id] === myUserId}
												showClaimButton={isHunting}
												onClaim={handleClaim}
												onSell={() => onSell?.(card.id)}
												onTame={() => onTame?.(card.id)}
												isAction={isAction}
												myUserId={myUserId}
												isMyTurn={isMyTurn}
											/>
										))}
									</div>
								)}

								{/* Sell reward */}
								<span className="text-slate-600 text-[9px] whitespace-nowrap">
									sell → {SELL_REWARD[zone.family]}
								</span>
							</div>
						))}
					</div>

					{/* Divider */}
					<div className="w-px bg-slate-700/50 self-stretch flex-shrink-0" />

					{/* Discard pile */}
					<div className="flex flex-col items-center justify-center gap-1.5 flex-shrink-0">
						<span className="text-slate-500 text-[10px] uppercase tracking-widest">
							Discard
						</span>
						<div className="relative" data-anim="discard-pile">
							<CardBack width={72} height={118} />
							<div
								className="absolute bg-slate-700 text-white font-bold rounded-full border border-slate-500 flex items-center justify-center"
								style={{
									top: -5,
									right: -7,
									minWidth: 18,
									height: 18,
									fontSize: 9,
									paddingInline: 2,
								}}
							>
								{discardPileCount}
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
