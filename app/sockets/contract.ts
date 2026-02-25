// ********** Lobby Events **********

export const LobbyEvents = {
    /** client -> server | payload: none   | Request the current room list on lobby mount */
    GET_ROOMS: 'lobby:rooms',
    /** server -> client | payload: Room[] | Full room list, sent in response to GET_ROOMS */
    ROOMS: 'lobby:rooms',
    /** server -> client | payload: Room   | Broadcast when a new room is created */
    ROOM_ADDED: 'lobby:room-added',
    /** server -> client | payload: Room   | Broadcast when a room's player count or settings change */
    ROOM_UPDATED: 'lobby:room-updated',
    /** server -> client | payload: string (roomId) | Broadcast when a room is removed */
    ROOM_REMOVED: 'lobby:room-removed',
} as const;

// ********** Room Events **********

export const RoomEvents = {
    /** client -> server | payload: RoomCreatePayload  | Create a new room */
    CREATE:  'room:create',
    /** client -> server | payload: RoomJoinPayload    | Join an existing room */
    JOIN:    'room:join',
    /** client -> server | payload: RoomLeavePayload   | Leave the current room */
    LEAVE:   'room:leave',
    /** client -> server | payload: RoomUpdatePayload  | Update room settings (host only, waiting status only) */
    UPDATE:  'room:update',
    /** server -> client | payload: RoomJoinedPayload  | Sent to all room sockets when any player joins */
    JOINED:  'room:joined',
    /** server -> client | payload: RoomLeftPayload    | Sent to leaving socket and remaining sockets */
    LEFT:    'room:left',
    /** server -> client | payload: RoomUpdatedPayload | Broadcast to all room sockets when settings change */
    UPDATED: 'room:updated',
    /** server -> client | payload: RoomErrorPayload   | Sent to the requesting socket only on error */
    ERROR:   'room:error',
    /** server -> client | payload: RoomPlayerReconnectingPayload | Player lost connection; 60s grace period started */
    PLAYER_RECONNECTING: 'room:player-reconnecting',
    /** server -> client (reconnecting socket only) | payload: RoomRestoredPayload | Grace-period reconnect succeeded */
    RESTORED: 'room:restored',
} as const;

// ********** Room Payload Types **********

export interface RoomCreatePayload {
    name: string;
    pace?: 'chill' | 'slow' | 'fast';
    isPrivate?: boolean;
    maxPlayers?: number;
    password?: string;
}

export interface RoomJoinPayload {
    roomId: string;
    password?: string;
}

export interface RoomLeavePayload {
    roomId: string;
}

export interface RoomUpdatePayload {
    roomId: string;
    name?: string;
    pace?: 'chill' | 'slow' | 'fast';
    isPrivate?: boolean;
    maxPlayers?: number;
    /** Pass null to clear the password (make room public) */
    password?: string | null;
}

export interface RoomInfo {
    id: string;
    name: string;
    hostUserId: string;
    hostUsername: string;
    pace: 'chill' | 'slow' | 'fast';
    isPrivate: boolean;
    maxPlayers: number;
    currentPlayers: number;
    status: 'waiting' | 'in-progress' | 'finished';
}

export interface RoomDetail extends RoomInfo {
    players: { userId: string; username: string; isConnected: boolean }[];
}

export interface RoomJoinedPayload {
    roomDetail: RoomDetail;
}

export interface RoomLeftPayload {
    roomId: string;
    roomDetail?: RoomDetail;
}

export interface RoomUpdatedPayload {
    roomDetail: RoomDetail;
}

export interface RoomErrorPayload {
    code: string;
    message: string;
}

export interface RoomPlayerReconnectingPayload {
    userId: string;
    username: string;
}

export interface RoomRestoredPayload {
    roomDetail: RoomDetail;
}

// ********** Game Events **********

