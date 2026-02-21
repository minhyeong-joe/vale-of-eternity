import { createContext, useContext, useState, type ReactNode } from "react";

import { signIn } from "../apis/userAPI";
import { socket } from "../sockets/connection";

interface User {
    userId: string;
    username: string;
    email?: string;
}

interface UserContextType {
    user: User | null;
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);

    const login = async (username: string, password: string) => {
        const data = await signIn(username, password);
        console.log("Login successful:", data);
        setUser({ userId: data.userId, username: data.username, email: data.email });
        socket.auth = { userId: data.userId, username: data.username };
        socket.connect();
    };

    const logout = () => {
        socket.disconnect();
        setUser(null);
    };

    return (
        <UserContext.Provider value={{ user, login, logout }}>
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
