import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import type { FamilyZone, Family, Card, PlayerColor } from "../types/game";
import { CardImage, CardBack } from "./CardStack";

// ─── Card dimensions in the hunting-ground zone ────────────────────────────

const ZONE_CARD_W = 80;
const ZONE_CARD_H = 118;

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
	onClaim: (card: Card, cardRect: DOMRect) => void;
}

function ZoneCard({ card, claimedBy, canClaim, onClaim }: ZoneCardProps) {
	const isClaimed = claimedBy !== undefined;
	const isClickable = canClaim && !isClaimed;

	const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
		if (!isClickable) return;
		onClaim(card, e.currentTarget.getBoundingClientRect());
	};

	return (
		<div
			className={`relative flex-shrink-0 rounded group ${isClickable ? "cursor-pointer" : isClaimed ? "cursor-default" : "cursor-not-allowed"}`}
			style={{ width: ZONE_CARD_W, height: ZONE_CARD_H }}
		>
			{/* Card face */}
			<CardImage
				card={card}
				width={ZONE_CARD_W}
				height={ZONE_CARD_H}
				onClick={isClickable ? handleClick : undefined}
			/>

			{/* Hover highlight ring (unclaimed only) */}
			{isClickable && (
				<div className="absolute inset-0 rounded opacity-0 group-hover:opacity-100 ring-2 ring-amber-400/80 bg-amber-400/10 pointer-events-none transition-opacity duration-150" />
			)}

			{/* Claimed: dim overlay + marker badge */}
			{isClaimed && (
				<>
					<div className="absolute inset-0 rounded bg-black/45 pointer-events-none" />
					<div className="absolute bottom-1 right-1 z-10 rounded-full ring-2 ring-white/70 shadow-lg">
						<MiniAvatar color={claimedBy} size={TOKEN_SIZE - 6} />
					</div>
				</>
			)}
		</div>
	);
}

// ─── Confirm modal ─────────────────────────────────────────────────────────

interface ConfirmModalProps {
	card: Card;
	myPlayerColor: PlayerColor;
	onCancel: () => void;
	onConfirm: (confirmBtnRect: DOMRect) => void;
}

function ConfirmModal({
	card,
	myPlayerColor,
	onCancel,
	onConfirm,
}: ConfirmModalProps) {
	const handleConfirmClick = (e: React.MouseEvent<HTMLButtonElement>) => {
		onConfirm(e.currentTarget.getBoundingClientRect());
	};

	return createPortal(
		<div
			className="fixed inset-0 z-50 flex items-center justify-center p-4"
			onClick={onCancel}
		>
			<div className="absolute inset-0 bg-black/65 backdrop-blur-sm" />
			<div
				className="relative bg-slate-800/98 border border-slate-600/80 rounded-xl shadow-2xl p-5 flex flex-col items-center gap-4"
				style={{ minWidth: 220 }}
				onClick={(e) => e.stopPropagation()}
			>
				{/* Heading */}
				<div className="flex items-center gap-2.5">
					<MiniAvatar color={myPlayerColor} size={26} />
					<h3 className="text-white font-bold text-sm">Place Marker?</h3>
				</div>

				{/* Card preview */}
				<div className="rounded-lg overflow-hidden shadow-lg ring-1 ring-slate-600/60">
					<CardImage card={card} width={100} height={148} />
				</div>

				{/* Card name */}
				<p className="text-slate-300 text-xs text-center leading-snug max-w-[160px]">
					Claim <span className="text-white font-semibold">{card.name}</span>?
					<br />
					<span className="text-slate-500">
						This card will be reserved for you.
					</span>
				</p>

				{/* Action buttons */}
				<div className="flex gap-3 w-full">
					<button
						onClick={onCancel}
						className="flex-1 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 border border-slate-600 text-slate-300 hover:text-white text-xs font-medium transition-colors cursor-pointer"
					>
						Cancel
					</button>
					<button
						onClick={handleConfirmClick}
						className="flex-1 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 border border-amber-500/70 text-white text-xs font-semibold transition-colors cursor-pointer"
					>
						Confirm
					</button>
				</div>
			</div>
		</div>,
		document.body,
	);
}

// ─── GameBoard ─────────────────────────────────────────────────────────────