export const GameEvents = {
    // client → server
    /** Emit to start a game (host only). No payload. */
    START:     'game:start',
    /** Hunt phase: claim a card on the board. payload: HuntPickPayload */
    HUNT_PICK: 'game:hunt-pick',
    /** Action phase: sell a claimed card for stones. payload: SellPayload */
    SELL:      'game:sell',
    /** Action phase: tame a claimed card into hand. payload: TamePayload */
    TAME:      'game:tame',
    /** Action phase: summon a hand card to area. payload: SummonPayload */
    SUMMON:    'game:summon',
    /** Action phase: remove a summoned card (pay 1 stone per round). payload: RemovePayload */
    REMOVE:    'game:remove',
    /** Resolution phase: activate a card's active effect. payload: ActivatePayload */
    ACTIVATE:  'game:activate',
    /** Respond to a pending interaction (e.g. target selection). payload: RespondPayload */
    RESPOND:   'game:respond',
    /** End your turn. No payload. */
    END_TURN:  'game:end-turn',
    /** Request a fresh state snapshot from the server (e.g. after page refresh). No payload. */
    REQUEST_STATE: 'game:request-state',
    // server → client
    /** Full authoritative state snapshot. payload: ServerGameState */
    STATE:       'game:state',
    /** Partial state update (shallow-merged). payload: Partial<ServerGameState> */
    STATE_DELTA: 'game:state-delta',
    /** A card effect requires player input. payload: InteractionRequest */
    INTERACTION: 'game:interaction',
    /** An action failed validation. payload: { code: string; message: string } */
    ERROR:       'game:error',
    /** Game ended mid-match (player permanently left). payload: { reason: string; username: string } */
    ENDED:       'game:ended',
} as const;

// ── Game payload types ──────────────────────────────────────────────────────

export interface HuntPickPayload {
    cardId: number;
}

export interface SellPayload {
    cardId: number;
}

export interface TamePayload {
    cardId: number;
}

export interface StoneCost {
    red?: number;
    blue?: number;
    purple?: number;
}

export interface SummonPayload {
    cardId: number;
    payment: StoneCost;
}

export interface RemovePayload {
    cardId: number;
    payment: StoneCost;
}

export interface ActivatePayload {
    cardId: number;
}

/**
 * Sent in response to a game:interaction event.
 * The `value` shape depends on the interaction type:
 *   - target (userId string)
 *   - card / discardThenSummon (cardId number)
 *   - cards (cardId[])
 *   - choice (option string)
 */
export interface RespondPayload {
    value: string | number | number[] | Record<string, number>;
}

// ── Server → Client game state shape ───────────────────────────────────────

export interface ServerPlayer {
    userId: string;
    username: string;
    color: string;
    score: number;
    stones: { red: number; blue: number; purple: number };
    area: number[];
    discard: number[];
    handCount: number;
    hand: number[];      // populated only for the requesting socket's player
    activeEffectsUsed: number[];
    stoneValueBonus: { red: number; blue: number; purple: number };
    stoneOverrides: Array<{ from: string; countsAs: string }>;
    costReductionAll: number;
    costReductionByFamily: { fire: number; water: number; earth: number; wind: number; dragon: number };
}

export interface ServerGameState {
    roomId: string;
    round: number;
    phase: 'hunting' | 'action' | 'resolution';
    firstPlayerIndex: number;
    activePlayerIndex: number;
    /** Server may send player indices (number) or userIds (string) */
    huntPickOrder: (string | number)[];
    huntPicksDone: number;
    drawDeckCount: number;
    discardPileCount: number;
    boardZones: { fire: number[]; water: number[]; earth: number[]; wind: number[]; dragon: number[] };
    boardMarkers: Record<string, string>;   // cardId (string key) → userId
    pendingInteraction: {
        type: 'target' | 'card' | 'cards' | 'choice' | 'discardThenSummon' | 'stoneOverflow';
        forUserId: string;
        cardId: number;
        context: Record<string, unknown>;
    } | null;
    players: ServerPlayer[];
}
