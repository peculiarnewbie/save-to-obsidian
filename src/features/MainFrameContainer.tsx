import { useEffect, useState } from "react";
import Header from "./Header";

const MainFrameContainer = ({ closePopup }: { closePopup: () => void }) => {
	const [isActive, setIsActive] = useState(false);
	const [message, setMessage] = useState("message here");

	return (
		<>
			<Header closePopup={closePopup} />
			<div>nahhahah</div>
			<div>{message}</div>
			<button onClick={() => setIsActive(!isActive)}>activate</button>
			{isActive && <>yo</>}
		</>
	);
};

export default MainFrameContainer;
