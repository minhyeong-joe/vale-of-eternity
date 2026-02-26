import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router";
import type { Route } from "./+types/gameRoom";
import { useUser } from "../contexts/UserContext";
import { toast } from "sonner";
import { socket } from "../sockets/connection";
import {
	RoomEvents,
	GameEvents,
	type RoomDetail,
	type RoomJoinedPayload,
	type RoomLeftPayload,
	type RoomUpdatePayload,
	type RoomUpdatedPayload,
	type RoomPlayerReconnectingPayload,
	type ServerGameState,
} from "../sockets/contract";
import { GameHeader } from "../components/GameHeader";
import { GameBoard } from "../components/GameBoard";
import { PlayerArea } from "../components/PlayerArea";
import { InteractionModal } from "../components/InteractionModal";
import { GameOverModal } from "../components/GameOverModal";
import { AnimationLayer, type AnimSpec } from "../components/AnimationLayer";
import type {
	GameState,
	GameStatus,
	Player,
	PlayerColor,
	FamilyZone,
	Family,
	StoneCount,
} from "../types/game";
import { CardRepo as C } from "../data/CardRepo";
import type { RoomSettingsFormData } from "../components/RoomSettingsModal";
import "./gameRoom.css";
import { set } from "zod";

const PLAYER_COLORS: PlayerColor[] = ["purple", "green", "black", "gray"];

const COLOR_DOT: Record<PlayerColor, string> = {
	purple: "bg-purple-500",
	green: "bg-emerald-500",
	black: "bg-slate-400",
	gray: "bg-gray-400",
};

const FAMILIES: Family[] = ["fire", "water", "earth", "wind", "dragon"];

// ── GameState factories / transformers ───────────────────────────────────────

/**
 * Empty state for the waiting lobby.
 * Players are listed in join order (host first), but no cards, no stones, no active turn.
 */
function buildWaitingState(roomDetail: RoomDetail | null): GameState {
	const players: Player[] = (roomDetail?.players ?? []).map((p, i) => ({
		id: p.userId,
		username: p.username,
		color: PLAYER_COLORS[i % PLAYER_COLORS.length],
		score: 0,
		stones: { red: 0, blue: 0, purple: 0 },
		summonedCards: [],
		discardedCards: [],
		hand: [],
		handCount: 0,
		activeEffectsUsed: [],
		isFirstPlayer: i === 0,
		isCurrentTurn: false,
		isReady: p.isReady ?? false,
	}));

	return {
		round: null,
		phase: "",
		activePlayerId: null,
		firstPlayerIndex: 0,
		huntPickOrder: [],
		huntPicksDone: 0,
		players,
		boardZones: FAMILIES.map((fam) => ({ family: fam, cards: [] })),
		boardMarkers: {},
		drawPileCount: 0,
		discardPileCount: 0,
		pendingInteraction: null,
	};
}

/**
 * Converts the server's authoritative state into the UI GameState,
 * resolving card IDs into full Card objects via CardRepo.
 */
