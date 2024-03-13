import { useEffect } from "react";
import { useViewStore } from "~components/MainFrameContainer";
import { usePageElementStore } from "~components/Selector/DetailSelector";
import { Views, type PageElementType } from "~types";

function PageElement(props: { pageElement: PageElementType; index: number }) {
	const { setCurrentPageElement } = usePageElementStore();
	const { setCurrentView } = useViewStore();

	const reselect = () => {
		setCurrentPageElement({ index: props.index, ...props.pageElement });
		setCurrentView(Views.Selection.Hover);
	};

	return (
		<div>
			<div>{props.index}</div>
			<div>{props.pageElement.value}</div>
			<button onClick={reselect}>Reselect</button>
		</div>
	);
}

export default PageElement;
