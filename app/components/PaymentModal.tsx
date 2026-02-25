/**
 * PaymentModal — lets the current player choose which stones to pay for summoning or removing a card.
 *
 * For SUMMON: cost is the card's stone cost value.  Player picks any combo whose total VALUE ≥ cost.
 * For REMOVE: cost is the current round number.     Same rule.
 */
import { useState, useCallback } from "react";
import { createPortal } from "react-dom";
import type { Card, StoneCount } from "../types/game";
import { CardImage } from "./CardStack";
import { StoneIcon } from "./StoneRow";

function totalValue(s: StoneCount, ev: Record<keyof StoneCount, number>) {
	return s.red * ev.red + s.blue * ev.blue + s.purple * ev.purple;
}

function StoneBtn({
	type,
	count,
	available,
	onInc,
	onDec,
	canConfirm,
	effectiveValue,
}: {
	type: keyof StoneCount;
	count: number;
	available: number;
	onInc: () => void;
	onDec: () => void;
	canConfirm: boolean;
	effectiveValue: number;
}) {
	const SPRITE: Record<keyof StoneCount, "stone-1" | "stone-3" | "stone-6"> = {
		red: "stone-1",
		blue: "stone-3",
		purple: "stone-6",
	};

	return (
		<div className="flex flex-col items-center gap-1">
			<StoneIcon type={SPRITE[type]} size="md" />
			<span className="text-[9px] text-slate-400">×{effectiveValue}</span>
			<button
				onClick={onInc}
				disabled={count >= available || canConfirm}
				className="w-6 h-6 rounded bg-slate-600 hover:bg-slate-500 disabled:opacity-30 disabled:cursor-not-allowed text-xs font-bold transition-colors cursor-pointer"
			>
				+
			</button>
			<span className="text-sm font-bold text-white min-w-[16px] text-center">
				{count}
			</span>
			<button
				onClick={onDec}
				disabled={count <= 0}
				className="w-6 h-6 rounded bg-slate-600 hover:bg-slate-500 disabled:opacity-30 disabled:cursor-not-allowed text-xs font-bold transition-colors cursor-pointer"
			>
				−
			</button>
		</div>
	);
}

interface PaymentModalProps {
	card: Card;
	/** Stone cost that must be met (value sum). */
	requiredValue: number;
	/** Stones the player currently holds. */
	playerStones: StoneCount;
	/** Per-stone-type bonus to base value from permanent effects (e.g. Water Giant). */
	stoneValueBonus?: StoneCount;
	/** Stone type remappings from permanent effects (e.g. Hae-tae swaps blue ↔ purple). */
	stoneOverrides?: Array<{ from: string; countsAs: string }>;
	title?: string;
	confirmLabel?: string;
	onConfirm: (payment: StoneCount) => void;
	onCancel: () => void;
}

export function PaymentModal({
	card,
	requiredValue,
	playerStones,
	stoneValueBonus = { red: 0, blue: 0, purple: 0 },
	stoneOverrides = [],
	title = "Pay stones",
	confirmLabel = "Confirm",
	onConfirm,
	onCancel,
}: PaymentModalProps) {
	const [paid, setPaid] = useState<StoneCount>({ red: 0, blue: 0, purple: 0 });

	// Build override map: stone type → which type it counts as
	const overrideMap: Record<string, string> = {};
	for (const ov of stoneOverrides) overrideMap[ov.from] = ov.countsAs;

	const BASE: Record<string, number> = { red: 1, blue: 3, purple: 6 };
	const mapped = (t: string) => overrideMap[t] ?? t;
	// For each stone type: use the base value of the type it counts as, plus that type's bonus
	const effectiveValues: Record<keyof StoneCount, number> = {
		red:    (BASE[mapped("red")]    ?? 1) + (stoneValueBonus[mapped("red")    as keyof StoneCount] ?? 0),
		blue:   (BASE[mapped("blue")]   ?? 3) + (stoneValueBonus[mapped("blue")   as keyof StoneCount] ?? 0),
		purple: (BASE[mapped("purple")] ?? 6) + (stoneValueBonus[mapped("purple") as keyof StoneCount] ?? 0),
	};

	const adj = useCallback(
		(type: keyof StoneCount, delta: number) => {
			setPaid((prev) => ({
				...prev,
				[type]: Math.max(0, Math.min(playerStones[type], prev[type] + delta)),
			}));
		},
		[playerStones],
	);

	const paidValue = totalValue(paid, effectiveValues);
	const canConfirm = paidValue >= requiredValue;
	const FREE = requiredValue === 0;

	return createPortal(
		<div
			className="fixed inset-0 z-50 flex items-center justify-center p-4"
			onClick={onCancel}
		>
			<div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
			<div
				className="relative bg-slate-800/98 border border-slate-600/80 rounded-xl shadow-2xl p-5 flex flex-col items-center gap-4"
				style={{ minWidth: 260 }}
				onClick={(e) => e.stopPropagation()}
			>
				<h3 className="text-white font-bold text-sm">{title}</h3>

				<div className="rounded-lg overflow-hidden shadow-lg ring-1 ring-slate-600/60">
					<CardImage card={card} width={80} height={118} />
				</div>

				<div className="text-center">
					<p className="text-slate-300 text-xs font-medium">{card.name}</p>
					{FREE ? (
						<p className="text-green-400 text-[10px] font-semibold mt-0.5">
							Free — no cost
						</p>
					) : (
						<p className="text-slate-500 text-[10px]">
							Required value:{" "}
							<span className="text-amber-400 font-bold">{requiredValue}</span>{" "}
							— Paid:{" "}
							<span
								className={
									canConfirm
										? "text-green-400 font-bold"
										: "text-rose-400 font-bold"
								}
							>
								{paidValue}
							</span>
						</p>
					)}
				</div>

				{/* Only show stone pickers when there's an actual cost */}
				{!FREE && (
					<div className="flex gap-5 px-2">
						{(["red", "blue", "purple"] as const).map((t) => (
							<StoneBtn
								key={t}
								type={t}
								count={paid[t]}
								available={playerStones[t]}
								onInc={() => adj(t, 1)}
								onDec={() => adj(t, -1)}
								canConfirm={canConfirm}
								effectiveValue={effectiveValues[t]}
							/>
						))}
					</div>
				)}

				<div className="flex gap-3 w-full">
					<button
						onClick={onCancel}
						className="flex-1 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 border border-slate-600 text-slate-300 hover:text-white text-xs font-medium transition-colors cursor-pointer"
					>
						Cancel
					</button>
					<button
						disabled={!FREE && !canConfirm}
						onClick={() =>
							onConfirm(FREE ? { red: 0, blue: 0, purple: 0 } : paid)
						}
						className="flex-1 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 disabled:opacity-40 disabled:cursor-not-allowed border border-amber-500/70 text-white text-xs font-semibold transition-colors cursor-pointer"
					>
						{confirmLabel}
					</button>
				</div>
			</div>
		</div>,
		document.body,
	);
}
