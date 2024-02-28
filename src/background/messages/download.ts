import type { PlasmoMessaging } from "@plasmohq/messaging";

const handler: PlasmoMessaging.PortHandler = async (req, res) => {
	console.log(req.body);

	const body = req.body;

	const titleTest = "test";

	chrome.downloads.download(
		{
			url:
				"data:text/plain;charset=utf-8," +
				encodeURIComponent(body.value),
			filename: `${titleTest}`,
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
