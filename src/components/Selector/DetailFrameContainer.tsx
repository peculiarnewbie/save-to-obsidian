import cssText from "data-text:~style.css";
import DetailSelector from "./DetailSelector";

export const getStyle = () => {
	const style = document.createElement("style");
	style.textContent = cssText;
	return style;
};

function DetailFrameContainer({ shown }: { shown: boolean }) {
	return (
		<>
			<div
				className={`${shown ? "flex" : "hidden"} text-text-primary flex-col rounded-xl w-full h-full bg-obsidian-100 overflow-hidden`}
			>
				detail select
				<DetailSelector />
			</div>
		</>
	);
}

const BodyStyle = () => {
	return (
		<>
			<style>{cssText}</style>
		</>
	);
};

export default DetailFrameContainer;
