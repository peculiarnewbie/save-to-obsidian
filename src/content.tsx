import cssText from "data-text:~style.css";
import type { PlasmoCSConfig } from "plasmo";

import { CountButton } from "~features/count-button";
import CustomIframe from "~features/CustomIframe";
import MainFrameContainer from "~features/MainFrameContainer";

export const config: PlasmoCSConfig = {
	matches: ["https://*/*"],
};

export const getStyle = () => {
	const style = document.createElement("style");
	style.textContent = cssText;
	return style;
};

const PlasmoOverlay = () => {
	return (
		<div className="plasmo-appearance-none plasmo-z-40 plasmo-flex plasmo-fixed plasmo-top-32 plasmo-right-8">
			<button className=" p-2 plasmo-bg-white">fuck</button>
			<CustomIframe>
				<MainFrameContainer />
			</CustomIframe>
		</div>
	);
};

const IframeContent = () => {
	return <div className=" plasmo-bg-black plasmo-text-white">tesss</div>;
};

export default PlasmoOverlay;
