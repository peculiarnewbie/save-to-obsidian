import { useEffect, useState } from "react";
import { useViewStore } from "~components/MainFrameContainer";
import { Views, type PageElementType } from "~types";
import HoverCanvas from "./HoverCanvas";
import { create } from "zustand";
import { usePageElementStore } from "./DetailSelector";
import { generatePath, getElementFromPath, getElementValueFromPath } from "~Helpers/ElementActions";

interface HoverElementState {
	hoveredElement: HTMLElement | undefined;
	setHoveredElement: (element: HTMLElement) => void;
}

export const useHoverElementStore = create<HoverElementState>()((set) => ({
	hoveredElement: undefined,
	setHoveredElement: (element) => set({ hoveredElement: element }),
}));

function HoverSelector({ detail }: { detail: boolean }) {
	const { setCurrentView: setCurrentView } = useViewStore();

	const { currentPageElement, setCurrentPageElement } = usePageElementStore();
	const { hoveredElement, setHoveredElement } = useHoverElementStore();

	const selectElement = (e: MouseEvent) => {
		const el = e.target as HTMLElement;
		e.stopPropagation();
		e.preventDefault();

		setCurrentPageElement({
			...getPageElement(el),
			index: currentPageElement.index,
		});
		setCurrentView(Views.Selection.Detail);
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
		<div id="HoverSelector" className="pointer-events-none absolute left-0 top-0 h-screen w-screen">
			<HoverCanvas hoveredElement={hoveredElement} />
		</div>
	);
}

export default HoverSelector;

export const getPageElement = (el: HTMLElement) => {
	const generatedPath = generatePath(el);
	const valueFromPath = getElementValueFromPath(generatedPath, document);

	return {
		element: el,
		path: generatedPath,
		value: valueFromPath,
	} as PageElementType;
};
