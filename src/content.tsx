import cssText from "data-text:~style.css";
import type { PlasmoCSConfig } from "plasmo";
import OverlayParent from "./components/IframeWrapper/OverlayParent";

export const config: PlasmoCSConfig = {
	matches: ["https://*/*"],
	// matches: ["https://www.google.com/*", "https://www.youtube.com/*"],
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
