import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const joinRoomSchema = z.object({
    password: z.string().min(1, "Password is required"),
});

type JoinRoomFormData = z.infer<typeof joinRoomSchema>;

interface JoinRoomModalProps {
    roomName: string;
    onClose: () => void;
    onJoin: (password: string) => void;
}

export function JoinRoomModal({ roomName, onClose, onJoin }: JoinRoomModalProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
        setFocus,
    } = useForm<JoinRoomFormData>({
        resolver: zodResolver(joinRoomSchema),
    });

    useEffect(() => {
        setFocus("password");
    }, [setFocus]);

    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [onClose]);

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            aria-modal="true"
            role="dialog"
        >
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal Card */}
            <div className="relative w-full max-w-sm bg-slate-700/90 backdrop-blur-sm rounded-lg shadow-2xl border border-slate-600/50">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-600/50">
                    <div>
                        <h2 className="text-lg font-bold text-white">Private Room</h2>
                        <p className="text-slate-400 text-xs mt-0.5 truncate max-w-56">{roomName}</p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-slate-400 hover:text-white transition-colors duration-150 cursor-pointer"
                        aria-label="Close"
                    >
                        <i className="fa-solid fa-xmark text-lg" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit(({ password }) => onJoin(password))} className="px-6 py-5 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                            Password
                        </label>
                        <div className="relative">
                            <i className="fa-solid fa-lock absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs pointer-events-none" />
                            <input
                                {...register("password")}
                                type="password"
                                placeholder="Enter room password"
                                className="w-full pl-9 pr-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm"
                            />
                        </div>
                        {errors.password && (
                            <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>
                        )}
                    </div>

                    <div className="flex gap-3 pt-1">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-2 px-4 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-300 font-semibold rounded-lg transition-colors duration-150 cursor-pointer text-sm"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-150 cursor-pointer text-sm"
                        >
                            Join Room
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
