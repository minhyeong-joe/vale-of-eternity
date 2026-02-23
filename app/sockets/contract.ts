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
