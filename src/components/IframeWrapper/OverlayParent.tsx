import { useEffect, useState } from "react";
import { useMessage } from "@plasmohq/messaging/hook";
import CustomIframe from "./CustomIframe";
import MainFrameContainer, { useViewStore } from "../MainFrameContainer";
import { Views } from "~types";
import HoverSelector from "~components/Selector/HoverSelector";
import DetailFrameContainer from "~components/Selector/DetailFrameContainer";

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
				${currentView == Views.Selection.Hover ? "hidden" : "flex"}
			`}
				>
					<CustomIframe isSelecting={isSelecting}>
						<MainFrameContainer
							hidden={isSelecting}
							closePopup={closePopup}
						/>
						<DetailFrameContainer
							shown={
								isSelecting &&
								currentView == Views.Selection.Detail
							}
						/>
					</CustomIframe>
				</div>
				{isSelecting && currentView == Views.Selection.Hover ? (
					<HoverSelector />
				) : (
					<></>
				)}
			</div>
		);
	}
	return <></>;
};

export default OverlayParent;
