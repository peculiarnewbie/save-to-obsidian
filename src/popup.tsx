import { useEffect } from "react";
import { sendToBackground, sendToContentScript } from "@plasmohq/messaging";

import "~style.css";

sendToContentScript({ name: "open", body: "open" });

function IndexPopup() {}

export default IndexPopup;
