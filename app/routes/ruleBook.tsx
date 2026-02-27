import type { Route } from "./+types/ruleBook";
import { useUser } from "../contexts/UserContext";

import AppHeader from "~/components/AppHeader";

import { player } from "~/data/mockUpGame";
import { PlayerArea } from "~/components/PlayerArea";

export function meta({}: Route.MetaArgs) {
	return [
		{ title: "Rule Book - Vale of Eternity" },
		{
			name: "description",
			content: "Vale of Eternity Board Game rule book and interface guide",
		},
	];
}

export default function RuleBook() {
	const { user } = useUser();

	if (!user) return null;

	const handleBookmarkClick = (e: React.MouseEvent<HTMLSpanElement>) => {
		const targetId = e.currentTarget.getAttribute("data-jump");
		if (targetId) {
			const element = document.getElementById(targetId);
			if (element) {
				const yOffset = -20;
				const container = document.querySelector(".voe-background");
				const y =
					element.getBoundingClientRect().top +
					(container ? container.scrollTop : window.pageYOffset) +
					yOffset;
				if (container) {
					container.scrollTo({ top: y, behavior: "smooth" });
				} else {
					window.scrollTo({ top: y, behavior: "smooth" });
				}
				// Highlight effect
				element.classList.add("highlight-flash");
				setTimeout(() => {
					element.classList.remove("highlight-flash");
				}, 1000);
			}
		}
	};

	return (
		<div className="voe-background fixed inset-0 bg-cover bg-center bg-no-repeat overflow-y-auto">
			{/* Background Overlay */}
			<div className="fixed inset-0 bg-black/50" />

			<div className="relative min-h-screen flex flex-col">
				<AppHeader />

				{/* Main Content */}
				<main className="flex-1 p-6">
					<div className="mx-auto w-full max-w-screen-2xl">
						<div className="bg-slate-600/60 backdrop-blur-sm rounded-lg shadow-xl p-6">
							<ul className="list-disc list-inside text-slate-300 mb-8">
								{/* Card Section */}
								<li className="text-xl font-semibold text-white my-8">
									The Cards
								</li>

								<div className="flex flex-col sm:flex-row gap-4 mb-6">
									{/* card image */}
									<div className="flex-shrink-0 sm:text-center">
										<div className="relative inline-block">
											<img
												src="/assets/cards/fire/Salamander.webp"
												alt="cards"
												className="rounded-lg border border-slate-500 shadow-xl w-[320px] max-w-full"
											/>
											<span className="absolute left-[10%] top-[57%] flex items-center justify-center w-10 h-10 bg-stone-400 font-bold text-lg rounded-full border border-slate-500 text-slate-800 shadow-xl">
												1
											</span>
											<span className="absolute left-[-6%] top-[15%] flex items-center justify-center w-10 h-10 bg-stone-400 font-bold text-lg rounded-full border border-slate-500 text-slate-800 shadow-xl">
												2
											</span>
											<span className="absolute left-[-6%] top-[3%] flex items-center justify-center w-10 h-10 bg-stone-400 font-bold text-lg rounded-full border border-slate-500 text-slate-800 shadow-xl">
												3
											</span>
											<span className="absolute left-[60%] top-[73%] flex items-center justify-center w-10 h-10 bg-stone-400 font-bold text-lg rounded-full border border-slate-500 text-slate-800 shadow-xl">
												4
											</span>

											<span className="absolute left-[-6%] top-[73%] flex items-center justify-center w-10 h-10 bg-stone-400 font-bold text-lg rounded-full border border-slate-500 text-slate-800 shadow-xl">
												5
											</span>
										</div>
									</div>
									{/* card description */}
									<div className="flex-shrink-5">
										<p className="text-slate-200 mb-4">
											Each card represents a creature
										</p>
										<div className="flex items-center gap-1 mb-2">
											<span className="flex items-center justify-center w-10 h-10 aspect-square bg-stone-400 font-bold text-lg rounded-full border border-slate-500 text-slate-800 shadow-xl mr-2">
												1
											</span>
											<p className="text-slate-200">Name of the card</p>
										</div>
										<div className="flex items-center gap-1 mb-2">
											<span className="flex items-center justify-center w-10 h-10 aspect-square bg-stone-400 font-bold text-lg rounded-full border border-slate-500 text-slate-800 shadow-xl mr-2">
												2
											</span>
											<p
												className="text-slate-200 underline cursor-pointer"
												data-jump="summon-cost"
												onClick={handleBookmarkClick}
											>
												Summoning cost
											</p>
										</div>
										<div className="flex items-center gap-1 mb-2">
											<span className="flex items-center justify-center w-10 h-10 aspect-square bg-stone-400 font-bold text-lg rounded-full border border-slate-500 text-slate-800 shadow-xl mr-2">
												3
											</span>
											<p className="text-slate-200">Family of the card</p>
										</div>
										<p className="text-slate-300/80 mb-4 mt-2 ml-12">
											There are 5 families in the game:{" "}
											<span className="text-blue-400 font-bold">
												<span className="sprite description-water inline-block align-middle" />
												Water
											</span>
											,{" "}
											<span className="text-red-500 font-bold">
												<span className="sprite description-fire inline-block align-middle" />
												Fire
											</span>
											,{" "}
											<span className="text-green-500 font-bold">
												<span className="sprite description-earth inline-block align-middle" />
												Earth
											</span>
											,{" "}
											<span className="text-pink-400 font-bold">
												<span className="sprite description-wind inline-block align-middle" />
												Wind
											</span>
											, and{" "}
											<span className="text-purple-400 font-bold">
												<span className="sprite description-dragon inline-block align-middle" />
												Dragon
											</span>
											. Each family has its own unique play-style and mechanics.
										</p>
										<div className="flex items-center gap-1 mb-2">
											<span className="flex items-center justify-center w-10 h-10 aspect-square bg-stone-400 font-bold text-lg rounded-full border border-slate-500 text-slate-800 shadow-xl mr-2">
												4
											</span>
											<p className="text-slate-200">Effect of the card</p>
										</div>
										<p className="text-slate-300/80 mb-4 mt-2 ml-12">
											There are various effect that give players benefits.
										</p>
										<div className="flex items-center gap-1 mb-2">
											<span className="flex items-center justify-center w-10 h-10 aspect-square bg-stone-400 font-bold text-lg rounded-full border border-slate-500 text-slate-800 shadow-xl mr-2">
												5
											</span>
											<p className="text-slate-200">Type of the effect</p>
										</div>
										<p className="text-slate-300/80 mb-4 mt-2 ml-12">
											There are 4 types of effects:{" "}
										</p>
										<div className="flex items-center gap-1">
											<div className="sprite description-instant x150 shadow-xl mr-2 ml-12" />
											<p className="text-slate-200">Instant:</p>
										</div>
										<p className="text-slate-300/80 mb-4 ml-20">
											Triggers only when the card is being summoned.
										</p>
										<div className="flex items-center gap-1">
											<div className="sprite description-permanent x150 shadow-xl mr-2 ml-12" />
											<p className="text-slate-200">Permanent:</p>
										</div>
										<p className="text-slate-300/80 mb-4 ml-20">
											Always active after the card has been summoned.
										</p>
										<div className="flex items-center gap-1">
											<div className="sprite description-active x150 shadow-xl mr-2 ml-12" />
											<p className="text-slate-200">Active:</p>
										</div>
										<p className="text-slate-300/80 mb-4 ml-20">
											Activates once per round during the{" "}
											<b>Resolution Phase</b>
										</p>
									</div>
								</div>
								{/* End of Card Section */}

								<hr className="border-slate-400/80 my-6" />

								{/* Magic Stone Section */}
								<li
									className="text-xl font-semibold text-white my-8"
									id="magic-stones"
								>
									Magic Stones
								</li>
								<p className="text-slate-200 mb-4">
									Players usually earn magic stones by selling cards that they
									hunted.{" "}
									<span id="summon-cost">
										They can then use these magic stones to summon a card from
										their hand.
									</span>{" "}
									There are 3 types of magic stones.
								</p>
								<div className="flex sm:flex-row flex-col justify-start gap-8 mb-6">
									<div className="flex-col items-center justify-center gap-1 mb-2">
										<div className="sprite stone-1 mx-auto" />
										<p className="text-slate-300 text-center">
											Red stone is worth 1.
										</p>
									</div>
									<div className="flex-col items-center justify-center gap-1 mb-2">
										<div className="sprite stone-3 mx-auto" />
										<p className="text-slate-300 text-center">
											Blue stone is worth 3.
										</p>
									</div>
									<div className="flex-col items-center justify-center gap-1 mb-2">
										<div className="sprite stone-6 mx-auto" />
										<p className="text-slate-300 text-center">
											Purple stone is worth 6.
										</p>
									</div>
								</div>
								<ul className="list-disc list-inside text-slate-300 mb-8 ml-6">
									<li className="text-green-400">
										IMPORTANT: A player cannot have more than 4 magic stones,
										regardless of their type(s)
									</li>
									<li>
										If a player exceeds this limit, they must keep 4 magic
										stones and discard the rest.
									</li>
									<li>
										This decision must be made before taking any other actions.
									</li>
									<li>
										Players cannot trade their magic stones for the magic stones
										in the supply unless a card effect allows them to do so.
									</li>
									<li>
										Players do not receive change when they pay more than the
										required cost.
									</li>
									<li>
										Magic stones that each player has are public information.
									</li>
									{/* End of Magic Stone Section */}

									<hr className="border-slate-400/80 my-6" />

									{/* Area Section */}
									<li className="text-xl font-semibold text-white my-8">
										The Area
									</li>
									<p className="text-slate-200 mb-4">
										An area is a zone that a player uses to display the card
										that they have summoned.
										<li className="my-2">
											The max number of summoned cards that each player may have
											in their area is equal to the number of the current round.{" "}
											<br />
											<span className="text-slate-300 italic ml-6">
												E.g) In 5th round, the max number of cards you can
												summon is equal to 5.
											</span>
										</li>
										<li className="my-2 text-green-400">
											IMPORTANT: You cannot have more summoned cards that the
											current round number. You may{" "}
											<span
												className="underline cursor-pointer"
												data-jump="test"
												onClick={handleBookmarkClick}
											>
												remove a card
											</span>{" "}
											from your area to make space for a new card.
										</li>
									</p>

									<PlayerArea
										player={player}
										isSelf={true}
										isMyTurn={true}
										phase="hunting"
										round={5}
										gameStatus={"in-progress"}
										isHost={true}
										isReady={true}
									/>
									<p className="text-slate-200 mb-4 mt-2">
										This is how your area looks like in game
									</p>
									<ul className="list-disc list-inside text-slate-300 mb-8 ml-6">
										<li className="my-2">
											Your <b className="text-slate-200">current score</b> and{" "}
											<b className="text-slate-200">
												number of{" "}
												<span
													className="underline cursor-pointer"
													onClick={handleBookmarkClick}
													data-jump="magic-stones"
												>
													magic stones
												</span>
											</b>{" "}
											are displayed on top left below your username.
											<p className="text-slate-300/80 italic ml-8 mt-1">
												You can also see current values of your magic stones and
												total value of your magic stones.
											</p>
										</li>
										<li className="my-2">
											Your <b className="text-slate-200">summoned cards</b> are
											displayed on the left indicated with current number of
											summoned cards and max number of summoned cards for
											current round.
										</li>
										<li className="my-2">
											Your <b className="text-slate-200">hand cards</b> are
											displayed on the right. These cards are{" "}
											<b className="text-slate-200">HIDDEN</b> from your
											opponent.
										</li>
									</ul>
									{/* End of Area Section */}

									<hr className="border-slate-400/80 my-6" />

									<p className="text-slate-300 italic mb-4">To be added...</p>

									{/* How to Play Section */}
									{/* <li className="text-xl font-semibold text-white my-8">
										How to Play
									</li>
									<p className="text-slate-300 mb-4">
										The game is played over several rounds (max 10 rounds). Each
										round is divided into 3 phases.
									</p>
									<p className="text-slate-100 text-[30px] mb-4">
										Hunting{" "}
										<i className="fa-solid fa-arrow-right text-lg mx-1 align-middle" />{" "}
										Action{" "}
										<i className="fa-solid fa-arrow-right text-lg mx-1 align-middle" />{" "}
										Resolution
									</p>
									<ol className="list-decimal list-inside text-slate-300 mb-4 ml-6">
										<li className="text-[20px]">Hunting Phase</li>
									</ol> */}
								</ul>
							</ul>
						</div>
					</div>
				</main>
			</div>
		</div>
	);
}
