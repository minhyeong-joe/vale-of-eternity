import type { StoneCount } from '../types/game';

type StoneSize = 'sm' | 'md';

// Sprite sheet scale factors
// stone-1 / stone-3: 85×83px original
// stone-6: 91×83px original
const STONE_SCALE: Record<StoneSize, { scale: number; w: number; h: number }> = {
    sm: { scale: 0.21, w: 18, h: 18 },
    md: { scale: 0.30, w: 26, h: 25 },
};

function StoneIcon({ type, size = 'sm' }: { type: 'stone-1' | 'stone-3' | 'stone-6'; size?: StoneSize }) {
    const { scale, w, h } = STONE_SCALE[size];
    return (
        <div style={{ width: w, height: h, overflow: 'hidden', position: 'relative', flexShrink: 0 }}>
            <div
                className={`sprite ${type} absolute`}
                style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}
            />
        </div>
    );
}

interface StoneRowProps {
    stones: StoneCount;
    size?: StoneSize;
    /** If true, always shows all 3 denominations even if count is 0 */
    showEmpty?: boolean;
}

export function StoneRow({ stones, size = 'sm', showEmpty = false }: StoneRowProps) {
    const textClass = size === 'sm' ? 'text-xs' : 'text-sm';
    return (
        <div className="flex items-center gap-2 flex-wrap">
            {(showEmpty || stones.red > 0) && (
                <div className="flex items-center gap-0.5">
                    <StoneIcon type="stone-1" size={size} />
                    <span className={`${textClass} text-slate-300`}>×{stones.red}</span>
                </div>
            )}
            {(showEmpty || stones.blue > 0) && (
                <div className="flex items-center gap-0.5">
                    <StoneIcon type="stone-3" size={size} />
                    <span className={`${textClass} text-slate-300`}>×{stones.blue}</span>
                </div>
            )}
            {(showEmpty || stones.purple > 0) && (
                <div className="flex items-center gap-0.5">
                    <StoneIcon type="stone-6" size={size} />
                    <span className={`${textClass} text-slate-300`}>×{stones.purple}</span>
                </div>
            )}
            {!showEmpty && stones.red === 0 && stones.blue === 0 && stones.purple === 0 && (
                <span className={`${textClass} text-slate-600 italic`}>No stones</span>
            )}
        </div>
    );
}

export { StoneIcon };
