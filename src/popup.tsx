import { CountButton } from "~features/count-button";
import { usePort } from "@plasmohq/messaging/hook";
import { sendToBackground, sendToContentScript } from "@plasmohq/messaging";

import "~style.css";
import { useEffect } from "react";

function IndexPopup() {
	const iframePort = usePort("ping");

	useEffect(() => {
		iframePort.send({
			body: "hii",
		});
		sendToContentScript({ name: "open", body: "shee it worked" });
	}, []);

	return (
		<div className="plasmo-flex plasmo-items-center plasmo-justify-center plasmo-h-16 plasmo-w-40">
			<button
				onClick={() => {
					iframePort.send({ body: "hiii" });
				}}
			>
				hiii
			</button>
			<CountButton />
		</div>
	);
}

export default IndexPopup;
