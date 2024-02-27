import { useViewStore } from "~components/MainFrameContainer";
import { Storage } from "@plasmohq/storage";
import { useTemplateStore } from "./Template";
import { Views, type TemplateType } from "~types";
import { create } from "zustand";
import { useEffect, useState, type PointerEvent } from "react";

const storage = new Storage();

const emptyTemplate = (title: string) => {
	return {
		title: title,
		directory: "",
		needsBackground: false,
		isnew: true,
		fields: [],
		pageElements: [],
	};
};

interface TemplateListItem {
	title: string;
	url?: string;
}

interface Templates {
	templates: TemplateType[];
	setTemplates: (list: TemplateType[]) => void;
}

export const useTemplates = create<Templates>()((set) => ({
	templates: [emptyTemplate("example")],
	setTemplates: (list) => {
		set({ templates: list });
	},
}));

function TemplateList() {
	const { setCurrentTemplate } = useTemplateStore();
	const { changeView } = useViewStore();
	const { templates, setTemplates } = useTemplates();

	const [templateList, setTemplateList] = useState<TemplateListItem[]>([]);
	const [templateToDelete, setTemplateToDelete] = useState("");

	const createNewTemplate = () => {
		setCurrentTemplate(emptyTemplate("New Template"));
		changeView(Views.Template.EditNew);
	};

	const getList = async () => {
		const generateExampleList = () => {
			const exampleTemplate: TemplateType = emptyTemplate("example");
			const newTemplates = [exampleTemplate];
			console.log(newTemplates);
			storage.set("templateList", newTemplates);
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
				url: template.url,
			});
		});
		setTemplateList(newList);
		console.log(templates);
	};

	const openTemplate = (title: string) => {
		setCurrentTemplate(
			templates.find((item) => item.title == title) as TemplateType
		);
		changeView(Views.Template.View);
	};

	const handleDeleteTemplate = (title: string, e: PointerEvent) => {
		e.stopPropagation();
		e.preventDefault();
		setTemplateToDelete(title);
	};

	const deleteTemplate = () => {
		const index = templates.findIndex(
			(item) => item.title == templateToDelete
		);
		const newTemplates = templates.toSpliced(index, 1);
		storage.set("templateList", newTemplates);
		setTemplateToDelete("");
		getList();
	};

	useEffect(() => {
		getList();
	}, []);

	return (
		<div className="relative h-full w-full">
			<div className="p-2">
				<div>List</div>
				{templateList.map((item, i) => {
					return (
						<div key={item.title} className="px-0 py-1">
							<div
								onPointerDown={() => openTemplate(item.title)}
								className=" p-2 hover:bg-obsidian-300 flex justify-between items-center w-full rounded-md"
							>
								<div className=" flex flex-col ">
									<p className=" text-xl">{item.title}</p>
									<p className=" opacity-60 text-sm">
										{"/" + (item.url ? item.url : "")}
									</p>
								</div>
								<button
									onPointerDown={(e) =>
										handleDeleteTemplate(item.title, e)
									}
									className=" p-2 bg-obsidian-300"
								>
									delete
								</button>
							</div>
						</div>
					);
				})}
				<button onClick={createNewTemplate}>New Template</button>
			</div>
			{templateToDelete != "" ? (
				<div className=" absolute z-10 top-0 w-full h-full bg-obsidian-100/80 flex flex-col items-center justify-center">
					<div className="w-3/4 h-fit flex flex-col justify-center items-center gap-2 bg-obsidian-300 rounded-md py-4 ">
						<p>Delete this template?</p>
						<div className="flex gap-8">
							<button
								onPointerDown={deleteTemplate}
								className=" bg-red-500 rounded-md py-2 px-4"
							>
								delete
							</button>
							<button
								onPointerDown={() => setTemplateToDelete("")}
								className=" py-2 px-4 rounded-sm"
							>
								cancel
							</button>
						</div>
					</div>
					<div className=" h-1/4" />
				</div>
			) : (
				<></>
			)}
		</div>
	);
}

export default TemplateList;
