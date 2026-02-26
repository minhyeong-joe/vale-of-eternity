/**
 * InteractionModal — shown when the server sets a pendingInteraction that requires
 * the current player to select a target / card / cards / choice / discardThenSummon.
 */
import { useState } from "react";
import { createPortal } from "react-dom";
import type {
	InteractionPayload,
	Player,
	Card,
	StoneCount,
} from "../types/game";
import { CardImage } from "./CardStack";
import { CardRepo } from "../data/CardRepo";
import { StoneIcon } from "./StoneRow";

// Sprite tokens for known choice option labels
type LabelToken = string | { sprite: string };
const RICH_LABELS: Record<string, LabelToken[]> = {
	"Lose 0, earn red": [
		"Lose ",
		{ sprite: "description-score-0" },
		", earn ",
		{ sprite: "description-stone-1" },
	],
	"Lose 1, earn blue": [
		"Lose ",
		{ sprite: "description-score-1" },
		", earn ",
		{ sprite: "description-stone-3" },
	],
	"Lose 2, earn purple": [
		"Lose ",
		{ sprite: "description-score-2" },
		", earn ",
		{ sprite: "description-stone-6" },
	],
	"Exchange 1 blue → 1 purple": [
		"Exchange 1 ",
		{ sprite: "description-stone-3" },
		" → 1 ",
		{ sprite: "description-stone-6" },
	],
	"Exchange 1 purple → 3 blue": [
		"Exchange 1 ",
		{ sprite: "description-stone-6" },
		" → 3 ",
		{ sprite: "description-stone-3" },
	],
	purple: [" Earn 1 ", { sprite: "description-stone-6" }],
	draw: ["Draw a card"],
	blue2: [" Earn 2 ", { sprite: "description-stone-3" }],
	score4: [" Earn ", { sprite: "description-score-4" }],
};

function DescSprite({ name }: { name: string }) {
	return (
		<div
			className={`sprite ${name}`}
			style={{
				display: "inline-block",
				verticalAlign: "middle",
				flexShrink: 0,
			}}
		/>
	);
}

function RichLabel({ tokens }: { tokens: LabelToken[] }) {
	return (
		<span className="inline-flex items-center gap-1 flex-wrap">
			{tokens.map((t, i) =>
				typeof t === "string" ? (
					<span key={i}>{t}</span>
				) : (
					<DescSprite key={i} name={t.sprite} />
				),
			)}
		</span>
	);
}

interface InteractionModalProps {
	interaction: InteractionPayload;
	myUserId: string;
	players: Player[];
	/** Fired when the player submits their choice */
	onRespond: (
		value: string | number | number[] | string[] | Record<string, number>,
	) => void;
}

function PlayerBtn({
	player,
	onClick,
}: {
	player: Player;
	onClick: () => void;
}) {
	return (
		<button
			onClick={onClick}
			className="flex items-center gap-2 w-full px-3 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 border border-slate-600 hover:border-slate-500 text-slate-200 hover:text-white text-xs font-medium transition-colors cursor-pointer"
		>
			<div
				className={`w-3 h-3 rounded-full flex-shrink-0 ${
					player.color === "purple"
						? "bg-purple-500"
						: player.color === "green"
							? "bg-emerald-500"
							: player.color === "black"
								? "bg-slate-400"
								: "bg-gray-400"
				}`}
			/>
			{player.username}
		</button>
	);
}

function CardBtn({
	card,
	selected,
	onClick,
}: {
	card: Card;
	selected: boolean;
	onClick: () => void;
}) {
	return (
		<div
			onClick={onClick}
			className={`cursor-pointer rounded-lg overflow-hidden ring-2 transition-all ${selected ? "ring-amber-400 scale-105" : "ring-transparent hover:ring-amber-400/50"}`}
		>
			<CardImage card={card} width={108} height={165} />
		</div>
	);
}

