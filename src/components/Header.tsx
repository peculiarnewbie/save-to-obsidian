import { create } from "zustand";
import { Views, type ViewsKeys } from "../types";

interface IframeTitleState {
	iframeTitle: string;
	setIframeTitle: (title: string) => void;
}

export const useIframeTitleStore = create<IframeTitleState>()((set) => ({
	iframeTitle: "Save to Obsidian",
	setIframeTitle: (title) => set({ iframeTitle: title }),
}));

function Header({
	closePopup,
	currentView,
	goBack,
}: {
	closePopup: () => void;
	currentView: ViewsKeys;
	goBack: () => void;
}) {
	const { iframeTitle } = useIframeTitleStore();
	return (
		<div className=" flex justify-between bg-obsidian-300">
			<div className="flex text-2xl text-white font-bold items-center">
				{currentView != Views.Main && (
					<button onClick={goBack}>back</button>
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
