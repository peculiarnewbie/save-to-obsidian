import Icons, { IconsKeys } from "~Helpers/Icons";
import { useViewStore } from "~components/MainFrameContainer";
import { usePageElementStore } from "~components/Selector/DetailSelector";
import {
	highlightElement,
	useCanvasRef,
} from "~components/Selector/HoverCanvas";
import { getPageElement } from "~components/Selector/HoverSelector";
import { Views, type PageElementType } from "~types";

function PageElement(props: { pageElement: PageElementType; index: number }) {
	const { setCurrentPageElement } = usePageElementStore();
	const { setCurrentView } = useViewStore();

	const { canvasRef } = useCanvasRef();

	const reselect = () => {
		setCurrentPageElement({ index: props.index, ...props.pageElement });
		setCurrentView(Views.Selection.Hover);
	};

	const deleteElement = () => {};

	const hoverElement = () => {
		if (canvasRef && props.pageElement.element) {
			highlightElement(props.pageElement.element, canvasRef);
		}
	};

	return (
		<div className="flex gap-2" onPointerEnter={hoverElement}>
			<div>{props.index}</div>
			<div onMouseEnter={hoverElement}>{props.pageElement.value}</div>
			<button
				className="input-shadow hover:hover-shadow flex items-center justify-center rounded-md bg-obsidian-300 p-1 hover:bg-obsidian-350"
				onClick={reselect}
			>
				<Icons name={IconsKeys.Select} />
			</button>
			<button
				className="input-shadow hover:hover-shadow flex items-center justify-center rounded-md bg-obsidian-300 p-1 hover:bg-obsidian-350"
				onClick={reselect}
			>
				<Icons name={IconsKeys.Delete} />
			</button>
		</div>
	);
}

export default PageElement;
