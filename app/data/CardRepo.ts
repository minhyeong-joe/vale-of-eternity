import type { Card } from '../types/game';

/**
 * Client-side card repository.
 * Keyed by card id. All 70 cards will be added here.
 * Within each family group, cards are sorted alphabetically by name.
 *
 * Korean descriptions (descriptionKo) are translations of the English text.
 * If you have access to official Korean card text, please update accordingly.
 */
export const CardRepo: Record<number, Card> = {
    // ── Fire ──────────────────────────────────────────────────────────────
    1: {
        id: 1, name: 'Agni', family: 'fire', cost: 4,
        imagePath: '/assets/cards/fire/Agni.webp',
        effects: [
            {
                type: 'permanent',
                description: ['The value of your ', { sprite: 'description-stone-1' }, ' is increased by 1.'],
                descriptionKo: ['당신의 ', { sprite: 'description-stone-1' }, '의 값이 1 증가합니다.'],
            },
        ],
    },
    2: {
        id: 2, name: 'Asmodeus', family: 'fire', cost: 4,
        imagePath: '/assets/cards/fire/Asmodeus.webp',
        effects: [
            {
                type: 'active',
                description: ['Recover one of your cards with ', { sprite: 'description-instant' }, ' and a written cost of 2 or less.'],
                descriptionKo: [{ sprite: 'description-instant' }, '이 있고 표시된 코스트가 2 이하인 당신의 카드 1장을 회수합니다.'],
            },
        ],
    },
    3: {
        id: 3, name: 'Balog', family: 'fire', cost: 4,
        imagePath: '/assets/cards/fire/Balog.webp',
        effects: [
            {
                type: 'active',
                description: ['Recover one of your ', { sprite: 'description-fire' }, ' cards with ', { sprite: 'description-instant' }, '.'],
                descriptionKo: [{ sprite: 'description-instant' }, '이 있는 당신의 ', { sprite: 'description-fire' }, ' 카드 1장을 회수합니다.'],
            },
        ],
    },
    4: {
        id: 4, name: 'Burning Skull', family: 'fire', cost: 3,
        imagePath: '/assets/cards/fire/Burningskull.webp',
        effects: [
            {
                type: 'active',
                description: ['Discard one of your ', { sprite: 'description-stone-1' }, ', then earn ', { sprite: 'description-score-3' }, '.'],
                descriptionKo: ['당신의 ', { sprite: 'description-stone-1' }, ' 1개를 버리고 ', { sprite: 'description-score-3' }, '을 획득합니다.'],
            },
        ],
    },
    5: {
        id: 5, name: 'Firefox', family: 'fire', cost: 1,
        imagePath: '/assets/cards/fire/Firefox.webp',
        effects: [
            {
                type: 'instant',
                description: ['Earn ', { sprite: 'description-score-1' }, ' for each card in your hand.'],
                descriptionKo: ['손에 든 카드 1장당 ', { sprite: 'description-score-1' }, '을 획득합니다.'],
            },
        ],
    },
    6: {
        id: 6, name: 'Hestia', family: 'fire', cost: 0,
        imagePath: '/assets/cards/fire/Hestia.webp',
        effects: [
            {
                type: 'permanent',
                description: ['You can keep two more stones.'],
                descriptionKo: ['마법석을 2개 더 보유할 수 있습니다.'],
            },
        ],
    },
    7: {
        id: 7, name: 'Horned Salamander', family: 'fire', cost: 2,
        imagePath: '/assets/cards/fire/Hornedsalamander.webp',
        effects: [
            {
                type: 'active',
                description: ['Earn ', { sprite: 'description-stone-1' }, { sprite: 'description-stone-1' }, { sprite: 'description-stone-1' }, { sprite: 'description-stone-1' }, '.'],
                descriptionKo: [{ sprite: 'description-stone-1' }, { sprite: 'description-stone-1' }, { sprite: 'description-stone-1' }, { sprite: 'description-stone-1' }, '을 획득합니다.'],
            },
        ],
    },
    8: {
        id: 8, name: 'Ifrit', family: 'fire', cost: 2,
        imagePath: '/assets/cards/fire/Ifrit.webp',
        effects: [
            {
                type: 'instant',
                description: ['Earn ', { sprite: 'description-score-1' }, ' for each card in your area.'],
                descriptionKo: ['소환된 카드 1장당 ', { sprite: 'description-score-1' }, '을 획득합니다.'],
            },
        ],
    },
    9: {
        id: 9, name: 'Imp', family: 'fire', cost: 0,
        imagePath: '/assets/cards/fire/Imp.webp',
        effects: [
            {
                type: 'instant',
                description: ['Earn ', { sprite: 'description-stone-1' }, { sprite: 'description-stone-1' }, '.'],
                descriptionKo: [{ sprite: 'description-stone-1' }, { sprite: 'description-stone-1' }, '을 획득합니다.'],
            },
            {
                type: 'active',
                description: ['Recover.'],
                descriptionKo: ['회수합니다.'],
            },
        ],
    },
    10: {
        id: 10, name: 'Incubus', family: 'fire', cost: 2,
        imagePath: '/assets/cards/fire/Incubus.webp',
        effects: [
            {
                type: 'instant',
                description: ['Earn ', { sprite: 'description-score-2' }, ' for each card with a written cost of 2 or less in your area.'],
                descriptionKo: ['구역에 있는 표시된 코스트 2 이하인 카드 1장당 ', { sprite: 'description-score-2' }, '을 획득합니다.'],
            },
        ],
    },
    11: {
        id: 11, name: 'Lava Giant', family: 'fire', cost: 3,
        imagePath: '/assets/cards/fire/Lavagiant.webp',
        effects: [
            {
                type: 'instant',
                description: ['Earn ', { sprite: 'description-score-2' }, ' for each ', { sprite: 'description-fire' }, ' card in your area.'],
                descriptionKo: ['소환된 ', { sprite: 'description-fire' }, ' 카드 1장당 ', { sprite: 'description-score-2' }, '을 획득합니다.'],
            },
        ],
    },
    12: {
        id: 12, name: 'Phoenix', family: 'fire', cost: 3,
        imagePath: '/assets/cards/fire/Phoenix.webp',
        effects: [
            {
                type: 'permanent',
                description: ['Whenever you summon a card, earn ', { sprite: 'description-score-1' }, ' for each used ', { sprite: 'description-stone-1' }, '.'],
                descriptionKo: ['카드를 소환할 때마다 사용한 ', { sprite: 'description-stone-1' }, '의 수만큼 ', { sprite: 'description-score-1' }, '을 획득합니다.'],
            },
        ],
    },
    13: {
        id: 13, name: 'Salamander', family: 'fire', cost: 1,
        imagePath: '/assets/cards/fire/Salamander.webp',
        effects: [
            {
                type: 'active',
                description: ['Earn ', { sprite: 'description-stone-1' }, ' and ', { sprite: 'description-score-1' }, '.'],
                descriptionKo: [{ sprite: 'description-stone-1' }, '과 ', { sprite: 'description-score-1' }, '을 획득합니다.'],
            },
        ],
    },
    14: {
        id: 14, name: 'Succubus', family: 'fire', cost: 0,
        imagePath: '/assets/cards/fire/Succubus.webp',
        effects: [
            {
                type: 'instant',
                description: ['If cards with written cost of 1, 2, 3, and 4 are all in your area, earn ', { sprite: 'description-score-10' }, '.'],
                descriptionKo: ['구역에 표시된 코스트 1, 2, 3, 4인 카드가 모두 있다면 ', { sprite: 'description-score-10' }, '을 획득합니다.'],
            },
        ],
    },
    15: {
        id: 15, name: 'Surtr', family: 'fire', cost: 4,
        imagePath: '/assets/cards/fire/Surtr.webp',
        effects: [
            {
                type: 'instant',
                description: ['Earn ', { sprite: 'description-score-2' }, ' for each card family in your area.'],
                descriptionKo: ['소환된 카드 속성 수만큼 ', { sprite: 'description-score-2' }, '을 획득합니다.'],
            },
        ],
    },

    // ── Water ──────────────────────────────────────────────────────────────
    16: {
        id: 16, name: 'Charybdis', family: 'water', cost: 5,
        imagePath: '/assets/cards/water/Charybdis.webp',
        effects: [
            {
                type: 'active',
                description: ['Discard one of your ', { sprite: 'description-stone-3' }, ', then earn ', { sprite: 'description-score-5' }, '.'],
                descriptionKo: ['당신의 ', { sprite: 'description-stone-3' }, ' 1개를 버리고 ', { sprite: 'description-score-5' }, '을 획득합니다.'],
            },
        ],
    },
    17: {
        id: 17, name: 'Hae-tae', family: 'water', cost: 3,
        imagePath: '/assets/cards/water/Hae-tae.webp',
        effects: [
            {
                type: 'permanent',
                description: ['Value of your ', { sprite: 'description-stone-3' }, ' counts as ', { sprite: 'description-stone-6' }, '. Value of your ', { sprite: 'description-stone-6' }, ' counts as ', { sprite: 'description-stone-3' }, '.'],
                descriptionKo: ['당신의 ', { sprite: 'description-stone-3' }, '의 값이 ', { sprite: 'description-stone-6' }, '으로, ', { sprite: 'description-stone-6' }, '의 값이 ', { sprite: 'description-stone-3' }, '으로 취급됩니다.'],
            },
        ],
    },
    18: {
        id: 18, name: 'Hydra', family: 'water', cost: 4,
        imagePath: '/assets/cards/water/Hydra.png',
        effects: [
            {
                type: 'instant',
                description: ['Choose 2 between ', { sprite: 'description-stone-6' }, ' / draw a card / ', { sprite: 'description-stone-3' }, { sprite: 'description-stone-3' }, ' / ', { sprite: 'description-score-4' }, '. Earn them.'],
                descriptionKo: ['다음 중 2개를 선택하여 획득합니다: ', { sprite: 'description-stone-6' }, ' / 카드 드로우 / ', { sprite: 'description-stone-3' }, { sprite: 'description-stone-3' }, ' / ', { sprite: 'description-score-4' }, '.'],
            },
        ],
    },
    19: {
        id: 19, name: 'Kappa', family: 'water', cost: 1,
        imagePath: '/assets/cards/water/Kappa.png',
        effects: [
            {
                type: 'permanent',
                description: ['Whenever you summon a card using ', { sprite: 'description-stone-3' }, ', earn ', { sprite: 'description-score-2' }, '.'],
                descriptionKo: [{ sprite: 'description-stone-3' }, '을 사용해 카드를 소환할 때마다 ', { sprite: 'description-score-2' }, '을 획득합니다.'],
            },
        ],
    },
    20: {
        id: 20, name: 'Leviathan', family: 'water', cost: 4,
        imagePath: '/assets/cards/water/Leviathan.png',
        effects: [
            {
                type: 'instant',
                description: ['Earn ', { sprite: 'description-score-7' }, ' points. A player of your choice discards one of their summoned ', { sprite: 'description-dragon' }, ' cards.'],
                descriptionKo: [{ sprite: 'description-score-7' }, '을 획득합니다. 선택한 플레이어는 자신의 소환된 ', { sprite: 'description-dragon' }, ' 카드 1장을 버립니다.'],
            },
        ],
    },
    21: {
        id: 21, name: 'Nessie', family: 'water', cost: 2,
        imagePath: '/assets/cards/water/Nessie.png',
        effects: [
            {
                type: 'active',
                description: ['If there is no ', { sprite: 'description-dragon' }, ' card in your area, earn ', { sprite: 'description-score-2' }, '.'],
                descriptionKo: ['구역에 ', { sprite: 'description-dragon' }, ' 카드가 없다면 ', { sprite: 'description-score-2' }, '을 획득합니다.'],
            },
        ],
    },
    22: {
        id: 22, name: 'Poseidon', family: 'water', cost: 7,
        imagePath: '/assets/cards/water/Poseidon.png',
        effects: [
            {
                type: 'instant',
                description: ['Earn ', { sprite: 'description-score-3' }, ' for each ', { sprite: 'description-water' }, ' card in your area.'],
                descriptionKo: ['소환된 ', { sprite: 'description-water' }, ' 카드 1장당 ', { sprite: 'description-score-3' }, '을 획득합니다.'],
            },
        ],
    },
    23: {
        id: 23, name: 'Sea Spirit', family: 'water', cost: 1,
        imagePath: '/assets/cards/water/Seaspirit.png',
        effects: [
            {
                type: 'active',
                description: ['Earn ', { sprite: 'description-score-1' }, ' for each your ', { sprite: 'description-stone-3' }, '.'],
                descriptionKo: ['당신의 ', { sprite: 'description-stone-3' }, '의 수만큼 ', { sprite: 'description-score-1' }, '을 획득합니다.'],
            },
        ],
    },
    24: {
        id: 24, name: 'Snail Maiden', family: 'water', cost: 3,
        imagePath: '/assets/cards/water/Snailmaiden.png',
        effects: [
            {
                type: 'active',
                description: ['Exchange one of your ', { sprite: 'description-stone-3' }, ' with ', { sprite: 'description-stone-6' }, '. -or- Exchange one of your ', { sprite: 'description-stone-6' }, ' with ', { sprite: 'description-stone-3' }, { sprite: 'description-stone-3' }, { sprite: 'description-stone-3' }, '.'],
                descriptionKo: ['당신의 ', { sprite: 'description-stone-3' }, ' 1개를 ', { sprite: 'description-stone-6' }, '으로 교환합니다. 또는 당신의 ', { sprite: 'description-stone-6' }, ' 1개를 ', { sprite: 'description-stone-3' }, { sprite: 'description-stone-3' }, { sprite: 'description-stone-3' }, '으로 교환합니다.'],
            },
        ],
    },
    25: {
        id: 25, name: 'Triton', family: 'water', cost: 4,
        imagePath: '/assets/cards/water/Triton.webp',
        effects: [
            {
                type: 'permanent',
                description: ['Whenever you tame a ', { sprite: 'description-water' }, ' card, earn ', { sprite: 'description-stone-3' }, { sprite: 'description-stone-3' }, '.'],
                descriptionKo: [{ sprite: 'description-water' }, ' 카드를 포획할 때마다 ', { sprite: 'description-stone-3' }, { sprite: 'description-stone-3' }, '을 획득합니다.'],
            },
        ],
    },
    26: {
        id: 26, name: 'Undine', family: 'water', cost: 1,
        imagePath: '/assets/cards/water/Undine.webp',
        effects: [
            {
                type: 'instant',
                description: ['Earn ', { sprite: 'description-stone-3' }, '.'],
                descriptionKo: [{ sprite: 'description-stone-3' }, '을 획득합니다.'],
            },
            {
                type: 'active',
                description: ['Recover.'],
                descriptionKo: ['회수합니다.'],
            },
        ],
    },
    27: {
        id: 27, name: 'Undine Queen', family: 'water', cost: 3,
        imagePath: '/assets/cards/water/Undinequeen.png',
        effects: [
            {
                type: 'active',
                description: ['Earn ', { sprite: 'description-stone-3' }, '.'],
                descriptionKo: [{ sprite: 'description-stone-3' }, '을 획득합니다.'],
            },
        ],
    },
    28: {
        id: 28, name: 'Water Giant', family: 'water', cost: 4,
        imagePath: '/assets/cards/water/Watergiant.webp',
        effects: [
            {
                type: 'instant',
                description: ['Earn ', { sprite: 'description-stone-3' }, { sprite: 'description-stone-3' }, '.'],
                descriptionKo: [{ sprite: 'description-stone-3' }, { sprite: 'description-stone-3' }, '을 획득합니다.'],
            },
            {
                type: 'permanent',
                description: ['Values of your ', { sprite: 'description-stone-3' }, ' and ', { sprite: 'description-stone-6' }, ' are each increased by 1.'],
                descriptionKo: ['당신의 ', { sprite: 'description-stone-3' }, '과 ', { sprite: 'description-stone-6' }, '의 값이 각각 1 증가합니다.'],
            },
        ],
    },
    29: {
        id: 29, name: 'Yuki Onna', family: 'water', cost: 0,
        imagePath: '/assets/cards/water/Yukionna.webp',
        effects: [
            {
                type: 'instant',
                description: ['Discard all your stones and earn ', { sprite: 'description-score-dynamic' }, ' (total value of discarded stones).'],
                descriptionKo: ['당신의 마법석을 모두 버리고 ', { sprite: 'description-score-dynamic' }, '(버린 마법석의 총 값)을 획득합니다.'],
            },
        ],
    },
    30: {
        id: 30, name: 'Yuki Onna Exalted', family: 'water', cost: 3,
        imagePath: '/assets/cards/water/Yukionnaexalted.png',
        effects: [
            {
                type: 'instant',
                description: ['Earn ', { sprite: 'description-score-dynamic' }, ' (total value of your ', { sprite: 'description-stone-3' }, ').'],
                descriptionKo: [{ sprite: 'description-score-dynamic' }, '(당신의 ', { sprite: 'description-stone-3' }, '의 총 값)을 획득합니다.'],
            },
        ],
    },

    // ── Earth ──────────────────────────────────────────────────────────────
    31: {
        id: 31, name: 'Basilisk', family: 'earth', cost: 3,
        imagePath: '/assets/cards/earth/Basilisk.png',
        effects: [
            {
                type: 'active',
                description: ['Lose ', {sprite: 'description-score-0'},  '/ ', {sprite: 'description-score-1'}, ' / ', {sprite: 'description-score-2'}, ', then earn ', { sprite: 'description-stone-1' }, ' / ', { sprite: 'description-stone-3' }, ' / ', { sprite: 'description-stone-6' }, '.'],
                descriptionKo: [{ sprite: 'description-score-0' }, '/ ', { sprite: 'description-score-1' }, ' / ', { sprite: 'description-score-2' }, '을 잃고 ', { sprite: 'description-stone-1' }, ' / ', { sprite: 'description-stone-3' }, ' / ', { sprite: 'description-stone-6' }, '을 획득합니다.'],
            },
        ],
    },
    32: {
        id: 32, name: 'Behemoth', family: 'earth', cost: 9,
        imagePath: '/assets/cards/earth/Behemoth.webp',
        effects: [
            {
                type: 'instant',
                description: ['Earn ', { sprite: 'description-score-3' }, ' for each card family in your area.'],
                descriptionKo: ['소환된 카드 속성 수만큼 ', { sprite: 'description-score-3' }, '을 획득합니다.'],
            },
        ],
    },
    33: {
        id: 33, name: 'Cerberus', family: 'earth', cost: 5,
        imagePath: '/assets/cards/earth/Cerberus.png',
        effects: [
            {
                type: 'instant',
                description: ['Discard up to 3 of your other summoned cards.'],
                descriptionKo: ['당신의 다른 소환된 카드 중 최대 3장을 버립니다.'],
            },
        ],
    },
    34: {
        id: 34, name: 'Forest Spirit', family: 'earth', cost: 2,
        imagePath: '/assets/cards/earth/Forestspirit.webp',
        effects: [
            {
                type: 'instant',
                description: ['Discard a card from your hand and earn ', { sprite: 'description-score-dynamic' }, ' (cost written on the card).'],
                descriptionKo: ['손에 든 카드 1장을 버리고 ', { sprite: 'description-score-dynamic' }, '(해당 카드의 표시된 코스트)을 획득합니다.'],
            },
        ],
    },
    35: {
        id: 35, name: 'Gargoyle', family: 'earth', cost: 2,
        imagePath: '/assets/cards/earth/Gargoyle.png',
        effects: [
            {
                type: 'permanent',
                description: ['Whenever you summon a card using ', { sprite: 'description-stone-6' }, ', earn ', { sprite: 'description-score-3' }, '.'],
                descriptionKo: [{ sprite: 'description-stone-6' }, '을 사용해 카드를 소환할 때마다 ', { sprite: 'description-score-3' }, '을 획득합니다.'],
            },
        ],
    },
    36: {
        id: 36, name: 'Goblin', family: 'earth', cost: 1,
        imagePath: '/assets/cards/earth/Goblin.webp',
        effects: [
            {
                type: 'active',
                description: ['Steal ', { sprite: 'description-score-1' }, ' from any opponent.'],
                descriptionKo: ['임의의 상대방에게서 ', { sprite: 'description-score-1' }, '을 빼앗습니다.'],
            },
        ],
    },
    37: {
        id: 37, name: 'Goblin Soldier', family: 'earth', cost: 4,
        imagePath: '/assets/cards/earth/Goblinsoldier.webp',
        effects: [
            {
                type: 'active',
                description: ['If any opponent has more points than you, earn ', { sprite: 'description-score-4' }, '. Otherwise lose ', { sprite: 'description-score-4' }, '.'],
                descriptionKo: ['상대방 중 당신보다 점수가 높은 플레이어가 있다면 ', { sprite: 'description-score-4' }, '을 획득합니다. 그렇지 않으면 ', { sprite: 'description-score-4' }, '을 잃습니다.'],
            },
        ],
    },
    38: {
        id: 38, name: 'Medusa', family: 'earth', cost: 4,
        imagePath: '/assets/cards/earth/Medusa.png',
        effects: [
            {
                type: 'active',
                description: ['Discard a card from your hand, then earn ', { sprite: 'description-stone-6' }, '.'],
                descriptionKo: ['손에 든 카드 1장을 버리고 ', { sprite: 'description-stone-6' }, '을 획득합니다.'],
            },
        ],
    },
    39: {
        id: 39, name: 'Mimic', family: 'earth', cost: 6,
        imagePath: '/assets/cards/earth/Mimic.png',
        effects: [
            {
                type: 'active',
                description: ['Choose any ', { sprite: 'description-earth' }, ' card from discard pile. Add it into your hand.'],
                descriptionKo: ['버린 카드 더미에서 ', { sprite: 'description-earth' }, ' 카드 1장을 선택해 손에 넣습니다.'],
            },
        ],
    },
    40: {
        id: 40, name: 'Mud Slime', family: 'earth', cost: 6,
        imagePath: '/assets/cards/earth/Mudslime.png',
        effects: [
            {
                type: 'instant',
                description: ['Earn ', { sprite: 'description-score-6' }, '.'],
                descriptionKo: [{ sprite: 'description-score-6' }, '을 획득합니다.'],
            },
            {
                type: 'active',
                description: ['Recover.'],
                descriptionKo: ['회수합니다.'],
            },
        ],
    },
    41: {
        id: 41, name: 'Rock Golem', family: 'earth', cost: 6,
        imagePath: '/assets/cards/earth/Rockgolem.png',
        effects: [
            {
                type: 'instant',
                description: ['Earn ', { sprite: 'description-score-dynamic' }, ' (total value of your ', { sprite: 'description-stone-6' }, ').'],
                descriptionKo: [{ sprite: 'description-score-dynamic' }, '(당신의 ', { sprite: 'description-stone-6' }, '의 총 값)을 획득합니다.'],
            },
        ],
    },
    42: {
        id: 42, name: 'Sand Giant', family: 'earth', cost: 10,
        imagePath: '/assets/cards/earth/Sandgiant.png',
        effects: [
            {
                type: 'instant',
                description: ['Earn ', { sprite: 'description-score-4' }, ' for each ', { sprite: 'description-earth' }, ' card in your area.'],
                descriptionKo: ['소환된 ', { sprite: 'description-earth' }, ' 카드 1장당 ', { sprite: 'description-score-4' }, '을 획득합니다.'],
            },
        ],
    },
    43: {
        id: 43, name: 'Stone Golem', family: 'earth', cost: 6,
        imagePath: '/assets/cards/earth/Stonegolem.webp',
        effects: [
            {
                type: 'instant',
                description: ['Exchange each of your stones with ', { sprite: 'description-stone-6' }, '.'],
                descriptionKo: ['당신의 마법석을 모두 ', { sprite: 'description-stone-6' }, '으로 교환합니다.'],
            },
        ],
    },
    44: {
        id: 44, name: 'Troll', family: 'earth', cost: 3,
        imagePath: '/assets/cards/earth/Troll.png',
        effects: [
            {
                type: 'active',
                description: ['If you have ', { sprite: 'description-stone-6' }, ', earn ', { sprite: 'description-score-3' }, '.'],
                descriptionKo: [{ sprite: 'description-stone-6' }, '이 있다면 ', { sprite: 'description-score-3' }, '을 획득합니다.'],
            },
        ],
    },
    45: {
        id: 45, name: 'Young Forest Spirit', family: 'earth', cost: 0,
        imagePath: '/assets/cards/earth/Youngforestspirit.png',
        effects: [
            {
                type: 'instant',
                description: ['Discard a card from your hand and summon another card for free.'],
                descriptionKo: ['손에 든 카드 1장을 버리고 다른 카드 1장을 무료로 소환합니다.'],
            },
        ],
    },

    46: {
        id: 46, name: 'Boreas', family: 'wind', cost: 4,
        imagePath: '/assets/cards/wind/Boreas.png',
        effects: [
            {
                type: 'instant',
                description: ['Earn ', { sprite: 'description-score-1' }, ' for each ', { sprite: 'description-wind' }, ' card in your area. Immediately recover this card.'],
                descriptionKo: ['소환된 ', { sprite: 'description-wind' }, ' 카드 1장당 ', { sprite: 'description-score-1' }, '을 획득합니다. 즉시 이 카드를 회수합니다.'],
            },
        ],
    },
    47: {
        id: 47, name: 'Dandelion Spirit', family: 'wind', cost: 3,
        imagePath: '/assets/cards/wind/Dandelionspirit.webp',
        effects: [
            {
                type: 'instant',
                description: ['Draw a card.'],
                descriptionKo: ['카드를 1장 드로우합니다.'],
            },
            {
                type: 'active',
                description: ['Recover.'],
                descriptionKo: ['회수합니다.'],
            },
        ],
    },
    48: {
        id: 48, name: 'Freyja', family: 'wind', cost: 7,
        imagePath: '/assets/cards/wind/Freyja.png',
        effects: [
            {
                type: 'active',
                description: ['Earn ', { sprite: 'description-score-1' }, ' for each card with ', { sprite: 'description-active' }, ' in your area.'],
                descriptionKo: ['구역에 있는 ', { sprite: 'description-active' }, '가 있는 카드 1장당 ', { sprite: 'description-score-1' }, '을 획득합니다.'],
            },
        ],
    },
    49: {
        id: 49, name: 'Genie', family: 'wind', cost: 4,
        imagePath: '/assets/cards/wind/Genie.png',
        effects: [
            {
                type: 'instant',
                description: ['Activate all available ', { sprite: 'description-active' }, ' effect of cards in your area.'],
                descriptionKo: ['소환된 카드 중 사용 가능한 ', { sprite: 'description-active' }, ' 효과를 모두 발동합니다.'],
            },
        ],
    },
    50: {
        id: 50, name: 'Genie Exalted', family: 'wind', cost: 5,
        imagePath: '/assets/cards/wind/Genieexalted.png',
        effects: [
            {
                type: 'active',
                description: ['Copy one ', { sprite: 'description-active' }, ' effect of another card in your area and activate it.'],
                descriptionKo: ['구역에 있는 다른 카드의 ', { sprite: 'description-active' }, ' 효과 중 하나를 복사하여 발동합니다.'],
            },
        ],
    },
    51: {
        id: 51, name: 'Gi-rin', family: 'wind', cost: 10,
        imagePath: '/assets/cards/wind/Gi-rin.png',
        effects: [
            {
                type: 'instant',
                description: ['Earn ', { sprite: 'description-score-2' }, ' for each card in your area.'],
                descriptionKo: ['소환된 카드 1장당 ', { sprite: 'description-score-2' }, '을 획득합니다.'],
            },
        ],
    },
    52: {
        id: 52, name: 'Griffon', family: 'wind', cost: 7,
        imagePath: '/assets/cards/wind/Griffon.png',
        effects: [
            {
                type: 'active',
                description: ['Draw a card.'],
                descriptionKo: ['카드를 1장 드로우합니다.'],
            },
        ],
    },
    53: {
        id: 53, name: 'Harpy', family: 'wind', cost: 3,
        imagePath: '/assets/cards/wind/Harpy.png',
        effects: [
            {
                type: 'active',
                description: ['If the number of cards in your hand is the same as the number of cards in your area, earn ', { sprite: 'description-score-3' }, '.'],
                descriptionKo: ['손에 든 카드 수와 소환된 카드 수가 같다면 ', { sprite: 'description-score-3' }, '을 획득합니다.'],
            },
        ],
    },
    54: {
        id: 54, name: 'Hippogriff', family: 'wind', cost: 4,
        imagePath: '/assets/cards/wind/Hippogriff.png',
        effects: [
            {
                type: 'instant',
                description: ['Draw a card.'],
                descriptionKo: ['카드를 1장 드로우합니다.'],
            },
            {
                type: 'permanent',
                description: ['The cost of your ', { sprite: 'description-wind' }, ' card is decreased by 2.'],
                descriptionKo: ['당신의 ', { sprite: 'description-wind' }, ' 카드의 코스트가 2 감소합니다.'],
            },
        ],
    },
    55: {
        id: 55, name: 'Odin', family: 'wind', cost: 6,
        imagePath: '/assets/cards/wind/Odin.png',
        effects: [
            {
                type: 'active',
                description: ['If you have less than 6 cards in your hand, earn ', { sprite: 'description-score-2' }, '. Otherwise, earn ', { sprite: 'description-stone-6' }, '.'],
                descriptionKo: ['손에 든 카드가 6장 미만이라면 ', { sprite: 'description-score-2' }, '을 획득합니다. 그렇지 않으면 ', { sprite: 'description-stone-6' }, '을 획득합니다.'],
            },
        ],
    },
    56: {
        id: 56, name: 'Pegasus', family: 'wind', cost: 3,
        imagePath: '/assets/cards/wind/Pegasus.webp',
        effects: [
            {
                type: 'instant',
                description: ['Draw a card.'],
                descriptionKo: ['카드를 1장 드로우합니다.'],
            },
            {
                type: 'permanent',
                description: ['The cost of your card is decreased by 1.'],
                descriptionKo: ['당신의 카드의 코스트가 1 감소합니다.'],
            },
        ],
    },
    57: {
        id: 57, name: 'Rudra', family: 'wind', cost: 8,
        imagePath: '/assets/cards/wind/Rudra.webp',
        effects: [
            {
                type: 'instant',
                description: ['Earn ', { sprite: 'description-score-2' }, ' for each card in your hand.'],
                descriptionKo: ['손에 든 카드 1장당 ', { sprite: 'description-score-2' }, '을 획득합니다.'],
            },
        ],
    },
    58: {
        id: 58, name: 'Sylph', family: 'wind', cost: 4,
        imagePath: '/assets/cards/wind/Sylph.png',
        effects: [
            {
                type: 'instant',
                description: ['Draw a card.'],
                descriptionKo: ['카드를 1장 드로우합니다.'],
            },
            {
                type: 'permanent',
                description: ['Whenever you summon a card, earn ', { sprite: 'description-score-1' }, '.'],
                descriptionKo: ['카드를 소환할 때마다 ', { sprite: 'description-score-1' }, '을 획득합니다.'],
            },
        ],
    },
    59: {
        id: 59, name: 'Tengu', family: 'wind', cost: 3,
        imagePath: '/assets/cards/wind/Tengu.webp',
        effects: [
            {
                type: 'instant',
                description: ['Earn ', { sprite: 'description-score-6' }, ' and put this card on the top of the draw deck.'],
                descriptionKo: [{ sprite: 'description-score-6' }, '을 획득하고 이 카드를 드로우 덱의 맨 위에 놓습니다.'],
            },
        ],
    },
    60: {
        id: 60, name: 'Valkyrie', family: 'wind', cost: 5,
        imagePath: '/assets/cards/wind/Valkyrie.png',
        effects: [
            {
                type: 'active',
                description: ['Earn ', { sprite: 'description-score-1' }, ' for each card family in your area.'],
                descriptionKo: ['소환된 카드 속성 수만큼 ', { sprite: 'description-score-1' }, '을 획득합니다.'],
            },
        ],
    },

    61: {
        id: 61, name: 'Aeris', family: 'dragon', cost: 9,
        imagePath: '/assets/cards/dragon/Aeris.png',
        effects: [
            {
                type: 'instant',
                description: ['Recover one of your other cards and earn ', { sprite: 'description-score-dynamic' }, ' (cost written on the card).'],
                descriptionKo: ['당신의 다른 카드 1장을 회수하고 ', { sprite: 'description-score-dynamic' }, '(해당 카드의 표시된 코스트)을 획득합니다.'],
            },
        ],
    },
    62: {
        id: 62, name: 'Boulder', family: 'dragon', cost: 8,
        imagePath: '/assets/cards/dragon/Boulder.webp',
        effects: [
            {
                type: 'instant',
                description: ['Earn ', { sprite: 'description-score-8' }, ' points. A player of your choice discards one of their summoned ', { sprite: 'description-wind' }, ' cards.'],
                descriptionKo: [{ sprite: 'description-score-8' }, '을 획득합니다. 선택한 플레이어는 자신의 소환된 ', { sprite: 'description-wind' }, ' 카드 1장을 버립니다.'],
            },
        ],
    },
    63: {
        id: 63, name: 'Dragon Egg', family: 'dragon', cost: 3,
        imagePath: '/assets/cards/dragon/Dragonegg.webp',
        effects: [
            {
                type: 'instant',
                description: ['Discard this card and summon a ', { sprite: 'description-dragon' }, ' card for free.'],
                descriptionKo: ['이 카드를 버리고 ', { sprite: 'description-dragon' }, ' 카드 1장을 무료로 소환합니다.'],
            },
        ],
    },
    64: {
        id: 64, name: 'Ember', family: 'dragon', cost: 7,
        imagePath: '/assets/cards/dragon/Ember.png',
        effects: [
            {
                type: 'instant',
                description: ['Earn ', { sprite: 'description-score-7' }, ' points. A player of your choice discards one of their summoned ', { sprite: 'description-water' }, ' cards.'],
                descriptionKo: [{ sprite: 'description-score-7' }, '을 획득합니다. 선택한 플레이어는 자신의 소환된 ', { sprite: 'description-water' }, ' 카드 1장을 버립니다.'],
            },
        ],
    },
    65: {
        id: 65, name: 'Eternity', family: 'dragon', cost: 12,
        imagePath: '/assets/cards/dragon/Eternity.png',
        effects: [
            {
                type: 'instant',
                description: ['Earn ', { sprite: 'description-score-4' }, ' for each card family in your area.'],
                descriptionKo: ['소환된 카드 속성 수만큼 ', { sprite: 'description-score-4' }, '을 획득합니다.'],
            },
        ],
    },
    66: {
        id: 66, name: 'Gust', family: 'dragon', cost: 8,
        imagePath: '/assets/cards/dragon/Gust.png',
        effects: [
            {
                type: 'instant',
                description: ['Earn ', { sprite: 'description-score-8' }, ' points. A player of your choice discards one of their summoned ', { sprite: 'description-earth' }, ' cards.'],
                descriptionKo: [{ sprite: 'description-score-8' }, '을 획득합니다. 선택한 플레이어는 자신의 소환된 ', { sprite: 'description-earth' }, ' 카드 1장을 버립니다.'],
            },
        ],
    },
    67: {
        id: 67, name: 'Marina', family: 'dragon', cost: 7,
        imagePath: '/assets/cards/dragon/Marina.png',
        effects: [
            {
                type: 'instant',
                description: ['Earn ', { sprite: 'description-score-7' }, ' points. A player of your choice discards one of their summoned ', { sprite: 'description-fire' }, ' cards.'],
                descriptionKo: [{ sprite: 'description-score-7' }, '을 획득합니다. 선택한 플레이어는 자신의 소환된 ', { sprite: 'description-fire' }, ' 카드 1장을 버립니다.'],
            },
        ],
    },
    68: {
        id: 68, name: 'Scorch', family: 'dragon', cost: 9,
        imagePath: '/assets/cards/dragon/Scorch.png',
        effects: [
            {
                type: 'instant',
                description: ['Copy one ', { sprite: 'description-instant' }, ' effect of another card in your area and activate it.'],
                descriptionKo: ['구역에 있는 다른 카드의 ', { sprite: 'description-instant' }, ' 효과 중 하나를 복사하여 발동합니다.'],
            },
        ],
    },
    69: {
        id: 69, name: 'Tidal', family: 'dragon', cost: 5,
        imagePath: '/assets/cards/dragon/Tidal.png',
        effects: [
            {
                type: 'instant',
                description: ['Earn ', { sprite: 'description-score-5' }, ' for each ', { sprite: 'description-dragon' }, ' card in your area.'],
                descriptionKo: ['소환된 ', { sprite: 'description-dragon' }, ' 카드 1장당 ', { sprite: 'description-score-5' }, '을 획득합니다.'],
            },
        ],
    },
    70: {
        id: 70, name: 'Willow', family: 'dragon', cost: 10,
        imagePath: '/assets/cards/dragon/Willow.png',
        effects: [
            {
                type: 'instant',
                description: ['Earn ', { sprite: 'description-stone-1' }, { sprite: 'description-stone-3' }, { sprite: 'description-stone-6' }, ' and ', { sprite: 'description-score-3' }, '. Draw a card.'],
                descriptionKo: [{ sprite: 'description-stone-1' }, { sprite: 'description-stone-3' }, { sprite: 'description-stone-6' }, '과 ', { sprite: 'description-score-3' }, '을 획득합니다. 카드를 1장 드로우합니다.'],
            },
        ],
    },
};
