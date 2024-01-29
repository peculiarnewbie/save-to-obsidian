import { useEffect, type ChangeEvent, useState } from "react";
import { useIframeTitleStore } from "../Header";
import type { TemplateType } from "~types";
import { create } from "zustand";

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
	const { currentTemplate, setCurrentTemplate } = useTemplateStore();

	const { setIframeTitle } = useIframeTitleStore();

	const setTitle = (e: ChangeEvent) => {
		const newTitle = (e.target as HTMLInputElement).value;
		setCurrentTemplate({
			title: newTitle,
			directory: currentTemplate.directory,
			fields: currentTemplate.fields ?? [],
			needsBackground: currentTemplate.needsBackground,
		});
		setIframeTitle(newTitle);
	};

	const saveTemplate = () => {};

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
