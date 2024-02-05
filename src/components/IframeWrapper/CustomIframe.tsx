import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";

const CustomIframe = ({
	children,
	isSelecting,
}: {
	children: any;
	isSelecting: boolean;
}) => {
	const [contentRef, setContentRef] = useState(null);
	const [mountNode, setMountNode] = useState(null);

	const [isActive, setIsActive] = useState(false);

	useEffect(() => {
		setMountNode(contentRef?.contentWindow?.document?.body);
	}, [contentRef]);

	return (
		<iframe ref={setContentRef} className=" w-[450px] h-[700px]">
			{mountNode != null && mountNode != undefined ? (
				createPortal(children, mountNode)
			) : (
				<></>
			)}
		</iframe>
	);
};

export default CustomIframe;
