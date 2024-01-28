import { useEffect, useState } from "react";
import { useMessage } from "@plasmohq/messaging/hook";
import CustomIframe from "./CustomIframe";
import MainFrameContainer from "./MainFrameContainer";

const OverlayParent = () => {
	const [isActive, setIsActive] = useState(false);

	useMessage<string, string>(async (req, res) => {
		console.log("got message", req.body);
		if (req.body == "open") setIsActive(true);
	});

	const closePopup = () => {
		setIsActive(false);
	};

	if (isActive) {
		return (
			<div className="plasmo-appearance-none plasmo-z-40 plasmo-flex plasmo-fixed plasmo-top-32 plasmo-right-8">
				<button
					id="lePlasmoButton"
					onClick={closePopup}
					className=" p-2 plasmo-bg-white"
				>
					fuck
				</button>
				<CustomIframe>
					<MainFrameContainer />
				</CustomIframe>
			</div>
		);
	}
	return (
		<>
			<div>hello</div>
		</>
	);
};

export default OverlayParent;
