export type Family = 'fire' | 'water' | 'earth' | 'wind' | 'dragon';
export type EffectType = 'instant' | 'permanent' | 'resolution';
export type Phase = 'hunting' | 'action' | 'resolution';
export type PlayerColor = 'purple' | 'green' | 'black' | 'gray';

/**
 * A description token is either a plain string or a reference to a sprite
 * by its CSS class name (e.g. 'description-score-1', 'description-fire').
 */
export type DescToken = string | { sprite: string };

export interface Card {
    id: number;
    name: string;
    family: Family;
    cost: number;
    /** Base score. Use 'dynamic' for cards whose score depends on game state. */
    score: number | 'dynamic';
    effectType: EffectType;
    /**
     * Parsed card description as an array of text + sprite tokens.
     * Renders inline, matching the card image's printed text exactly.
     */
    description: DescToken[];
    /** Public path to the card face image, e.g. /assets/cards/fire/Salamander.webp */
    imagePath: string;
}

export interface StoneCount {
    red: number;    // stone-1, worth 1
    blue: number;   // stone-3, worth 3
    purple: number; // stone-6, worth 6
}

export function totalStoneCount(s: StoneCount) {
    return s.red + s.blue + s.purple;
}

export function totalStoneValue(s: StoneCount) {
    return s.red + s.blue * 3 + s.purple * 6;
}

export interface Player {
    id: number;
    username: string;
    color: PlayerColor;
    score: number;
    stones: StoneCount;
    summonedCards: Card[];
    hand: Card[];       // actual cards for self; empty [] for opponents
    handCount: number;  // total hand size (use this for opponents)
    isFirstPlayer: boolean;
    isCurrentTurn: boolean;
}

export interface FamilyZone {
    family: Family;
    cards: Card[];
}

export interface GameState {
    round: number;
    phase: Phase;
    activePlayerId: number;
    myPlayerId: number;
    players: Player[];
    boardZones: FamilyZone[];
    drawPileCount: number;
    discardPileCount: number;
}
