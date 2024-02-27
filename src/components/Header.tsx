import { create } from "zustand";
import { Views, type ViewsKeys } from "../types";
import backImage from "data-base64:~images/Back.svg";
import { useViewStore } from "./MainFrameContainer";

interface IframeTitleState {
	iframeTitle: string;
	setIframeTitle: (title: string) => void;
}

export const useIframeTitleStore = create<IframeTitleState>()((set) => ({
	iframeTitle: "Save to Obsidian",
	setIframeTitle: (title) => set({ iframeTitle: title }),
}));

function Header({ closePopup }: { closePopup: () => void }) {
	const { currentView, setCurrentView } = useViewStore();
	const { iframeTitle } = useIframeTitleStore();

	const goBack = () => {
		switch (currentView) {
			case Views.Template.View:
				setCurrentView(Views.Main);
				break;
			case Views.Template.EditNew:
				confirmUnsavedChanges(Views.Main);
			case Views.Template.EditExisting:
				confirmUnsavedChanges(Views.Template.View);
				break;
		}
	};

	const confirmUnsavedChanges = (navTo: ViewsKeys) => {
		setCurrentView(navTo);
	};

	return (
		<div className=" flex justify-between bg-obsidian-300">
			<div className="flex text-2xl text-white font-bold items-center">
				{currentView != Views.Main && (
					<button className="flex p-2" onClick={goBack}>
						<img src={backImage} width="20px" />
					</button>
				)}
				<div className=" pl-4">{iframeTitle}</div>
			</div>
			<button
				className="flex bg-transparent text-2xl text-white py-3 px-5 hover:bg-red-500"
				onClick={() => closePopup()}
			>
				x
			</button>
		</div>
	);
}

export default Header;
