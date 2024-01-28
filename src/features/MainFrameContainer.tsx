import { useState } from "react";
import cssText from "data-text:~style.css";
import Header from "./Header";

export const getStyle = () => {
	const style = document.createElement("style");
	style.textContent = cssText;
	return style;
};

const MainFrameContainer = ({ closePopup }: { closePopup: () => void }) => {
	const [isActive, setIsActive] = useState(false);
	const [message, setMessage] = useState("message here");

	const [iframeTitle, setIframeTitle] = useState("Save to Obsidian");

	return (
		<div className=" w-full h-full text-text-primary flex flex-col rounded-xl bg-obsidian-100 overflow-hidden">
			<Header closePopup={closePopup} iframeTitle={iframeTitle} />
			<div>nahhahah</div>
			<div className=" bg-transparent">{message}</div>
			<button onClick={() => setIsActive(!isActive)}>activate</button>
			{isActive && <>yo</>}
			<BodyStyle />
		</div>
	);
};

const BodyStyle = () => {
	return (
		<>
			<style>{cssText}</style>
		</>
	);
};

export default MainFrameContainer;
