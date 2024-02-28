import { useEffect, type ChangeEvent, useState } from "react";
import { useIframeTitleStore } from "../Header";
import {
	FieldTypes,
	type FieldType,
	type PageElementType,
	type TemplateType,
	Views,
} from "~types";
import { create } from "zustand";
import { useTemplates } from "./TemplateList";
import { Storage } from "@plasmohq/storage";
import PropertyField from "./PropertyField";
import { useViewStore } from "~components/MainFrameContainer";
import PageElement from "./PageElement";
import { getElementValueFromPath } from "~Helpers/ElementActions";

const storage = new Storage();

interface TemplateState {
	currentTemplate: TemplateType & { isnew?: boolean };
	setCurrentTemplate: (template: TemplateType & { isnew?: boolean }) => void;
}

export const useTemplateStore = create<TemplateState>()((set) => ({
	currentTemplate: {} as TemplateType,
	setCurrentTemplate: (template) => set({ currentTemplate: template }),
}));

export const TemplateState = {
	closed: 0,
	loading: 1,
	viewing: 2,
	editing: 3,
} as const;

export type TemplateStateKeys =
	(typeof TemplateState)[keyof typeof TemplateState];

function Template() {
	const [oldTitle, setOldTitle] = useState("New Template");
	const [templateState, setTemplateState] = useState<TemplateStateKeys>(
		TemplateState.closed
	);

	const { currentTemplate, setCurrentTemplate } = useTemplateStore();
	const { templates, setTemplates } = useTemplates();
	const { setIframeTitle } = useIframeTitleStore();
	const { currentView, setCurrentView } = useViewStore();

	const setTitle = (e: ChangeEvent) => {
		const { title, ...rest } = currentTemplate;
		const newTitle = (e.target as HTMLInputElement).value;
		setCurrentTemplate({
			title: newTitle,
			...rest,
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

	const toggleState = async (state: TemplateStateKeys) => {
		await new Promise((resolve) => setTimeout(resolve, 0));
		setTemplateState(state);
		// setIsEditing(edit);
	};

	useEffect(() => {
		setIframeTitle(currentTemplate.title);
	}, [currentTemplate.title]);

	useEffect(() => {
		setOldTitle(currentTemplate.title);
	}, []);

	useEffect(() => {
		if (currentView == Views.Template.View) {
			// ====== syncronously load element values and pass them to fields' finalValues

			const { pageElements, ...rest } = currentTemplate;
			const newElements = [...pageElements];

			pageElements.map((element, i) => {
				newElements[i].value = getElementValueFromPath(
					element.path,
					document
				);
			});

			setCurrentTemplate({ pageElements: newElements, ...rest });

			toggleState(TemplateState.viewing);
		} else {
			toggleState(TemplateState.editing);
		}
	}, [currentView]);

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
							templateState={templateState}
						/>
					);
				})}
			</FieldList>
			<button onClick={addField}>Add Field</button>
			<div>elements========================</div>
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
			<div className="flex flex-col">
				{templateState === TemplateState.editing ? (
					<div>
						<button
							onClick={() => {
								saveTemplate();
								setCurrentView(Views.Template.View);
							}}
						>
							save templatee
						</button>
						<button
							onClick={() =>
								setCurrentView(Views.Selection.Hover)
							}
						>
							Select
						</button>
					</div>
				) : (
					<div className="flex gap-4">
						<button
							onClick={() =>
								setCurrentView(Views.Template.EditExisting)
							}
						>
							Edit
						</button>
						<button onClick={() => downloadMD(currentTemplate)}>
							Download
						</button>
					</div>
				)}
			</div>
		</div>
	);
}

const downloadMD = async (template: TemplateType) => {
	let mdValue = "---\n";
	template.fields.map((field) => {
		mdValue += field.key + ": " + field.finalValue + "\n";
	});
	mdValue += "---";
	console.log(mdValue);

	var element = document.createElement("a");
	element.setAttribute(
		"href",
		"data:text/plain;charset=utf-8," + encodeURIComponent(mdValue)
	);
	element.setAttribute("download", "markdown");

	element.style.display = "none";
	document.body.appendChild(element);

	element.click();

	document.body.removeChild(element);

	console.log("dun");
};

const FieldList = ({ children }: { children: React.ReactNode }) => {
	return <div className=" flex flex-col gap-2">{children}</div>;
};

const PageElementsList = ({ children }: { children: React.ReactNode }) => {
	return <div className="flex flex-col">{children}</div>;
};

export default Template;
