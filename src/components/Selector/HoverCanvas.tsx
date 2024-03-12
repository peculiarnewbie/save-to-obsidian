import { useEffect, useLayoutEffect, useRef } from "react";
import { create } from "zustand";

interface CanvasRefState {
	canvasRef: HTMLCanvasElement;
	setCanvasRef: (canvas: HTMLCanvasElement) => void;
}

export const useCanvasRef = create<CanvasRefState>()((set) => ({
	canvasRef: document.createElement("canvas"),
	setCanvasRef: (element) => {
		set({ canvasRef: element });
	},
}));

function HoverCanvas({
	hoveredElement,
}: {
	hoveredElement: HTMLElement | undefined;
}) {
	const { setCanvasRef } = useCanvasRef();
	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		if (canvasRef.current && hoveredElement) {
			highlightElement(hoveredElement, canvasRef.current);
		}
	}, [hoveredElement]);

	useLayoutEffect(() => {
		setCanvasRef(canvasRef.current as HTMLCanvasElement);
	}, []);

	return (
		<canvas
			id="plasmoHoverCanvas"
			ref={canvasRef}
			className=" pointer-events-none fixed left-0 top-0 z-30 h-screen w-screen"
		/>
	);
}

export default HoverCanvas;

export const highlightElement = (
	element: HTMLElement,
	canvas: HTMLCanvasElement,
) => {
	console.log(canvas);
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	const ctx = canvas.getContext("2d");
	if (!ctx) return;

	ctx.clearRect(0, 0, canvas.width, canvas.height);

	ctx.fillStyle = "rgba(50, 50, 255, 0.4)";
	const rect = element.getBoundingClientRect();

	ctx.fillRect(
		rect.left - 5,
		rect.top - 5,
		rect.width + 10,
		rect.height + 10,
	);
	// ctx.fillRect(10, 10, 20, 20);
};
