import { useEffect, useState } from "react";
import { useMessage } from "@plasmohq/messaging/hook";

const MainFrameContainer = () => {
	const [isActive, setIsActive] = useState(false);
	const [message, setMessage] = useState("no message yet");

	useMessage<string, string>(async (req, res) => {
		console.log("got message", req.body);

		setMessage(req.body);
	});

	return (
		<>
			<div>{message}</div>
			<button onClick={() => setIsActive(!isActive)}>activate</button>
			{isActive && <>yo</>}
		</>
	);
};

export default MainFrameContainer;
