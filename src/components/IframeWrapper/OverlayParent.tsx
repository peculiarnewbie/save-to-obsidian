import { useEffect, useState } from "react";
import { useMessage } from "@plasmohq/messaging/hook";
import CustomIframe from "./CustomIframe";
import MainFrameContainer, { useViewStore } from "../MainFrameContainer";
import { Views } from "~types";
import HoverSelector from "~components/Selector/HoverSelector";

const OverlayParent = () => {
	const { currentView } = useViewStore();

	const [isActive, setIsActive] = useState(false);
	const [isSelecting, setIsSelecting] = useState(false);

	useMessage<string, string>(async (req, res) => {
		console.log("got message", req.body);
		if (req.body == "open") setIsActive(!isActive);
	});

	const closePopup = () => {
		setIsActive(false);
	};

	useEffect(() => {
		if (
			currentView == Views.Selection.Hover ||
			currentView == Views.Selection.Detail
		)
			setIsSelecting(true);
		else setIsSelecting(false);
	}, [currentView]);

	if (isActive) {
		return (
			<div>
				<div
					className={`appearance-none z-40 fixed top-3 right-3 bg-transparent
				${isSelecting ? "hidden" : "flex"}
			`}
				>
					<CustomIframe>
						<MainFrameContainer closePopup={closePopup} />
					</CustomIframe>
				</div>
				{isSelecting ? <HoverSelector /> : <></>}
			</div>
		);
	}
	return <></>;
};

export default OverlayParent;