function transformServerState(
	ss: ServerGameState,
	myUserId: string,
): GameState {
	// huntPickOrder may contain player indices (numbers) or userIds (strings).
	// Normalise to userId strings so the UI can compare against myUserId.
	const huntPickOrder: string[] = (ss.huntPickOrder ?? []).map((entry) =>
		typeof entry === "number"
			? (ss.players[entry]?.userId ?? String(entry))
			: entry,
	);

	const boardZones: FamilyZone[] = FAMILIES.map((fam) => ({
		family: fam,
		cards: (ss.boardZones[fam] ?? []).map((id) => C[id]).filter(Boolean),
	}));

	const boardMarkers: Record<number, string> = {};
	for (const [cardIdStr, uid] of Object.entries(ss.boardMarkers ?? {})) {
		boardMarkers[Number(cardIdStr)] = uid;
	}

	// During hunting, whose turn it is comes from huntPickOrder[huntPicksDone],
	// not activePlayerIndex (which tracks action/resolution phase turns only).
	const huntingActiveUserId =
		ss.phase === "hunting" && huntPickOrder.length > 0
			? (huntPickOrder[ss.huntPicksDone % huntPickOrder.length] ?? null)
			: null;

	const activePlayerId =
		huntingActiveUserId ?? ss.players[ss.activePlayerIndex]?.userId ?? null;

	const players: Player[] = ss.players.map((sp, idx) => ({
		id: sp.userId,
		username: sp.username,
		color: sp.color as PlayerColor,
		score: sp.score,
		stones: sp.stones,
		summonedCards: (sp.area ?? []).map((id) => C[id]).filter(Boolean),
		discardedCards: (sp.discard ?? []).map((id) => C[id]).filter(Boolean),
		hand: (sp.hand ?? []).map((id) => C[id]).filter(Boolean),
		handCount: sp.handCount,
		activeEffectsUsed: sp.activeEffectsUsed ?? [],
		stoneValueBonus: sp.stoneValueBonus ?? { red: 0, blue: 0, purple: 0 },
		stoneOverrides: sp.stoneOverrides ?? [],
		costReductionAll: sp.costReductionAll ?? 0,
		costReductionByFamily: sp.costReductionByFamily ?? {},
		isFirstPlayer: idx === ss.firstPlayerIndex,
		isCurrentTurn: sp.userId === activePlayerId,
		isReady: false,
	}));

	return {
		round: ss.round,
		phase: ss.phase,
		activePlayerId,
		firstPlayerIndex: ss.firstPlayerIndex,
		huntPickOrder,
		huntPicksDone: ss.huntPicksDone ?? 0,
		players,
		boardZones,
		boardMarkers,
		drawPileCount: ss.drawDeckCount,
		discardPileCount: ss.discardPileCount,
		pendingInteraction: ss.pendingInteraction,
	};
}

// ── Component ────────────────────────────────────────────────────────────────

function capturePositions(): Map<string, DOMRect> {
	const m = new Map<string, DOMRect>();
	document.querySelectorAll("[data-anim]").forEach((el) => {
		const key = (el as HTMLElement).dataset.anim!;
		m.set(key, el.getBoundingClientRect());
	});
	return m;
}

function computeAnimations(
	prev: GameState,
	next: GameState,
	positions: Map<string, DOMRect>,
): AnimSpec[] {
	const specs: AnimSpec[] = [];
	const ts = Date.now();
	const center = (key: string) => {
		const r = positions.get(key);
		return r ? { x: r.left + r.width / 2, y: r.top + r.height / 2 } : null;
	};

	const prevBoardIds = new Set(
		prev.boardZones.flatMap((z) => z.cards.map((c) => c.id)),
	);
	const nextBoardIds = new Set(
		next.boardZones.flatMap((z) => z.cards.map((c) => c.id)),
	);
	for (const cardId of prevBoardIds) {
		if (nextBoardIds.has(cardId)) continue;
		const from = center(`board-card-${cardId}`);
		if (!from) continue;
		for (const np of next.players) {
			const pp = prev.players.find((p) => p.id === np.id);
			if (!pp) continue;
			const dRed = np.stones.red - pp.stones.red;
			const dBlue = np.stones.blue - pp.stones.blue;
			const dPurple = np.stones.purple - pp.stones.purple;
			if (dRed > 0 || dBlue > 0 || dPurple > 0) {
				const toDiscard = center("discard-pile");
				if (toDiscard)
					specs.push({
						id: `sell-card-${cardId}-${ts}`,
						fromX: from.x,
						fromY: from.y,
						toX: toDiscard.x,
						toY: toDiscard.y,
						content: "card-back",
					});
				const toStones = center(`stones-${np.id}`);
				if (toStones) {
					if (dRed > 0)
						specs.push({
							id: `sell-r-${ts}`,
							fromX: from.x,
							fromY: from.y,
							toX: toStones.x,
							toY: toStones.y,
							content: "stone-1",
						});
					if (dBlue > 0)
						specs.push({
							id: `sell-b-${ts}`,
							fromX: from.x,
							fromY: from.y,
							toX: toStones.x,
							toY: toStones.y,
							content: "stone-3",
						});
					if (dPurple > 0)
						specs.push({
							id: `sell-p-${ts}`,
							fromX: from.x,
							fromY: from.y,
							toX: toStones.x,
							toY: toStones.y,
							content: "stone-6",
						});
				}
				break;
			}
			if (np.handCount > pp.handCount) {
				const to = center(`hand-${np.id}`);
				if (to)
					specs.push({
						id: `tame-${cardId}-${ts}`,
						fromX: from.x,
						fromY: from.y,
						toX: to.x,
						toY: to.y,
						content: "card-back",
					});
				break;
			}
		}
	}

	if (next.drawPileCount < prev.drawPileCount) {
		const from = center("draw-pile");
		if (from) {
			for (const np of next.players) {
				const pp = prev.players.find((p) => p.id === np.id);
				if (!pp || np.handCount <= pp.handCount) continue;
				const to = center(`hand-${np.id}`);
				if (to)
					specs.push({
						id: `draw-${np.id}-${ts}`,
						fromX: from.x,
						fromY: from.y,
						toX: to.x,
						toY: to.y,
						content: "card-back",
					});
				break;
			}
		}
	}

	for (const np of next.players) {
		const pp = prev.players.find((p) => p.id === np.id);
		if (!pp) continue;
		const delta = np.score - pp.score;
		if (delta <= 0) continue;
		const to = center(`score-${np.id}`);
		if (!to) continue;
		const from = center(`stones-${np.id}`) ?? to;
		specs.push({
			id: `score-${np.id}-${ts}`,
			fromX: from.x,
			fromY: from.y,
			toX: to.x,
			toY: to.y,
			content: { text: `+${delta}` },
		});
	}

	return specs;
}

