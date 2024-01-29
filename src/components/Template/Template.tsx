import { useEffect, type ChangeEvent, useState } from "react";
import { useIframeTitleStore } from "../Header";
import type { TemplateType } from "~types";
import { create } from "zustand";
import { useTemplates } from "./TemplateList";
import { Storage } from "@plasmohq/storage";

const storage = new Storage();

interface TemplateState {
	currentTemplate: TemplateType;
	setCurrentTemplate: (template: TemplateType) => void;
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
		});
	};

	const saveTemplate = () => {
		const modifiedIndex = templates.findIndex(
			(item) => item.title == oldTitle
		);
		console.log(modifiedIndex, currentTemplate);
		const newTemplates = templates.toSpliced(
			modifiedIndex,
			1,
			currentTemplate
		);
		setTemplates(newTemplates);
		storage.set("templateList", newTemplates);
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
