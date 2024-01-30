import { useEffect, type ChangeEvent, useState } from "react";
import { useIframeTitleStore } from "../Header";
import type { TemplateType } from "~types";
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
		</div>
	);
}

export default Template;
