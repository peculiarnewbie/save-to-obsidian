import { useEffect } from "react";
import { sendToBackground, sendToContentScript } from "@plasmohq/messaging";

import "~style.css";

function IndexPopup() {
	useEffect(() => {
		sendToContentScript({ name: "open", body: "open" });
	}, []);
	return <></>;
}

export default IndexPopup;
