import { useEffect, useState } from "react";

const MainFrameContainer = () => {
	const [isActive, setIsActive] = useState(false);
	const [message, setMessage] = useState("message here");

	return (
		<>
			<div>{message}</div>
			<button onClick={() => setIsActive(!isActive)}>activate</button>
			{isActive && <>yo</>}
		</>
	);
};

export default MainFrameContainer;
