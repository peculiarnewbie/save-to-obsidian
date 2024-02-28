import { sendToBackground, type PlasmoMessaging } from "@plasmohq/messaging";
import type { TemplateType } from "~types";

export const downloadMD = async (template: TemplateType) => {
	let mdValue = "---\n";
	template.fields.map((field) => {
		mdValue += field.key + ": " + field.finalValue + "\n";
	});
	mdValue += "---";

	const filename = template.directory + template.filename.finalValue;

	console.log(mdValue, filename);

	const resp = await sendToBackground({
		name: "download",
		body: {
			value: mdValue,
			filename: filename,
		},
	});
};

const handler: PlasmoMessaging.PortHandler = async (req, res) => {
	console.log(req.body);

	const body = req.body;

	chrome.downloads.download(
		{
			url:
				"data:text/plain;charset=utf-8," +
				encodeURIComponent(body.value),
			filename: `${body.filename}`,
			saveAs: true,
			conflictAction: "uniquify",
		},
		() => {
			console.log("downloaded");
		}
	);

	res.send({
		message: "Hello from port handler",
	});
};

export default handler;
