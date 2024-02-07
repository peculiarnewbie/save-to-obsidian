import { useEffect, useState } from "react";
import { useViewStore } from "~components/MainFrameContainer";
import { Views } from "~types";
import HoverCanvas from "./HoverCanvas";
import { create } from "zustand";

interface HoverElementState {
	hoveredElement: HTMLElement;
	setHoveredElement: (element: HTMLElement) => void;
}

export const useHoverElementStore = create<HoverElementState>()((set) => ({
	hoveredElement: undefined,
	setHoveredElement: (element) => set({ hoveredElement: element }),
}));

function HoverSelector({ detail }: { detail: boolean }) {
	const { changeView } = useViewStore();

	const { hoveredElement, setHoveredElement } = useHoverElementStore();

	const selectElement = async (e: MouseEvent) => {
		e.stopPropagation();
		e.preventDefault();

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

	return (
		<div className="absolute w-screen h-screen pointer-events-none top-0 left-0">
			<HoverCanvas hoveredElement={hoveredElement} />
		</div>
	);
}

export default HoverSelector;
