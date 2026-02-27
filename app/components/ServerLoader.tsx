import { useState, useEffect } from "react";

import api from "../apis/api";

export default function ServerLoader() {
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		let isMounted = true;
		const retryDelay = 1000 * 60;
		const checkServer = async () => {
			try {
				await api.get("/health");
				if (isMounted) setIsLoading(false);
			} catch (err) {
				if (isMounted) {
					setTimeout(checkServer, retryDelay);
				}
			}
		};
		if (isLoading) {
			checkServer();
		}
		return () => {
			isMounted = false;
		};
	}, [isLoading]);

	return (
		<>
			{isLoading && (
				<div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75 z-50">
					<div className="flex flex-col items-center">
						<img
							src="/loader.gif"
							alt="Loading..."
							className="w-16 h-16 mb-4"
						/>
						<div className="text-white text-lg">Warming up the server...</div>
					</div>
				</div>
			)}
		</>
	);
}
