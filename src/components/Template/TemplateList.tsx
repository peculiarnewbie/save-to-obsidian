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
	setTemplates: (list) => {
		set({ templates: list });
	},
}));

function TemplateList() {
	const { setCurrentTemplate } = useTemplateStore();
	const { changeView } = useViewStore();
	const { templates, setTemplates } = useTemplates();

	const [templateList, setTemplateList] = useState([]);

	const createNewTemplate = () => {
		setCurrentTemplate({
			title: "New Template",
			directory: "",
			needsBackground: false,
			isnew: true,
		});
		changeView(Views.Template.EditNew);
	};

	const getList = async () => {
		const generateExampleList = () => {
			const exampleTemplate: TemplateType = {
				title: "example",
				directory: "",
				needsBackground: false,
			};
			const newTemplates = [exampleTemplate];
			console.log(newTemplates);
			storage.set("templateList", newTemplates);
			console.log("generated example");
		};

		const pulledTemplates = (await storage.get(
			"templateList"
		)) as TemplateType[];
		if (!pulledTemplates) return;

		setTemplates(pulledTemplates);

		if (!pulledTemplates || pulledTemplates.length == 0) {
			generateExampleList();
			await getList();
			return;
		}

		const newList = [] as TemplateListItem[];
		pulledTemplates.forEach((template) => {
			newList.push({
				title: template.title,
				url: "",
			});
		});
		setTemplateList(newList);
	};

	const openTemplate = (title: string) => {
		setCurrentTemplate(templates.find((item) => item.title == title));
		changeView(Views.Template.View);
	};

	const deleteTemplate = (title: string) => {
		const index = templates.findIndex((item) => item.title == title);
		const newTemplates = templates.toSpliced(index, 1);
		storage.set("templateList", newTemplates);
		getList();
	};

	useEffect(() => {
		getList();
	}, []);

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
						<button
							onClick={() => deleteTemplate(item.title)}
							className=" p-2 bg-obsidian-300"
						>
							delete
						</button>
					</div>
				);
			})}
			<button onClick={createNewTemplate}>New Template</button>
		</div>
	);
}

export default TemplateList;
