import { useEffect } from "react";
import { generatePath, getElementValueFromPath } from "~Helpers/ElementActions";
import { useViewStore } from "~components/MainFrameContainer";
import {
	usePageElementStore,
	useTemplateStore,
} from "~components/Template/Template";
import { Views, type PathStep, IdType } from "~types";

function DetailSelector() {
	const { currentPageElement, setCurrentPageElement } = usePageElementStore();
	const { changeView } = useViewStore();
	const { currentTemplate, setCurrentTemplate } = useTemplateStore();

	const selectElement = async () => {
		const generatedPath = generatePath(currentPageElement.element);
		const valueFromPath = getElementValueFromPath(generatedPath, document);

		setCurrentPageElement({
			path: generatedPath,
			value: valueFromPath,
		});

		const { pageElements, ...rest } = { ...currentTemplate };
		if (pageElements) {
			pageElements.push(currentPageElement);
			setCurrentTemplate({ pageElements, ...rest });
		} else
			setCurrentTemplate({ pageElements: [currentPageElement], ...rest });

		changeView(Views.Template.View);
	};

	useEffect(() => {
		console.log("element", currentPageElement.element);
	}, [currentPageElement]);

	return (
		<div>
			<div>{currentPageElement.key}</div>
			<div>
				{currentPageElement.path?.map((path, i) => {
					return <div key={i}>{path.type}</div>;
				})}
			</div>
			<button onClick={selectElement}>Select</button>
		</div>
	);
}

export default DetailSelector;
