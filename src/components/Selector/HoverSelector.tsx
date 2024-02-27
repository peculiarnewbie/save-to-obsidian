import { useEffect, useState } from "react";
import { useViewStore } from "~components/MainFrameContainer";
import { Views, type PageElementType } from "~types";
import HoverCanvas from "./HoverCanvas";
import { create } from "zustand";
import { usePageElementStore } from "./DetailSelector";
import { generatePath, getElementValueFromPath } from "~Helpers/ElementActions";

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

		const generatedPath = generatePath(el);
		const valueFromPath = getElementValueFromPath(generatedPath, document);

		const newPageElement: PageElementType = {
			element: el,
			path: generatedPath,
			value: valueFromPath,
		};

		setCurrentPageElement(newPageElement);
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
