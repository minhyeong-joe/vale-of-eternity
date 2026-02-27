import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// ─── Schema + types ────────────────────────────────────────────────────────

const roomSettingsSchema = z.object({
	name: z.string().min(1, "Room name is required"),
	password: z.string().optional(),
	maxPlayers: z.number().min(2).max(4),
	pace: z.enum(["chill", "slow", "fast"]),
});

export type RoomSettingsFormData = z.infer<typeof roomSettingsSchema>;

// ─── Shared option lists ───────────────────────────────────────────────────

type GamePace = "chill" | "slow" | "fast";

const PACE_OPTIONS: {
	value: GamePace;
	label: string;
	description: string;
	icon: string;
	enabled: boolean;
}[] = [
	{
		value: "chill",
		label: "Chill",
		description: "No time limit",
		icon: "fa-solid fa-mug-hot",
		enabled: true,
	},
	{
		value: "slow",
		label: "Slow",
		description: "2 min / turn",
		icon: "fa-solid fa-hourglass-half",
		enabled: false,
	},
	{
		value: "fast",
		label: "Fast",
		description: "1 min / turn",
		icon: "fa-solid fa-bolt",
		enabled: false,
	},
];

// ─── Component ─────────────────────────────────────────────────────────────

interface RoomSettingsModalProps {
	/** Current room configuration pre-fills the form */
	currentSettings?: RoomSettingsFormData;
	defaultRoomName?: string; // used only in create mode, ignored if currentSettings is provided
	/** Minimum allowed maxPlayers (= current number of players in-room) */
	minPlayers?: number;
	onClose: () => void;
	onSave: (data: RoomSettingsFormData) => void;
}

export function RoomSettingsModal({
	currentSettings,
	defaultRoomName,
	minPlayers,
	onClose,
	onSave,
}: RoomSettingsModalProps) {
	const {
		register,
		handleSubmit,
		control,
		formState: { errors },
	} = useForm<RoomSettingsFormData>({
		resolver: zodResolver(roomSettingsSchema),
		defaultValues: {
			name: currentSettings?.name || defaultRoomName || "",
			password: currentSettings?.password || "",
			maxPlayers: currentSettings?.maxPlayers || 4,
			pace: currentSettings?.pace || "chill",
		},
	});

	// Close on Escape
	useEffect(() => {
		const onKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") onClose();
		};
		window.addEventListener("keydown", onKeyDown);
		return () => window.removeEventListener("keydown", onKeyDown);
	}, [onClose]);

	// Only allow maxPlayers values that don't drop below the current player count
	const allowedMaxPlayers = minPlayers
		? [2, 3, 4].filter((n) => n >= minPlayers)
		: [2, 3, 4];

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

			{/* Modal card */}
			<div className="relative w-full max-w-md bg-slate-700/90 backdrop-blur-sm rounded-lg shadow-2xl border border-slate-600/50">
				{/* Header */}
				<div className="flex items-center justify-between px-6 py-4 border-b border-slate-600/50">
					<h2 className="text-lg font-bold text-white flex items-center gap-2">
						{currentSettings ? (
							<>
								<i className="fa-solid fa-gear text-slate-400 text-base" />
								Room Settings
							</>
						) : (
							"Create Room"
						)}
					</h2>
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
				<form onSubmit={handleSubmit(onSave)} className="px-6 py-5 space-y-5">
					{/* Room Name */}
					<div>
						<label className="block text-sm font-medium text-slate-300 mb-2">
							Room Name
						</label>
						<input
							{...register("name")}
							type="text"
							className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm"
						/>
						{errors.name && (
							<p className="text-red-400 text-xs mt-1">{errors.name.message}</p>
						)}
					</div>

					{/* Password */}
					<div>
						<label className="block text-sm font-medium text-slate-300 mb-2">
							Password
							<span className="ml-2 text-xs text-slate-500 font-normal">
								(leave blank for public room)
							</span>
						</label>
						<div className="relative">
							<i className="fa-solid fa-lock absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs pointer-events-none" />
							<input
								{...register("password")}
								type="password"
								placeholder="Optional password"
								className="w-full pl-9 pr-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm"
							/>
						</div>
					</div>

					{/* Max Players */}
					<div>
						<label className="block text-sm font-medium text-slate-300 mb-2">
							Max Players
							{minPlayers && minPlayers > 2 && (
								<span className="ml-2 text-xs text-slate-500 font-normal">
									(min {minPlayers} — room is occupied)
								</span>
							)}
						</label>
						<Controller
							name="maxPlayers"
							control={control}
							render={({ field }) => (
								<div className="flex gap-2">
									{[2, 3, 4].map((n) => {
										const disabled =
											minPlayers && n < minPlayers ? true : false;
										return (
											<button
												key={n}
												type="button"
												disabled={disabled}
												onClick={() => !disabled && field.onChange(n)}
												className={`flex-1 py-2 rounded-lg text-sm font-semibold border transition-colors duration-150 ${
													disabled
														? "bg-slate-900/60 border-slate-700 text-slate-600 cursor-not-allowed"
														: field.value === n
															? "bg-blue-600 border-blue-500 text-white cursor-pointer"
															: "bg-slate-800 border-slate-600 text-slate-300 hover:border-slate-500 cursor-pointer"
												}`}
											>
												{n}
											</button>
										);
									})}
								</div>
							)}
						/>
					</div>

					{/* Game Pace */}
					<div>
						<label className="block text-sm font-medium text-slate-300 mb-2">
							Game Pace
						</label>
						<Controller
							name="pace"
							control={control}
							render={({ field }) => (
								<div className="flex gap-2">
									{PACE_OPTIONS.map((option) => (
										<button
											key={option.value}
											type="button"
											onClick={() => field.onChange(option.value)}
											className={`flex-1 flex flex-col items-center gap-1 py-3 px-2 rounded-lg border transition-colors duration-150 ${
												field.value === option.value
													? "bg-blue-600 border-blue-500 text-white"
													: "bg-slate-800 border-slate-600 text-slate-300 hover:border-slate-500"
											} ${!option.enabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
											disabled={!option.enabled}
										>
											<i className={`${option.icon} text-sm`} />
											<span className="text-xs font-semibold">
												{option.label}
											</span>
											<span
												className={`text-xs ${field.value === option.value ? "text-blue-200" : "text-slate-500"}`}
											>
												{option.description}
											</span>
										</button>
									))}
								</div>
							)}
						/>
					</div>

					{/* Actions */}
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
							{currentSettings ? "Save" : "Create"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
