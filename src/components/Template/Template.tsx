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

const storage = new Storage();

interface TemplateState {
	currentTemplate: TemplateType & { isnew?: boolean };
	setCurrentTemplate: (template: TemplateType & { isnew?: boolean }) => void;
}

export const useTemplateStore = create<TemplateState>()((set) => ({
	currentTemplate: {} as TemplateType,
	setCurrentTemplate: (template) => set({ currentTemplate: template }),
}));

function Template() {
	const [isEditing, setIsEditing] = useState(true);
	const [oldTitle, setOldTitle] = useState("New Template");

	const { currentTemplate, setCurrentTemplate } = useTemplateStore();
	const { templates, setTemplates } = useTemplates();

	const { setIframeTitle } = useIframeTitleStore();

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

		const newTemplate: TemplateType = {
			title: currentTemplate.title,
			directory: currentTemplate.directory,
			fields: currentTemplate.fields,
			needsBackground: currentTemplate.needsBackground,
		};

		if (currentTemplate.isnew) {
			const newTemplates = [...templates];
			newTemplates.push(newTemplate);
			console.log(newTemplates);
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

	const deleteField = (key: string) => {
		const { fields, ...rest } = currentTemplate;

		const index = fields.findIndex((field) => field.key == key);

		const newFields = fields.toSpliced(index, 1);

		setCurrentTemplate({ fields: newFields, ...rest });
	};

	useEffect(() => {
		setIframeTitle(currentTemplate.title);
	}, [currentTemplate.title]);

	useEffect(() => {
		setOldTitle(currentTemplate.title);
	});

	return (
		<div>
			<p>title</p>
			<input onChange={setTitle} value={currentTemplate.title}></input>
			<div>Template</div>
			<button onClick={saveTemplate}>save template</button>
			{// Field list
			currentTemplate.fields?.map((field) => {
				return (
					<div key={field.key}>
						<p>{field.key}</p>
						<p>{field.value}</p>
						<button onClick={() => deleteField(field.key)}>
							delete field
						</button>
					</div>
				);
			})}
			<button onClick={addField}>Add Field</button>
			<PageElementsList
				pageElements={currentTemplate.pageElements}
			></PageElementsList>
		</div>
	);
}

const FieldList = ({ fields }: { fields: FieldType[] }) => {
	return <></>;
};

const PageElementsList = ({
	pageElements,
}: {
	pageElements: PageElementType[];
}) => {
	return <></>;
};

export default Template;
