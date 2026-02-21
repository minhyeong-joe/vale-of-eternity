import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router';
import type { Route } from './+types/gameRoom';
import { useUser } from '../contexts/UserContext';
import { toast } from 'sonner';
import { socket } from '../sockets/connection';
import {
    RoomEvents,
    type RoomDetail,
    type RoomJoinedPayload,
    type RoomLeftPayload,
    type RoomUpdatePayload,
    type RoomUpdatedPayload,
} from '../sockets/contract';
import { GameHeader } from '../components/GameHeader';
import { GameBoard } from '../components/GameBoard';
import { PlayerArea } from '../components/PlayerArea';
import type { GameState, GameStatus, Player, PlayerColor } from '../types/game';
import { CardRepo as C } from '../data/CardRepo';
import type { RoomSettingsFormData } from '../components/RoomSettingsModal';
import './gameRoom.css';

const PLAYER_COLORS: PlayerColor[] = ['purple', 'green', 'black', 'gray'];

const COLOR_DOT: Record<PlayerColor, string> = {
    purple: 'bg-purple-500',
    green: 'bg-emerald-500',
    black: 'bg-slate-400',
    gray: 'bg-gray-400',
};

// ── GameState factories ──────────────────────────────────────────────────────

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
        hand: [],
        handCount: 0,
        isFirstPlayer: i === 0,
        isCurrentTurn: false,
    }));

    return {
        round: null,
        phase: '',
        activePlayerId: null,
        players,
        boardZones: [
            { family: 'fire', cards: [] },
            { family: 'water', cards: [] },
            { family: 'earth', cards: [] },
            { family: 'wind', cards: [] },
            { family: 'dragon', cards: [] },
        ],
        drawPileCount: 0,
        discardPileCount: 0,
    };
}

/**
 * Simulated mid-game state (round 4) for local development.
 * Uses real player objects so self/opponent rendering is correct.
 * TODO: replace with initial game:state socket event payload when server is ready.
 */
function buildMockGameState(players: Player[]): GameState {
    const mockData = [
        { score: 32, stones: { red: 2, blue: 1, purple: 0 }, summoned: [C[1], C[3], C[7]], hand: [C[14], C[15], C[4]], handCount: 3 },
        { score: 27, stones: { red: 0, blue: 2, purple: 1 }, summoned: [C[5], C[11]], hand: [], handCount: 4 },
        { score: 15, stones: { red: 3, blue: 0, purple: 0 }, summoned: [C[6], C[13]], hand: [], handCount: 2 },
        { score: 41, stones: { red: 1, blue: 1, purple: 0 }, summoned: [C[2], C[9]], hand: [], handCount: 3 },
    ];

    const mockPlayers: Player[] = players.map((p, i) => {
        const d = mockData[i % mockData.length];
        return {
            ...p,
            score: d.score,
            stones: d.stones,
            summonedCards: d.summoned,
            hand: i === 0 ? d.hand : [],  // only expose hand for self (index 0 = host in mock)
            handCount: d.handCount,
            isCurrentTurn: i === 0,
        };
    });

    return {
        round: 4,
        phase: 'action',
        activePlayerId: players[0]?.id ?? null,
        players: mockPlayers,
        boardZones: [
            { family: 'fire', cards: [C[1], C[3]] },
            { family: 'water', cards: [C[4], C[5]] },
            { family: 'earth', cards: [C[8]] },
            { family: 'wind', cards: [C[10]] },
            { family: 'dragon', cards: [C[11], C[12]] },
        ],
        drawPileCount: 28,
        discardPileCount: 14,
    };
}

// ── Component ────────────────────────────────────────────────────────────────

export function meta({ }: Route.MetaArgs) {
    return [
        { title: 'Game Room - Vale of Eternity' },
        { name: 'description', content: 'Vale of Eternity Board Game' },
    ];
}

