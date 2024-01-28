import { sendToContentScript } from "@plasmohq/messaging";

sendToContentScript({ name: "open", body: "open" });
setTimeout(() => window.close(), 0);
