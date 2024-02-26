import { useEffect, useRef } from "react";

function HoverCanvas({
	hoveredElement,
}: {
	hoveredElement: HTMLElement | undefined;
}) {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	const highlightElement = (element: HTMLElement) => {
		const canvas = canvasRef.current as HTMLCanvasElement;

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
			rect.height + 10
		);
		// ctx.fillRect(10, 10, 20, 20);
	};

	useEffect(() => {
		if (canvasRef.current && hoveredElement) {
			highlightElement(hoveredElement);
		}
	}, [hoveredElement]);

	return (
		<canvas
			id="plasmoHoverCanvas"
			ref={canvasRef}
			className=" fixed pointer-events-none z-30 w-screen h-screen top-0 left-0"
		/>
	);
}

export default HoverCanvas;
