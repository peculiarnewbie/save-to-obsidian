import { generatePath, getElementValueFromPath } from "~Helpers/ElementActions";
import { useViewStore } from "~components/MainFrameContainer";
import { useTemplateStore } from "~components/Template/Template";
import { Views, type PathStep, IdType, type PageElementType } from "~types";
import { create } from "zustand";
import MyButton from "~components/Elements/MyButton";
import { useEffect, useState } from "react";
import { getPageElement } from "./HoverSelector";
import { highlightElement, useCanvasRef } from "./HoverCanvas";

interface PageElementState {
	currentPageElement: PageElementType & { index?: number };
	setCurrentPageElement: (
		element: PageElementType & { index?: number },
	) => void;
	resetCurrentPageElement: () => void;
}

export const usePageElementStore = create<PageElementState>()((set) => ({
	currentPageElement: { path: [], value: "" },
	setCurrentPageElement: (element) => {
		set({ currentPageElement: element });
	},
	resetCurrentPageElement: () => {
		set({ currentPageElement: { path: [], value: "" } });
	},
}));

function DetailSelector(props: { shown: boolean }) {
	const { currentPageElement, setCurrentPageElement } = usePageElementStore();
	const { setCurrentView: setCurrentView } = useViewStore();
	const { currentTemplate, setCurrentTemplate } = useTemplateStore();
	const { canvasRef } = useCanvasRef();

	const [isDetailSelecting, setIsDetailSelecting] = useState(false);
	const [tempNode, setTempNode] = useState<Node>();

	const selectElement = async () => {
		if (!currentPageElement.element) return;

		const newPageElement: PageElementType = {
			path: currentPageElement.path,
			value: currentPageElement.value,
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

	const detailSelect = (node: Node, index?: number) => {
		if (node.nodeType === 1) {
			const el = node as HTMLElement;
			highlightElement(el, canvasRef);

			setCurrentPageElement({
				...getPageElement(el),
				index: currentPageElement.index,
			});
		} else if (index !== undefined) {
			const { path, value, ...rest } = currentPageElement;
			const newPath = path ?? ([] as PathStep[]);
			newPath.push({ type: IdType.Node, value: "", index: index });

			const newPageElement: PageElementType = {
				...rest,
				value: node.nodeValue as string,
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
			setCurrentPageElement({
				...getPageElement(currentPageElement.element as HTMLElement),
				index: currentPageElement.index,
			});
		} else {
			setCurrentPageElement({
				...getPageElement(
					currentPageElement.element?.parentElement as HTMLElement,
				),
				index: currentPageElement.index,
			});
			highlightElement(
				currentPageElement.element?.parentElement as HTMLElement,
				canvasRef,
			);
		}
	};

	const returnHighlight = () => {
		highlightElement(currentPageElement.element as HTMLElement, canvasRef);
	};

	return (
		<div
			className={`${props.shown ? "flex" : "hidden"} h-full w-full flex-col overflow-hidden overflow-y-auto rounded-xl bg-obsidian-200 p-2 text-text-primary`}
		>
			<div>value:</div>
			<div className=" mt-2 h-[200px] w-full shrink-0 grow overflow-auto bg-obsidian-100 p-1">
				{currentPageElement.value}
			</div>
			<ElementPath currentPageElement={currentPageElement} />
			{!isDetailSelecting ? (
				<div className="flex flex-col gap-2">
					<MyButton
						wfull
						onClick={() => {
							setTempNode(currentPageElement.element);
							setIsDetailSelecting(true);
						}}
					>
						Select Specific
					</MyButton>
					<MyButton
						wfull
						onClick={() => setCurrentView(Views.Selection.Hover)}
					>
						Reselect
					</MyButton>
					<div className="flex w-full gap-2">
						<MyButton
							wfull
							onClick={() => setCurrentView(Views.Template.View)}
						>
							Cancel
						</MyButton>
						<MyButton onClick={selectElement} accented wfull>
							Done
						</MyButton>
					</div>
				</div>
			) : (
				<div className="flex w-full flex-col gap-2">
					<MyButton
						wfull
						onClick={selectParent}
						onMouseEnter={() => {
							if (currentPageElement.element?.parentElement)
								highlightElement(
									currentPageElement.element.parentElement,
									canvasRef,
								);
						}}
						onMouseLeave={returnHighlight}
					>
						Select Parent
					</MyButton>
					<div className="flex gap-2">
						<div className="h-full w-[2px] bg-obsidian-300" />
						<div
							className="flex w-full min-w-0 shrink flex-col items-start gap-1"
							onMouseLeave={returnHighlight}
						>
							{currentPageElement.path[
								currentPageElement.path.length - 1
							].type !== IdType.Node &&
								[
									...(currentPageElement.element
										?.childNodes as NodeList),
								].map((node, i) => {
									if (node.nodeType === 1)
										return (
											<button
												className=" w-full truncate rounded-md bg-obsidian-300 px-2 py-1 text-left shadow-md hover:bg-obsidian-350"
												key={i}
												onClick={() =>
													detailSelect(node)
												}
												onMouseEnter={() =>
													highlightElement(
														node as HTMLElement,
														canvasRef,
													)
												}
											>
												{(node as HTMLElement).tagName +
													": " +
													(node as HTMLElement)
														.innerText}
											</button>
										);
									else if (
										node.nodeType === 3 &&
										!isWhitespaceString(
											node.nodeValue as string,
										)
									)
										return (
											<button
												className=" w-full truncate rounded-md bg-obsidian-300 px-2 py-1 text-start shadow-md hover:bg-obsidian-350"
												key={i}
												onClick={() =>
													detailSelect(node, i)
												}
											>
												text: {node.nodeValue}
											</button>
										);
								})}
						</div>
					</div>
					<div className="flex w-full gap-2">
						<MyButton
							wfull
							onClick={() => {
								if (tempNode) detailSelect(tempNode);
								setIsDetailSelecting(false);
							}}
						>
							Cancel
						</MyButton>
						<MyButton
							wfull
							accented
							onClick={() => setIsDetailSelecting(false)}
						>
							Select
						</MyButton>
					</div>
				</div>
			)}
		</div>
	);
}

export default DetailSelector;

const ElementPath = (props: { currentPageElement: PageElementType }) => {
	const [show, setShow] = useState(false);

	if (show) {
		return (
			<div>
				<div>
					{props.currentPageElement.path?.map((path, i) => {
						return (
							<div key={i}>
								{path.type}: {path.value} {path.index}
							</div>
						);
					})}
				</div>
				<button
					className="bg-obsidian-300"
					onClick={() => setShow(false)}
				>
					close path
				</button>
			</div>
		);
	} else {
		return (
			<button className="bg-obsidian-300" onClick={() => setShow(true)}>
				show path
			</button>
		);
	}
};

const isWhitespaceString = (str: string) => !str.replace(/\s/g, "").length;
