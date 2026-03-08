import { useState, useRef, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import type { Phase, Player, GameStatus } from "../types/game";
import type { GamePace } from "./CreateRoomModal";
import { RoomSettingsModal } from "./RoomSettingsModal";
import type { RoomSettingsFormData } from "./RoomSettingsModal";

// ─── Phase config ──────────────────────────────────────────────────────────

const PHASE_CFG: Partial<
	Record<Phase, { label: string; colorClass: string; icon: string }>
> = {
	hunting: {
		label: "Hunting",
		colorClass: "text-emerald-400 bg-emerald-900/40 border-emerald-700/40",
		icon: "fa-solid fa-crosshairs",
	},
	action: {
		label: "Action",
		colorClass: "text-amber-400   bg-amber-900/40   border-amber-700/40",
		icon: "fa-solid fa-bolt",
	},
	resolution: {
		label: "Resolution",
		colorClass: "text-sky-400     bg-sky-900/40     border-sky-700/40",
		icon: "fa-solid fa-hourglass-half",
	},
};

const PACE_CFG: Record<GamePace, { label: string; icon: string }> = {
	chill: { label: "Chill (no limit)", icon: "fa-solid fa-mug-hot" },
	slow: { label: "Slow (2 min/turn)", icon: "fa-solid fa-hourglass-half" },
	fast: { label: "Fast (1 min/turn)", icon: "fa-solid fa-bolt" },
};

// ─── Props ─────────────────────────────────────────────────────────────────

interface GameHeaderProps {
	status: GameStatus;
	round: number | null;
	phase: Phase | "";
	players: Player[];
	activePlayerId: string | null;
	myPlayerId: string | null;
	onLeave: () => void;
	onStartGame?: () => void;
	/** Room metadata for the info chip + settings */
	roomName?: string;
	roomHost?: string;
	pace?: GamePace;
	isPrivate?: boolean;
	/** True when the current player is the host */
	isHost?: boolean;
	/** Current settings passed to the settings modal form */
	roomSettings?: RoomSettingsFormData;
	/** Number of players currently in the room (caps min maxPlayers in settings) */
	currentPlayerCount?: number;
	onSaveSettings?: (data: RoomSettingsFormData) => void;
	onReady?: () => void;
	roomPlayers?: Array<{ userId: string; username: string; isReady: boolean }>;
}

// ─── Component ─────────────────────────────────────────────────────────────

export function GameHeader({
	status,
	round,
	phase,
	players,
	activePlayerId,
	myPlayerId,
	onLeave,
	onStartGame,
	roomName,
	roomHost,
	pace,
	isPrivate,
	isHost,
	roomSettings,
	currentPlayerCount = 2,
	onSaveSettings,
	onReady,
	roomPlayers,
}: GameHeaderProps) {
	const [showSettings, setShowSettings] = useState(false);
	const [tooltipPos, setTooltipPos] = useState<{
		left: number;
		top: number;
	} | null>(null);
	const [menuOpen, setMenuOpen] = useState(false);
	const [dropdownTop, setDropdownTop] = useState(0);
	const triggerRef = useRef<HTMLDivElement>(null);
	const headerRef = useRef<HTMLElement>(null);
	const dropdownRef = useRef<HTMLDivElement>(null);

	const closeMenu = useCallback(() => setMenuOpen(false), []);

	const handleMenuToggle = useCallback(() => {
		if (!menuOpen && headerRef.current) {
			setDropdownTop(headerRef.current.getBoundingClientRect().bottom);
		}
		setMenuOpen((prev) => !prev);
	}, [menuOpen]);

	useEffect(() => {
		if (!menuOpen) return;
		const handleClick = (e: MouseEvent) => {
			const target = e.target as Node;
			if (
				headerRef.current?.contains(target) ||
				dropdownRef.current?.contains(target)
			) return;
			closeMenu();
		};
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") closeMenu();
		};
		document.addEventListener("mousedown", handleClick);
		document.addEventListener("keydown", handleKeyDown);
		return () => {
			document.removeEventListener("mousedown", handleClick);
			document.removeEventListener("keydown", handleKeyDown);
		};
	}, [menuOpen, closeMenu]);

	const handleRoomInfoEnter = useCallback(() => {
		if (!triggerRef.current) return;
		const r = triggerRef.current.getBoundingClientRect();
		setTooltipPos({ left: r.left, top: r.bottom + 6 });
	}, []);

	const handleRoomInfoLeave = useCallback(() => setTooltipPos(null), []);

	const phaseConf = phase
		? PHASE_CFG[phase as import("../types/game").Phase]
		: null;
	const paceConf = pace ? PACE_CFG[pace] : null;
	const activePlayer = players.find((p) => p.id === activePlayerId);
	const isMyTurn = activePlayerId === myPlayerId;

	const isAllReady = roomPlayers ? roomPlayers.every((p) => p.isReady) : false;
	const amIReady = roomPlayers
		? roomPlayers.find((p) => p.userId === myPlayerId)?.isReady
		: false;

	const canStartGame = isHost && isAllReady && players.length > 1;

	return (
		<>
			<header ref={headerRef} className="bg-slate-900/80 backdrop-blur-sm border-b border-slate-700/50 px-4 py-2.5 flex items-center gap-3">
				{/* Title */}
				<h1 className="title-glow text-base font-bold text-white flex-shrink-0 text-center leading-tight">
				<span className="sm:hidden">Vale<br/>of<br/>Eternity</span>
				<span className="hidden sm:inline whitespace-nowrap">Vale of Eternity</span>
			</h1>

				{/* Room name + info icon */}
				{roomName && (
					<div
						ref={triggerRef}
						className="hidden sm:flex items-center gap-1.5 text-slate-300 text-sm cursor-default select-none flex-shrink-0"
						onMouseEnter={handleRoomInfoEnter}
						onMouseLeave={handleRoomInfoLeave}
					>
						<i className="fa-solid fa-door-open text-slate-500 text-xs" />
						<span className="font-medium text-white/90 max-w-32 truncate">
							{roomName}
						</span>
						<i className="fa-solid fa-circle-info text-slate-500 text-xs" />
					</div>
				)}

				{/* Separator */}
				{roomName && <div className="hidden sm:block w-px h-4 bg-slate-700 flex-shrink-0" />}

				{/* Game info cluster — changes based on game status */}
				<div className="flex items-center gap-3 flex-wrap flex-1 min-w-0 justify-center">
					{status === "waiting" || status === "finished" ? (
						/* ── Waiting / finished: start button (host) or waiting label ── */
						isHost ? (
							<button
								onClick={onStartGame}
								className={`flex items-center gap-2 px-5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 border border-emerald-500/70 text-white font-bold text-sm transition-colors ${canStartGame ? "cursor-pointer" : "opacity-50 cursor-not-allowed"}`}
								disabled={!canStartGame}
							>
								<i className="fa-solid fa-play text-[11px]" />
								{status === "finished" ? "New Game" : "Start Game"}
							</button>
						) : (
							<button
								onClick={onReady}
								className={`flex items-center gap-2 px-5 py-1.5 rounded-lg border text-white font-bold text-sm transition-colors cursor-pointer ${
									amIReady
										? "bg-rose-700/80 hover:bg-rose-700 border-rose-600/70"
										: "bg-emerald-600 hover:bg-emerald-500 border-emerald-500/70"
								}`}
							>
								<i className={`fa-solid ${amIReady ? "fa-xmark" : "fa-check"} text-[11px]`} />
								{amIReady ? "Cancel Ready" : "Ready"}
							</button>
						)
					) : (
						/* ── In-progress: round / phase / turn / dots ── */
						<>
							{/* Round */}
							<div className="flex items-center gap-1.5 text-sm text-slate-300">
								<i className="fa-regular fa-circle-dot text-slate-500 text-xs" />
								Round <strong className="text-white">{round}</strong>/10
							</div>

							{/* Phase badge */}
							{phaseConf && (
								<span
									className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full border ${phaseConf.colorClass}`}
								>
									<i className={`${phaseConf.icon} text-[10px]`} />
									{phaseConf.label} Phase
								</span>
							)}

							{/* Turn indicator */}
							{activePlayer && (
								<div className="flex items-center gap-1.5">
									{isMyTurn ? (
										<span className="text-emerald-300 text-xs font-bold animate-pulse">
											<i className="fa-solid fa-bolt mr-1 text-[10px]" />
											Your Turn!
										</span>
									) : (
										<span className="text-slate-400 text-xs">
											{activePlayer.username}'s turn
										</span>
									)}
								</div>
							)}

							{/* Turn order dots */}
							<div className="hidden sm:flex items-center gap-1">
								{players.map((p) => (
									<div
										key={p.id}
										title={p.username}
										className={`w-2 h-2 rounded-full transition-all ${
											p.id === activePlayerId
												? "scale-125 ring-1 ring-white/40"
												: "opacity-40"
										} ${
											p.color === "purple"
												? "bg-purple-500"
												: p.color === "green"
													? "bg-teal-500"
													: p.color === "black"
														? "bg-slate-500"
														: "bg-gray-300"
										}`}
									/>
								))}
							</div>
						</>
					)}
				</div>

				{/* Right side: Settings (host only, waiting only) + Leave */}
				<div className="hidden sm:flex items-center gap-3 flex-shrink-0">
					{isHost && status === "waiting" && roomSettings && onSaveSettings && (
						<button
							onClick={() => setShowSettings(true)}
							className="flex items-center gap-1.5 text-slate-400 hover:text-white text-sm transition-colors cursor-pointer whitespace-nowrap"
							title="Room Settings"
						>
							<i className="fa-solid fa-gear" />
							<span>Settings</span>
						</button>
					)}

					<button
						onClick={onLeave}
						className="flex items-center gap-1.5 text-slate-400 hover:text-white text-sm transition-colors cursor-pointer whitespace-nowrap"
					>
						<i className="fa-solid fa-right-from-bracket" />
						<span>Leave</span>
					</button>
				</div>

				<button
					onClick={handleMenuToggle}
					className="sm:hidden flex items-center justify-center w-8 h-8 text-slate-400 hover:text-white transition-colors duration-200 cursor-pointer flex-shrink-0"
					aria-label={menuOpen ? "Close menu" : "Open menu"}
					aria-expanded={menuOpen}
				>
					<i className={`fa-solid ${menuOpen ? "fa-xmark" : "fa-bars"} text-lg`} />
				</button>
			</header>

			{/* Room settings modal */}
			{showSettings && roomSettings && onSaveSettings && (
				<RoomSettingsModal
					currentSettings={roomSettings}
					minPlayers={currentPlayerCount}
					onClose={() => setShowSettings(false)}
					onSave={(data) => {
						onSaveSettings(data);
						setShowSettings(false);
					}}
				/>
			)}

			{menuOpen &&
				createPortal(
					<div
						ref={dropdownRef}
						className="fixed left-0 right-0 z-[9998] bg-slate-900/95 backdrop-blur-sm border-b border-slate-700/50"
						style={{ top: dropdownTop }}
					>
						<div className="flex flex-col px-4 py-3 gap-1">
							{/* Room info */}
							{roomName && (
								<>
									<div className="px-3 py-2 space-y-1.5">
										<div className="flex items-center gap-2 text-sm text-white/90">
											<i className="fa-solid fa-door-open text-slate-500 w-4 text-center text-xs" />
											<span className="font-medium">{roomName}</span>
										</div>
										{roomHost && (
											<div className="flex items-center gap-2 text-xs text-slate-300">
												<i className="fa-solid fa-user text-slate-500 w-4 text-center" />
												<span>Host: <span className="text-white font-medium">{roomHost}</span></span>
											</div>
										)}
										{paceConf && (
											<div className="flex items-center gap-2 text-xs text-slate-300">
												<i className={`${paceConf.icon} text-slate-500 w-4 text-center`} />
												<span>{paceConf.label}</span>
											</div>
										)}
										<div className="flex items-center gap-2 text-xs text-slate-300">
											{isPrivate ? (
												<>
													<i className="fa-solid fa-lock text-amber-500/80 w-4 text-center" />
													<span className="text-amber-400/90">Private</span>
												</>
											) : (
												<>
													<i className="fa-solid fa-lock-open text-slate-500 w-4 text-center" />
													<span>Public</span>
												</>
											)}
										</div>
									</div>
									<div className="my-1 border-t border-slate-700/50" />
								</>
							)}

							{/* Settings (host, waiting only) */}
							{isHost && status === "waiting" && roomSettings && onSaveSettings && (
								<button
									onClick={() => { setShowSettings(true); closeMenu(); }}
									className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-slate-700/30 transition-colors duration-200 cursor-pointer text-left"
								>
									<i className="fa-solid fa-gear w-4 text-center" />
									Settings
								</button>
							)}

							{/* Leave */}
							<button
								onClick={() => { onLeave(); closeMenu(); }}
								className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-slate-700/30 transition-colors duration-200 cursor-pointer text-left"
							>
								<i className="fa-solid fa-right-from-bracket w-4 text-center" />
								Leave
							</button>
						</div>
					</div>,
					document.body,
				)}

			{/* Room info tooltip — portalled to escape header stacking context */}
			{tooltipPos &&
				createPortal(
					<div
						className="fixed z-[9999] pointer-events-none"
						style={{ left: tooltipPos.left, top: tooltipPos.top }}
					>
						<div className="bg-slate-900 border border-slate-600/70 rounded-lg shadow-xl p-3 w-52 space-y-2">
							{roomName && (
								<div className="flex items-center gap-2 text-sm text-slate-300">
									<i className="fa-solid fa-door-open text-slate-500 text-xs" />
									<span className="font-medium text-white/90 truncate">
										{roomName}
									</span>
								</div>
							)}
							{roomHost && (
								<div className="flex items-center gap-2 text-xs text-slate-300">
									<i className="fa-solid fa-user text-slate-500 w-3 text-center" />
									<span>
										Host:{" "}
										<span className="text-white font-medium">{roomHost}</span>
									</span>
								</div>
							)}
							{paceConf && (
								<div className="flex items-center gap-2 text-xs text-slate-300">
									<i
										className={`${paceConf.icon} text-slate-500 w-3 text-center`}
									/>
									<span>{paceConf.label}</span>
								</div>
							)}
							<div className="flex items-center gap-2 text-xs text-slate-300">
								{isPrivate ? (
									<>
										<i className="fa-solid fa-lock text-amber-500/80 w-3 text-center" />
										<span className="text-amber-400/90">Private</span>
									</>
								) : (
									<>
										<i className="fa-solid fa-lock-open text-slate-500 w-3 text-center" />
										<span>Public</span>
									</>
								)}
							</div>
						</div>
					</div>,
					document.body,
				)}
		</>
	);
}
