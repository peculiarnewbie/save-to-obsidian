import { useTemplateStore } from "../Template";
import PageElement from "./PageElement";

export default function PageElementsList() {
	const { currentTemplate, setCurrentTemplate } = useTemplateStore();

	const deleteElement = (i: number) => {
		const { pageElements, ...rest } = currentTemplate;
		const newElements = pageElements.toSpliced(i, 1);
		setCurrentTemplate({ pageElements: newElements, ...rest });
	};

	return (
		<div className="flex flex-col">
			{currentTemplate.pageElements?.map((pageElement, i) => {
				return (
					<PageElement
						// ======================= fix key to a generated one
						deleteElement={deleteElement}
						key={i}
						pageElement={pageElement}
						index={i}
					/>
				);
			})}
		</div>
	);
}
