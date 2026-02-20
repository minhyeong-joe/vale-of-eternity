import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import type { Route } from './+types/gameRoom';
import { useUser } from '../contexts/UserContext';
import { GameHeader } from '../components/GameHeader';
import { GameBoard } from '../components/GameBoard';
import { PlayerArea } from '../components/PlayerArea';
import type { Card, GameState } from '../types/game';
import type { GamePace } from '../components/CreateRoomModal';
import './gameRoom.css';

export function meta({}: Route.MetaArgs) {
    return [
        { title: 'Game Room - Vale of Eternity' },
        { name: 'description', content: 'Vale of Eternity Board Game' },
    ];
}

// ─── Mock card data ───────────────────────────────────────────────────────

const C: Record<number, Card> = {
    1: {
        id: 1, name: 'Salamander', family: 'fire', cost: 1, score: 1, effectType: 'instant',
        imagePath: '/assets/cards/fire/Salamander.webp',
        description: ['Earn ', { sprite: 'description-stone-1' }, ' and ', { sprite: 'description-stone-1' }, '.'],
    },
    2: {
        id: 2, name: 'Burning Skull', family: 'fire', cost: 3, score: 3, effectType: 'instant',
        imagePath: '/assets/cards/fire/Burningskull.webp',
        description: ['Discard a card from your hand, then earn ', { sprite: 'description-stone-3' }, '.'],
    },
    3: {
        id: 3, name: 'Ifrit', family: 'fire', cost: 2, score: 'dynamic', effectType: 'instant',
        imagePath: '/assets/cards/fire/Ifrit.webp',
        description: ['Earn ', { sprite: 'description-stone-1' }, ' for each ', { sprite: 'description-fire' }, ' summoned.'],
    },
    4: {
        id: 4, name: 'Hydra', family: 'water', cost: 4, score: 4, effectType: 'instant',
        imagePath: '/assets/cards/water/Hydra.png',
        description: ['Choose 2: draw a card / earn ', { sprite: 'description-stone-3' }, ' and ', { sprite: 'description-stone-3' }, '.'],
    },
    5: {
        id: 5, name: 'Leviathan', family: 'water', cost: 6, score: 6, effectType: 'permanent',
        imagePath: '/assets/cards/water/Leviathan.png',
        description: ['Pay 1 less when summoning ', { sprite: 'description-water' }, ' cards.'],
    },
    6: {
        id: 6, name: 'Mud Slime', family: 'earth', cost: 4, score: 4, effectType: 'permanent',
        imagePath: '/assets/cards/earth/Mudslime.png',
        description: ['Earn 1 extra stone when selling an ', { sprite: 'description-earth' }, ' card.'],
    },
    7: {
        id: 7, name: 'Troll', family: 'earth', cost: 3, score: 3, effectType: 'permanent',
        imagePath: '/assets/cards/earth/Troll.png',
        description: ['Your summoning cost is reduced by 1.'],
    },
    8: {
        id: 8, name: 'Medusa', family: 'earth', cost: 5, score: 5, effectType: 'resolution',
        imagePath: '/assets/cards/earth/Medusa.png',
        description: ['Discard a card from your hand, then earn ', { sprite: 'description-stone-6' }, '.'],
    },
    9: {
        id: 9, name: 'Cerberus', family: 'earth', cost: 5, score: 5, effectType: 'permanent',
        imagePath: '/assets/cards/earth/Cerberus.png',
        description: ['Discard up to 3 of your summoned cards.'],
    },
    10: {
        id: 10, name: 'Griffon', family: 'wind', cost: 7, score: 7, effectType: 'resolution',
        imagePath: '/assets/cards/wind/Griffon.png',
        description: ['Draw a card.'],
    },
    11: {
        id: 11, name: 'Dragon Egg', family: 'dragon', cost: 3, score: 3, effectType: 'instant',
        imagePath: '/assets/cards/dragon/Dragonegg.webp',
        description: ['Draw 1 card and immediately summon it.'],
    },
    12: {
        id: 12, name: 'Eternity', family: 'dragon', cost: 8, score: 'dynamic', effectType: 'instant',
        imagePath: '/assets/cards/dragon/Eternity.png',
        description: ['Earn ', { sprite: 'description-score-4' }, ' pts for each different family in your area.'],
    },
    13: {
        id: 13, name: 'Kappa', family: 'water', cost: 3, score: 3, effectType: 'permanent',
        imagePath: '/assets/cards/water/Kappa.png',
        description: ['Whenever you summon a card using ', { sprite: 'description-stone-3' }, ', earn ', { sprite: 'description-score-2' }, ' pts.'],
    },
    14: {
        id: 14, name: 'Willow', family: 'dragon', cost: 2, score: 2, effectType: 'instant',
        imagePath: '/assets/cards/dragon/Willow.png',
        description: ['Draw 2 cards.'],
    },
    15: {
        id: 15, name: 'Ember', family: 'dragon', cost: 4, score: 7, effectType: 'instant',
        imagePath: '/assets/cards/dragon/Ember.png',
        description: ['Earn ', { sprite: 'description-score-7' }, ' pts. A player of your choice discards a summoned ', { sprite: 'description-water' }, ' card.'],
    },
};

