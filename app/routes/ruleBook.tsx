import type { Route } from "./+types/ruleBook";
import { useUser } from "../contexts/UserContext";

import AppHeader from "~/components/AppHeader";

import {
	player,
	player2,
	mockGameState,
	mockActionGameState,
	ranked,
	RANK_MEDAL,
} from "~/data/mockUpGame";
import { PlayerArea, PlayerAvatar } from "~/components/PlayerArea";
import { GameBoard } from "~/components/GameBoard";
import { CardImage } from "~/components/CardStack";
import { CardRepo } from "~/data/CardRepo";

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
				setTimeout(() => {
					element.classList.add("highlight-flash");
				}, 500);
				setTimeout(() => {
					element.classList.remove("highlight-flash");
				}, 1);
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
				<main className="flex-1 p-3">
					<div className="mx-auto w-full max-w-screen-2xl">
						<div className="bg-slate-600/60 backdrop-blur-sm rounded-lg shadow-xl p-5">
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
											<span
												className="absolute left-[10%] top-[57%] flex items-center justify-center w-10 h-10 bg-stone-400 font-bold text-lg rounded-full border border-slate-500 text-slate-800 shadow-xl cursor-pointer"
												data-jump="card-name"
												onClick={handleBookmarkClick}
											>
												1
											</span>
											<span
												className="absolute left-[-6%] top-[15%] flex items-center justify-center w-10 h-10 bg-stone-400 font-bold text-lg rounded-full border border-slate-500 text-slate-800 shadow-xl cursor-pointer"
												data-jump="card-summon-cost"
												onClick={handleBookmarkClick}
											>
												2
											</span>
											<span
												className="absolute left-[-6%] top-[3%] flex items-center justify-center w-10 h-10 bg-stone-400 font-bold text-lg rounded-full border border-slate-500 text-slate-800 shadow-xl cursor-pointer"
												data-jump="card-family"
												onClick={handleBookmarkClick}
											>
												3
											</span>
											<span
												className="absolute left-[60%] top-[73%] flex items-center justify-center w-10 h-10 bg-stone-400 font-bold text-lg rounded-full border border-slate-500 text-slate-800 shadow-xl cursor-pointer"
												data-jump="card-effect"
												onClick={handleBookmarkClick}
											>
												4
											</span>

											<span
												className="absolute left-[-6%] top-[73%] flex items-center justify-center w-10 h-10 bg-stone-400 font-bold text-lg rounded-full border border-slate-500 text-slate-800 shadow-xl cursor-pointer"
												data-jump="card-effect-type"
												onClick={handleBookmarkClick}
											>
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
											<p className="text-slate-200" id="card-name">
												Name of the card
											</p>
										</div>
										<div className="flex items-center gap-1 mb-2">
											<span className="flex items-center justify-center w-10 h-10 aspect-square bg-stone-400 font-bold text-lg rounded-full border border-slate-500 text-slate-800 shadow-xl mr-2">
												2
											</span>
											<p
												className="text-slate-200 underline cursor-pointer"
												data-jump="summon-cost"
												onClick={handleBookmarkClick}
												id="card-summon-cost"
											>
												Summoning cost
											</p>
										</div>
										<div className="flex items-center gap-1 mb-2">
											<span className="flex items-center justify-center w-10 h-10 aspect-square bg-stone-400 font-bold text-lg rounded-full border border-slate-500 text-slate-800 shadow-xl mr-2">
												3
											</span>
											<p className="text-slate-200" id="card-family">
												Family of the card
											</p>
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
											<p className="text-slate-200" id="card-effect">
												Effect of the card
											</p>
										</div>
										<p className="text-slate-300/80 mb-4 mt-2 ml-12">
											There are various effect that give players benefits.
										</p>
										<div className="flex items-center gap-1 mb-2">
											<span className="flex items-center justify-center w-10 h-10 aspect-square bg-stone-400 font-bold text-lg rounded-full border border-slate-500 text-slate-800 shadow-xl mr-2">
												5
											</span>
											<p className="text-slate-200" id="card-effect-type">
												Type of the effect
											</p>
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
											<b
												className="cursor-pointer underline"
												onClick={handleBookmarkClick}
												data-jump="resolution-phase"
											>
												Resolution Phase
											</b>
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
									Players usually earn magic stones by{" "}
									<span
										className="cursor-pointer underline"
										onClick={handleBookmarkClick}
										data-jump="sell-card"
									>
										selling cards
									</span>{" "}
									that they hunted.{" "}
									<span id="summon-cost">
										They can then use these magic stones to{" "}
										<span
											className="cursor-pointer underline"
											onClick={handleBookmarkClick}
											data-jump="summon-card"
										>
											summon a card
										</span>{" "}
										from their hand or{" "}
										<span
											className="cursor-pointer underline"
											onClick={handleBookmarkClick}
											data-jump="remove-card"
										>
											remove a card
										</span>{" "}
										from their{" "}
										<span
											className="cursor-pointer underline"
											onClick={handleBookmarkClick}
											data-jump="player-area"
										>
											area
										</span>
										.
									</span>{" "}
									There are 3 types of magic stones.
								</p>
								<div className="flex sm:flex-row flex-col justify-start gap-8 mb-2">
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
								<p className="text-slate-300/80 mb-4 mt-2">
									*The value of magic stones can be adjusted by card effects,
									and these effects can stack.
								</p>
								<ul className="list-disc list-inside text-slate-300 mb-8 ml-6">
									<li className="text-green-400 mb-2">
										IMPORTANT: A player cannot have more than 4 magic stones,
										regardless of their type(s)
										<p className="text-slate-300/80 italic ml-6 mt-1">
											Hestia card's effect allows player to keep up to 6 magic
											stones.
										</p>
										<img
											src="/assets/cards/fire/Hestia.webp"
											alt="cards"
											className="rounded-lg border border-slate-500 shadow-xl max-w-full ml-3 my-3"
										/>
									</li>
									<li className="mb-2">
										If a player exceeds this limit, they must keep 4 magic
										stones and discard the rest.
									</li>
									<li>
										Players do not receive change when they pay more than the
										required cost.
									</li>
									{/* End of Magic Stone Section */}

									<hr className="border-slate-400/80 my-6" />

									{/* Area Section */}
								</ul>
								<li
									className="text-xl font-semibold text-white my-8"
									id="player-area"
								>
									The Area
								</li>
								<p className="text-slate-200 mb-4">
									An area is a zone that a player uses to display the card that
									they have summoned.
									<li className="my-2">
										The max number of summoned cards that each player may have
										in their area is equal to the number of the current round.{" "}
										<br />
										<span className="text-slate-300 italic ml-6">
											E.g) In 5th round, the max number of cards you can summon
											is equal to 5.
										</span>
									</li>
									<li className="my-2 text-green-400">
										IMPORTANT: You cannot have more summoned cards that the
										current round number. You may{" "}
										<span
											className="underline cursor-pointer"
											data-jump="remove-card"
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
									phase={"hunting"}
									round={mockGameState.round}
									gameStatus={"in-progress"}
									isHost={true}
									isReady={true}
								/>
								<p className="text-slate-200 mb-4 mt-2">
									This is how your area looks like in game (
									<span className="italic">
										hover over cards to see their information
									</span>
									)
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
											total value of your magic stones. (This includes bonus
											from card effects)
										</p>
									</li>
									<li className="my-2">
										Your <b className="text-slate-200">summoned cards</b> are
										displayed on the left indicated with current number of
										summoned cards and max number of summoned cards for current
										round.
									</li>
									<li className="my-2">
										Your <b className="text-slate-200">hand cards</b> are
										displayed on the right. These cards are{" "}
										<b className="text-slate-200">HIDDEN</b> from your opponent.
									</li>
								</ul>
								{/* End of Area Section */}

								<hr className="border-slate-400/80 my-6" />

								{/* How to Play Section */}
								<li className="text-xl font-semibold text-white my-8">
									How to Play
								</li>
								<p className="text-slate-300 mb-4">
									The game is played over several rounds (max 10 rounds). Each
									round is divided into 3 phases.
								</p>
								<p className="text-slate-100 text-[30px] mb-4">
									<span
										className="cursor-pointer"
										data-jump="hunting-phase"
										onClick={handleBookmarkClick}
									>
										Hunting
									</span>{" "}
									<i className="fa-solid fa-arrow-right text-lg mx-1 align-middle" />{" "}
									<span
										className="cursor-pointer"
										data-jump="action-phase"
										onClick={handleBookmarkClick}
									>
										Action
									</span>{" "}
									<i className="fa-solid fa-arrow-right text-lg mx-1 align-middle" />{" "}
									<span
										className="cursor-pointer"
										data-jump="resolution-phase"
										onClick={handleBookmarkClick}
									>
										Resolution
									</span>
								</p>

								<ol className="list-decimal list-inside text-slate-300 mb-4 ml-6">
									{/* Hunting Phase */}
									<li className="text-[20px]" id="hunting-phase">
										Hunting Phase
									</li>
									<p className="text-slate-300 mb-2 mt-2">
										At the beginning of each round, as many cards as twice the
										number of players are drawn from the draw pile.
									</p>
									<p className="text-slate-300/80 mb-4 ml-4">
										If the draw pile runs out, the discarded pile will be
										shuffled and reused.
									</p>
								</ol>

								<GameBoard
									zones={mockGameState.boardZones}
									drawPileCount={mockGameState.drawPileCount}
									discardPileCount={mockGameState.discardPileCount}
									myPlayerColor={player.color}
									myUserId={player.id}
									players={mockGameState.players}
									boardMarkers={mockGameState.boardMarkers}
									phase={mockGameState.phase}
									activeHunterUserId={player2.id}
									isMyTurn={false}
								/>

								<p className="text-slate-300 text-sm mb-4 ml-6">
									*Example - 8 cards revealed in a 4-player game. Purple player
									has hunted <b className="text-slate-200">Agni</b> from fire
									family and placed a marker on it.
								</p>

								<ol className="list-decimal list-inside text-slate-300 mb-4 ml-6">
									<ul className="list-disc list-inside text-slate-300 mb-4 ml-6">
										<li className="text-slate-300 mb-4 mt-2">
											Starting from the first player, each player chooses a card
											and places their player marker on it to{" "}
											<b className="text-slate-200">"hunt"</b> it. Players may
											not choose a card if there is already a player marker on
											it.
										</li>
										<li className="text-slate-300 mb-4 mt-2">
											Then, from the last player, each player chooses a second
											card and places their player marker on it.{" "}
											<span className="text-green-400">
												The order is <b>snake-draft</b> style such that last
												player chooses two cards consecutively and the first
												player chooses their second card at the end.
											</span>
										</li>
									</ul>
									{/* End of Hunting Phase */}

									{/* Action Phase */}
									<li className="text-[20px]" id="action-phase" value={2}>
										Action Phase
									</li>

									<ul className="list-disc list-inside text-slate-300 mb-4 ml-6">
										<p className="text-slate-300 mb-4 mt-2">
											After all players have placed their markers, the hunting
											phase ends and the action phase begins. Starting from the
											first player, each player can take as many actions as
											desired during their turn.
										</p>
										<li className="text-slate-300 mb-4 mt-2">
											Players can take the following actions in any order:
											<ul className="list-disc list-inside text-slate-300 mb-4 ml-6">
												<li className="text-slate-300 mb-4 mt-2">
													<b
														className="text-slate-200 cursor-pointer underline"
														data-jump="sell-card"
														onClick={handleBookmarkClick}
													>
														Sell:
													</b>{" "}
													Sell a card from your hunted cards for its stone
													value.
												</li>
												<li className="text-slate-300 mb-4 mt-2">
													<b
														className="text-slate-200 cursor-pointer underline"
														data-jump="tame-card"
														onClick={handleBookmarkClick}
													>
														Tame:
													</b>{" "}
													Tame a card on the board that you have hunted and
													retrieve it to your hand.
												</li>
												<li className="text-slate-300 mb-4 mt-2">
													<b
														className="text-slate-200 cursor-pointer underline"
														data-jump="summon-card"
														onClick={handleBookmarkClick}
													>
														Summon:
													</b>{" "}
													Summon a card from your hand to your area by paying
													its summoning cost.
												</li>
												<li className="text-slate-300 mb-4 mt-2">
													<b
														className="text-slate-200 cursor-pointer underline"
														data-jump="remove-card"
														onClick={handleBookmarkClick}
													>
														Remove:
													</b>{" "}
													Remove a card from your area to free up space for
													summoning.
												</li>
											</ul>
										</li>
										<li className="text-slate-300 mb-2 mt-2">
											Once player is done with their actions, the player must
											click{" "}
											<button className="text-xs py-1.5 px-4 rounded-lg bg-amber-600/80 hover:bg-amber-600 border border-amber-500/70 text-white font-semibold transition-colors cursor-pointer mx-1">
												End Turn
											</button>
											{""}
											at the bottom of their player area.
										</li>
										<b className="text-slate-200 ml-4">
											NOTE: Players can't end a turn while player marker is on a
											card; it MUST be retrieved by selling or taming that card.
										</b>
									</ul>
								</ol>

								<p className="text-slate-300 text-xl font-bold mb-4 mt-8">
									Game Board example during action phase
								</p>
								<GameBoard
									zones={mockActionGameState.boardZones}
									drawPileCount={mockActionGameState.drawPileCount}
									discardPileCount={mockActionGameState.discardPileCount}
									myPlayerColor={player.color}
									myUserId={player.id}
									players={mockActionGameState.players}
									boardMarkers={mockActionGameState.boardMarkers}
									phase={mockActionGameState.phase}
									activeHunterUserId={player2.id}
									isMyTurn={true}
								/>
								<ol className="list-decimal list-inside text-slate-300 mb-4 ml-6">
									<ul className="list-disc list-inside text-slate-300 mb-4 ml-6">
										{/* Action Phase - sell a card */}
										<p
											className="text-slate-300 text-xl font-bold my-4"
											id="sell-card"
										>
											Sell a card
										</p>
										<ul className="list-disc list-inside text-slate-300 mb-4 ml-6">
											<li className="text-slate-300 mb-4 mt-2">
												When player chooses to sell a card, the card is
												discarded and the player immediately receives{" "}
												<span
													className="cursor-pointer underline"
													onClick={handleBookmarkClick}
													data-jump="magic-stones"
												>
													magic stones
												</span>{" "}
												by the card's family.
											</li>
											<div className="flex items-center gap-1 mb-2 flex-wrap justify-start">
												<div>
													<div className="sprite fire-cards-header align-middle mx-1 x50" />
													<p className="text-slate-300 text-center">
														Fire cards → 3 red stones
													</p>
												</div>
												<div>
													<div className="sprite water-cards-header align-middle mx-1 x50" />
													<p className="text-slate-300 text-center">
														Water cards → 1 blue stone
													</p>
												</div>
												<div>
													<div className="sprite earth-cards-header align-middle mx-1 x50" />
													<p className="text-slate-300 text-center">
														Earth cards → 4 red stones
													</p>
												</div>
												<div>
													<div className="sprite wind-cards-header align-middle mx-1 x50" />
													<p className="text-slate-300 text-center">
														Wind cards → 1 red, 1 blue stones
													</p>
												</div>
												<div>
													<div className="sprite dragon-cards-header align-middle mx-1 x50" />
													<p className="text-slate-300 text-center">
														Dragon cards → 1 purple stone
													</p>
												</div>
											</div>
											<li className="text-green-400 mb-4 mt-2">
												REMINDER: You cannot have more than 4 magic stones,
												regardless of their type(s).
											</li>
										</ul>
										{/* End of Action Phase - sell a card */}

										{/* Action Phase - tame a card */}
										<p
											className="text-slate-300 text-xl font-bold my-4"
											id="tame-card"
										>
											Tame a card
										</p>
										<ul className="list-disc list-inside text-slate-300 mb-4 ml-6">
											<li className="text-slate-300 mb-4 mt-2">
												Tamed card is retrieved to player's hand and becomes
												hidden from other players.
											</li>
											<li className="text-green-400 mb-4 mt-2">
												REMINDER: There is no hand limit.
											</li>
										</ul>
										{/* End of Action Phase - tame a card */}
									</ul>
								</ol>

								<p className="text-slate-300 text-xl font-bold mb-4 mt-8">
									Player Area example during action phase
								</p>
								<PlayerArea
									player={player}
									isSelf={true}
									isMyTurn={true}
									phase={"action"}
									round={mockGameState.round}
									gameStatus={"in-progress"}
									isHost={true}
									isReady={true}
								/>
								<ol className="list-decimal list-inside text-slate-300 mb-4 ml-6">
									<ul className="list-disc list-inside text-slate-300 mb-4 ml-6">
										{/* Action Phase - summon a card */}
										<p
											className="text-slate-300 text-xl font-bold my-4"
											id="summon-card"
										>
											Summon a Card
										</p>
										<ul className="list-disc list-inside text-slate-300 mb-4 ml-6">
											<li className="text-slate-300 mb-4 mt-2">
												If your{" "}
												<span
													className="cursor-pointer underline"
													onClick={handleBookmarkClick}
													data-jump="player-area"
												>
													area
												</span>{" "}
												is full, you cannot summon a card unless you remove a
												card from your area first.
											</li>
											<li className="text-green-400 mb-4 mt-2">
												IMPORTANT: The number of areas you have is equal to the
												number of the current round.
											</li>
											<li className="text-slate-300 mb-4 mt-2">
												Pay as many magic stones as required by the card's
												summoning cost to summon into your area.
											</li>
											<li className="text-slate-300 mb-4 mt-2">
												Even if you pay more than the cost, you don't get any
												change.
											</li>
											<li className="text-slate-300 mb-4 mt-2">
												You can only summon one card at a time, even if there's
												remaining value from magic stones that you paid. You can
												summon another card by paying its cost again with other
												magic stones.
												<p className="text-slate-300/80 italic ml-6 mt-1">
													You can try summoning a card from{" "}
													<b>Player Area example</b> above and see how cost
													payment works.
												</p>
											</li>
											<li className="text-slate-300 mb-4 mt-2 font-bold">
												NOTE: The cost of the card can be reduced by card
												effects, and these effects can stack. However, the cost
												cannot be reduced below 0.
											</li>
											<li className="text-slate-300 mb-4 mt-2">
												Resolve the Instant effect
												<div className="sprite description-instant inline-block align-middle mx-1" />
												of the summoned card, if any. If instant effect cannot
												be resolved immediately, player cannot summon that card.
											</li>
										</ul>
										{/* End of Action Phase - summon a card */}
										{/* Action Phase - remove a card */}
										<p
											className="text-slate-300 text-xl font-bold my-4"
											id="remove-card"
										>
											Remove a Card
										</p>
										<ul className="list-disc list-inside text-slate-300 mb-4 ml-6">
											<li className="text-slate-300 mb-4 mt-2">
												Discards a summoned card from a player's own area
											</li>
											<li className="text-slate-300 mb-4 mt-2">
												The cost required to remove a card is equal to the
												number of current round.
												<p className="text-slate-300/80 italic ml-6 mt-1">
													You can try removing a card in{" "}
													<b>Player Area example</b> above and see it costs 5 in
													5th round
												</p>
											</li>
										</ul>
									</ul>
									{/* End of Action Phase */}

									{/* Resolution Phase */}
									<li className="text-[20px]" id="resolution-phase" value={3}>
										Resolution Phase
									</li>
									<ul className="list-disc list-inside text-slate-300 mb-4 ml-6">
										<div className="flex items-center gap-1 mb-2 mt-3">
											<div className="sprite description-active align-middle mx-1 x150" />
											<p className="text-slate-300 text-start ml-2">
												From the first player, each player takes turns to
												resolve the active effects of summoned cards.
											</p>
										</div>
										<li className="text-slate-300 mb-4 mt-2">
											Active effect is triggered once per round during
											resolution phase.
										</li>
										<li className="text-slate-300 mb-4 mt-2">
											Players can choose to activate in any order they prefer.
											<p className="text-slate-300/80 italic ml-6 mt-1">
												TIP: Order of activation can be crucial in maximizing as
												they can chain effectively with one another in specific
												order.
											</p>
										</li>
										<li className="text-slate-300 mb-4 mt-2">
											If the triggering effect is not resolved, the triggered
											effect is not activated and is skipped.
										</li>
										<li className="text-slate-300 mb-4 mt-2">
											Once player has activated all active effects of summoned
											cards, the next player takes their turn.
										</li>
									</ul>
									{/* End of Resolution Phase */}
								</ol>
								{/* End of How to Play Section */}
								<p className="text-slate-300 text-xl font-bold mb-4 mt-8">
									Player Area example during resolution phase
								</p>
								<PlayerArea
									player={player}
									isSelf={true}
									isMyTurn={true}
									phase={"resolution"}
									round={mockGameState.round}
									gameStatus={"in-progress"}
									isHost={true}
									isReady={true}
								/>

								<hr className="border-slate-400/80 my-6" />

								{/* Game End Section */}
								<li className="text-xl font-semibold text-white my-8">
									End of Game and Victory
								</li>
								<p className="text-slate-300 font-bold mb-4 mt-8">
									If the end game condition has been met at the end of the
									round, the game ends.
									<br />
									There are two kinds of end game conditions:
								</p>
								<ul className="list-disc list-inside text-slate-300 mb-4 ml-6">
									<li className="text-slate-300 mb-2 mt-2">
										Any player has a score of 60 or more at the end of the
										round.
									</li>
									<li className="text-slate-300 mb-2 mt-2">
										Or, the 10th round ends.
									</li>
								</ul>

								{/* Gameover Modal example */}
								<div className="relative bg-slate-900 border border-slate-600/80 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
									{/* Header */}
									<div className="px-6 py-4 border-b border-slate-700/60 flex items-center justify-between">
										<h2 className="text-white font-bold text-lg">Game Over</h2>
										<button className="text-slate-400 hover:text-white transition-colors cursor-pointer">
											<i className="fa-solid fa-xmark" />
										</button>
									</div>

									{/* Rankings */}
									<div className="px-6 py-4 flex flex-col gap-3">
										{ranked.map((p) => {
											const medal = RANK_MEDAL[p.rank] ?? `#${p.rank}`;
											const rankLabel =
												p.rank === 1
													? "1st"
													: p.rank === 2
														? "2nd"
														: p.rank === 3
															? "3rd"
															: `${p.rank}th`;

											return (
												<div
													key={p.id}
													className="bg-slate-800/60 border border-slate-700/50 rounded-lg p-4"
												>
													{/* Top row: rank + avatar + name + score */}
													<div className="flex items-center gap-3 mb-3">
														<span className="text-xl w-5 text-center flex-shrink-0">
															{medal}
														</span>
														<span className="text-slate-300 text-xs uppercase tracking-wider flex-shrink-0">
															{rankLabel}
														</span>
														<PlayerAvatar color={p.color} size={28} />
														<span className="text-white font-semibold text-sm flex-1 truncate">
															{p.username}
														</span>
														<div className="text-right flex-shrink-0">
															<span className="text-yellow-300 font-bold text-lg">
																{p.score}
															</span>
															<span className="text-slate-400 text-xs ml-1">
																pts
															</span>
														</div>
													</div>

													{/* Summoned cards */}
													<div>
														<span className="text-slate-500 text-[10px] uppercase tracking-wider block mb-2">
															Summoned ({p.summonedCards.length})
														</span>
														{p.summonedCards.length === 0 ? (
															<span className="text-slate-600 text-xs">
																None
															</span>
														) : (
															<div className="flex flex-wrap gap-1.5">
																{p.summonedCards.map((card) => (
																	<CardImage
																		key={card.id}
																		card={card}
																		width={56}
																		height={82}
																	/>
																))}
															</div>
														)}
													</div>
												</div>
											);
										})}
									</div>

									{/* Footer */}
									<div className="px-6 py-4 border-t border-slate-700/60 flex justify-end">
										<button className="px-5 py-2 bg-slate-700 hover:bg-slate-600 border border-slate-600/70 text-white text-sm font-medium rounded-lg transition-colors cursor-pointer">
											Close
										</button>
									</div>
								</div>
								{/* End of Gameover Modal example */}

								<p className="text-slate-300 mb-4 mt-4">
									At the end of the game, player with the highest score wins. If
									there is a tie, the player with more summoned cards wins. If
									there's still a tie, then the tied players share the victory.
								</p>
								<p className="text-slate-300/80 mb-4 ml-6">
									Note that even if <b>Player 3</b> and <b>Player 2</b> have the
									same score, <b>Player 2</b> wins because <b>Player 2</b> has
									more summoned cards than <b>Player 3</b>.
								</p>

								{/* End of Game End Section */}

								<hr className="border-slate-400/80 my-6" />
								
								{/* Card Repo - All Cards */}
								<li className="text-xl font-semibold text-white my-8" id="all-cards">
									Card Repository
								</li>
								<p className="text-slate-300 mb-4">
									Here you can find all the cards in the game sorted by their
									family. You can hover on each card to see its
									details and effects.
								</p>
								<div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-5 gap-2">
									{Object.values(CardRepo).map((card) => (
										<div className="flex flex-col items-center" key={card.id}>
											<CardImage card={card} width={120} height={180} />
										</div>
									))}
								</div>
							</ul>
						</div>
					</div>
				</main>
			</div>
		</div>
	);
}