export function meta({}: Route.MetaArgs) {
	return [
		{ title: "Game Room - Vale of Eternity" },
		{ name: "description", content: "Vale of Eternity Board Game" },
	];
}

export default function GameRoom() {
	const location = useLocation();
	const navigate = useNavigate();
	const { user } = useUser();

	const [roomInfo, setRoomInfo] = useState<RoomDetail | null>(
		(location.state as { roomDetail?: RoomDetail } | null)?.roomDetail ?? null,
	);
	const [gameStatus, setGameStatus] = useState<GameStatus>(
		() => (roomInfo?.status as GameStatus | undefined) ?? "waiting",
	);
	const [gameState, setGameState] = useState<GameState>(() =>
		buildWaitingState(roomInfo),
	);

	const [anims, setAnims] = useState<AnimSpec[]>([]);
	const [showGameOver, setShowGameOver] = useState(false);
	const [selfReconnectStart, setSelfReconnectStart] = useState<number | null>(null);
	const [playerDisconnectTimes, setPlayerDisconnectTimes] = useState<Record<string, number>>({});
	const [, setTick] = useState(0);

	// Refs keep socket callbacks in sync with latest state without re-registering listeners
	const roomInfoRef = useRef(roomInfo);
	const gameStatusRef = useRef(gameStatus);
	const gameStateRef = useRef(gameState);
	useEffect(() => {
		roomInfoRef.current = roomInfo;
	}, [roomInfo]);
	useEffect(() => {
		gameStatusRef.current = gameStatus;
	}, [gameStatus]);
	useEffect(() => {
		gameStateRef.current = gameState;
	}, [gameState]);

	// Tick every second while any reconnect timer is active
	useEffect(() => {
		const hasActive = selfReconnectStart !== null || Object.keys(playerDisconnectTimes).length > 0;
		if (!hasActive) return;
		const id = setInterval(() => setTick((t) => t + 1), 1000);
		return () => clearInterval(id);
	}, [selfReconnectStart, playerDisconnectTimes]);

	// Clear opponent disconnect times when they reconnect (isConnected flips back)
	useEffect(() => {
		if (!roomInfo) return;
		setPlayerDisconnectTimes((prev) => {
			const next = { ...prev };
			let changed = false;
			for (const p of roomInfo.players) {
				if (p.isConnected !== false && next[p.userId]) {
					delete next[p.userId];
					changed = true;
				}
			}
			return changed ? next : prev;
		});
	}, [roomInfo]);

	useEffect(() => {
		if (!user) return;

		const onJoined = (payload: RoomJoinedPayload) => {
			const prevPlayers = roomInfoRef.current?.players ?? [];
			const joined = payload.roomDetail.players.find(
				(p) => !prevPlayers.some((pp) => pp.userId === p.userId),
			);
			setRoomInfo(payload.roomDetail);
			// Rebuild player list while waiting so new joiners appear immediately
			if (gameStatusRef.current === "waiting") {
				setGameState(buildWaitingState(payload.roomDetail));
			}
			if (joined && joined.userId !== user.userId) {
				toast.success(`${joined.username} joined the room`, {
					toasterId: "main-toaster",
				});
			}
		};

		const onLeft = (payload: RoomLeftPayload) => {
			if (!payload.roomDetail) return;
			const prevPlayers = roomInfoRef.current?.players ?? [];
			const left = prevPlayers.find(
				(p) =>
					!payload.roomDetail!.players.some((pp) => pp.userId === p.userId),
			);
			setRoomInfo(payload.roomDetail);
			if (gameStatusRef.current === "waiting") {
				setGameState(buildWaitingState(payload.roomDetail));
			} else {
				// Remove the left player from gameState.players if game is in-progress
				setGameState((prev) => ({
					...prev,
					players: prev.players.filter((p) =>
						payload?.roomDetail?.players.some((rp) => rp.userId === p.id),
					),
				}));
			}
			if (left)
				toast.warning(`${left.username} left the room`, {
					toasterId: "main-toaster",
				});
		};

		const onUpdated = (payload: RoomUpdatedPayload) => {
			const prev = roomInfoRef.current;
			const prevPlayers = prev?.players ?? [];
			const gameStarting = payload.roomDetail.status !== "waiting";
			for (const newP of payload.roomDetail.players) {
				const prevP = prevPlayers.find((p) => p.userId === newP.userId);
				if (
					prevP &&
					prevP.isReady !== newP.isReady &&
					gameStatusRef.current === "waiting" &&
					!gameStarting
				) {
					if (newP.isReady)
						toast.success(`${newP.username} is ready`, {
							toasterId: "main-toaster",
						});
					else
						toast.warning(`${newP.username} is not ready`, {
							toasterId: "main-toaster",
						});
				}
			}
			if (
				prev &&
				(prev.name !== payload.roomDetail.name ||
					prev.pace !== payload.roomDetail.pace ||
					prev.maxPlayers !== payload.roomDetail.maxPlayers ||
					prev.isPrivate !== payload.roomDetail.isPrivate)
			) {
				toast.success("Room updated successfully", {
					toasterId: "main-toaster",
				});
			}
			setRoomInfo(payload.roomDetail);
		};

		const onPlayerReconnecting = ({
			userId: dcUserId,
			username: dcUsername,
		}: RoomPlayerReconnectingPayload) => {
			setRoomInfo((prev) => {
				if (!prev) return prev;
				return {
					...prev,
					players: prev.players.map((p) =>
						p.userId === dcUserId ? { ...p, isConnected: false } : p,
					),
				};
			});
			setPlayerDisconnectTimes((prev) => ({ ...prev, [dcUserId]: Date.now() }));
			toast.warning(`${dcUsername} lost connection. Waiting to reconnect...`, {
				toasterId: "main-toaster",
			});
		};

		socket.on(RoomEvents.JOINED, onJoined);
		socket.on(RoomEvents.LEFT, onLeft);
		socket.on(RoomEvents.UPDATED, onUpdated);
		socket.on(RoomEvents.PLAYER_RECONNECTING, onPlayerReconnecting);

		// ── Game events ───────────────────────────────────────────────────

		const onGameState = (ss: ServerGameState) => {
			const positions = capturePositions();
			const newState = transformServerState(ss, user.userId);
			const newAnims = computeAnimations(
				gameStateRef.current,
				newState,
				positions,
			);
			if (gameStatusRef.current === "finished") {
				setGameStatus("finished");
				setShowGameOver(true);
			} else {
				setGameStatus("in-progress");
			}
			setGameState(newState);
			if (newAnims.length > 0) setAnims((prev) => [...prev, ...newAnims]);
		};

		const onGameStateDelta = (delta: Partial<ServerGameState>) => {
			// The server currently emits full snapshots; treat delta as full state if complete.
			if ((delta as ServerGameState).phase) {
				onGameState(delta as ServerGameState);
			}
		};

		const onGameError = ({ message }: { code: string; message: string }) => {
			toast.error(message, { toasterId: "game-toaster" });
		};

		const onGameEnded = ({ reason }: { reason: string; username: string }) => {
			if (reason === "session_expired") {
				navigate("/lobby", { replace: true });
				return;
			}
			setGameStatus("waiting");
			setGameState(buildWaitingState(roomInfoRef.current));
		};

		socket.on(GameEvents.STATE, onGameState);
		socket.on(GameEvents.STATE_DELTA, onGameStateDelta);
		socket.on(GameEvents.ERROR, onGameError);
		socket.on(GameEvents.ENDED, onGameEnded);

		// If the socket was already connected before this effect ran (e.g. page
		// refresh: UserContext connects the socket before [user] triggers this
		// effect), request a fresh snapshot so we don't miss the server's initial
		// game:state emission.
		const onConnectRequestState = () => {
			setSelfReconnectStart(null);
			socket.emit(GameEvents.REQUEST_STATE);
		};
		socket.on("connect", onConnectRequestState);
		if (socket.connected) {
			socket.emit(GameEvents.REQUEST_STATE);
		}

		const onOwnDisconnect = (reason: string) => {
			if (reason === "io server disconnect") return;
			setSelfReconnectStart(Date.now());
		};
		socket.on("disconnect", onOwnDisconnect);

		return () => {
			socket.off(RoomEvents.JOINED, onJoined);
			socket.off(RoomEvents.LEFT, onLeft);
			socket.off(RoomEvents.UPDATED, onUpdated);
			socket.off(RoomEvents.PLAYER_RECONNECTING, onPlayerReconnecting);
			socket.off(GameEvents.STATE, onGameState);
			socket.off(GameEvents.STATE_DELTA, onGameStateDelta);
			socket.off(GameEvents.ERROR, onGameError);
			socket.off(GameEvents.ENDED, onGameEnded);
			socket.off("connect", onConnectRequestState);
			socket.off("disconnect", onOwnDisconnect);
		};
	}, [user]);

	// Auto-end resolution turn when player has no activatable active effects
	useEffect(() => {
		if (
			!user ||
			gameState.phase !== "resolution" ||
			gameState.pendingInteraction ||
			gameStatus === "finished"
		)
			return;
		const me = gameState.players.find((p) => p.id === user.userId);
		if (!me || gameState.activePlayerId !== user.userId) return;
		const hasActivatable = me.summonedCards.some((card) => {
			const hasActive = card.effects.some((e) => e.type === "active");
			if (!hasActive || me.activeEffectsUsed.includes(card.id)) return false;
			// Genie Exalted (50): activatable as long as any other active card exists in area
			if (card.id === 50) {
				return me.summonedCards.some(
					(c) => c.id !== 50 && c.effects.some((e) => e.type === "active"),
				);
			}
			return true;
		});
		if (hasActivatable) return;
		const timer = setTimeout(() => {
			toast.info("No resolution actions — ending turn", {
				toasterId: "game-toaster",
			});
			socket.emit(GameEvents.END_TURN);
		}, 1000);
		return () => clearTimeout(timer);
	}, [
		user,
		gameStatus,
		gameState.phase,
		gameState.pendingInteraction,
		gameState.activePlayerId,
		gameState.players,
	]);

	if (!user) return null;

	if (!roomInfo) {
		return (
			<div className="fixed inset-0 bg-black/80 flex items-center justify-center">
				<p className="text-slate-300 text-sm animate-pulse">
					Reconnecting to room...
				</p>
			</div>
		);
	}

	// ── Derived values ───────────────────────────────────────────────────────

	const myPlayerId = user.userId;
	const myPlayer = gameState.players.find((p) => p.id === myPlayerId);
	const opponents = gameState.players.filter((p) => p.id !== myPlayerId);
	const isMyTurn = gameState.activePlayerId === myPlayerId;
	const isHost = roomInfo?.hostUserId === myPlayerId;
	const roomHostName = isHost ? user.username : (roomInfo?.hostUsername ?? "");

	/** userId of whose turn it is to pick during hunting (now derived from activePlayerId) */
	const activeHunterUserId =
		gameState.phase === "hunting" ? gameState.activePlayerId : null;

	// ── Handlers ─────────────────────────────────────────────────────────────

	const handleRoomLeave = () => {
		socket.emit(RoomEvents.LEAVE, { roomId: roomInfo?.id });
		navigate("/lobby");
	};

	const handleReady = () => {
		socket.emit(RoomEvents.READY);
	};

	const handleStartGame = () => {
		socket.emit(GameEvents.START);
	};

	const handleUpdateRoom = (data: RoomSettingsFormData) => {
		if (!roomInfo) return;
		const payload: RoomUpdatePayload = {
			roomId: roomInfo.id,
			name: data.name,
			pace: data.pace,
			maxPlayers: data.maxPlayers,
			password: data.password === "" ? null : data.password,
			isPrivate: data.password != null && data.password !== "",
		};
		socket.emit(RoomEvents.UPDATE, payload);
	};

	// ── Game action handlers ──────────────────────────────────────────────

	const handleHuntPick = (cardId: number) => {
		socket.emit(GameEvents.HUNT_PICK, { cardId });
	};

	const handleSell = (cardId: number) => {
		socket.emit(GameEvents.SELL, { cardId });
	};

	const handleTame = (cardId: number) => {
		socket.emit(GameEvents.TAME, { cardId });
	};

	const handleSummon = (cardId: number, payment: StoneCount) => {
		socket.emit(GameEvents.SUMMON, { cardId, payment });
	};

	const handleRemove = (cardId: number, payment: StoneCount) => {
		socket.emit(GameEvents.REMOVE, { cardId, payment });
	};

	const handleActivate = (cardId: number) => {
		if (
			gameState.pendingInteraction?.type === "genieActivation" &&
			gameState.pendingInteraction?.forUserId === myPlayerId
		) {
			socket.emit(GameEvents.RESPOND, { value: cardId });
		} else {
			socket.emit(GameEvents.ACTIVATE, { cardId });
		}
	};

	const handleEndTurn = () => {
		socket.emit(GameEvents.END_TURN);
	};

	const handleRespond = (
		value: string | number | number[] | string[] | Record<string, number>,
	) => {
		socket.emit(GameEvents.RESPOND, { value });
	};

	const handleGameOverClose = () => {
		setShowGameOver(false);
		setGameStatus("waiting");
		setGameState(buildWaitingState(roomInfoRef.current));
	};

	// ── Render ───────────────────────────────────────────────────────────────

	return (
		<div className="game-room-container fixed inset-0 overflow-y-auto">
			<div className="fixed inset-0 bg-black/65 pointer-events-none" />

			<div className="relative min-h-screen flex flex-col">
				<GameHeader
					status={gameStatus}
					round={gameState.round}
					phase={gameState.phase}
					players={gameState.players}
					activePlayerId={gameState.activePlayerId}
					myPlayerId={myPlayerId}
					onLeave={handleRoomLeave}
					onStartGame={handleStartGame}
					roomName={roomInfo?.name ?? ""}
					roomHost={roomHostName}
					pace={roomInfo?.pace ?? "chill"}
					isPrivate={roomInfo?.isPrivate ?? false}
					isHost={isHost}
					roomSettings={{
						name: roomInfo?.name ?? "",
						maxPlayers: roomInfo?.maxPlayers ?? 4,
						pace: roomInfo?.pace ?? "chill",
						password: "",
					}}
					currentPlayerCount={roomInfo?.currentPlayers ?? 0}
					onSaveSettings={handleUpdateRoom}
					onReady={handleReady}
					roomPlayers={roomInfo?.players ?? []}
				/>

				<main className="flex-1 flex flex-col gap-3 p-3 max-w-screen-2xl mx-auto w-full">
					{/* Opponents row */}
					{opponents.length > 0 && (
						<div className="flex gap-3">
							{opponents.map((p) => {
								const roomPlayer = roomInfo.players.find(
									(rp) => rp.userId === p.id,
								);
								const isConnected = roomPlayer?.isConnected ?? true;
								const opponentIsHost = roomInfo.hostUserId === p.id;
								const opponentIsReady = roomPlayer?.isReady ?? false;
								return (
									<div key={p.id} className="flex-1 min-w-0 relative">
										{!isConnected && (
											<div className="absolute inset-0 bg-black/50 z-10 flex items-center justify-center rounded-lg backdrop-blur-sm">
												<span className="text-slate-300 text-xs font-medium animate-pulse">
													Reconnecting... ({Math.max(0, 60 - Math.floor((Date.now() - (playerDisconnectTimes[p.id] ?? Date.now())) / 1000))}s)
												</span>
											</div>
										)}
										<PlayerArea
											player={p}
											isSelf={false}
											isActive={p.id === gameState.activePlayerId}
											gameStatus={gameStatus}
											isHost={opponentIsHost}
											isReady={opponentIsReady}
										/>
									</div>
								);
							})}
						</div>
					)}

					{/* Game board */}
					<GameBoard
						zones={gameState.boardZones}
						drawPileCount={gameState.drawPileCount}
						discardPileCount={gameState.discardPileCount}
						myPlayerColor={myPlayer?.color}
						myUserId={myPlayerId}
						players={gameState.players}
						boardMarkers={gameState.boardMarkers}
						phase={gameState.phase}
						activeHunterUserId={activeHunterUserId}
						isMyTurn={isMyTurn}
						onHuntPick={handleHuntPick}
						onSell={handleSell}
						onTame={handleTame}
					/>

					{/* Score strip */}
					<div className="bg-slate-800/50 backdrop-blur-sm rounded-lg border border-slate-700/50 px-3 py-2 flex items-center gap-3 flex-wrap">
						<span className="text-slate-500 text-[10px] uppercase tracking-widest flex-shrink-0">
							Scores
						</span>
						<div className="flex items-center gap-4 flex-wrap flex-1">
							{gameState.players.map((p) => (
								<div key={p.id} className="flex items-center gap-1.5">
									<div
										className={`w-2 h-2 rounded-full ${COLOR_DOT[p.color]}`}
									/>
									<span className="text-slate-300 text-xs">{p.username}</span>
									<span className="text-white text-xs font-bold">
										{p.score}
									</span>
									{p.isFirstPlayer && (
										<span className="text-yellow-400 text-[9px]">★</span>
									)}
									{p.score >= 60 && (
										<span className="text-yellow-300 text-[10px] font-bold">
											60+
										</span>
									)}
								</div>
							))}
						</div>
						<span className="text-slate-600 text-[10px] flex-shrink-0">
							ends at 60 pts or round 10
						</span>
					</div>

					{/* My player area */}
					{myPlayer && (
						<PlayerArea
							player={myPlayer}
							isSelf={true}
							isMyTurn={isMyTurn}
							phase={gameState.phase}
							gameStatus={gameStatus}
							isHost={isHost}
							isReady={
								roomInfo.players.find((p) => p.userId === myPlayerId)
									?.isReady ?? false
							}
							genieActivationOptions={
								gameState.pendingInteraction?.type === "genieActivation" &&
								gameState.pendingInteraction?.forUserId === myPlayerId
									? ((
											gameState.pendingInteraction.context as {
												options?: number[];
											}
										).options ?? [])
									: undefined
							}
							onSummon={handleSummon}
							onRemove={handleRemove}
							onActivate={handleActivate}
							onEndTurn={handleEndTurn}
						/>
					)}
				</main>
			</div>

			{/* Flying animation overlay */}
			<AnimationLayer
				anims={anims}
				onAnimDone={(id) => setAnims((prev) => prev.filter((a) => a.id !== id))}
			/>

			{/* Game over modal */}
			{showGameOver && (
				<GameOverModal
					players={gameState.players}
					onClose={handleGameOverClose}
				/>
			)}

			{/* Interaction modal (card effect requires player input) */}
			{gameState.pendingInteraction && (
				<InteractionModal
					interaction={gameState.pendingInteraction}
					myUserId={myPlayerId}
					players={gameState.players}
					onRespond={handleRespond}
				/>
			)}

			{/* Reconnecting overlay */}
			{selfReconnectStart !== null && (
				<div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center gap-3">
					<div className="w-8 h-8 border-2 border-slate-400 border-t-white rounded-full animate-spin" />
					<p className="text-white text-sm font-medium">Reconnecting...</p>
					<p className="text-slate-400 text-xs">
						Your game is held for up to {Math.max(0, 60 - Math.floor((Date.now() - selfReconnectStart) / 1000))} seconds
					</p>
				</div>
			)}
		</div>
	);
}
