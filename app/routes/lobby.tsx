import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import type { Route } from "./+types/lobby";
import { useUser } from "../contexts/UserContext";
import { socket } from "../sockets/connection";
import { LobbyEvents, RoomEvents, type RoomCreatePayload, type RoomJoinPayload, type RoomJoinedPayload, type RoomErrorPayload } from "../sockets/contract";
import { CreateRoomModal, type CreateRoomFormData } from "../components/CreateRoomModal";
import { JoinRoomModal } from "../components/JoinRoomModal";
import "./lobby.css";

export function meta({}: Route.MetaArgs) {
    return [
        { title: "Lobby - Vale of Eternity" },
        { name: "description", content: "Vale of Eternity Board Game" },
    ];
}

type RoomStatus = "waiting" | "in-progress";

interface Room {
    id: string;
    name: string;
    hostUserId: string;
    hostUsername: string;
    pace: 'chill' | 'slow' | 'fast';
    isPrivate: boolean;
    maxPlayers: number;
    currentPlayers: number;
    status: RoomStatus;
}

export default function Lobby() {
    const navigate = useNavigate();
    const { user, logout } = useUser();
    const [rooms, setRooms] = useState<Room[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [pendingJoinRoom, setPendingJoinRoom] = useState<Room | null>(null);

    useEffect(() => {
        if (!user) {
            navigate("/");
        }
    }, [user, navigate]);

    useEffect(() => {
        if (!user) return;

        socket.emit(LobbyEvents.GET_ROOMS);

        socket.on(LobbyEvents.ROOMS, (data: Room[]) => setRooms(data));
        socket.on(LobbyEvents.ROOM_ADDED, (room: Room) => setRooms(prev => [...prev, room]));
        socket.on(LobbyEvents.ROOM_UPDATED, (room: Room) => setRooms(prev => prev.map(r => r.id === room.id ? room : r)));
        socket.on(LobbyEvents.ROOM_REMOVED, (roomId: string) => setRooms(prev => prev.filter(r => r.id !== roomId)));

        return () => {
            socket.off(LobbyEvents.ROOMS);
            socket.off(LobbyEvents.ROOM_ADDED);
            socket.off(LobbyEvents.ROOM_UPDATED);
            socket.off(LobbyEvents.ROOM_REMOVED);
        };
    }, [user]);

    if (!user) return null;

    const filteredRooms = rooms.filter(
        (room) =>
            room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            room.hostUsername.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleJoin = (room: Room) => {
        if (room.status === "in-progress" || room.currentPlayers === room.maxPlayers) return;

        if (room.isPrivate) {
            setPendingJoinRoom(room);
            return;
        }

        emitJoin(room.id, undefined);
    };

    const emitJoin = (roomId: string, password: string | undefined) => {
        const onJoined = ({ roomDetail }: RoomJoinedPayload) => {
            socket.off(RoomEvents.ERROR, onError);
            navigate(`/game-room/${roomDetail.id}`, { state: { roomDetail } });
        };

        const onError = ({ message }: RoomErrorPayload) => {
            socket.off(RoomEvents.JOINED, onJoined);
            toast.error(message);
        };

        socket.once(RoomEvents.JOINED, onJoined);
        socket.once(RoomEvents.ERROR, onError);
        socket.emit(RoomEvents.JOIN, { roomId, password } satisfies RoomJoinPayload);
    };

    const handleCreateRoom = () => {
        setShowCreateModal(true);
    };

    const handleCreate = (data: CreateRoomFormData) => {
        const payload: RoomCreatePayload = {
            name: data.name,
            pace: data.pace,
            isPrivate: !!data.password,
            maxPlayers: data.maxPlayers,
            password: data.password || undefined,
        };

        socket.once(RoomEvents.JOINED, ({ roomDetail }: RoomJoinedPayload) => {
            navigate(`/game-room/${roomDetail.id}`, { state: { roomDetail } });
        });

        socket.emit(RoomEvents.CREATE, payload);
        setShowCreateModal(false);
    };

    return (
        <>
            <div className="lobby-container fixed inset-0 bg-cover bg-center bg-no-repeat overflow-y-auto">
                {/* Background Overlay */}
                <div className="fixed inset-0 bg-black/50" />

                <div className="relative min-h-screen flex flex-col">
                    {/* Header */}
                    <header className="bg-slate-900/70 backdrop-blur-sm border-b border-slate-700/50 px-6 py-4">
                        <div className="max-w-5xl mx-auto flex items-center justify-between">
                            <h1 className="title-glow text-2xl font-bold text-white">Vale of Eternity</h1>
                            <div className="flex items-center gap-4">
                                <span className="text-slate-300 text-sm">
                                    <i className="fa-solid fa-user mr-2 text-slate-400" />
                                    {user.username}
                                </span>
                                <button
                                    onClick={() => {
                                        logout();
                                        navigate("/");
                                    }}
                                    className="flex items-center gap-1.5 text-slate-400 hover:text-white text-sm transition-colors duration-200 cursor-pointer"
                                >
                                    <i className="fa-solid fa-right-from-bracket" />
                                    Sign Out
                                </button>
                            </div>
                        </div>
                    </header>

                    {/* Main Content */}
                    <main className="flex-1 p-6">
                        <div className="max-w-5xl mx-auto">
                            <div className="bg-slate-600/60 backdrop-blur-sm rounded-lg shadow-xl p-6">

                                {/* Panel Header */}
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                                    <div>
                                        <h2 className="text-xl font-bold text-white">Game Lobby</h2>
                                        <p className="text-slate-400 text-sm mt-0.5">
                                            {filteredRooms.length} room{filteredRooms.length !== 1 ? "s" : ""} available
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-3 w-full sm:w-auto">
                                        {/* Search */}
                                        <div className="relative flex-1 sm:flex-none">
                                            <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs pointer-events-none" />
                                            <input
                                                type="text"
                                                placeholder="Search rooms..."
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                className="w-full sm:w-52 pl-9 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm"
                                            />
                                        </div>
                                        {/* Create Room */}
                                        <button
                                            onClick={handleCreateRoom}
                                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 cursor-pointer text-sm whitespace-nowrap"
                                        >
                                            <i className="fa-solid fa-plus" />
                                            Create Room
                                        </button>
                                    </div>
                                </div>

                                {/* Rooms Table */}
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-slate-600">
                                                <th className="text-left text-slate-400 text-xs font-semibold uppercase tracking-wide pb-3 pr-4">Room Name</th>
                                                <th className="text-left text-slate-400 text-xs font-semibold uppercase tracking-wide pb-3 pr-4">Host</th>
                                                <th className="text-center text-slate-400 text-xs font-semibold uppercase tracking-wide pb-3 pr-4">Players</th>
                                                <th className="text-center text-slate-400 text-xs font-semibold uppercase tracking-wide pb-3 pr-4">Pace</th>
                                                <th className="text-center text-slate-400 text-xs font-semibold uppercase tracking-wide pb-3 pr-4">Status</th>
                                                <th className="text-center text-slate-400 text-xs font-semibold uppercase tracking-wide pb-3 pr-4">Access</th>
                                                <th className="pb-3" />
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-700/50">
                                            {filteredRooms.length === 0 ? (
                                                <tr>
                                                    <td colSpan={7} className="text-center text-slate-400 py-10 text-sm">
                                                        <i className="fa-solid fa-dungeon text-slate-600 text-3xl mb-3 block" />
                                                        No rooms found
                                                    </td>
                                                </tr>
                                            ) : (
                                                filteredRooms.map((room) => {
                                                    const isFull = room.currentPlayers === room.maxPlayers;
                                                    const isJoinable = room.status === "waiting" && !isFull;

                                                    return (
                                                        <tr
                                                            key={room.id}
                                                            className="hover:bg-slate-700/30 transition-colors duration-150"
                                                        >
                                                            {/* Room Name */}
                                                            <td className="py-3.5 pr-4">
                                                                <span className="text-white font-medium">{room.name}</span>
                                                            </td>

                                                            {/* Host */}
                                                            <td className="py-3.5 pr-4">
                                                                <span className="text-slate-300 text-sm">{room.hostUsername}</span>
                                                            </td>

                                                            {/* Players */}
                                                            <td className="py-3.5 pr-4 text-center">
                                                                <span className={`text-sm font-medium ${isFull ? "text-red-400" : "text-slate-300"}`}>
                                                                    {room.currentPlayers}/{room.maxPlayers}
                                                                </span>
                                                            </td>

                                                            {/* Pace */}
                                                            <td className="py-3.5 pr-4 text-center">
                                                                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-sky-300 bg-sky-900/40 px-2.5 py-1 rounded-full border border-sky-700/40">
                                                                    <i className={`${
                                                                        room.pace === 'chill' ? 'fa-solid fa-mug-hot' :
                                                                        room.pace === 'slow'  ? 'fa-solid fa-hourglass-half' :
                                                                                               'fa-solid fa-bolt'
                                                                    } text-[10px]`} />
                                                                    {room.pace.charAt(0).toUpperCase() + room.pace.slice(1)}
                                                                </span>
                                                            </td>

                                                            {/* Status Badge */}
                                                            <td className="py-3.5 pr-4 text-center">
                                                                {room.status === "waiting" ? (
                                                                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-400 bg-emerald-900/40 px-2.5 py-1 rounded-full border border-emerald-700/40">
                                                                        <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                                                                        Waiting
                                                                    </span>
                                                                ) : (
                                                                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-400 bg-amber-900/40 px-2.5 py-1 rounded-full border border-amber-700/40">
                                                                        <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse" />
                                                                        In Progress
                                                                    </span>
                                                                )}
                                                            </td>

                                                            {/* Lock Icon */}
                                                            <td className="py-3.5 pr-4 text-center">
                                                            {room.isPrivate ? (
                                                                    <i
                                                                        className="fa-solid fa-lock text-amber-400 text-sm"
                                                                        title="Password protected"
                                                                    />
                                                                ) : (
                                                                    <i
                                                                        className="fa-solid fa-lock-open text-slate-500 text-sm"
                                                                        title="Open"
                                                                    />
                                                                )}
                                                            </td>

                                                            {/* Join Button */}
                                                            <td className="py-3.5 text-right">
                                                                <button
                                                                    onClick={() => handleJoin(room)}
                                                                    disabled={!isJoinable}
                                                                    className="text-sm font-semibold py-1.5 px-4 rounded-lg transition-colors duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed bg-blue-600/80 hover:enabled:bg-blue-600 text-white"
                                                                >
                                                                    Join
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    );
                                                })
                                            )}
                                        </tbody>
                                    </table>
                                </div>

                                    {/* Legend */}
                                <div className="flex items-center gap-5 mt-5 pt-4 border-t border-slate-700/50">
                                    <span className="flex items-center gap-1.5 text-xs text-slate-400">
                                        <i className="fa-solid fa-lock text-amber-400" />
                                        Private
                                    </span>
                                    <span className="flex items-center gap-1.5 text-xs text-slate-400">
                                        <i className="fa-solid fa-lock-open text-slate-500" />
                                        Public
                                    </span>
                                </div>

                            </div>
                        </div>
                    </main>
                </div>
            </div>

            {/* Create Room Modal */}
            {showCreateModal && (
                <CreateRoomModal
                    defaultRoomName={`${user.username}'s Room`}
                    onClose={() => setShowCreateModal(false)}
                    onCreate={handleCreate}
                />
            )}

            {/* Join Room Modal (private rooms) */}
            {pendingJoinRoom && (
                <JoinRoomModal
                    roomName={pendingJoinRoom.name}
                    onClose={() => setPendingJoinRoom(null)}
                    onJoin={(password) => {
                        setPendingJoinRoom(null);
                        emitJoin(pendingJoinRoom.id, password);
                    }}
                />
            )}
        </>
    );
}
