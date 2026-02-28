import {
	isRouteErrorResponse,
	Links,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
} from "react-router";

import type { Route } from "./+types/root";
import { UserProvider } from "./contexts/UserContext";
import { AuthGuard } from "./AuthGuard";
import ServerLoader from "./components/ServerLoader";
import { Toaster } from "sonner";
import "./app.css";
import "./sprites.css";

export const links: Route.LinksFunction = () => [
	{ rel: "preconnect", href: "https://fonts.googleapis.com" },
	{ rel: "icon", href: "/favicon.png" },
	{
		rel: "preconnect",
		href: "https://fonts.gstatic.com",
		crossOrigin: "anonymous",
	},
	{
		rel: "stylesheet",
		href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
	},
	{
		rel: "stylesheet",
		href: "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css",
	},
];

const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:5173";

export function Layout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				{/* Open Graph Meta Tags */}
				<meta property="og:title" content="Vale of Eternity" />
				<meta
					property="og:description"
					content="Vale of Eternity on socket-based web application"
				/>
				<meta property="og:image" content={`${BASE_URL}/cover.jpg`} />
				<meta property="og:url" content={BASE_URL} />
				<meta property="og:type" content="website" />
				<meta name="twitter:card" content="summary_large_image" />
				<meta name="twitter:title" content="Vale of Eternity" />
				<meta
					name="twitter:description"
					content="Vale of Eternity on socket-based web application"
				/>
				<meta name="twitter:image" content={`${BASE_URL}/cover.jpg`} />
				<Meta />
				<Links />
			</head>
			<body>
				{children}
				<ScrollRestoration />
				<Scripts />
			</body>
		</html>
	);
}

export default function App() {
	return (
		<UserProvider>
			<AuthGuard>
				<ServerLoader />
				<Outlet />
				<Toaster
					position="top-left"
					richColors
					duration={1500}
					id="main-toaster"
				/>
				<Toaster
					position="top-right"
					richColors
					duration={2000}
					id="game-toaster"
				/>
			</AuthGuard>
		</UserProvider>
	);
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
	let message = "Oops!";
	let details = "An unexpected error occurred.";
	let stack: string | undefined;

	if (isRouteErrorResponse(error)) {
		message = error.status === 404 ? "404" : "Error";
		details =
			error.status === 404
				? "The requested page could not be found."
				: error.statusText || details;
	} else if (import.meta.env.DEV && error && error instanceof Error) {
		details = error.message;
		stack = error.stack;
	}

	return (
		<main className="pt-16 p-4 container mx-auto">
			<h1>{message}</h1>
			<p>{details}</p>
			{stack && (
				<pre className="w-full p-4 overflow-x-auto">
					<code>{stack}</code>
				</pre>
			)}
		</main>
	);
}
