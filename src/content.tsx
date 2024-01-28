import cssText from "data-text:~style.css";
import type { PlasmoCSConfig } from "plasmo";
import OverlayParent from "~features/OverlayParent";

export const config: PlasmoCSConfig = {
	//matches: ["https://*/*"],
	matches: ["https://www.google.com/*"],
};

export const getStyle = () => {
	const style = document.createElement("style");
	style.textContent = cssText;
	return style;
};

const PlasmoOverlay = () => {
	return <OverlayParent />;
};

export default PlasmoOverlay;
