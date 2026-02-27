import { useNavigate } from "react-router";
import { useUser } from "~/contexts/UserContext";

export default function AppHeader() {
	const { user, logout } = useUser();
	const navigate = useNavigate();

	return (
		<header className="bg-slate-900/80 backdrop-blur-sm border-b border-slate-700/50 px-4 py-2.5 flex w-full items-center justify-between">
			<h1 className="title-glow text-2xl font-bold text-white flex-shrink-0">
				Vale of Eternity
			</h1>

			{/* navlinks */}
			<div className="flex items-center gap-12 cursor-default select-none">
				<a
					onClick={() => navigate("/lobby")}
					className={`hover:text-white transition-colors duration-200 ${window.location.pathname === "/lobby" ? "text-white" : "text-slate-400 cursor-pointer"}`}
				>
					<i className="fa-solid fa-house mr-2" />
					Lobby
				</a>
				<a
					onClick={() => navigate("/rule-book")}
					className={`hover:text-white transition-colors duration-200 ${window.location.pathname === "/rule-book" ? "text-white" : "text-slate-400 cursor-pointer"}`}
				>
					<i className="fa-solid fa-book mr-2" />
					Rule book
				</a>
			</div>

			{/* user info and sign out */}
			<div className="flex items-center gap-3 flex-shrink-0">
				<span className="text-slate-300 text-sm">
					<i className="fa-solid fa-user mr-2 text-slate-400" />
					{user?.username || "guest"}
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
		</header>
	);
}