// ─── Mock game state ──────────────────────────────────────────────────────

const MOCK_GAME: GameState = {
    round: 3,
    phase: 'hunting',
    activePlayerId: 4,
    myPlayerId: 1,
    players: [
        {
            id: 1,
            username: '',           // overridden at render time
            color: 'purple',
            score: 12,
            stones: { red: 2, blue: 1, purple: 0 },
            summonedCards: [C[1], C[4]],
            hand: [C[2], C[6], C[11]],
            handCount: 3,
            isFirstPlayer: false,
            isCurrentTurn: false,
        },
        {
            id: 2,
            username: 'Aelindra',
            color: 'green',
            score: 8,
            stones: { red: 3, blue: 0, purple: 0 },
            summonedCards: [C[3]],
            hand: [],
            handCount: 4,
            isFirstPlayer: true,
            isCurrentTurn: false,
        },
        {
            id: 3,
            username: 'Thorin',
            color: 'black',
            score: 15,
            stones: { red: 1, blue: 1, purple: 0 },
            summonedCards: [C[9], C[8]],
            hand: [],
            handCount: 2,
            isFirstPlayer: false,
            isCurrentTurn: true,
        },
        {
            id: 4,
            username: 'Seraph',
            color: 'gray',
            score: 6,
            stones: { red: 0, blue: 1, purple: 1 },
            summonedCards: [],
            hand: [],
            handCount: 6,
            isFirstPlayer: false,
            isCurrentTurn: false,
        },
    ],
    boardZones: [
        { family: 'fire',   cards: [C[1], C[2]] },
        { family: 'water',  cards: [C[13], C[4]] },
        { family: 'earth',  cards: [C[7]] },
        { family: 'wind',   cards: [] },
        { family: 'dragon', cards: [C[12], C[15]] },
    ],
    drawPileCount: 45,
    discardPileCount: 8,
};

// ─── Score board strip ─────────────────────────────────────────────────────

const COLOR_DOT: Record<string, string> = {
    purple: 'bg-purple-500',
    green:  'bg-emerald-500',
    black:  'bg-slate-400',
    gray:   'bg-gray-400',
};

// ─── Mock room metadata ────────────────────────────────────────────────────

const MOCK_ROOM = {
    name:       "Adventurers' Den",
    hostId:     1,          // player 1 (the current user) is the host
    pace:       'chill' as GamePace,
    isPrivate:  false,
    maxPlayers: 4,
};

// ─── Route component ──────────────────────────────────────────────────────

export default function GameRoom() {
    const navigate = useNavigate();
    const { user } = useUser();

    useEffect(() => {
        if (!user) navigate('/');
    }, [user, navigate]);

    if (!user) return null;

    const game = MOCK_GAME;
    const myPlayer = { ...game.players.find(p => p.id === game.myPlayerId)!, username: user.username };
    const opponents = game.players.filter(p => p.id !== game.myPlayerId);
    const isMyTurn = game.activePlayerId === game.myPlayerId;

    const isHost = MOCK_ROOM.hostId === game.myPlayerId;
    const roomHost = game.players.find(p => p.id === MOCK_ROOM.hostId);
    const roomHostName = MOCK_ROOM.hostId === game.myPlayerId ? user.username : roomHost?.username ?? '';

    return (
        <div className="game-room-container fixed inset-0 overflow-y-auto">
            {/* Background overlay */}
            <div className="fixed inset-0 bg-black/65 pointer-events-none" />

            <div className="relative min-h-screen flex flex-col">
                {/* ── Header ── */}
                <GameHeader
                    round={game.round}
                    phase={game.phase}
                    players={game.players}
                    activePlayerId={game.activePlayerId}
                    myPlayerId={game.myPlayerId}
                    onLeave={() => navigate('/lobby')}
                    roomName={MOCK_ROOM.name}
                    roomHost={roomHostName}
                    pace={MOCK_ROOM.pace}
                    isPrivate={MOCK_ROOM.isPrivate}
                    isHost={isHost}
                    roomSettings={{ name: MOCK_ROOM.name, maxPlayers: MOCK_ROOM.maxPlayers, pace: MOCK_ROOM.pace, password: '' }}
                    currentPlayerCount={game.players.length}
                    onSaveSettings={(data) => console.log('Room settings saved:', data)}
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
