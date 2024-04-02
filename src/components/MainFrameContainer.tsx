import { useEffect, useState } from "react";
import Header, { useIframeTitleStore } from "./Header";
import { Views, type ViewsKeys, type TemplateType } from "../types";
import TemplateList from "./Template/TemplateList";

import { create } from "zustand";
import Settings from "./Settings";
import Template from "./Template/Template";

interface ViewState {
	currentView: ViewsKeys;
	setCurrentView: (view: ViewsKeys) => void;
}

export const useViewStore = create<ViewState>()((set) => ({
	currentView: Views.Main,
	setCurrentView: (view) => set({ currentView: view }),
}));

const MainFrameContainer = ({
	closePopup,
	hidden,
}: {
	closePopup: () => void;
	hidden: boolean;
}) => {
	const { setIframeTitle } = useIframeTitleStore();
	const { currentView, setCurrentView } = useViewStore();

	// =========================================================== delete this.
	// just change the store wherever you're switching views
	useEffect(() => {
		switch (currentView) {
			case Views.Main:
				setIframeTitle("Save to Obsidian");
				break;
			case Views.Settings:
				setIframeTitle("Settings");
				break;
		}
	}, [currentView]);

	// =====================

	return (
		<>
			<div
				className={`${hidden ? "hidden" : "flex"} h-full w-full flex-col overflow-hidden rounded-xl bg-obsidian-100 text-text-primary`}
			>
				<Header closePopup={closePopup} />
				<MainContent currentView={currentView} />
			</div>
		</>
	);
};

const MainContent = ({ currentView }: { currentView: ViewsKeys }) => {
	if (currentView == Views.Main) return <TemplateList />;
	else if (currentView == Views.Settings) return <Settings />;
	else return <Template />;
};

export default MainFrameContainer;
