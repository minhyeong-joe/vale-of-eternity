import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { StoneIcon } from "./StoneRow";
import { CardBack } from "./CardStack";

export type AnimContent =
	| "card-back"
	| "stone-1"
	| "stone-3"
	| "stone-6"
	| { text: string };

export interface AnimSpec {
	id: string;
	/** Center x of start (viewport coords) */
	fromX: number;
	/** Center y of start (viewport coords) */
	fromY: number;
	/** Center x of destination */
	toX: number;
	/** Center y of destination */
	toY: number;
	content: AnimContent;
	duration?: number;
}

function FlyingElement({
	spec,
	onDone,
}: {
	spec: AnimSpec;
	onDone: () => void;
}) {
	const ref = useRef<HTMLDivElement>(null);
	const dur = spec.duration ?? 550;

	useEffect(() => {
		const el = ref.current;
		if (!el) return;

		const dx = spec.toX - spec.fromX;
		const dy = spec.toY - spec.fromY;

		// Double-RAF: first frame applies initial style, second triggers transition
		let raf2: number;
		const raf1 = requestAnimationFrame(() => {
			raf2 = requestAnimationFrame(() => {
				el.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px))`;
				el.style.opacity = "0";
			});
		});

		const onEnd = (e: TransitionEvent) => {
			if (e.propertyName === "opacity") onDone();
		};
		el.addEventListener("transitionend", onEnd);

		return () => {
			cancelAnimationFrame(raf1);
			cancelAnimationFrame(raf2);
			el.removeEventListener("transitionend", onEnd);
		};
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	let inner: React.ReactNode;
	if (spec.content === "card-back") {
		inner = <CardBack width={48} height={72} />;
	} else if (spec.content === "stone-1" || spec.content === "stone-3" || spec.content === "stone-6") {
		inner = <StoneIcon type={spec.content} size="md" />;
	} else {
		inner = (
			<span className="text-yellow-300 font-bold text-base drop-shadow-[0_0_6px_rgba(252,211,77,0.9)]">
				{spec.content.text}
			</span>
		);
	}

	return (
		<div
			ref={ref}
			style={{
				position: "fixed",
				left: spec.fromX,
				top: spec.fromY,
				transform: "translate(-50%, -50%)",
				opacity: 1,
				transition: `transform ${dur}ms cubic-bezier(0.25,0.46,0.45,0.94), opacity ${dur}ms ease-in`,
				pointerEvents: "none",
				zIndex: 200,
			}}
		>
			{inner}
		</div>
	);
}

interface AnimationLayerProps {
	anims: AnimSpec[];
	onAnimDone: (id: string) => void;
}

export function AnimationLayer({ anims, onAnimDone }: AnimationLayerProps) {
	if (anims.length === 0) return null;
	return createPortal(
		<>
			{anims.map((spec) => (
				<FlyingElement key={spec.id} spec={spec} onDone={() => onAnimDone(spec.id)} />
			))}
		</>,
		document.body,
	);
}
