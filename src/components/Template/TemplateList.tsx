import { useTemplateStore, useViewStore } from "~components/MainFrameContainer";
import { Views } from "~types";

function TemplateList() {
	const { setCurrentTemplate } = useTemplateStore();
	const { changeView } = useViewStore();

	const newTemplate = () => {
		setCurrentTemplate({
			title: "New Template",
			directory: "",
			needsBackground: false,
		});
		changeView(Views.EditTemplate);
	};

	return (
		<div>
			<div>List</div>
			<button onClick={newTemplate}>New Template</button>
		</div>
	);
}

export default TemplateList;
