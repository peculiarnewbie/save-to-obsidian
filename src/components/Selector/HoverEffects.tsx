import { useEffect } from "react";

function HoverEffects({ hoveredElement }: { hoveredElement: HTMLElement }) {
	useEffect(() => {
		console.log(hoveredElement);
	}, [hoveredElement]);
	return (
		<div>
			<div></div>
		</div>
	);
}

export default HoverEffects;
