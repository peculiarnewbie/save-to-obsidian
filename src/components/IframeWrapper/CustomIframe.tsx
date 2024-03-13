import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useViewStore } from "~components/MainFrameContainer";
import { Views } from "~types";

const CustomIframe = ({ children }: { children: any }) => {
	const contentRef = useRef(null);
	const [mountNode, setMountNode] = useState<HTMLBodyElement>();
	const { currentView } = useViewStore();

	useEffect(() => {
		if (contentRef.current)
			setMountNode(
				(contentRef.current as HTMLIFrameElement).contentWindow
					?.document?.body as HTMLBodyElement,
			);
	}, [contentRef]);

	return (
		<iframe
			ref={contentRef}
			className={`${currentView === Views.Selection.Detail ? " h-[450px] w-[250px]" : "h-[700px] w-[450px]"} `}
		>
			{mountNode != null && mountNode != undefined ? (
				createPortal(children, mountNode)
			) : (
				<></>
			)}
		</iframe>
	);
};

export default CustomIframe;
