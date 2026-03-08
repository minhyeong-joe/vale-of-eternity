import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router";
import { useUser } from "~/contexts/UserContext";
import { useLang } from "~/contexts/LanguageContext";

export default function AppHeader() {
	const { user, logout } = useUser();
	const { lang, toggleLang } = useLang();
	const navigate = useNavigate();
	const [menuOpen, setMenuOpen] = useState(false);
	const [dropdownTop, setDropdownTop] = useState(0);
	const headerRef = useRef<HTMLElement>(null);
	const dropdownRef = useRef<HTMLDivElement>(null);

	const closeMenu = useCallback(() => setMenuOpen(false), []);

	const handleMenuToggle = useCallback(() => {
		if (!menuOpen && headerRef.current) {
			setDropdownTop(headerRef.current.getBoundingClientRect().bottom);
		}
		setMenuOpen((prev) => !prev);
	}, [menuOpen]);

	useEffect(() => {
		if (!menuOpen) return;
		const handleClick = (e: MouseEvent) => {
			const target = e.target as Node;
			if (
				headerRef.current?.contains(target) ||
				dropdownRef.current?.contains(target)
			) return;
			closeMenu();
		};
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") closeMenu();
		};
		document.addEventListener("mousedown", handleClick);
		document.addEventListener("keydown", handleKeyDown);
		return () => {
			document.removeEventListener("mousedown", handleClick);
			document.removeEventListener("keydown", handleKeyDown);
		};
	}, [menuOpen, closeMenu]);

	return (
		<>
			<header
				ref={headerRef}
				className="bg-slate-900/80 backdrop-blur-sm border-b border-slate-700/50 px-4 py-2.5 flex w-full items-center justify-between"
			>
				<h1 className="title-glow text-2xl font-bold text-white flex-shrink-0">
					Vale of Eternity
				</h1>

				<div className="hidden sm:flex items-center gap-12 cursor-default select-none">
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

				<div className="hidden sm:flex items-center gap-3 flex-shrink-0">
					<button
						onClick={toggleLang}
						className="flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-white transition-colors duration-200 cursor-pointer select-none"
						title="Switch language"
					>
						<span className={lang === "en" ? "text-white" : "text-slate-500"}>ENG</span>
						<span className="text-slate-600">|</span>
						<span className={lang === "ko" ? "text-white" : "text-slate-500"}>한국어</span>
					</button>
					<div className="w-px h-4 bg-slate-700" />
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

				<button
					onClick={handleMenuToggle}
					className="sm:hidden flex items-center justify-center w-8 h-8 text-slate-400 hover:text-white transition-colors duration-200 cursor-pointer"
					aria-label={menuOpen ? "Close menu" : "Open menu"}
					aria-expanded={menuOpen}
				>
					<i className={`fa-solid ${menuOpen ? "fa-xmark" : "fa-bars"} text-lg`} />
				</button>
			</header>

			{menuOpen &&
				createPortal(
					<div
						ref={dropdownRef}
						className="fixed left-0 right-0 z-[9998] bg-slate-900/95 backdrop-blur-sm border-b border-slate-700/50"
						style={{ top: dropdownTop }}
					>
						<nav className="flex flex-col px-4 py-3 gap-1">
							<a
								onClick={() => { navigate("/lobby"); closeMenu(); }}
								className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors duration-200 cursor-pointer ${
									window.location.pathname === "/lobby"
										? "text-white bg-slate-700/50"
										: "text-slate-400 hover:text-white hover:bg-slate-700/30"
								}`}
							>
								<i className="fa-solid fa-house w-4 text-center" />
								Lobby
							</a>
							<a
								onClick={() => { navigate("/rule-book"); closeMenu(); }}
								className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors duration-200 cursor-pointer ${
									window.location.pathname === "/rule-book"
										? "text-white bg-slate-700/50"
										: "text-slate-400 hover:text-white hover:bg-slate-700/30"
								}`}
							>
								<i className="fa-solid fa-book w-4 text-center" />
								Rule book
							</a>
							<div className="my-1 border-t border-slate-700/50" />
							<div className="flex items-center gap-3 px-3 py-2 text-sm text-slate-300">
								<i className="fa-solid fa-user w-4 text-center text-slate-400" />
								{user?.username || "guest"}
							</div>
							<button
								onClick={toggleLang}
								className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-slate-700/30 transition-colors duration-200 cursor-pointer text-left"
							>
								<i className="fa-solid fa-language w-4 text-center" />
								<span>
									<span className={lang === "en" ? "text-white font-semibold" : ""}>ENG</span>
									{" / "}
									<span className={lang === "ko" ? "text-white font-semibold" : ""}>한국어</span>
								</span>
							</button>
							<button
								onClick={() => { logout(); navigate("/"); closeMenu(); }}
								className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-slate-700/30 transition-colors duration-200 cursor-pointer text-left"
							>
								<i className="fa-solid fa-right-from-bracket w-4 text-center" />
								Sign Out
							</button>
						</nav>
					</div>,
					document.body,
				)}
		</>
	);
}
