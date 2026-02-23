import { useNavigate, useLocation } from "react-router";
import { socket } from "./sockets/connection";
import { RoomEvents, type RoomRestoredPayload } from "./sockets/contract";
import { useEffect, type ReactNode } from "react";
import { useUser } from "./contexts/UserContext";

export function AuthGuard({ children }: { children: ReactNode }) {
	const { user, authReady } = useUser();
	const navigate = useNavigate();
	const { pathname } = useLocation();

	useEffect(() => {
		if (!user) return;
		const onRestored = ({ roomDetail }: RoomRestoredPayload) => {
			navigate(`/game-room/${roomDetail.id}`, {
				state: { roomDetail },
				replace: true,
			});
		};
		socket.on(RoomEvents.RESTORED, onRestored);
		return () => {
			socket.off(RoomEvents.RESTORED, onRestored);
		};
	}, [user, navigate]);

	useEffect(() => {
		if (!authReady) return;
		if (!user && pathname !== "/") {
			navigate("/", { replace: true });
		} else if (user && pathname === "/") {
			navigate("/lobby", { replace: true });
		}
	}, [authReady, user, pathname, navigate]);

	if (!authReady) return null;

	return <>{children}</>;
}
