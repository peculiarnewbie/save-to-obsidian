import { generatePath, getElementValueFromPath } from "~Helpers/ElementActions";
import { useViewStore } from "~components/MainFrameContainer";
import { useTemplateStore } from "~components/Template/Template";
import { Views, type PathStep, IdType, type PageElementType } from "~types";
import { create } from "zustand";
import MyButton from "~components/Elements/MyButton";
import { useState } from "react";
import { getPageElement } from "./HoverSelector";
import { highlightElement } from "./HoverCanvas";

interface PageElementState {
	currentPageElement: PageElementType & { index?: number };
	setCurrentPageElement: (
		element: PageElementType & { index?: number },
	) => void;
}

export const usePageElementStore = create<PageElementState>()((set) => ({
	currentPageElement: { path: [], value: "" },
	setCurrentPageElement: (element) => {
		set({ currentPageElement: element });
	},
}));

function DetailSelector() {
	const { currentPageElement, setCurrentPageElement } = usePageElementStore();
	const { setCurrentView: setCurrentView } = useViewStore();
	const { currentTemplate, setCurrentTemplate } = useTemplateStore();
	const [isDetailSelecting, setIsDetailSelecting] = useState(false);

	const selectElement = async () => {
		if (!currentPageElement.element) return;
		const generatedPath = generatePath(currentPageElement.element);
		const valueFromPath = getElementValueFromPath(generatedPath, document);

		const newPageElement: PageElementType = {
			path: generatedPath,
			value: valueFromPath,
		};

		const { pageElements, ...rest } = currentTemplate;
		if (pageElements) {
			if (currentPageElement.index !== undefined)
				pageElements.splice(
					currentPageElement.index,
					1,
					newPageElement,
				);
			else pageElements.push(newPageElement);
			setCurrentTemplate({ pageElements, ...rest });
		} else {
			setCurrentTemplate({ pageElements: [newPageElement], ...rest });
		}

		setCurrentView(
			currentTemplate.isnew
				? Views.Template.EditNew
				: Views.Template.EditExisting,
		);
	};

	const detailSelect = (node: Node, index: number) => {
		if (node.nodeType === 1) {
			const el = node as HTMLElement;

			setCurrentPageElement({
				...getPageElement(el),
				index: currentPageElement.index,
			});
		} else {
			const { path, ...rest } = currentPageElement;
			const newPath = path ?? ([] as PathStep[]);
			newPath.push({ type: IdType.Node, value: "", index: index });

			const newPageElement: PageElementType = {
				...rest,
				path: newPath,
			};

			setCurrentPageElement({
				...newPageElement,
				index: currentPageElement.index,
			});
		}
	};

	const selectParent = () => {
		if (
			currentPageElement.path[currentPageElement.path.length - 1].type ===
			IdType.Node
		) {
			console.log(currentPageElement);
		} else {
			console.log(
				"selecting parent",
				document.getElementById("plasmoHoverCanvas"),
			);
			setCurrentPageElement({
				...getPageElement(
					currentPageElement.element?.parentElement as HTMLElement,
				),
				index: currentPageElement.index,
			});
			highlightElement(
				currentPageElement.element?.parentElement as HTMLElement,
				document.getElementById(
					"plasmoHoverCanvas",
				) as HTMLCanvasElement,
			);
		}
	};

	return (
		<div>
			<div>index: {currentPageElement.index}</div>
			<div>{currentPageElement.value}</div>
			<div>
				{currentPageElement.path?.map((path, i) => {
					return <div key={i}>{path.type}</div>;
				})}
			</div>
			<MyButton onClick={selectElement} accented>
				Select
			</MyButton>
			<MyButton onClick={() => setCurrentView(Views.Selection.Hover)}>
				Reselect
			</MyButton>
			<MyButton onClick={() => setCurrentView(Views.Template.View)}>
				Cancel
			</MyButton>
			<MyButton onClick={() => setIsDetailSelecting(true)}>
				Specific
			</MyButton>
			{isDetailSelecting ? (
				<div className="flex flex-col">
					{[
						...(currentPageElement.element?.childNodes as NodeList),
					].map((node, i) => {
						if (node.nodeType === 1)
							return (
								<MyButton onClick={() => detailSelect(node, i)}>
									{(node as HTMLElement).tagName +
										": " +
										(node as HTMLElement).innerText}
								</MyButton>
							);
						else if (node.nodeType === 3)
							return (
								<MyButton onClick={() => detailSelect(node, i)}>
									text: {node.nodeValue}
								</MyButton>
							);
					})}
					<MyButton onClick={selectParent}>Select Parent</MyButton>
				</div>
			) : (
				<></>
			)}
		</div>
	);
}

export default DetailSelector;
