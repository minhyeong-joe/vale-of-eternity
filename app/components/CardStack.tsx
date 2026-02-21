import { useState, useCallback, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import type { Card, Family } from '../types/game';

// ─── Family accent colors (used for tooltip border) ────────────────────────

const ACCENT: Record<Family, string> = {
    fire: '#f87171',
    water: '#60a5fa',
    earth: '#4ade80',
    wind: '#e879f9',
    dragon: '#818cf8',
};

// The sprite sheet uses 'air' for the wind family
const familyToSprite = (f: Family) => f === 'wind' ? 'air' : f;

// ─── Inline description sprite (26×27px, native size) ─────────────────────

function DescSprite({ name }: { name: string }) {
    return (
        <div
            className={`sprite ${name}`}
            style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}
        />
    );
}

// ─── Tooltip content panel ─────────────────────────────────────────────────

interface TooltipPanelProps {
    card: Card;
    /** position: fixed coordinates */
    left: number;
    top: number;
}

function TooltipPanel({ card, left, top }: TooltipPanelProps) {
    const accent = ACCENT[card.family];
    const familySprite = `description-${familyToSprite(card.family)}`;
    const effectSprite = `description-${card.effectType}`;

    return (
        <div
            className="fixed z-[9999] pointer-events-none"
            style={{ left, top, width: 200 }}
        >
            <div
                className="bg-slate-900/98 rounded-lg shadow-2xl p-3"
                style={{ border: `1px solid ${accent}66` }}
            >
                {/* Header row: family | effect type | cost | score */}
                <div className="flex items-center gap-1.5 mb-2">
                    <DescSprite name={familySprite} />
                    <DescSprite name={effectSprite} />
                    <div className="ml-auto flex items-center gap-2">
                        <span className="text-slate-400 text-[10px]">
                            Cost <span className="text-white font-bold">{card.cost}</span>
                        </span>
                        <span className="text-slate-400 text-[10px]">
                            ★ <span className="text-white font-bold">{card.score}</span>
                        </span>
                    </div>
                </div>

                {/* Card name */}
                <div
                    className="text-[11px] font-semibold mb-2 truncate"
                    style={{ color: accent }}
                >
                    {card.name}
                </div>

                <div className="border-t border-slate-700/80 mb-2" />

                {/* Description with inline sprites matching card text exactly */}
                <div className="leading-snug">
                    {card.description.map((token, i) =>
                        typeof token === 'string' ? (
                            <span key={i} className="text-slate-300" style={{ fontSize: 10 }}>
                                {token}
                            </span>
                        ) : (
                            <DescSprite key={i} name={token.sprite} />
                        )
                    )}
                </div>
            </div>
        </div>
    );
}

// ─── Compute tooltip position from mouse coords ────────────────────────────

const TW = 212; // tooltip width + padding
const TH = 140; // tooltip height estimate

function tooltipCoords(mx: number, my: number): { left: number; top: number } {
    const left = mx + TW + 16 > window.innerWidth
        ? mx - TW - 10
        : mx + 12;
    const top = Math.max(6, Math.min(my - 30, window.innerHeight - TH - 6));
    return { left, top };
}

// ─── Card face using the actual card image ─────────────────────────────────

interface CardImageProps {
    card: Card;
    width: number;
    height: number;
}

function CardImage({ card, width, height }: CardImageProps) {
    const [pos, setPos] = useState<{ left: number; top: number } | null>(null);

    const handleMove = useCallback((e: React.MouseEvent) => {
        setPos(tooltipCoords(e.clientX, e.clientY));
    }, []);

    const handleLeave = useCallback(() => setPos(null), []);

    return (
        <div
            className="relative flex-shrink-0"
            style={{ width, height }}
            onMouseMove={handleMove}
            onMouseLeave={handleLeave}
        >
            <img
                src={card.imagePath}
                alt={card.name}
                className="rounded select-none pointer-events-none w-full h-full"
                style={{ objectFit: 'cover', objectPosition: 'center top' }}
                draggable={false}
                onError={e => {
                    // fallback: hide broken image, show family-colored placeholder
                    (e.target as HTMLImageElement).style.display = 'none';
                }}
            />
            {pos && createPortal(
                <TooltipPanel card={card} left={pos.left} top={pos.top} />,
                document.body
            )}
        </div>
    );
}

