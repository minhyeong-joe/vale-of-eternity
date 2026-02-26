import io from 'socket.io-client';

export const socket = io(import.meta.env.VITE_API_BASE_URL, {
    autoConnect: false,
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 10000,
    randomizationFactor: 0.3,
});

if (import.meta.env.VITE_API_LOCAL) {
    socket.onAny((event, ...args) => console.log(`[socket] ${event}`, args));
}