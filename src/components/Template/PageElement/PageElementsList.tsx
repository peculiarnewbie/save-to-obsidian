import { deletePageElement } from "~Helpers/ElementActions";
import { useTemplateStore } from "../Template";
import PageElement from "./PageElement";

export default function PageElementsList() {
	const { currentTemplate, setCurrentTemplate } = useTemplateStore();

	const deleteElement = (i: number) => {
		const { pageElements, fields, ...rest } = currentTemplate;
		const { newElements, newFields } = deletePageElement(
			i,
			currentTemplate.pageElements,
			currentTemplate.fields,
		);
		setCurrentTemplate({
			pageElements: newElements,
			fields: newFields,
			...rest,
		});
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
