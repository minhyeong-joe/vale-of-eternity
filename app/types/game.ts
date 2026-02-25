export type Family = 'fire' | 'water' | 'earth' | 'wind' | 'dragon';
export type EffectType = 'instant' | 'permanent' | 'active';
export type Phase = 'hunting' | 'action' | 'resolution';
export type PlayerColor = 'purple' | 'green' | 'black' | 'gray';
export type GameStatus = 'waiting' | 'in-progress' | 'finished';


export type DescToken = string | { sprite: string };

export interface CardEffect {
    type: EffectType;
    description: DescToken[];
}

export interface Card {
    id: number;
    name: string;
    family: Family;
    cost: number;
    effects: CardEffect[];
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
    id: string;
    username: string;
    color: PlayerColor;
    score: number;
    stones: StoneCount;
    /** Cards the player has summoned to their area */
    summonedCards: Card[];
    /** Cards in the player's discard pile */
    discardedCards: Card[];
    hand: Card[];               // actual cards for self; empty [] for opponents
    handCount: number;          // total hand size (use this for opponents)
    /** Card IDs whose active effect has already been triggered this resolution phase */
    activeEffectsUsed: number[];
    /** Per-stone-type bonus to base value (from permanent effects like Water Giant) */
    stoneValueBonus: StoneCount;
    /** Stone type remappings from permanent effects (e.g. Hae-tae swaps blue ↔ purple) */
    stoneOverrides: Array<{ from: string; countsAs: string }>;
    /** Flat cost reduction applied to all cards (e.g. Pegasus) */
    costReductionAll: number;
    /** Per-family cost reduction (e.g. Hippogriff for wind) */
    costReductionByFamily: Partial<Record<Family, number>>;
    isFirstPlayer: boolean;
    isCurrentTurn: boolean;
}

export interface FamilyZone {
    family: Family;
    cards: Card[];
}

export interface InteractionPayload {
    type: 'target' | 'card' | 'cards' | 'choice' | 'discardThenSummon' | 'stoneOverflow';
    forUserId: string;
    cardId: number;
    context: Record<string, unknown>;
}

export interface GameState {
    round: number | null;
    phase: Phase | '';
    activePlayerId: string | null;
    /** Index into players[] for the first-player token holder this round */
    firstPlayerIndex: number;
    /** Ordered userId list for the snake-draft hunt; huntPicksDone tracks progress */
    huntPickOrder: string[];
    huntPicksDone: number;
    players: Player[];
    boardZones: FamilyZone[];
    /** cardId → userId of who claimed the card (board markers placed during hunting) */
    boardMarkers: Record<number, string>;
    drawPileCount: number;
    discardPileCount: number;
    /** Non-null when a card effect is waiting for player input */
    pendingInteraction: InteractionPayload | null;
}