// ─── Card back sprite ──────────────────────────────────────────────────────

export function CardBack({ width = 60, height = 98 }: { width?: number; height?: number }) {
    const scale = width / 125;
    return (
        <div
            className="rounded overflow-hidden flex-shrink-0"
            style={{ width, height, position: 'relative' }}
        >
            <div
                className="sprite card-back absolute"
                style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}
            />
        </div>
    );
}

// ─── Larger card for expand modal ─────────────────────────────────────────

function ModalCard({ card, faceDown }: { card: Card; faceDown: boolean }) {
    const W = 120, H = 180;
    if (faceDown) return <CardBack width={W} height={H} />;
    return <CardImage card={card} width={W} height={H} />;
}

// ─── CardStack ─────────────────────────────────────────────────────────────

const CARD_W = 64;
const CARD_H = 95;
const STACK_OFFSET = 18;      // offset for non-stretch compact stacks (always overlapping)
const CARD_GAP = 6;           // gap between cards when fully spread (no overlap)
const MIN_OFFSET = 5;         // minimum sliver per card when compressed hard
const BACK_CARD_W = 58;
const BACK_CARD_H = 95;
const BACK_STACK_OFFSET = 10; // back cards always tight — no dynamic needed

interface CardStackProps {
    cards: Card[];
    faceDown?: boolean;
    label: string;
    emptyText?: string;
    maxVisible?: number;
    noExpand?: boolean;
    stretch?: boolean;
    className?: string;
}