export default function GameRoom() {
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useUser();

    const [roomInfo, setRoomInfo] = useState<RoomDetail | null>(
        (location.state as { roomDetail?: RoomDetail } | null)?.roomDetail ?? null
    );
    const [gameStatus, setGameStatus] = useState<GameStatus>(
        () => (roomInfo?.status as GameStatus | undefined) ?? 'waiting'
    );
    const [gameState, setGameState] = useState<GameState>(
        () => buildWaitingState(roomInfo)
    );

    // Refs keep socket callbacks in sync with latest state without re-registering listeners
    const roomInfoRef = useRef(roomInfo);
    const gameStatusRef = useRef(gameStatus);
    useEffect(() => { roomInfoRef.current = roomInfo; }, [roomInfo]);
    useEffect(() => { gameStatusRef.current = gameStatus; }, [gameStatus]);

    useEffect(() => {
        if (!user) navigate('/');
    }, [user, navigate]);

    useEffect(() => {
        if (!user) return;

        const onJoined = (payload: RoomJoinedPayload) => {
            const prevPlayers = roomInfoRef.current?.players ?? [];
            const joined = payload.roomDetail.players.find(
                p => !prevPlayers.some(pp => pp.userId === p.userId)
            );
            setRoomInfo(payload.roomDetail);
            // Rebuild player list while waiting so new joiners appear immediately
            if (gameStatusRef.current === 'waiting') {
                setGameState(buildWaitingState(payload.roomDetail));
            }
            if (joined && joined.userId !== user.userId) {
                toast.success(`${joined.username} joined the room`);
            }
        };

        const onLeft = (payload: RoomLeftPayload) => {
            if (!payload.roomDetail) return;
            const prevPlayers = roomInfoRef.current?.players ?? [];
            const left = prevPlayers.find(
                p => !payload.roomDetail!.players.some(pp => pp.userId === p.userId)
            );
            setRoomInfo(payload.roomDetail);
            if (gameStatusRef.current === 'waiting') {
                setGameState(buildWaitingState(payload.roomDetail));
            }
            if (left) toast.warning(`${left.username} left the room`);
        };

        const onUpdated = (payload: RoomUpdatedPayload) => {
            setRoomInfo(payload.roomDetail);
            toast.success('Room updated successfully');
        };

        // TODO: wire up game state socket events when server-side is ready
        // socket.on(GameEvents.STATE, (payload: GameStatePayload) => {
        //     setGameStatus('in-progress');
        //     setGameState(payload.gameState);
        // });

        socket.on(RoomEvents.JOINED, onJoined);
        socket.on(RoomEvents.LEFT, onLeft);
        socket.on(RoomEvents.UPDATED, onUpdated);

        return () => {
            socket.off(RoomEvents.JOINED, onJoined);
            socket.off(RoomEvents.LEFT, onLeft);
            socket.off(RoomEvents.UPDATED, onUpdated);
        };
    }, [user]);

    if (!user) return null;

    // ── Derived values ───────────────────────────────────────────────────────

    const myPlayerId = user.userId;
    const myPlayer = gameState.players.find(p => p.id === myPlayerId);
    const opponents = gameState.players.filter(p => p.id !== myPlayerId);
    const isMyTurn = gameState.activePlayerId === myPlayerId;
    const isHost = roomInfo?.hostUserId === myPlayerId;
    const roomHostName = isHost ? user.username : (roomInfo?.hostUsername ?? '');

    // ── Handlers ─────────────────────────────────────────────────────────────

    const handleRoomLeave = () => {
        socket.emit(RoomEvents.LEAVE, { roomId: roomInfo?.id });
        navigate('/lobby');
    };

    const handleStartGame = () => {
        // TODO: emit game:start; replace mock with server game:state payload
        setGameStatus('in-progress');
        setGameState(buildMockGameState(gameState.players));
    };

    const handleUpdateRoom = (data: RoomSettingsFormData) => {
        if (!roomInfo) return;
        const payload: RoomUpdatePayload = {
            roomId: roomInfo.id,
            name: data.name,
            pace: data.pace,
            maxPlayers: data.maxPlayers,
            password: data.password === '' ? null : data.password,
            isPrivate: data.password != null && data.password !== '',
        };
        socket.emit(RoomEvents.UPDATE, payload);
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
                    roomName={roomInfo?.name ?? ''}
                    roomHost={roomHostName}
                    pace={roomInfo?.pace ?? 'chill'}
                    isPrivate={roomInfo?.isPrivate ?? false}
                    isHost={isHost}
                    roomSettings={{ name: roomInfo?.name ?? '', maxPlayers: roomInfo?.maxPlayers ?? 4, pace: roomInfo?.pace ?? 'chill', password: '' }}
                    currentPlayerCount={roomInfo?.currentPlayers ?? 0}
                    onSaveSettings={handleUpdateRoom}
                />

                <main className="flex-1 flex flex-col gap-3 p-3 max-w-5xl mx-auto w-full">

                    {/* Opponents row */}
                    {opponents.length > 0 && (
                        <div className="flex gap-3">
                            {opponents.map(p => (
                                <div key={p.id} className="flex-1 min-w-0">
                                    <PlayerArea
                                        player={p}
                                        isSelf={false}
                                        isActive={p.id === gameState.activePlayerId}
                                    />
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Game board */}
                    <GameBoard
                        zones={gameState.boardZones}
                        drawPileCount={gameState.drawPileCount}
                        discardPileCount={gameState.discardPileCount}
                    />

                    {/* Score strip */}
                    <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg border border-slate-700/50 px-3 py-2 flex items-center gap-3 flex-wrap">
                        <span className="text-slate-500 text-[10px] uppercase tracking-widest flex-shrink-0">Scores</span>
                        <div className="flex items-center gap-4 flex-wrap flex-1">
                            {gameState.players.map(p => (
                                <div key={p.id} className="flex items-center gap-1.5">
                                    <div className={`w-2 h-2 rounded-full ${COLOR_DOT[p.color]}`} />
                                    <span className="text-slate-300 text-xs">{p.username}</span>
                                    <span className="text-white text-xs font-bold">{p.score}</span>
                                    {p.isFirstPlayer && <span className="text-yellow-400 text-[9px]">★</span>}
                                    {p.score >= 60 && <span className="text-yellow-300 text-[10px] font-bold">60+</span>}
                                </div>
                            ))}
                        </div>
                        <span className="text-slate-600 text-[10px] flex-shrink-0">ends at 60 pts or round 10</span>
                    </div>

                    {/* My player area */}
                    {myPlayer && (
                        <PlayerArea
                            player={myPlayer}
                            isSelf={true}
                            isMyTurn={isMyTurn}
                        />
                    )}

                </main>
            </div>
        </div>
    );
}
