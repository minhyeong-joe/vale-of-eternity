import type { Card } from '../types/game';

/**
 * Client-side card repository.
 * Keyed by card id. All 70 cards will be added here.
 */
export const CardRepo: Record<number, Card> = {
    1: {
        id: 1, name: 'Salamander', family: 'fire', cost: 1, score: 1, effectType: 'instant',
        imagePath: '/assets/cards/fire/Salamander.webp',
        description: ['Earn ', { sprite: 'description-stone-1' }, ' and ', { sprite: 'description-stone-1' }, '.'],
    },
    2: {
        id: 2, name: 'Burning Skull', family: 'fire', cost: 3, score: 3, effectType: 'instant',
        imagePath: '/assets/cards/fire/Burningskull.webp',
        description: ['Discard a card from your hand, then earn ', { sprite: 'description-stone-3' }, '.'],
    },
    3: {
        id: 3, name: 'Ifrit', family: 'fire', cost: 2, score: 'dynamic', effectType: 'instant',
        imagePath: '/assets/cards/fire/Ifrit.webp',
        description: ['Earn ', { sprite: 'description-stone-1' }, ' for each ', { sprite: 'description-fire' }, ' summoned.'],
    },
    4: {
        id: 4, name: 'Hydra', family: 'water', cost: 4, score: 4, effectType: 'instant',
        imagePath: '/assets/cards/water/Hydra.png',
        description: ['Choose 2: draw a card / earn ', { sprite: 'description-stone-3' }, ' and ', { sprite: 'description-stone-3' }, '.'],
    },
    5: {
        id: 5, name: 'Leviathan', family: 'water', cost: 6, score: 6, effectType: 'permanent',
        imagePath: '/assets/cards/water/Leviathan.png',
        description: ['Pay 1 less when summoning ', { sprite: 'description-water' }, ' cards.'],
    },
    6: {
        id: 6, name: 'Mud Slime', family: 'earth', cost: 4, score: 4, effectType: 'permanent',
        imagePath: '/assets/cards/earth/Mudslime.png',
        description: ['Earn 1 extra stone when selling an ', { sprite: 'description-earth' }, ' card.'],
    },
    7: {
        id: 7, name: 'Troll', family: 'earth', cost: 3, score: 3, effectType: 'permanent',
        imagePath: '/assets/cards/earth/Troll.png',
        description: ['Your summoning cost is reduced by 1.'],
    },
    8: {
        id: 8, name: 'Medusa', family: 'earth', cost: 5, score: 5, effectType: 'resolution',
        imagePath: '/assets/cards/earth/Medusa.png',
        description: ['Discard a card from your hand, then earn ', { sprite: 'description-stone-6' }, '.'],
    },
    9: {
        id: 9, name: 'Cerberus', family: 'earth', cost: 5, score: 5, effectType: 'permanent',
        imagePath: '/assets/cards/earth/Cerberus.png',
        description: ['Discard up to 3 of your summoned cards.'],
    },
    10: {
        id: 10, name: 'Griffon', family: 'wind', cost: 7, score: 7, effectType: 'resolution',
        imagePath: '/assets/cards/wind/Griffon.png',
        description: ['Draw a card.'],
    },
    11: {
        id: 11, name: 'Dragon Egg', family: 'dragon', cost: 3, score: 3, effectType: 'instant',
        imagePath: '/assets/cards/dragon/Dragonegg.webp',
        description: ['Draw 1 card and immediately summon it.'],
    },
    12: {
        id: 12, name: 'Eternity', family: 'dragon', cost: 8, score: 'dynamic', effectType: 'instant',
        imagePath: '/assets/cards/dragon/Eternity.png',
        description: ['Earn ', { sprite: 'description-score-4' }, ' pts for each different family in your area.'],
    },
    13: {
        id: 13, name: 'Kappa', family: 'water', cost: 3, score: 3, effectType: 'permanent',
        imagePath: '/assets/cards/water/Kappa.png',
        description: ['Whenever you summon a card using ', { sprite: 'description-stone-3' }, ', earn ', { sprite: 'description-score-2' }, ' pts.'],
    },
    14: {
        id: 14, name: 'Willow', family: 'dragon', cost: 2, score: 2, effectType: 'instant',
        imagePath: '/assets/cards/dragon/Willow.png',
        description: ['Draw 2 cards.'],
    },
    15: {
        id: 15, name: 'Ember', family: 'dragon', cost: 4, score: 7, effectType: 'instant',
        imagePath: '/assets/cards/dragon/Ember.png',
        description: ['Earn ', { sprite: 'description-score-7' }, ' pts. A player of your choice discards a summoned ', { sprite: 'description-water' }, ' card.'],
    },
};
