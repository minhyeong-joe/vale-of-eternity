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
    round: number | null;
    phase: Phase | '';
    activePlayerId: string | null;
    players: Player[];
    boardZones: FamilyZone[];
    drawPileCount: number;
    discardPileCount: number;
}
