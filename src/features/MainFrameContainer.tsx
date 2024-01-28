import { useEffect, useRef, useState } from "react";
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

	const parentRef = useRef();

	useEffect(() => {
		console.log("appending to parent:", parentRef.current);
		const style = document.createElement("style");
		style.textContent = cssText;
		document.body.append(style);

		const addedDiv = document.createElement("p");
		addedDiv.innerText = "this is added after";
		document.body.appendChild(addedDiv);
		//getStyle();
	}, []);

	return (
		<div ref={parentRef}>
			<style>{cssText}</style>
			<Header closePopup={closePopup} />
			<div>nahhahah</div>
			<div>{message}</div>
			<button onClick={() => setIsActive(!isActive)}>activate</button>
			{isActive && <>yo</>}
		</div>
	);
};

export default MainFrameContainer;
