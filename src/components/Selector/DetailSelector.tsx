import { generatePath, getElementValueFromPath } from "~Helpers/ElementActions";
import { useViewStore } from "~components/MainFrameContainer";
import { useTemplateStore } from "~components/Template/Template";
import { Views, type PathStep, IdType, type PageElementType } from "~types";
import { create } from "zustand";
import MyButton from "~components/Elements/MyButton";

interface PageElementState {
	currentPageElement: PageElementType & { index?: number };
	setCurrentPageElement: (
		element: PageElementType & { index?: number },
	) => void;
}

export const usePageElementStore = create<PageElementState>()((set) => ({
	currentPageElement: {},
	setCurrentPageElement: (element) => {
		set({ currentPageElement: element });
	},
}));

function DetailSelector() {
	const { currentPageElement } = usePageElementStore();
	const { setCurrentView: setCurrentView } = useViewStore();
	const { currentTemplate, setCurrentTemplate } = useTemplateStore();

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
			<MyButton onClick={() => setCurrentView(Views.Selection.Hover)}>
				Specific
			</MyButton>
		</div>
	);
}

export default DetailSelector;
