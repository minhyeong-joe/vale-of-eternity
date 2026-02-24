import type { Card } from '../types/game';

/**
 * Client-side card repository.
 * Keyed by card id. All 70 cards will be added here.
 * Within each family group, cards are sorted alphabetically by name.
 */
export const CardRepo: Record<number, Card> = {
    // ── Fire ──────────────────────────────────────────────────────────────
    1: {
        id: 1, name: 'Agni', family: 'fire', cost: 4,
        imagePath: '/assets/cards/fire/Agni.webp',
        effects: [
            { type: 'permanent', description: ['The value of your ', { sprite: 'description-stone-1' }, ' is increased by 1.'] },
        ],
    },
    2: {
        id: 2, name: 'Asmodeus', family: 'fire', cost: 4,
        imagePath: '/assets/cards/fire/Asmodeus.webp',
        effects: [
            { type: 'active', description: ['Recover one of your cards with ', { sprite: 'description-instant' }, ' and a written cost of 2 or less.'] },
        ],
    },
    3: {
        id: 3, name: 'Balog', family: 'fire', cost: 4,
        imagePath: '/assets/cards/fire/Balog.webp',
        effects: [
            { type: 'active', description: ['Recover one of your ', { sprite: 'description-fire' }, ' cards with ', { sprite: 'description-instant' }, '.'] },
        ],
    },
    4: {
        id: 4, name: 'Burning Skull', family: 'fire', cost: 3,
        imagePath: '/assets/cards/fire/Burningskull.webp',
        effects: [
            { type: 'active', description: ['Discard one of your ', { sprite: 'description-stone-1' }, ', then earn ', { sprite: 'description-score-3' }, '.'] },
        ],
    },
    5: {
        id: 5, name: 'Firefox', family: 'fire', cost: 1,
        imagePath: '/assets/cards/fire/Firefox.webp',
        effects: [
            { type: 'instant', description: ['Earn ', { sprite: 'description-score-1' }, ' for each card in your hand.'] },
        ],
    },
    6: {
        id: 6, name: 'Hestia', family: 'fire', cost: 0,
        imagePath: '/assets/cards/fire/Hestia.webp',
        effects: [
            { type: 'permanent', description: ['You can keep two more stones.'] },
        ],
    },
    7: {
        id: 7, name: 'Horned Salamander', family: 'fire', cost: 2,
        imagePath: '/assets/cards/fire/Hornedsalamander.webp',
        effects: [
            { type: 'active', description: ['Earn ', { sprite: 'description-stone-1' }, { sprite: 'description-stone-1' }, { sprite: 'description-stone-1' }, { sprite: 'description-stone-1' }, '.'] },
        ],
    },
    8: {
        id: 8, name: 'Ifrit', family: 'fire', cost: 2,
        imagePath: '/assets/cards/fire/Ifrit.webp',
        effects: [
            { type: 'instant', description: ['Earn ', { sprite: 'description-score-1' }, ' for each card in your area.'] },
        ],
    },
    9: {
        id: 9, name: 'Imp', family: 'fire', cost: 0,
        imagePath: '/assets/cards/fire/Imp.webp',
        effects: [
            { type: 'instant', description: ['Earn ', { sprite: 'description-stone-1' }, { sprite: 'description-stone-1' }, '.'] },
            { type: 'active', description: ['Recover.'] },
        ],
    },
    10: {
        id: 10, name: 'Incubus', family: 'fire', cost: 2,
        imagePath: '/assets/cards/fire/Incubus.webp',
        effects: [
            { type: 'instant', description: ['Earn ', { sprite: 'description-score-2' }, ' for each card with a written cost of 2 or less in your area.'] },
        ],
    },
    11: {
        id: 11, name: 'Lava Giant', family: 'fire', cost: 3,
        imagePath: '/assets/cards/fire/Lavagiant.webp',
        effects: [
            { type: 'instant', description: ['Earn ', { sprite: 'description-score-2' }, ' for each ', { sprite: 'description-fire' }, ' card in your area.'] },
        ],
    },
    12: {
        id: 12, name: 'Phoenix', family: 'fire', cost: 3,
        imagePath: '/assets/cards/fire/Phoenix.webp',
        effects: [
            { type: 'permanent', description: ['Whenever you summon a card, earn ', { sprite: 'description-score-1' }, ' for each used ', { sprite: 'description-stone-1' }, '.'] },
        ],
    },
    13: {
        id: 13, name: 'Salamander', family: 'fire', cost: 1,
        imagePath: '/assets/cards/fire/Salamander.webp',
        effects: [
            { type: 'active', description: ['Earn ', { sprite: 'description-stone-1' }, ' and ', { sprite: 'description-score-1' }, '.'] },
        ],
    },
    14: {
        id: 14, name: 'Succubus', family: 'fire', cost: 0,
        imagePath: '/assets/cards/fire/Succubus.webp',
        effects: [
            { type: 'instant', description: ['If cards with written cost of 1, 2, 3, and 4 are all in your area, earn ', { sprite: 'description-score-10' }, '.'] },
        ],
    },
    15: {
        id: 15, name: 'Surtr', family: 'fire', cost: 4,
        imagePath: '/assets/cards/fire/Surtr.webp',
        effects: [
            { type: 'instant', description: ['Earn ', { sprite: 'description-score-2' }, ' for each card family in your area.'] },
        ],
    },

    // ── Water ──────────────────────────────────────────────────────────────
    16: {
        id: 16, name: 'Charybdis', family: 'water', cost: 5,
        imagePath: '/assets/cards/water/Charybdis.webp',
        effects: [
            { type: 'active', description: ['Discard one of your ', { sprite: 'description-stone-3' }, ', then earn ', { sprite: 'description-score-5' }, '.'] },
        ],
    },
    17: {
        id: 17, name: 'Hae-tae', family: 'water', cost: 3,
        imagePath: '/assets/cards/water/Hae-tae.webp',
        effects: [
            { type: 'permanent', description: ['Value of your ', { sprite: 'description-stone-3' }, ' counts as ', { sprite: 'description-stone-6' }, '. Value of your ', { sprite: 'description-stone-6' }, ' counts as ', { sprite: 'description-stone-3' }, '.'] },
        ],
    },
    18: {
        id: 18, name: 'Hydra', family: 'water', cost: 4,
        imagePath: '/assets/cards/water/Hydra.png',
        effects: [
            { type: 'instant', description: ['Choose 2 between ', { sprite: 'description-stone-6' }, ' / draw a card / ', { sprite: 'description-stone-3' }, { sprite: 'description-stone-3' }, { sprite: 'description-score-4' }, '. Earn them.'] },
        ],
    },
    19: {
        id: 19, name: 'Kappa', family: 'water', cost: 1,
        imagePath: '/assets/cards/water/Kappa.png',
        effects: [
            { type: 'permanent', description: ['Whenever you summon a card using ', { sprite: 'description-stone-3' }, ', earn ', { sprite: 'description-score-2' }, '.'] },
        ],
    },
    20: {
        id: 20, name: 'Leviathan', family: 'water', cost: 4,
        imagePath: '/assets/cards/water/Leviathan.png',
        effects: [
            { type: 'instant', description: ['Earn ', { sprite: 'description-score-7' }, ' points. A player of your choice discards one of their summoned ', { sprite: 'description-dragon' }, ' cards.'] },
        ],
    },
    21: {
        id: 21, name: 'Nessie', family: 'water', cost: 2,
        imagePath: '/assets/cards/water/Nessie.png',
        effects: [
            { type: 'active', description: ['If there is no ', { sprite: 'description-dragon' }, ' card in your area, earn ', { sprite: 'description-score-2' }, '.'] },
        ],
    },
    22: {
        id: 22, name: 'Poseidon', family: 'water', cost: 7,
        imagePath: '/assets/cards/water/Poseidon.png',
        effects: [
            { type: 'instant', description: ['Earn ', { sprite: 'description-score-3' }, ' for each ', { sprite: 'description-water' }, ' card in your area.'] },
        ],
    },
    23: {
        id: 23, name: 'Sea Spirit', family: 'water', cost: 1,
        imagePath: '/assets/cards/water/Seaspirit.png',
        effects: [
            { type: 'active', description: ['Earn ', { sprite: 'description-score-1' }, ' for each your ', { sprite: 'description-stone-3' }, '.'] },
        ],
    },
    24: {
        id: 24, name: 'Snail Maiden', family: 'water', cost: 3,
        imagePath: '/assets/cards/water/Snailmaiden.png',
        effects: [
            { type: 'active', description: ['Exchange one of your ', { sprite: 'description-stone-3' }, ' with ', { sprite: 'description-stone-6' }, '. -or- Exchange one of your ', { sprite: 'description-stone-6' }, ' with ', { sprite: 'description-stone-3' }, { sprite: 'description-stone-3' }, { sprite: 'description-stone-3' }, '.'] },
        ],
    },
    25: {
        id: 25, name: 'Triton', family: 'water', cost: 4,
        imagePath: '/assets/cards/water/Triton.webp',
        effects: [
            { type: 'permanent', description: ['Whenever you tame a ', { sprite: 'description-water' }, ' card, earn ', { sprite: 'description-stone-3' }, { sprite: 'description-stone-3' }, '.'] },
        ],
    },
    26: {
        id: 26, name: 'Undine', family: 'water', cost: 1,
        imagePath: '/assets/cards/water/Undine.webp',
        effects: [
            { type: 'instant', description: ['Earn ', { sprite: 'description-stone-3' }, '.'] },
            { type: 'active', description: ['Recover.'] },
        ],
    },
    27: {
        id: 27, name: 'Undine Queen', family: 'water', cost: 3,
        imagePath: '/assets/cards/water/Undinequeen.png',
        effects: [
            { type: 'active', description: ['Earn ', { sprite: 'description-stone-3' }, '.'] },
        ],
    },
    28: {
        id: 28, name: 'Water Giant', family: 'water', cost: 4,
        imagePath: '/assets/cards/water/Watergiant.webp',
        effects: [
            { type: 'instant', description: ['Earn ', { sprite: 'description-stone-3' }, { sprite: 'description-stone-3' }, '.'] },
            { type: 'permanent', description: ['Values of your ', { sprite: 'description-stone-3' }, ' and ', { sprite: 'description-stone-6' }, ' are each increased by 1.'] },
        ],
    },
    29: {
        id: 29, name: 'Yuki Onna', family: 'water', cost: 0,
        imagePath: '/assets/cards/water/Yukionna.webp',
        effects: [
            { type: 'instant', description: ['Discard all your stones and earn ', { sprite: 'description-score-dynamic' }, ' (total value of discarded stones).'] },
        ],
    },
    30: {
        id: 30, name: 'Yuki Onna Exalted', family: 'water', cost: 3,
        imagePath: '/assets/cards/water/Yukionnaexalted.png',
        effects: [
            { type: 'instant', description: ['Earn ', { sprite: 'description-score-dynamic' }, ' (total value of your ', { sprite: 'description-stone-3' }, ').'] },
        ],
    },

    // ── Earth ──────────────────────────────────────────────────────────────
    31: {
        id: 31, name: 'Basilisk', family: 'earth', cost: 3,
        imagePath: '/assets/cards/earth/Basilisk.png',
        effects: [
            { type: 'active', description: ['Lose ', {sprite: 'description-stone-0'},  '/ ', {sprite: 'description-stone-1'}, ' / ', {sprite: 'description-stone-2'}, ', then earn ', { sprite: 'description-stone-1' }, ' / ', { sprite: 'description-stone-3' }, ' / ', { sprite: 'description-stone-6' }, '.'] },
        ],
    },
    32: {
        id: 32, name: 'Behemoth', family: 'earth', cost: 9,
        imagePath: '/assets/cards/earth/Behemoth.webp',
        effects: [
            { type: 'instant', description: ['Earn ', { sprite: 'description-score-3' }, ' for each card family in your area.'] },
        ],
    },
    33: {
        id: 33, name: 'Cerberus', family: 'earth', cost: 5,
        imagePath: '/assets/cards/earth/Cerberus.png',
        effects: [
            { type: 'instant', description: ['Discard up to 3 of your other summoned cards.'] },
        ],
    },
    34: {
        id: 34, name: 'Forest Spirit', family: 'earth', cost: 2,
        imagePath: '/assets/cards/earth/Forestspirit.webp',
        effects: [
            { type: 'instant', description: ['Discard a card from your hand and earn ', { sprite: 'description-score-dynamic' }, ' (cost written on the card).'] },
        ],
    },
    35: {
        id: 35, name: 'Gargoyle', family: 'earth', cost: 2,
        imagePath: '/assets/cards/earth/Gargoyle.png',
        effects: [
            { type: 'permanent', description: ['Whenever you summon a card using ', { sprite: 'description-stone-6' }, ', earn ', { sprite: 'description-score-3' }, '.'] },
        ],
    },
    36: {
        id: 36, name: 'Goblin', family: 'earth', cost: 1,
        imagePath: '/assets/cards/earth/Goblin.webp',
        effects: [
            { type: 'active', description: ['Steal ', { sprite: 'description-score-1' }, ' from any opponent.'] },
        ],
    },
    37: {
        id: 37, name: 'Goblin Soldier', family: 'earth', cost: 4,
        imagePath: '/assets/cards/earth/Goblinsoldier.webp',
        effects: [
            { type: 'active', description: ['If any opponent has more points than you, earn ', { sprite: 'description-score-4' }, '. Otherwise lose ', { sprite: 'description-score-4' }, '.'] },
        ],
    },
    38: {
        id: 38, name: 'Medusa', family: 'earth', cost: 4,
        imagePath: '/assets/cards/earth/Medusa.png',
        effects: [
            { type: 'active', description: ['Discard a card from your hand, then earn ', { sprite: 'description-stone-6' }, '.'] },
        ],
    },
    39: {
        id: 39, name: 'Mimic', family: 'earth', cost: 6,
        imagePath: '/assets/cards/earth/Mimic.png',
        effects: [
            { type: 'active', description: ['Choose any ', { sprite: 'description-earth' }, ' card from discard pile. Add it into your hand.'] },
        ],
    },
    40: {
        id: 40, name: 'Mud Slime', family: 'earth', cost: 6,
        imagePath: '/assets/cards/earth/Mudslime.png',
        effects: [
            { type: 'instant', description: ['Earn ', { sprite: 'description-score-6' }, '.'] },
            { type: 'active', description: ['Recover.'] },
        ],
    },
    41: {
        id: 41, name: 'Rock Golem', family: 'earth', cost: 6,
        imagePath: '/assets/cards/earth/Rockgolem.png',
        effects: [
            { type: 'instant', description: ['Earn ', { sprite: 'description-score-dynamic' }, ' (total value of your ', { sprite: 'description-stone-6' }, ').'] },
        ],
    },
    42: {
        id: 42, name: 'Sand Giant', family: 'earth', cost: 10,
        imagePath: '/assets/cards/earth/Sandgiant.png',
        effects: [
            { type: 'instant', description: ['Earn ', { sprite: 'description-score-4' }, ' for each ', { sprite: 'description-earth' }, ' card in your area.'] },
        ],
    },
    43: {
        id: 43, name: 'Stone Golem', family: 'earth', cost: 6,
        imagePath: '/assets/cards/earth/Stonegolem.webp',
        effects: [
            { type: 'instant', description: ['Exchange each of your stones with ', { sprite: 'description-stone-6' }, '.'] },
        ],
    },
    44: {
        id: 44, name: 'Troll', family: 'earth', cost: 3,
        imagePath: '/assets/cards/earth/Troll.png',
        effects: [
            { type: 'active', description: ['If you have ', { sprite: 'description-stone-6' }, ', earn ', { sprite: 'description-score-3' }, '.'] },
        ],
    },
    45: {
        id: 45, name: 'Young Forest Spirit', family: 'earth', cost: 0,
        imagePath: '/assets/cards/earth/Youngforestspirit.png',
        effects: [
            { type: 'instant', description: ['Discard a card from your hand and summon another card for free.'] },
        ],
    },

    46: {
        id: 46, name: 'Boreas', family: 'wind', cost: 4,
        imagePath: '/assets/cards/wind/Boreas.png',
        effects: [
            { type: 'instant', description: ['Earn ', { sprite: 'description-score-1' }, ' for each ', { sprite: 'description-wind' }, ' card in your area. Immediately recover this card.'] },
        ],
    },
    47: {
        id: 47, name: 'Dandelion Spirit', family: 'wind', cost: 3,
        imagePath: '/assets/cards/wind/Dandelionspirit.webp',
        effects: [
            { type: 'instant', description: ['Draw a card.'] },
            { type: 'active', description: ['Recover.'] },
        ],
    },
    48: {
        id: 48, name: 'Freyja', family: 'wind', cost: 7,
        imagePath: '/assets/cards/wind/Freyja.png',
        effects: [
            { type: 'active', description: ['Earn ', { sprite: 'description-score-1' }, ' for each card with ', { sprite: 'description-active' }, ' in your area.'] },
        ],
    },
    49: {
        id: 49, name: 'Genie', family: 'wind', cost: 4,
        imagePath: '/assets/cards/wind/Genie.png',
        effects: [
            { type: 'instant', description: ['Activate all available ', { sprite: 'description-active' }, ' effect of cards in your area.'] },
        ],
    },
    50: {
        id: 50, name: 'Genie Exalted', family: 'wind', cost: 5,
        imagePath: '/assets/cards/wind/Genieexalted.png',
        effects: [
            { type: 'active', description: ['Copy one ', { sprite: 'description-active' }, ' effect of another card in your area and activate it.'] },
        ],
    },
    51: {
        id: 51, name: 'Gi-rin', family: 'wind', cost: 10,
        imagePath: '/assets/cards/wind/Gi-rin.png',
        effects: [
            { type: 'instant', description: ['Earn ', { sprite: 'description-score-2' }, ' for each card in your area.'] },
        ],
    },
    52: {
        id: 52, name: 'Griffon', family: 'wind', cost: 7,
        imagePath: '/assets/cards/wind/Griffon.png',
        effects: [
            { type: 'active', description: ['Draw a card.'] },
        ],
    },
    53: {
        id: 53, name: 'Harpy', family: 'wind', cost: 3,
        imagePath: '/assets/cards/wind/Harpy.png',
        effects: [
            { type: 'active', description: ['If the number of cards in your hand is the same as the number of cards in your area, earn ', { sprite: 'description-score-3' }, '.'] },
        ],
    },
    54: {
        id: 54, name: 'Hippogriff', family: 'wind', cost: 4,
        imagePath: '/assets/cards/wind/Hippogriff.png',
        effects: [
            { type: 'instant', description: ['Draw a card.'] },
            { type: 'permanent', description: ['The cost of your ', { sprite: 'description-wind' }, ' card is decreased by 2.'] },
        ],
    },
    55: {
        id: 55, name: 'Odin', family: 'wind', cost: 6,
        imagePath: '/assets/cards/wind/Odin.png',
        effects: [
            { type: 'active', description: ['If you have less than 6 cards in your hand, earn ', { sprite: 'description-score-2' }, '. Otherwise, earn ', { sprite: 'description-stone-6' }, '.'] },
        ],
    },
    56: {
        id: 56, name: 'Pegasus', family: 'wind', cost: 3,
        imagePath: '/assets/cards/wind/Pegasus.webp',
        effects: [
            { type: 'instant', description: ['Draw a card.'] },
            { type: 'permanent', description: ['The cost of your card is decreased by 1.'] },
        ],
    },
    57: {
        id: 57, name: 'Rudra', family: 'wind', cost: 8,
        imagePath: '/assets/cards/wind/Rudra.webp',
        effects: [
            { type: 'instant', description: ['Earn ', { sprite: 'description-score-2' }, ' for each card in your hand.'] },
        ],
    },
    58: {
        id: 58, name: 'Sylph', family: 'wind', cost: 4,
        imagePath: '/assets/cards/wind/Sylph.png',
        effects: [
            { type: 'instant', description: ['Draw a card.'] },
            { type: 'permanent', description: ['Whenever you summon a card, earn ', { sprite: 'description-score-1' }, '.'] },
        ],
    },
    59: {
        id: 59, name: 'Tengu', family: 'wind', cost: 3,
        imagePath: '/assets/cards/wind/Tengu.webp',
        effects: [
            { type: 'instant', description: ['Earn ', { sprite: 'description-stone-6' }, ' and put this card on the top of the draw deck.'] },
        ],
    },
    60: {
        id: 60, name: 'Valkyrie', family: 'wind', cost: 5,
        imagePath: '/assets/cards/wind/Valkyrie.png',
        effects: [
            { type: 'active', description: ['Earn ', { sprite: 'description-score-1' }, ' for each card family in your area.'] },
        ],
    },

    61: {
        id: 61, name: 'Aeris', family: 'dragon', cost: 9,
        imagePath: '/assets/cards/dragon/Aeris.png',
        effects: [
            { type: 'instant', description: ['Recover one of your other cards and earn ', { sprite: 'description-score-dynamic' }, ' (cost written on the card).'] },
        ],
    },
    62: {
        id: 62, name: 'Boulder', family: 'dragon', cost: 8,
        imagePath: '/assets/cards/dragon/Boulder.webp',
        effects: [
            { type: 'instant', description: ['Earn ', { sprite: 'description-score-8' }, ' points. A player of your choice discards one of their summoned ', { sprite: 'description-wind' }, ' cards.'] },
        ],
    },
    63: {
        id: 63, name: 'Dragon Egg', family: 'dragon', cost: 3,
        imagePath: '/assets/cards/dragon/Dragonegg.webp',
        effects: [
            { type: 'instant', description: ['Discard this card and summon a ', { sprite: 'description-dragon' }, ' card for free.'] },
        ],
    },
    64: {
        id: 64, name: 'Ember', family: 'dragon', cost: 7,
        imagePath: '/assets/cards/dragon/Ember.png',
        effects: [
            { type: 'instant', description: ['Earn ', { sprite: 'description-score-7' }, ' points. A player of your choice discards one of their summoned ', { sprite: 'description-water' }, ' cards.'] },
        ],
    },
    65: {
        id: 65, name: 'Eternity', family: 'dragon', cost: 12,
        imagePath: '/assets/cards/dragon/Eternity.png',
        effects: [
            { type: 'instant', description: ['Earn ', { sprite: 'description-score-4' }, ' for each card family in your area.'] },
        ],
    },
    66: {
        id: 66, name: 'Gust', family: 'dragon', cost: 8,
        imagePath: '/assets/cards/dragon/Gust.png',
        effects: [
            { type: 'instant', description: ['Earn ', { sprite: 'description-score-8' }, ' points. A player of your choice discards one of their summoned ', { sprite: 'description-earth' }, ' cards.'] },
        ],
    },
    67: {
        id: 67, name: 'Marina', family: 'dragon', cost: 7,
        imagePath: '/assets/cards/dragon/Marina.png',
        effects: [
            { type: 'instant', description: ['Earn ', { sprite: 'description-score-7' }, ' points. A player of your choice discards one of their summoned ', { sprite: 'description-fire' }, ' cards.'] },
        ],
    },
    68: {
        id: 68, name: 'Scorch', family: 'dragon', cost: 9,
        imagePath: '/assets/cards/dragon/Scorch.png',
        effects: [
            { type: 'instant', description: ['Copy one ', { sprite: 'description-instant' }, ' effect of another card in your area and activate it.'] },
        ],
    },
    69: {
        id: 69, name: 'Tidal', family: 'dragon', cost: 5,
        imagePath: '/assets/cards/dragon/Tidal.png',
        effects: [
            { type: 'instant', description: ['Earn ', { sprite: 'description-score-5' }, ' for each ', { sprite: 'description-dragon' }, ' card in your area.'] },
        ],
    },
    70: {
        id: 70, name: 'Willow', family: 'dragon', cost: 10,
        imagePath: '/assets/cards/dragon/Willow.png',
        effects: [
            { type: 'instant', description: ['Earn ', { sprite: 'description-stone-1' }, { sprite: 'description-stone-3' }, { sprite: 'description-stone-6' }, ' and ', { sprite: 'description-score-3' }, '. Draw a card.'] },
        ],
    },
};
