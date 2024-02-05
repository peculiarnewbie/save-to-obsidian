import { useEffect, type ChangeEvent, useState } from "react";
import { useIframeTitleStore } from "../Header";
import {
	FieldTypes,
	type FieldType,
	type PageElementType,
	type TemplateType,
} from "~types";
import { create } from "zustand";
import { useTemplates } from "./TemplateList";
import { Storage } from "@plasmohq/storage";
import PropertyField from "./PropertyField";
import { useViewStore } from "~components/MainFrameContainer";
import PageElement from "./PageElement";

const storage = new Storage();

interface TemplateState {
	currentTemplate: TemplateType & { isnew?: boolean };
	setCurrentTemplate: (template: TemplateType & { isnew?: boolean }) => void;
}

export const useTemplateStore = create<TemplateState>()((set) => ({
	currentTemplate: {} as TemplateType,
	setCurrentTemplate: (template) => set({ currentTemplate: template }),
}));

interface PageElementState {
	currentPageElement: PageElementType;
	setCurrentPageElement: (element: PageElementType) => void;
}

export const usePageElementStore = create<PageElementState>()((set) => ({
	currentPageElement: {} as PageElementType,
	setCurrentPageElement: (element) => {
		set({ currentPageElement: element });
	},
}));

function Template() {
	const [oldTitle, setOldTitle] = useState("New Template");

	const { currentTemplate, setCurrentTemplate } = useTemplateStore();
	const { templates, setTemplates } = useTemplates();
	const { setIframeTitle } = useIframeTitleStore();
	const { currentView, changeView } = useViewStore();
	const { currentPageElement } = usePageElementStore();

	const setTitle = (e: ChangeEvent) => {
		const newTitle = (e.target as HTMLInputElement).value;
		setCurrentTemplate({
			title: newTitle,
			directory: currentTemplate.directory,
			fields: currentTemplate.fields ?? [],
			needsBackground: currentTemplate.needsBackground,
			isnew: currentTemplate.isnew ?? false,
		});
	};

	const saveTemplate = () => {
		const saveToStorage = (newTemplates: TemplateType[]) => {
			setTemplates(newTemplates);
			storage.set("templateList", newTemplates);
		};

		const newTemplate = { ...currentTemplate };
		newTemplate.isnew = false;

		if (currentTemplate.isnew) {
			const newTemplates = [...templates];
			newTemplates.push(newTemplate);
			console.log("saved new", newTemplates);
			saveToStorage(newTemplates);
		} else {
			const modifiedIndex = templates.findIndex(
				(item) => item.title == oldTitle
			);
			const newTemplates = templates.toSpliced(
				modifiedIndex,
				1,
				newTemplate
			);
			saveToStorage(newTemplates);
		}
	};

	const addField = () => {
		const { fields, ...rest } = currentTemplate;

		let newFields: FieldType[];

		let unusedIndex = 1;
		while (
			fields?.find((field) => field.key == `field ${unusedIndex}`) !=
			undefined
		) {
			unusedIndex++;
		}

		let newField = {
			key: `field ${unusedIndex}`,
			type: FieldTypes.Text,
		};

		if (fields) newFields = fields.toSpliced(fields.length, 0, newField);
		else newFields = [newField];

		setCurrentTemplate({ fields: newFields, ...rest });
	};

	useEffect(() => {
		setIframeTitle(currentTemplate.title);
	}, [currentTemplate.title]);

	useEffect(() => {
		setOldTitle(currentTemplate.title);
	}, []);

	return (
		<div>
			<p>title</p>
			<input onChange={setTitle} value={currentTemplate.title}></input>
			<div>Fields</div>
			<FieldList>
				{currentTemplate.fields?.map((field, i) => {
					return (
						<PropertyField
							key={field.key}
							field={field}
							index={i}
						/>
					);
				})}
			</FieldList>
			<button onClick={addField}>Add Field</button>
			<PageElementsList>
				{currentTemplate.pageElements?.map((pageElement, i) => {
					return (
						<PageElement
							// ======================= fix key to a generated one
							key={i}
							pageElement={pageElement}
							index={i}
						/>
					);
				})}
			</PageElementsList>
			<div>element========================</div>
			<div>{currentPageElement.value}</div>
			<button onClick={saveTemplate}>save template</button>
		</div>
	);
}

const FieldList = ({ children }) => {
	return <div className=" flex flex-col gap-2">{children}</div>;
};

const PageElementsList = ({ children }) => {
	return <div className="flex flex-col">{children}</div>;
};

export default Template;
