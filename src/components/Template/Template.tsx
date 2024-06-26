import { useEffect, type ChangeEvent, useState } from "react";
import { useIframeTitleStore } from "../Header";
import { FieldTypes, type FieldType, type TemplateType, Views } from "~types";
import { create } from "zustand";
import { useTemplates } from "./TemplateList";
import { Storage } from "@plasmohq/storage";
import PropertyField, { parseInput } from "./Field/PropertyField";
import { useViewStore } from "~components/MainFrameContainer";
import {
	determineElementValue,
	getElementFromPath,
} from "~Helpers/ElementActions";
import { sendToBackground } from "@plasmohq/messaging";
import MyButton from "~components/Elements/MyButton";
import { usePageElementStore } from "~components/Selector/DetailSelector";
import PageElementsList from "./PageElement/PageElementsList";
import FieldList from "./Field/FieldList";

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
		TemplateState.closed,
	);

	const { currentTemplate, setCurrentTemplate } = useTemplateStore();
	const { templates, setTemplates } = useTemplates();
	const { setIframeTitle } = useIframeTitleStore();
	const { currentView, setCurrentView } = useViewStore();
	const { resetCurrentPageElement } = usePageElementStore();

	const setTitle = (e: ChangeEvent) => {
		const { title, ...rest } = currentTemplate;
		const newTitle = (e.target as HTMLInputElement).value;
		setCurrentTemplate({
			title: newTitle,
			...rest,
		});
	};
	const setDirectory = (e: ChangeEvent) => {
		const { directory, ...rest } = currentTemplate;
		const newDirectory = (e.target as HTMLInputElement).value;
		setCurrentTemplate({
			directory: newDirectory,
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
		setCurrentTemplate(newTemplate);

		if (currentTemplate.isnew) {
			const newTemplates = [...templates];
			newTemplates.push(newTemplate);
			console.log("saved new", newTemplates);
			saveToStorage(newTemplates);
		} else {
			const modifiedIndex = templates.findIndex(
				(item) => item.title == oldTitle,
			);
			const newTemplates = templates.toSpliced(
				modifiedIndex,
				1,
				newTemplate,
			);
			saveToStorage(newTemplates);
		}
	};

	const addField = () => {
		const { fields, ...rest } = currentTemplate;

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

		let newFields: FieldType[];
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
			const newTemplate = { ...currentTemplate };

			currentTemplate.pageElements.map((element, i) => {
				const el = getElementFromPath(element.path, document);
				newTemplate.pageElements[i].element = el;
				newTemplate.pageElements[i].value = el
					? determineElementValue(el)
					: "";
			});

			currentTemplate.fields.map((field, i) => {
				newTemplate.fields[i].finalValue = parseInput(
					currentTemplate.fields[i].value,
					newTemplate,
				);
			});

			newTemplate.filename.finalValue = parseInput(
				currentTemplate.filename.value,
				newTemplate,
			);

			setCurrentTemplate(newTemplate);

			toggleState(TemplateState.viewing);
		} else {
			toggleState(TemplateState.editing);
		}
	}, [currentView]);

	return (
		<div className="overflow-y-auto p-2">
			{templateState === TemplateState.editing && (
				<div>
					<p>title</p>
					<input
						onChange={setTitle}
						value={currentTemplate.title}
					></input>
					<p>directory</p>
					<input
						onChange={setDirectory}
						value={currentTemplate.directory}
					></input>
				</div>
			)}
			<PropertyField
				field={currentTemplate.filename}
				index={-1}
				templateState={templateState}
			/>
			<div>Fields</div>
			<FieldList templateState={templateState} />
			<button onClick={addField}>Add Field</button>
			<div className="pt-4">elements========================</div>

			<PageElementsList />

			<div className="flex flex-col">
				{templateState === TemplateState.editing ? (
					<div className="flex flex-col gap-4">
						<MyButton
							onClick={() => {
								resetCurrentPageElement();
								setCurrentView(Views.Selection.Hover);
							}}
						>
							Select
						</MyButton>
						<MyButton
							onClick={() => {
								saveTemplate();
								setCurrentView(Views.Template.View);
							}}
							accented
						>
							Save
						</MyButton>
					</div>
				) : (
					<div className="flex gap-4">
						<MyButton
							onClick={() =>
								setCurrentView(Views.Template.EditExisting)
							}
						>
							Edit
						</MyButton>
						<MyButton
							onClick={() => {
								console.log(currentTemplate);
								downloadMD(currentTemplate);
							}}
							accented={true}
						>
							Download
						</MyButton>
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

	const filename = template.directory + template.filename.finalValue;

	console.log(mdValue, filename, template);

	const resp = await sendToBackground({
		name: "download",
		body: {
			value: mdValue,
			filename: filename,
		},
	});
};

export default Template;
