import type { Player, StoneCount, Card } from "../types/game";
import { CardRepo } from "~/data/CardRepo";

const C = CardRepo;

export const player: Player = {
    id: "mock-player-1",
    username: "Player 1",
    color: "purple",
    score: 12,
    stones: {
        red: 2,
        blue: 1,
        purple: 1,
    },
    summonedCards: [C[20], C[2], C[5]],
    discardedCards: [],
    hand: [C[1], C[12]],
    handCount: 2,
    activeEffectsUsed: [],
    stoneValueBonus: {
        red: 0,
        blue: 0,
        purple: 0,
    },
    stoneOverrides: [],
    costReductionAll: 0,
    costReductionByFamily: {},
    isFirstPlayer: true,
    isCurrentTurn: true,
    isReady: true,
};