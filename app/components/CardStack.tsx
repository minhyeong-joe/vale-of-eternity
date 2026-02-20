import { useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import type { Card, Family } from '../types/game';

// ─── Family accent colors (used for tooltip border) ────────────────────────

const ACCENT: Record<Family, string> = {
    fire:   '#f87171',
    water:  '#60a5fa',
    earth:  '#4ade80',
    wind:   '#e879f9',
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
const STACK_OFFSET = 18;
const BACK_CARD_W = 58;
const BACK_CARD_H = 95;
const BACK_STACK_OFFSET = 10;

interface CardStackProps {
    cards: Card[];
    faceDown?: boolean;
    /** Title shown in the expand modal */
    label: string;
    emptyText?: string;
    /** Max cards shown fanned in the compact stack */
    maxVisible?: number;
    /**
     * When true: clicking does NOT open the expand modal.
     * Use this for opponent hands — show stacked backs + count only.
     */
    noExpand?: boolean;
    className?: string;
}

export function CardStack({
    cards,
    faceDown = false,
    label,
    emptyText = '—',
    maxVisible = 4,
    noExpand = false,
    className = '',
}: CardStackProps) {
    const [expanded, setExpanded] = useState(false);
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

    const visible = cards.slice(0, Math.min(cards.length, maxVisible));
    const containerW = (faceDown ? BACK_CARD_W : CARD_W) + (faceDown ? BACK_STACK_OFFSET : STACK_OFFSET) * (visible.length - 1);

    return (
        <>
            {/* ── Compact stack view ── */}
            <div
                className={`relative flex-shrink-0 ${canExpand ? 'cursor-pointer group' : ''} ${className}`}
                style={{ width: containerW, height: faceDown ? BACK_CARD_H : CARD_H }}
                onClick={canExpand ? () => setExpanded(true) : undefined}
            >
                {visible.map((card, i) => (
                    <div
                        key={card.id}
                        className="absolute"
                        style={{ left: i * (faceDown ? BACK_STACK_OFFSET : STACK_OFFSET), zIndex: i + 1 }}
                    >
                        {faceDown
                            ? <CardBack width={BACK_CARD_W} height={BACK_CARD_H} />
                            : <CardImage card={card} width={CARD_W} height={CARD_H} />
                        }
                    </div>
                ))}

                {/* Count badge */}
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
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 rounded transition-colors duration-150 pointer-events-none" style={{ zIndex: visible.length + 1 }} />
                )}
            </div>

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
