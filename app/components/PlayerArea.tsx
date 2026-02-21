import type { Card, Player } from '../types/game';
import { CardStack } from './CardStack';
import { StoneRow } from './StoneRow';

// ─── Player avatar sprite ──────────────────────────────────────────────────

function PlayerAvatar({ color, size }: { color: string; size: number }) {
    const scale = size / 90; // 90 is the sprite's native size
    return (
        <div
            style={{ width: size, height: size, overflow: 'hidden', position: 'relative', flexShrink: 0 }}
            className="rounded-full"
        >
            <div
                className={`sprite player-${color} absolute`}
                style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}
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
}

// ─── Compact opponent card ────────────────────────────────────────────────

function CompactPlayerArea({ player, isActive }: { player: Player; isActive: boolean }) {
    // For opponents: hand is face-down, modelled as N placeholder cards
    const handPlaceholders: Card[] = Array.from({ length: player.handCount }, (_, i) => ({
        id: -i,
        name: '?',
        family: 'fire' as const,
        cost: 0,
        score: 0,
        effectType: 'instant' as const,
        description: [],
        imagePath: '',
    }));

    return (
        <div
            className={`
                bg-slate-700/50 backdrop-blur-sm rounded-lg border p-2.5 flex flex-col gap-2
                ${isActive
                    ? 'border-amber-500/60 ring-1 ring-amber-500/30'
                    : 'border-slate-600/50'
                }
            `}
        >
            {/* Top row: avatar + name + score */}
            <div className="flex items-center gap-2">
                <PlayerAvatar color={player.color} size={34} />
                <div className="flex flex-col min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-white text-xs font-semibold truncate">{player.username}</span>
                        {player.isFirstPlayer && (
                            <span className="text-yellow-400 text-[9px] font-bold">★1st</span>
                        )}
                        {isActive && (
                            <span className="inline-block w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse flex-shrink-0" />
                        )}
                    </div>
                    <span className="text-slate-400 text-[10px]">{player.score} pts</span>
                </div>
            </div>

            {/* Stones */}
            <StoneRow stones={player.stones} size="sm" />

            {/* Cards row */}
            <div className="flex items-start gap-2 min-w-0">
                {/* Summoned — flex-1 so it fills the available space */}
                <div className="flex flex-col gap-1 flex-1 min-w-0">
                    <span className="text-slate-500 text-[9px] uppercase tracking-wide">
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
                <div className="flex flex-col gap-1 flex-shrink-0">
                    <span className="text-slate-500 text-[9px] uppercase tracking-wide">
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

// ─── Full self area ───────────────────────────────────────────────────────

function FullPlayerArea({ player, isMyTurn }: { player: Player; isMyTurn: boolean }) {
    return (
        <div
            className={`
                bg-slate-700/40 backdrop-blur-sm rounded-lg border p-3 flex flex-col gap-3
                ${isMyTurn
                    ? 'border-amber-500/50 ring-1 ring-amber-500/20'
                    : 'border-slate-600/50'
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
                            <span className="text-yellow-400 text-xs font-bold">★ 1st Player</span>
                        )}
                        {isMyTurn && (
                            <span className="text-amber-300 text-xs font-bold animate-pulse">
                                <i className="fa-solid fa-bolt mr-1 text-[10px]" />Your Turn
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-slate-300 text-sm font-semibold">{player.score} pts</span>
                        <StoneRow stones={player.stones} size="sm" showEmpty />
                    </div>
                </div>
            </div>

            {/* Cards area — both sections fill width evenly */}
            <div className="flex gap-4">

                {/* Summoned */}
                <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                    <span className="text-slate-400 text-xs font-medium">
                        Summoned ({player.summonedCards.length})
                    </span>
                    {player.summonedCards.length === 0 ? (
                        <span className="text-slate-600 text-xs italic">No summoned cards</span>
                    ) : (
                        <CardStack
                            cards={player.summonedCards}
                            faceDown={false}
                            label="Your Summoned Cards"
                            stretch={true}
                        />
                    )}
                </div>

                <div className="w-px bg-slate-600/50 self-stretch" />

                {/* Hand (visible to self) */}
                <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                    <span className="text-slate-400 text-xs font-medium">
                        Hand ({player.hand.length})
                        <span className="text-slate-600 font-normal ml-1.5 text-[10px]">— secret from others</span>
                    </span>
                    {player.hand.length === 0 ? (
                        <span className="text-slate-600 text-xs italic">Empty hand</span>
                    ) : (
                        <CardStack
                            cards={player.hand}
                            faceDown={false}
                            label="Your Hand"
                            stretch={true}
                        />
                    )}
                </div>
            </div>

            {/* Action buttons (only when it's your turn) */}
            {isMyTurn && (
                <div className="flex gap-2 pt-2 border-t border-slate-600/50 flex-wrap">
                    {(
                        [
                            { label: 'Sell',   icon: 'fa-solid fa-coins',         title: 'Sell a drafted card for stones' },
                            { label: 'Tame',   icon: 'fa-solid fa-hand',           title: 'Tame a drafted card into your hand' },
                            { label: 'Summon', icon: 'fa-solid fa-wand-sparkles',  title: 'Summon a card from your hand' },
                            { label: 'Remove', icon: 'fa-solid fa-trash',          title: 'Remove a summoned card from your area' },
                        ] as const
                    ).map(({ label, icon, title }) => (
                        <button
                            key={label}
                            title={title}
                            className="flex items-center gap-1.5 text-xs py-1.5 px-3 rounded-lg bg-slate-700 hover:bg-slate-600 border border-slate-600 hover:border-slate-500 text-slate-300 hover:text-white transition-colors cursor-pointer font-medium"
                        >
                            <i className={`${icon} text-[10px]`} />
                            {label}
                        </button>
                    ))}
                    <button className="ml-auto text-xs py-1.5 px-4 rounded-lg bg-amber-600/80 hover:bg-amber-600 border border-amber-500/70 text-white font-semibold transition-colors cursor-pointer">
                        End Turn
                    </button>
                </div>
            )}
        </div>
    );
}

// ─── Public export ─────────────────────────────────────────────────────────

export function PlayerArea({ player, isSelf, isMyTurn = false, isActive = false }: PlayerAreaProps) {
    if (isSelf) {
        return <FullPlayerArea player={player} isMyTurn={isMyTurn} />;
    }
    return <CompactPlayerArea player={player} isActive={isActive} />;
}