interface GameBoardProps {
	zones: FamilyZone[];
	drawPileCount: number;
	discardPileCount: number;
	myPlayerColor?: PlayerColor;
}

export function GameBoard({
	zones,
	drawPileCount,
	discardPileCount,
	myPlayerColor,
}: GameBoardProps) {
	const [claimedCards, setClaimedCards] = useState<Map<number, PlayerColor>>(
		new Map(),
	);
	const [pendingClaim, setPendingClaim] = useState<{
		card: Card;
		cardRect: DOMRect;
	} | null>(null);
	const [flyToken, setFlyToken] = useState<FlyToken | null>(null);

	// Phase 'init' → 'flying' transition (needs two rAF to let the DOM paint first)
	useEffect(() => {
		if (!flyToken || flyToken.phase !== "init") return;
		const id = requestAnimationFrame(() => {
			requestAnimationFrame(() => {
				setFlyToken((t) => (t ? { ...t, phase: "flying" } : null));
			});
		});
		return () => cancelAnimationFrame(id);
	}, [flyToken?.phase]);

	// After animation completes, commit the claimed card and remove the token
	useEffect(() => {
		if (!flyToken || flyToken.phase !== "flying") return;
		const id = setTimeout(() => {
			setClaimedCards((m) => new Map(m).set(flyToken.cardId, flyToken.color));
			setFlyToken(null);
		}, 440);
		return () => clearTimeout(id);
	}, [flyToken?.phase]);

	const handleCardClaim = (card: Card, cardRect: DOMRect) => {
		if (!myPlayerColor) return;
		setPendingClaim({ card, cardRect });
	};

	const handleConfirm = (confirmBtnRect: DOMRect) => {
		if (!pendingClaim || !myPlayerColor) return;
		const { card, cardRect } = pendingClaim;
		setPendingClaim(null);

		// Centre of confirm button → centre of target card
		const fromX = confirmBtnRect.left + confirmBtnRect.width / 2;
		const fromY = confirmBtnRect.top + confirmBtnRect.height / 2;
		const toX = cardRect.left + cardRect.width / 2;
		const toY = cardRect.top + cardRect.height / 2;

		setFlyToken({
			cardId: card.id,
			color: myPlayerColor,
			fromX,
			fromY,
			toX,
			toY,
			phase: "init",
		});
	};

	const handleCancel = () => setPendingClaim(null);

	return (
		<>
			<div className="bg-slate-800/50 backdrop-blur-sm rounded-lg border border-slate-700/50 p-3">
				<div className="flex items-stretch gap-3 overflow-x-auto pr-2">
					{/* Draw pile */}
					<div className="flex flex-col items-center justify-center gap-1.5 flex-shrink-0">
						<span className="text-slate-500 text-[10px] uppercase tracking-widest">
							Draw
						</span>
						<div className="relative">
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
												card={card}
												claimedBy={claimedCards.get(card.id)}
												canClaim={!!myPlayerColor}
												onClaim={handleCardClaim}
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
						<div className="relative">
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

			{/* Confirm placement modal */}
			{pendingClaim && myPlayerColor && (
				<ConfirmModal
					card={pendingClaim.card}
					myPlayerColor={myPlayerColor}
					onCancel={handleCancel}
					onConfirm={handleConfirm}
				/>
			)}

			{/* Flying marker token */}
			{flyToken &&
				createPortal(
					<div
						className="fixed pointer-events-none z-[9998] rounded-full ring-2 ring-white/80 shadow-xl"
						style={{
							width: TOKEN_SIZE,
							height: TOKEN_SIZE,
							top: flyToken.fromY - TOKEN_SIZE / 2,
							left: flyToken.fromX - TOKEN_SIZE / 2,
							transform:
								flyToken.phase === "flying"
									? `translate(${flyToken.toX - flyToken.fromX}px, ${flyToken.toY - flyToken.fromY}px) scale(0.85)`
									: "translate(0px, 0px) scale(1.1)",
							transition:
								flyToken.phase === "flying"
									? "transform 0.42s cubic-bezier(0.25, 0.46, 0.45, 0.94)"
									: "none",
						}}
					>
						<MiniAvatar color={flyToken.color} size={TOKEN_SIZE} />
					</div>,
					document.body,
				)}
		</>
	);
}
