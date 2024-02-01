import { useEffect } from "react";
import { useViewStore } from "~components/MainFrameContainer";
import { usePageElementStore } from "~components/Template/Template";
import { Views } from "~types";

function HoverSelector() {
	const { changeView } = useViewStore();
	const { setCurrentPageElement } = usePageElementStore();

	const selectElement = (e: MouseEvent) => {
		changeView(Views.Template.EditExisting);
		setCurrentPageElement({
			key: "minebroo",
			path: [],
		});
	};

	const addHoverEffect = (e: MouseEvent) => {
		console.log(e.target);
	};

	useEffect(() => {
		document.addEventListener("mouseover", addHoverEffect);
		document.addEventListener("click", selectElement);

		return () => {
			document.removeEventListener("mouseover", addHoverEffect);
			document.removeEventListener("click", selectElement);
		};
	}, []);

	return (
		<div className=" fixed w-screen h-screen pointer-events-none">
			<div className="relative w-full h-full bg-obsidian-300/50">
				<button onPointerDown={() => changeView(Views.Main)}>
					back
				</button>
			</div>
			<div></div>
		</div>
	);
}

export default HoverSelector;
