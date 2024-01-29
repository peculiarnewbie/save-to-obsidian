import { useEffect, type ChangeEvent } from "react";
import { useIframeTitleStore } from "../Header";
import { useTemplateStore } from "../MainFrameContainer";
import type { TemplateType } from "~types";

function Template({ isEditing }: { isEditing: boolean }) {
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

	return (
		<div>
			<p>title</p>
			<input onChange={setTitle} value={currentTemplate.title}></input>
			<div>Template</div>;
		</div>
	);
}

export default Template;
