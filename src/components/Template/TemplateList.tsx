import { useViewStore } from "~components/MainFrameContainer";
import { Storage } from "@plasmohq/storage";
import { useTemplateStore } from "./Template";
import { Views, type TemplateType } from "~types";
import { create } from "zustand";
import { useEffect, useState } from "react";

const storage = new Storage();

interface TemplateListItem {
	title: string;
	url: string;
}

interface Templates {
	templates: TemplateType[];
	setTemplates: (list: TemplateType[]) => void;
}

export const useTemplates = create<Templates>()((set) => ({
	templates: [{ title: "example", directory: "", needsBackground: false }],
	setTemplates: (list) => set({ templates: list }),
}));

function TemplateList() {
	const { setCurrentTemplate } = useTemplateStore();
	const { changeView } = useViewStore();
	const { templates, setTemplates } = useTemplates();

	const [templateList, setTemplateList] = useState([
		{ title: templates[0].title, url: "" },
	]);

	const newTemplate = () => {
		setCurrentTemplate({
			title: "New Template",
			directory: "",
			needsBackground: false,
		});
		changeView(Views.Template.EditNew);
	};

	const getList = async () => {
		const pulledTemplates = (await storage.get(
			"templateList"
		)) as TemplateType[];
		if (!pulledTemplates) return;

		setTemplates(pulledTemplates);

		const newList = [] as TemplateListItem[];
		pulledTemplates.forEach((template) => {
			newList.push({
				title: template.title,
				url: "",
			});
		});
		setTemplateList(newList);
	};

	useEffect(() => {
		getList();
	}, [templates]);

	const openTemplate = (title: string) => {
		setCurrentTemplate(templates.find((item) => item.title == title));
		changeView(Views.Template.View);
	};

	return (
		<div>
			<div>List</div>
			{templateList.map((item, i) => {
				return (
					<div key={item.title}>
						<button
							onClick={() => openTemplate(item.title)}
							className=" p-2 bg-obsidian-300"
						>
							{item.title}
						</button>
					</div>
				);
			})}
			<button onClick={newTemplate}>New Template</button>
		</div>
	);
}

export default TemplateList;
