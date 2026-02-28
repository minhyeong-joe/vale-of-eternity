// mock data purely for UI components on Rule Book page (ruleBook.tsx)
import type { Player, GameState } from "../types/game";
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
    summonedCards: [C[4], C[9], C[12]],
    discardedCards: [],
    hand: [C[18], C[51], C[55], C[65], C[14], C[34]],
    handCount: 6,
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

export const player2: Player = {
    id: "mock-player-2",
    username: "Player 2",
    color: "green",
    score: 8,
    stones: {
        red: 1,
        blue: 2,
        purple: 0,
    },
    summonedCards: [C[15], C[7], C[19]], // Surtr, Horned Salamander, Kappa
    discardedCards: [C[36]], // Goblin
    hand: [C[3], C[8], C[25]], // Balog, Ifrit, Triton
    handCount: 3,
    activeEffectsUsed: [],
    stoneValueBonus: {
        red: 0,
        blue: 0,
        purple: 0,
    },
    stoneOverrides: [],
    costReductionAll: 0,
    costReductionByFamily: {},
    isFirstPlayer: false,
    isCurrentTurn: false,
    isReady: true,
};

const player3: Player = {
    id: "mock-player-3",
    username: "Player 3",
    color: "black",
    score: 8,
    stones: {
        red: 1,
        blue: 0,
        purple: 2,
    },
    summonedCards: [C[33], C[39]], // Cerberus, Mimic
    discardedCards: [C[38]], // Medusa
    hand: [C[41], C[44]], // Rock Golem, Troll
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
    isFirstPlayer: false,
    isCurrentTurn: false,
    isReady: true,
};

const player4: Player = {
    id: "mock-player-4",
    username: "Player 4",
    color: "gray",
    score: 10,
    stones: {
        red: 2,
        blue: 2,
        purple: 0,
    },
    summonedCards: [C[48], C[70]], // Freyja, Willow
    discardedCards: [C[60]], // Valkyrie
    hand: [C[52], C[56], C[67]], // Griffon, Pegasus, Marina
    handCount: 3,
    activeEffectsUsed: [],
    stoneValueBonus: {
        red: 0,
        blue: 0,
        purple: 0,
    },
    stoneOverrides: [],
    costReductionAll: 0,
    costReductionByFamily: {},
    isFirstPlayer: false,
    isCurrentTurn: false,
    isReady: true,
};

export const mockGameState: GameState = {
    round: 5,
    phase: "hunting",
    activePlayerId: player.id,
    firstPlayerIndex: 0,
    huntPickOrder: [player.id, player2.id, player3.id, player4.id],
    huntPicksDone: 1,
    players: [player, player2, player3, player4],
    boardZones: [
        {
            family: "fire",
            cards: [C[1], C[7]]
        },
        {
            family: "water",
            cards: [C[19]]
        },
        {
            family: "earth",
            cards: [C[33], C[40]]
        },
        {
            family: "wind",
            cards: [C[48], C[59]]
        },
        {
            family: "dragon",
            cards: [C[70]]
        },
    ],
    boardMarkers: {
        1: player.id
    },
    drawPileCount: 43,
    discardPileCount: 8,
    pendingInteraction: null
}

export const mockActionGameState: GameState = {
    round: 5,
    phase: "action",
    activePlayerId: player.id,
    firstPlayerIndex: 0,
    huntPickOrder: [player.id, player2.id, player3.id, player4.id],
    huntPicksDone: 8,
    players: [player, player2, player3, player4],
    boardZones: [
        {
            family: "fire",
            cards: [C[1], C[7]]
        },
        {
            family: "water",
            cards: [C[19]]
        },
        {
            family: "earth",
            cards: [C[33], C[40]]
        },
        {
            family: "wind",
            cards: [C[48], C[59]]
        },
        {
            family: "dragon",
            cards: [C[70]]
        },
    ],
    boardMarkers: {
        1: player.id,
        7: player2.id,
        48: player3.id,
        70: player4.id,
        19: player4.id,
        33: player2.id,
        40: player3.id,
        59: player.id,
    },
    drawPileCount: 43,
    discardPileCount: 8,
    pendingInteraction: null
}

// rank player logic from GameOverModal.tsx (duplicated)
export const RANK_MEDAL = ["", "🥇", "🥈", "🥉"];

function rankPlayers(players: Player[]): Array<Player & { rank: number }> {
	const sorted = [...players].sort((a, b) => {
		if (b.score !== a.score) return b.score - a.score;
		return b.summonedCards.length - a.summonedCards.length;
	});

	const ranked: Array<Player & { rank: number }> = [];
	for (let i = 0; i < sorted.length; i++) {
		const p = sorted[i];
		let rank: number;
		if (i === 0) {
			rank = 1;
		} else {
			const prev = ranked[i - 1];
			const sameAsPrev =
				prev.score === p.score &&
				prev.summonedCards.length === p.summonedCards.length;
			rank = sameAsPrev ? prev.rank : i + 1;
		}
		ranked.push({ ...p, rank });
	}
	return ranked;
}

export const ranked = rankPlayers([player, player2, player3, player4]);
