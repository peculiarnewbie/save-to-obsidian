import { useViewStore } from "~components/MainFrameContainer";
import { useTemplateStore } from "./Template";
import { Views } from "~types";
import { create } from "zustand";

interface TemplateListItem {
	title: string;
	url: string;
}
interface TemplateListType {
	templateList: TemplateListItem[];
	setTemplateList: (list: TemplateListItem[]) => void;
}

export const useTemplateListStore = create<TemplateListType>()((set) => ({
	templateList: [{ title: "example", url: "" }],
	setTemplateList: (list) => set({ templateList: list }),
}));

function TemplateList() {
	const { setCurrentTemplate } = useTemplateStore();
	const { changeView } = useViewStore();
	const { templateList, setTemplateList } = useTemplateListStore();

	const newTemplate = () => {
		setCurrentTemplate({
			title: "New Template",
			directory: "",
			needsBackground: false,
		});
		changeView(Views.EditTemplate);
	};

	const openTemplate = () => {
		changeView(Views.Template);
	};

	return (
		<div>
			<div>List</div>
			{templateList.map((item, i) => {
				return (
					<div key={item.title}>
						<button
							onClick={openTemplate}
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
