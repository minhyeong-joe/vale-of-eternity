import io from 'socket.io-client';

export const socket = io(import.meta.env.VITE_API_BASE_URL, {
    autoConnect: false,
});

if (import.meta.env.VITE_API_LOCAL) {
    socket.onAny((event, ...args) => console.log(`[socket] ${event}`, args));
}