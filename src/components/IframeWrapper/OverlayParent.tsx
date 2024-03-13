import { useEffect, useState } from "react";
import { useMessage } from "@plasmohq/messaging/hook";
import CustomIframe from "./CustomIframe";
import MainFrameContainer, { useViewStore } from "../MainFrameContainer";
import { Views } from "~types";
import HoverSelector from "~components/Selector/HoverSelector";
import DetailSelector from "~components/Selector/DetailSelector";
import cssText from "data-text:~style.css";

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
					className={`fixed right-3 top-3 z-40 appearance-none bg-transparent
				${currentView == Views.Selection.Hover ? "hidden" : "flex"}
			`}
				>
					<CustomIframe>
						<MainFrameContainer
							hidden={isSelecting}
							closePopup={closePopup}
						/>
						<DetailSelector
							shown={
								isSelecting &&
								currentView == Views.Selection.Detail
							}
						/>
						<BodyStyle />
					</CustomIframe>
				</div>
				{isSelecting ? (
					<HoverSelector
						detail={currentView != Views.Selection.Hover}
					/>
				) : (
					<></>
				)}
			</div>
		);
	}
	return <></>;
};

export default OverlayParent;

const BodyStyle = () => {
	return (
		<>
			<style>{cssText}</style>
		</>
	);
};
