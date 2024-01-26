import cssText from "data-text:~style.css";
import type { PlasmoCSConfig } from "plasmo";

import { CountButton } from "~features/count-button";
import CustomIframe from "~features/CustomIframe";
import MainFrameContainer from "~features/MainFrameContainer";
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

const IframeContent = () => {
	return <div className=" plasmo-bg-black plasmo-text-white">tesss</div>;
};

export default PlasmoOverlay;
