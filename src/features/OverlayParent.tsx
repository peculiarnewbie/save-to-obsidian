import { useState } from "react";
import { useMessage } from "@plasmohq/messaging/hook";
import CustomIframe from "./CustomIframe";
import MainFrameContainer from "./MainFrameContainer";

const OverlayParent = () => {
	const [isActive, setIsActive] = useState(false);

	useMessage<string, string>(async (req, res) => {
		console.log("got message", req.body);
		if (req.body == "open") setIsActive(!isActive);
	});

	const closePopup = () => {
		setIsActive(false);
	};

	if (isActive) {
		return (
			<div className=" appearance-none z-40 flex fixed top-3 right-3 bg-transparent">
				<CustomIframe>
					<MainFrameContainer closePopup={closePopup} />
				</CustomIframe>
			</div>
		);
	}
	return <></>;
};

export default OverlayParent;
