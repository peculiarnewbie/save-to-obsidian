import { useViewStore } from "~components/MainFrameContainer";
import { usePageElementStore } from "~components/Selector/DetailSelector";
import { Views, type PageElementType } from "~types";
import { SelectIcon } from "~Helpers/Icons";

function PageElement(props: { pageElement: PageElementType; index: number }) {
	const { setCurrentPageElement } = usePageElementStore();
	const { setCurrentView } = useViewStore();

	const reselect = () => {
		setCurrentPageElement({ index: props.index, ...props.pageElement });
		setCurrentView(Views.Selection.Hover);
	};

	return (
		<div className="flex">
			<div>{props.index}</div>
			<div>{props.pageElement.value}</div>
			<button
				className="input-shadow hover:hover-shadow flex items-center justify-center rounded-md bg-obsidian-300 p-1 hover:bg-obsidian-350"
				onClick={reselect}
			>
				<SelectIcon />
			</button>
		</div>
	);
}

export default PageElement;
