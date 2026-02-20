import type { FamilyZone, Family } from '../types/game';
import { CardStack, CardBack } from './CardStack';

// ─── Family zone header sprites ────────────────────────────────────────────
// Original: 250×85px. At scale 0.42 → 105×36px visual.

const FAMILY_SPRITE: Record<Family, string> = {
    fire:   'fire-cards-header',
    water:  'water-cards-header',
    earth:  'earth-cards-header',
    wind:   'wind-cards-header',
    dragon: 'dragon-cards-header',
};

// Sell rewards shown as text under each zone
const SELL_REWARD: Record<Family, string> = {
    fire:   '3 red',
    earth:  '4 red',
    water:  '1 blue',
    wind:   '1 red + 1 blue',
    dragon: '1 purple',
};

function FamilyZoneHeader({ family }: { family: Family }) {
    const SCALE = 0.42;
    const W = Math.round(250 * SCALE); // 105
    const H = Math.round(85 * SCALE);  // 36
    return (
        <div style={{ width: W, height: H, overflow: 'hidden', position: 'relative', flexShrink: 0 }}>
            <div
                className={`sprite ${FAMILY_SPRITE[family]} absolute`}
                style={{ transform: `scale(${SCALE})`, transformOrigin: 'top left' }}
            />
        </div>
    );
}

interface GameBoardProps {
    zones: FamilyZone[];
    drawPileCount: number;
    discardPileCount: number;
}

export function GameBoard({ zones, drawPileCount, discardPileCount }: GameBoardProps) {
    return (
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg border border-slate-700/50 p-3">
            <div className="flex items-stretch gap-3 overflow-x-auto">

                {/* Draw pile */}
                <div className="flex flex-col items-center justify-center gap-1.5 flex-shrink-0">
                    <span className="text-slate-500 text-[10px] uppercase tracking-widest">Draw</span>
                    <div className="relative">
                        <CardBack width={50} height={82} />
                        <div
                            className="absolute bg-slate-700 text-white font-bold rounded-full border border-slate-500 flex items-center justify-center"
                            style={{ top: -5, right: -7, minWidth: 18, height: 18, fontSize: 9, paddingInline: 2 }}
                        >
                            {drawPileCount}
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div className="w-px bg-slate-700/50 self-stretch flex-shrink-0" />

                {/* Family zones */}
                <div className="flex gap-4 flex-1 justify-around min-w-0">
                    {zones.map(zone => (
                        <div key={zone.family} className="flex flex-col items-center gap-1.5 flex-shrink-0">
                            <FamilyZoneHeader family={zone.family} />
                            <CardStack
                                cards={zone.cards}
                                faceDown={false}
                                label={`${zone.family.charAt(0).toUpperCase() + zone.family.slice(1)} Zone`}
                                emptyText="empty"
                                maxVisible={3}
                            />
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
                    <span className="text-slate-500 text-[10px] uppercase tracking-widest">Discard</span>
                    <div className="relative">
                        <CardBack width={50} height={82} />
                        <div
                            className="absolute bg-slate-700 text-white font-bold rounded-full border border-slate-500 flex items-center justify-center"
                            style={{ top: -5, right: -7, minWidth: 18, height: 18, fontSize: 9, paddingInline: 2 }}
                        >
                            {discardPileCount}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
