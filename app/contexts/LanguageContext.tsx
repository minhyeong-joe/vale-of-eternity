import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

export type Lang = "en" | "ko";

const LANG_KEY = "user_lang";

interface LanguageContextType {
	lang: Lang;
	toggleLang: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
	const [lang, setLang] = useState<Lang>(() => {
		if (typeof window === "undefined") return "en";
		return (window.localStorage.getItem(LANG_KEY) as Lang) ?? "en";
	});

	const toggleLang = useCallback(() => {
		setLang((prev) => {
			const next: Lang = prev === "en" ? "ko" : "en";
			window.localStorage.setItem(LANG_KEY, next);
			return next;
		});
	}, []);

	return (
		<LanguageContext.Provider value={{ lang, toggleLang }}>
			{children}
		</LanguageContext.Provider>
	);
}

export function useLang() {
	const context = useContext(LanguageContext);
	if (context === undefined) {
		throw new Error("useLang must be used within a LanguageProvider");
	}
	return context;
}
