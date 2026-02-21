import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router';
import type { Route } from './+types/gameRoom';
import { useUser } from '../contexts/UserContext';
import { toast } from 'sonner';
import { socket } from '../sockets/connection';
import { RoomEvents, type RoomDetail, type RoomJoinedPayload, type RoomLeftPayload, type RoomUpdatePayload, type RoomUpdatedPayload } from '../sockets/contract';
import { GameHeader } from '../components/GameHeader';
import { GameBoard } from '../components/GameBoard';
import { PlayerArea } from '../components/PlayerArea';
import type { GameState, GameStatus, Player, PlayerColor } from '../types/game';
import type { RoomSettingsFormData } from '../components/RoomSettingsModal';
import './gameRoom.css';

const PLAYER_COLORS: PlayerColor[] = ['purple', 'green', 'black', 'gray'];

const COLOR_DOT: Record<PlayerColor, string> = {
    purple: 'bg-purple-500',
    green:  'bg-emerald-500',
    black:  'bg-slate-400',
    gray:   'bg-gray-400',
};

export function meta({}: Route.MetaArgs) {
    return [
        { title: 'Game Room - Vale of Eternity' },
        { name: 'description', content: 'Vale of Eternity Board Game' },
    ];
}

export default function GameRoom() {
    const location = useLocation();
    const [roomInfo, setRoomInfo] = useState<RoomDetail | null>(
        (location.state as { roomDetail?: RoomDetail } | null)?.roomDetail ?? null
    );
    const navigate = useNavigate();
    const { user } = useUser();

    // Game lifecycle state — toggled locally until socket events are wired up server-side
    const [gameStatus, setGameStatus] = useState<GameStatus>(
        () => (roomInfo?.status as GameStatus | undefined) ?? 'waiting'
    );
    // 0 = no active player (waiting/finished); set to first player's id when game starts
    const [activePlayerId, setActivePlayerId] = useState(0);

    // Ref keeps socket callbacks in sync with latest roomInfo without re-registering listeners
    const roomInfoRef = useRef(roomInfo);
    useEffect(() => { roomInfoRef.current = roomInfo; }, [roomInfo]);

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
            if (joined && joined.userId !== user.userId) {
                toast.success(`${joined.username} joined the room`);
            }
            if (payload.roomDetail.status !== 'waiting') {
                setGameStatus(payload.roomDetail.status as GameStatus);
            }
        };

        const onLeft = (payload: RoomLeftPayload) => {
            if (payload.roomDetail) {
                const prevPlayers = roomInfoRef.current?.players ?? [];
                const left = prevPlayers.find(
                    p => !payload.roomDetail!.players.some(pp => pp.userId === p.userId)
                );
                setRoomInfo(payload.roomDetail);
                if (left) toast.warning(`${left.username} left the room`);
            }
        };

        const onUpdated = (payload: RoomUpdatedPayload) => {
            setRoomInfo(payload.roomDetail);
            toast.success('Room updated successfully');
        };

        socket.on(RoomEvents.JOINED, onJoined);
        socket.on(RoomEvents.LEFT, onLeft);
        socket.on(RoomEvents.UPDATED, onUpdated);

        return () => {
            socket.off(RoomEvents.JOINED, onJoined);
            socket.off(RoomEvents.LEFT, onLeft);
            socket.off(RoomEvents.UPDATED, onUpdated);
        };
    }, [user]);

    useEffect(() => {
        if (!user) return;
        console.log("roomInfo changed:", roomInfo);
    }, [roomInfo]);

    if (!user) return null;

    const roomPlayers: Player[] = (roomInfo?.players ?? []).map((p, i) => ({
        id: i + 1,
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

    const myPlayerId = (roomInfo?.players.findIndex(p => p.userId === user.userId) ?? -1) + 1;

    const game: GameState = {
        round: 1,
        phase: 'hunting',
        activePlayerId: 1,
        myPlayerId,
        players: roomPlayers,
        boardZones: [
            { family: 'fire',   cards: [] },
            { family: 'water',  cards: [] },
            { family: 'earth',  cards: [] },
            { family: 'wind',   cards: [] },
            { family: 'dragon', cards: [] },
        ],
        drawPileCount: 0,
        discardPileCount: 0,
    };

    const myPlayer = { ...game.players.find(p => p.id === game.myPlayerId)!, username: user.username };
    const opponents = game.players.filter(p => p.id !== game.myPlayerId);
    const isMyTurn = game.activePlayerId === game.myPlayerId;

    const isHost = roomInfo?.hostUserId === user.userId;
    const roomHostName = roomInfo
        ? (roomInfo.hostUserId === user.userId ? user.username : roomInfo.hostUsername)
        : '';

    const handleRoomLeave = () => {
        socket.emit(RoomEvents.LEAVE, { roomId: roomInfo?.id });
        navigate('/lobby');
    };

    const handleStartGame = () => {
        setGameStatus('in-progress');
        // TODO: replace with initial state from socket game:state event
        setActivePlayerId(roomPlayers[0]?.id ?? 1);
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

    return (
        <div className="game-room-container fixed inset-0 overflow-y-auto">
            {/* Background overlay */}
            <div className="fixed inset-0 bg-black/65 pointer-events-none" />

            <div className="relative min-h-screen flex flex-col">
                {/* ── Header ── */}
                <GameHeader
                    status={gameStatus}
                    round={game.round}
                    phase={game.phase}
                    players={game.players}
                    activePlayerId={game.activePlayerId}
                    myPlayerId={game.myPlayerId}
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

                {/* ── Main layout ── */}
                <main className="flex-1 flex flex-col gap-3 p-3 max-w-5xl mx-auto w-full">

                    {/* ── Opponents row ── */}
                    {opponents.length > 0 && (
                        <div className="flex gap-3">
                            {opponents.map(p => (
                                <div key={p.id} className="flex-1 min-w-0">
                                    <PlayerArea player={p} isSelf={false} isActive={p.id === game.activePlayerId} />
                                </div>
                            ))}
                        </div>
                    )}

                    {/* ── Game board ── */}
                    <GameBoard
                        zones={game.boardZones}
                        drawPileCount={game.drawPileCount}
                        discardPileCount={game.discardPileCount}
                    />

                    {/* ── Score strip ── */}
                    <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg border border-slate-700/50 px-3 py-2 flex items-center gap-3 flex-wrap">
                        <span className="text-slate-500 text-[10px] uppercase tracking-widest flex-shrink-0">Scores</span>
                        <div className="flex items-center gap-4 flex-wrap flex-1">
                            {game.players.map(p => (
                                <div key={p.id} className="flex items-center gap-1.5">
                                    <div className={`w-2 h-2 rounded-full ${COLOR_DOT[p.color]}`} />
                                    <span className="text-slate-300 text-xs">
                                        {p.id === game.myPlayerId ? user.username : p.username}
                                    </span>
                                    <span className="text-white text-xs font-bold">{p.score}</span>
                                    {p.isFirstPlayer && <span className="text-yellow-400 text-[9px]">★</span>}
                                    {p.score >= 60 && <span className="text-yellow-300 text-[10px] font-bold">60+</span>}
                                </div>
                            ))}
                        </div>
                        <span className="text-slate-600 text-[10px] flex-shrink-0">
                            ends at 60 pts or round 10
                        </span>
                    </div>

                    {/* ── My area ── */}
                    <PlayerArea
                        player={myPlayer}
                        isSelf={true}
                        isMyTurn={isMyTurn}
                    />

                </main>
            </div>
        </div>
    );
}
