import { useRef } from "react";

function HoverCanvas({ hoveredElement }: { hoveredElement: HTMLElement }) {
	const canvasRef = useRef();

	return (
		<canvas
			ref={canvasRef}
			className=" fixed pointer-events-none z-30 w-full h-full"
		/>
	);
}

export default HoverCanvas;