export function CardStack({
    cards,
    faceDown = false,
    label,
    emptyText = '—',
    maxVisible = 4,
    noExpand = false,
    stretch = false,
    className = '',
}: CardStackProps) {
    const [expanded, setExpanded] = useState(false);

    // Outer probe div measures the available container width in stretch mode.
    // The actual stack is sized to min(naturalWidth, probeWidth) inside it.
    const probeRef = useRef<HTMLDivElement>(null);
    const [measuredWidth, setMeasuredWidth] = useState<number | null>(null);

    useEffect(() => {
        if (!stretch || faceDown || typeof ResizeObserver === 'undefined') return;
        const el = probeRef.current;
        if (!el) return;
        const ro = new ResizeObserver(([entry]) => setMeasuredWidth(entry.contentRect.width));
        ro.observe(el);
        return () => ro.disconnect();
    }, [stretch, faceDown]);

    const canExpand = !noExpand && cards.length > 0;

    if (cards.length === 0) {
        return (
            <div
                className={`flex items-center justify-center rounded border border-dashed border-slate-700 flex-shrink-0 ${className}`}
                style={{ width: CARD_W, height: CARD_H }}
            >
                <span className="text-slate-600 text-[10px] text-center px-1 leading-tight">{emptyText}</span>
            </div>
        );
    }

    const cardW = faceDown ? BACK_CARD_W : CARD_W;
    const cardH = faceDown ? BACK_CARD_H : CARD_H;

    // In stretch mode, show every card (let the dynamic offset determine density).
    // In fixed mode, cap to maxVisible.
    const visible = (stretch && !faceDown) ? cards : cards.slice(0, Math.min(cards.length, maxVisible));

    // ─── Layout: offset per card + final stack pixel width ────────────────
    //  • Back cards           → tight fixed offset, no dynamic
    //  • Face-up, no stretch  → fixed STACK_OFFSET (always overlapping)
    //  • Face-up, stretch     → side-by-side (CARD_W + CARD_GAP) when there's room;
    //                           overlap only when naturalSpreadW > measuredWidth
    let effectiveOffset: number;
    let stackWidth: number;

    if (faceDown || visible.length <= 1) {
        effectiveOffset = faceDown ? BACK_STACK_OFFSET : STACK_OFFSET;
        stackWidth = cardW + effectiveOffset * Math.max(0, visible.length - 1);
    } else if (stretch && !faceDown && measuredWidth !== null && measuredWidth > 0) {
        const spreadOffset = CARD_W + CARD_GAP;                          // no overlap
        const spreadW = CARD_W + spreadOffset * (visible.length - 1);
        if (spreadW <= measuredWidth) {
            // Enough room — cards side by side, no overlap
            effectiveOffset = spreadOffset;
            stackWidth = spreadW;
        } else {
            // Not enough room — start overlapping to fit within measuredWidth
            effectiveOffset = Math.max(MIN_OFFSET, (measuredWidth - CARD_W) / (visible.length - 1));
            stackWidth = measuredWidth;
        }
    } else {
        // stretch but not yet measured, or non-stretch: use fixed stack offset
        effectiveOffset = STACK_OFFSET;
        stackWidth = CARD_W + STACK_OFFSET * Math.max(0, visible.length - 1);
    }

    // ─── Shared inner content ──────────────────────────────────────────────
    const innerStack = (
        <div
            className={`relative flex-shrink-0 ${canExpand ? 'cursor-pointer group' : ''}`}
            style={{ width: stackWidth, height: cardH }}
            onClick={canExpand ? () => setExpanded(true) : undefined}
        >
            {visible.map((card, i) => (
                <div
                    key={card.id}
                    className="absolute"
                    style={{ left: i * effectiveOffset, zIndex: i + 1 }}
                >
                    {faceDown
                        ? <CardBack width={cardW} height={cardH} />
                        : <CardImage card={card} width={CARD_W} height={CARD_H} />
                    }
                </div>
            ))}

            {/* Count badge — top-right of the rightmost card */}
            <div
                className="absolute bg-slate-800 border border-slate-500 text-white font-bold rounded-full flex items-center justify-center"
                style={{
                    top: -7, right: -9,
                    zIndex: visible.length + 2,
                    minWidth: 18, height: 18,
                    fontSize: 9, paddingInline: 3,
                }}
            >
                {cards.length}
            </div>

            {/* Click-to-expand hover tint */}
            {canExpand && (
                <div
                    className="absolute inset-0 bg-black/0 group-hover:bg-black/20 rounded transition-colors duration-150 pointer-events-none"
                    style={{ zIndex: visible.length + 1 }}
                />
            )}
        </div>
    );

    return (
        <>
            {/* ── Compact stack view ──
                In stretch mode: a w-full probe div measures the available space;
                the actual stack inside is sized to min(naturalWidth, probeWidth).
                In fixed mode: the stack div is its own flex-shrink-0 block. */}
            {stretch && !faceDown ? (
                <div ref={probeRef} className={`w-full ${className}`}>
                    {innerStack}
                </div>
            ) : (
                <div className={`flex-shrink-0 ${className}`}>
                    {innerStack}
                </div>
            )}

            {/* ── Expand modal ── */}
            {expanded && (
                <div
                    className="fixed inset-0 z-40 flex items-center justify-center p-4"
                    onClick={() => setExpanded(false)}
                >
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
                    <div
                        className="relative bg-slate-800/95 border border-slate-600/80 rounded-lg shadow-2xl p-5 w-full max-w-2xl"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-white font-bold text-sm">
                                {label}
                                <span className="text-slate-400 font-normal ml-1.5 text-xs">({cards.length})</span>
                            </h3>
                            <button
                                onClick={() => setExpanded(false)}
                                className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                            >
                                <i className="fa-solid fa-xmark" />
                            </button>
                        </div>

                        <div className="flex gap-3 overflow-x-auto pb-2">
                            {cards.map((card, i) => (
                                <ModalCard key={card.id ?? i} card={card} faceDown={faceDown} />
                            ))}
                        </div>

                        {!faceDown && (
                            <p className="text-slate-600 text-[10px] mt-3">
                                <i className="fa-solid fa-circle-info mr-1" />
                                Hover any card to see its effect description
                            </p>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
