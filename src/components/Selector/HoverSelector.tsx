import { useEffect, useState } from "react";
import { useViewStore } from "~components/MainFrameContainer";
import { Views } from "~types";
import HoverCanvas from "./HoverCanvas";
import { create } from "zustand";
import { usePageElementStore } from "./DetailSelector";

interface HoverElementState {
	hoveredElement: HTMLElement | undefined;
	setHoveredElement: (element: HTMLElement) => void;
}

export const useHoverElementStore = create<HoverElementState>()((set) => ({
	hoveredElement: undefined,
	setHoveredElement: (element) => set({ hoveredElement: element }),
}));

function HoverSelector({ detail }: { detail: boolean }) {
	const { changeView } = useViewStore();

	const { setCurrentPageElement } = usePageElementStore();
	const { hoveredElement, setHoveredElement } = useHoverElementStore();

	const selectElement = (e: MouseEvent) => {
		const el = e.target as HTMLElement;
		e.stopPropagation();
		e.preventDefault();

		console.log("selected", el);
		setCurrentPageElement({ element: el });
		changeView(Views.Selection.Detail);
	};

	const addHoverEffect = (e: MouseEvent) => {
		const el = e.target as HTMLElement;
		setHoveredElement(el);
	};

	useEffect(() => {
		if (detail) {
			document.removeEventListener("mouseover", addHoverEffect);
			document.removeEventListener("click", selectElement, true);
		} else {
			document.addEventListener("mouseover", addHoverEffect);
			document.addEventListener("click", selectElement, true);
		}

		return () => {
			document.removeEventListener("mouseover", addHoverEffect);
			document.removeEventListener("click", selectElement, true);
		};
	}, [detail]);

	useEffect(() => {
		console.log(hoveredElement);
	}, [hoveredElement]);

	return (
		<div className="absolute w-screen h-screen pointer-events-none top-0 left-0">
			<HoverCanvas hoveredElement={hoveredElement} />
		</div>
	);
}

export default HoverSelector;
