import {
	createContext,
	useContext,
	useEffect,
	useState,
	type ReactNode,
} from "react";
import { jwtDecode, type JwtPayload } from "jwt-decode";

import { signIn } from "../apis/userAPI";
import { socket } from "../sockets/connection";

const TOKEN_KEY = "user_token";

interface User {
	userId: string;
	username: string;
	email?: string;
}

interface VoeTokenPayload extends JwtPayload {
	userId: string;
	username: string;
}

interface UserContextType {
	user: User | null;
	token: string | null;
	authReady: boolean;
	login: (username: string, password: string) => Promise<void>;
	logout: () => void;
}

function readStoredSession(): { user: User; token: string } | null {
	if (typeof window === "undefined") return null;
	const token = window.localStorage.getItem(TOKEN_KEY);
	if (!token) return null;
	try {
		const payload = jwtDecode<VoeTokenPayload>(token);
		if (!payload.exp || payload.exp * 1000 < Date.now()) {
			window.localStorage.removeItem(TOKEN_KEY);
			return null;
		}
		return {
			token,
			user: { userId: payload.userId, username: payload.username },
		};
	} catch {
		window.localStorage.removeItem(TOKEN_KEY);
		return null;
	}
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<User | null>(null);
	const [token, setToken] = useState<string | null>(null);
	const [authReady, setAuthReady] = useState(false);

	useEffect(() => {
		const session = readStoredSession();
		if (session) {
			setUser(session.user);
			setToken(session.token);
			if (!socket.connected) {
				socket.auth = { token: session.token };
				socket.connect();
			}
		}
		setAuthReady(true);
	}, []);

	const login = async (username: string, password: string) => {
		const data = await signIn(username, password);
		const { userId, username: decodedUsername } = jwtDecode<VoeTokenPayload>(
			data.client_token,
		);
		const loggedInUser: User = {
			userId,
			username: decodedUsername,
			email: data.email,
		};

		window.localStorage.setItem(TOKEN_KEY, data.client_token);
		setUser(loggedInUser);
		setToken(data.client_token);
		socket.auth = { token: data.client_token };
		socket.connect();
	};

	const logout = () => {
		socket.disconnect();
		setUser(null);
		setToken(null);
		window.localStorage.removeItem(TOKEN_KEY);
	};

	return (
		<UserContext.Provider value={{ user, token, authReady, login, logout }}>
			{children}
		</UserContext.Provider>
	);
}

export function useUser() {
	const context = useContext(UserContext);
	if (context === undefined) {
		throw new Error("useUser must be used within a UserProvider");
	}
	return context;
}