export function InteractionModal({
	interaction,
	myUserId,
	players,
	onRespond,
}: InteractionModalProps) {
	const [selectedCards, setSelectedCards] = useState<number[]>([]);
	const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
	const [stoneAdj, setStoneAdj] = useState<Partial<StoneCount>>({});

	// Only show modal to the player who needs to respond
	if (interaction.forUserId !== myUserId) {
		return createPortal(
			<div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
				<div className="bg-slate-800/90 border border-slate-600/80 rounded-xl shadow-2xl px-5 py-3 text-center">
					<p className="text-slate-300 text-sm animate-pulse">
						Waiting for another player…
					</p>
				</div>
			</div>,
			document.body,
		);
	}

	const ctx = interaction.context as Record<string, unknown>;
	const type = interaction.type;
	const me = players.find((p) => p.id === myUserId);

	// ── stoneOverflow: choose which stones to keep (total must equal cap) ───
	if (type === "stoneOverflow") {
		const excess = (ctx.excess as number) ?? 1;
		const cap = (ctx.cap as number) ?? 4;
		const stones = me?.stones ?? { red: 0, blue: 0, purple: 0 };

		const keptRed = stoneAdj.red ?? stones.red;
		const keptBlue = stoneAdj.blue ?? stones.blue;
		const keptPurple = stoneAdj.purple ?? stones.purple;
		const kept = { red: keptRed, blue: keptBlue, purple: keptPurple };
		const keptTotal = keptRed + keptBlue + keptPurple;

		const overCap = keptTotal > cap;
		const underCap = keptTotal < cap;
		const canConfirm = keptTotal === cap;

		const onDec = (t: keyof StoneCount) =>
			setStoneAdj((prev) => ({
				...prev,
				[t]: Math.max(0, (prev[t] ?? stones[t]) - 1),
			}));
		const onInc = (t: keyof StoneCount) =>
			setStoneAdj((prev) => ({
				...prev,
				[t]: Math.min(stones[t], (prev[t] ?? stones[t]) + 1),
			}));

		const SPRITE = {
			red: "stone-1",
			blue: "stone-3",
			purple: "stone-6",
		} as const;
		const stoneTypes = (["red", "blue", "purple"] as const).filter(
			(t) => stones[t] > 0,
		);

		return createPortal(
			<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
				<div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
				<div className="relative bg-slate-800/98 border border-amber-500/60 rounded-xl shadow-2xl p-5 flex flex-col items-center gap-4 min-w-[240px]">
					<h3 className="text-amber-300 font-bold text-sm text-center">
						Stone limit reached (cap: {cap})
					</h3>
					<p className="text-slate-400 text-xs text-center">
						Discard {excess} stone{excess !== 1 ? "s" : ""} — choose which to
						keep
					</p>
					<p
						className={`text-[12px] font-bold ${overCap ? "text-rose-400" : underCap ? "text-rose-400" : "text-green-400"}`}
					>
						Total: {keptTotal} / {cap}
					</p>
					{underCap && (
						<p className="text-rose-400 text-[10px]">
							You have discarded too many stones
						</p>
					)}
					<div className="flex gap-5">
						{stoneTypes.map((t) => (
							<div key={t} className="flex flex-col items-center gap-1">
								<StoneIcon type={SPRITE[t]} size="md" />
								<button
									onClick={() => onInc(t)}
									disabled={kept[t] >= stones[t]}
									className="w-6 h-6 rounded bg-slate-600 hover:bg-slate-500 disabled:opacity-30 disabled:cursor-not-allowed text-xs font-bold transition-colors cursor-pointer"
								>
									+
								</button>
								<span className="text-sm font-bold text-white min-w-[16px] text-center">
									{kept[t]}
								</span>
								<button
									onClick={() => onDec(t)}
									disabled={kept[t] <= 0}
									className="w-6 h-6 rounded bg-slate-600 hover:bg-slate-500 disabled:opacity-30 disabled:cursor-not-allowed text-xs font-bold transition-colors cursor-pointer"
								>
									−
								</button>
							</div>
						))}
					</div>
					<button
						disabled={!canConfirm}
						onClick={() => onRespond(kept)}
						className="px-6 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-semibold transition-colors cursor-pointer"
					>
						Confirm
					</button>
				</div>
			</div>,
			document.body,
		);
	}

	// ── target: pick an opponent ───────────────────────────────────────────
	if (type === "target") {
		const targetableUserIds =
			(ctx.options as string[]) ?? players.map((p) => p.id);
		const targets = players.filter((p) => targetableUserIds.includes(p.id));
		return createPortal(
			<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
				<div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
				<div className="relative bg-slate-800/98 border border-slate-600/80 rounded-xl shadow-2xl p-5 flex flex-col gap-3 min-w-[220px]">
					<h3 className="text-white font-bold text-sm text-center">
						Choose a target
					</h3>
					{targets.map((p) => (
						<PlayerBtn key={p.id} player={p} onClick={() => onRespond(p.id)} />
					))}
				</div>
			</div>,
			document.body,
		);
	}

	// ── choice: pick from a list of options (cards, players, stones, dynamic) ──
	if (type === "choice") {
		const options = (ctx.options as string[]) ?? [];
		const pickCount = ctx.pickCount as number | undefined;
		const isMulti = !!(pickCount && pickCount > 1);

		const toggleOption = (opt: string) =>
			setSelectedOptions((prev) =>
				prev.includes(opt)
					? prev.filter((x) => x !== opt)
					: prev.length < (pickCount ?? 1)
						? [...prev, opt]
						: prev,
			);

		const handleOptionClick = (opt: string) => {
			if (isMulti) toggleOption(opt);
			else onRespond(opt);
		};

		const optionBtnClass = (opt: string) => {
			const selected = isMulti && selectedOptions.includes(opt);
			return `w-full px-3 py-2 rounded-lg border text-slate-200 text-xs font-medium transition-colors cursor-pointer ${
				selected
					? "bg-slate-600 border-amber-400 text-white"
					: "bg-slate-700 hover:bg-slate-600 border-slate-600 hover:border-amber-500 hover:text-white"
			}`;
		};

		return createPortal(
			<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
				<div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
				<div className="relative bg-slate-800/98 border border-slate-600/80 rounded-xl shadow-2xl p-5 flex flex-col gap-3 min-w-[220px]">
					<h3 className="text-white font-bold text-sm text-center">
						{isMulti ? `Choose ${pickCount} options` : "Choose an option"}
					</h3>
					{isMulti && (
						<p className="text-slate-500 text-[10px] text-center">
							{selectedOptions.length} / {pickCount} selected
						</p>
					)}
					<div className="flex flex-col gap-2">
						{options.map((opt) => {
							// Card option: show image + tooltip
							const numId = Number(opt);
							if (!isNaN(numId) && CardRepo[numId]) {
								const card = CardRepo[numId];
								return (
									<button
										key={opt}
										onClick={() => handleOptionClick(opt)}
										className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 border border-slate-600 hover:border-amber-500 text-slate-200 hover:text-white text-xs font-medium transition-colors cursor-pointer group"
										title={card.name}
									>
										<CardImage card={card} width={108} height={165} />
										<span className="font-semibold group-hover:underline">
											{card.name}
										</span>
									</button>
								);
							}
							// Player option: show avatar + username
							const player = players.find((p) => p.id === opt);
							if (player) {
								return (
									<button
										key={opt}
										onClick={() => handleOptionClick(opt)}
										className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 border border-slate-600 hover:border-emerald-500 text-slate-200 hover:text-white text-xs font-medium transition-colors cursor-pointer"
									>
										<div
											className={`w-6 h-6 rounded-full bg-${player.color}-500`}
										/>
										<span className="font-semibold">{player.username}</span>
									</button>
								);
							}
							// Known label → rich sprite tokens
							const richTokens = RICH_LABELS[opt];
							if (richTokens) {
								return (
									<button
										key={opt}
										onClick={() => handleOptionClick(opt)}
										className={optionBtnClass(opt)}
									>
										<RichLabel tokens={richTokens} />
									</button>
								);
							}
							// Stone option: show stone icons
							if (typeof opt === "string" && opt.match(/stone|point|score/)) {
								const stoneMatch = opt.match(/(\d+)[- ]?stone/);
								const pointMatch = opt.match(/(\d+)[- ]?(point|score)/);
								if (stoneMatch) {
									const count = Number(stoneMatch[1]);
									return (
										<button
											key={opt}
											onClick={() => handleOptionClick(opt)}
											className={`flex items-center gap-2 ${optionBtnClass(opt)}`}
										>
											{Array.from({ length: count }).map((_, i) => (
												<span
													key={i}
													className="inline-block w-5 h-5 bg-yellow-400 rounded-full border border-yellow-600 mr-1"
												/>
											))}
											<span className="font-semibold">
												{count} stone{count > 1 ? "s" : ""}
											</span>
										</button>
									);
								}
								if (pointMatch) {
									const count = Number(pointMatch[1]);
									return (
										<button
											key={opt}
											onClick={() => handleOptionClick(opt)}
											className={`flex items-center gap-2 ${optionBtnClass(opt)}`}
										>
											<span className="inline-block w-5 h-5 bg-blue-400 rounded-full border border-blue-600 mr-1" />
											<span className="font-semibold">
												{count} point{count > 1 ? "s" : ""}
											</span>
										</button>
									);
								}
							}
							// Plain text fallback
							return (
								<button
									key={opt}
									onClick={() => handleOptionClick(opt)}
									className={optionBtnClass(opt)}
								>
									{opt}
								</button>
							);
						})}
					</div>
					{isMulti && (
						<button
							disabled={selectedOptions.length !== pickCount}
							onClick={() => onRespond(selectedOptions)}
							className="px-6 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-semibold transition-colors cursor-pointer"
						>
							Confirm
						</button>
					)}
				</div>
			</div>,
			document.body,
		);
	}

	const maxCount = (ctx.maxCount as number) ?? (ctx.count as number) ?? 1;
	const toggle = (id: number) =>
		setSelectedCards((prev) =>
			prev.includes(id)
				? prev.filter((x) => x !== id)
				: prev.length < maxCount
					? [...prev, id]
					: prev,
		);

	// ── card: pick one card from a list ───────────────────────────────────
	if (type === "card" || type === "discardThenSummon") {
		const cardIds =
			(ctx.options as number[]) ??
			(ctx.cardIds as number[]) ??
			me?.hand.map((c) => c.id) ??
			[];

		const cards = cardIds.map((id) => CardRepo[id]).filter(Boolean);
		// const label =
		// 	type === "discardThenSummon"
		// 		? ctx.phase === "pickSummon"
		// 			? "Summon a card for free"
		// 			: "Discard a card (then summon a card for free)"
		// 		: ctx.phase === "geniePickNext"
		// 			? "Genie — choose which card to activate"
		// 			: "Choose a card";
		return createPortal(
			<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
				<div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
				<div className="relative bg-slate-800/98 border border-slate-600/80 rounded-xl shadow-2xl p-5 flex flex-col items-center gap-3 max-w-sm">
					<h3 className="text-white font-bold text-sm text-center">
						{ctx.prompt}
					</h3>
					<div className="flex flex-wrap gap-2 justify-center">
						{cards.map((c) => (
							<CardBtn
								key={c.id}
								card={c}
								selected={selectedCards.includes(c.id)}
								onClick={() => toggle(c.id)}
							/>
						))}
					</div>
					<button
						disabled={selectedCards.length === 0}
						onClick={() => {
							onRespond(selectedCards[0]);
							setSelectedCards([]);
						}}
						className="px-6 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-semibold transition-colors cursor-pointer"
					>
						Confirm
					</button>
				</div>
			</div>,
			document.body,
		);
	}

	// ── cards: pick multiple cards ─────────────────────────────────────────
	if (type === "cards") {
		const cardIds =
			(ctx.options as number[]) ?? (ctx.cardIds as number[]) ?? [];
		const cards = cardIds.map((id) => CardRepo[id]).filter(Boolean);
		return createPortal(
			<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
				<div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
				<div className="relative bg-slate-800/98 border border-slate-600/80 rounded-xl shadow-2xl p-5 flex flex-col items-center gap-3 max-w-sm">
					<h3 className="text-white font-bold text-sm text-center">
						{ctx.prompt}
					</h3>
					<p className="text-slate-500 text-[10px]">
						{selectedCards.length} / {maxCount} selected
					</p>
					<div className="flex flex-wrap gap-2 justify-center">
						{cards.map((c) => (
							<CardBtn
								key={c.id}
								card={c}
								selected={selectedCards.includes(c.id)}
								onClick={() => toggle(c.id)}
							/>
						))}
					</div>
					<button
						disabled={selectedCards.length === 0}
						onClick={() => onRespond(selectedCards)}
						className="px-6 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-semibold transition-colors cursor-pointer"
					>
						Confirm
					</button>
				</div>
			</div>,
			document.body,
		);
	}

	return null;
}
