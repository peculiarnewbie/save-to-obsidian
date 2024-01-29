import { useEffect, useState } from "react";
import cssText from "data-text:~style.css";
import Header, { useIframeTitleStore } from "./Header";
import { Views, type ViewsKeys, type TemplateType } from "../types";
import TemplateList from "./Template/TemplateList";
import Template, { useTemplateStore } from "./Template/Template";

import { create } from "zustand";

interface ViewState {
	currentView: ViewsKeys;
	changeView: (view: ViewsKeys) => void;
}

export const useViewStore = create<ViewState>()((set) => ({
	currentView: Views.Main,
	changeView: (view) => set({ currentView: view }),
}));

export const getStyle = () => {
	const style = document.createElement("style");
	style.textContent = cssText;
	return style;
};

const MainFrameContainer = ({ closePopup }: { closePopup: () => void }) => {
	const { setIframeTitle } = useIframeTitleStore();
	const { currentView, changeView } = useViewStore();
	const { setCurrentTemplate } = useTemplateStore();

	const goBack = () => {
		if (currentView == Views.EditTemplate) changeView(Views.Main);
	};

	const newTemplate = () => {};

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
			case Views.EditTemplate:
				setIframeTitle("New Template");
				break;
		}
	}, [currentView]);

	// =====================

	return (
		<>
			<div className=" w-full h-full text-text-primary flex flex-col rounded-xl bg-obsidian-100 overflow-hidden">
				<Header
					closePopup={closePopup}
					currentView={currentView}
					goBack={goBack}
				/>
				<MainContent currentView={currentView} />
			</div>
			<BodyStyle />
		</>
	);
};

const MainContent = ({ currentView }: { currentView: ViewsKeys }) => {
	if (currentView == Views.Main) return <TemplateList />;
	else if (currentView == Views.Template || currentView == Views.EditTemplate)
		return <Template />;
};

const BodyStyle = () => {
	return (
		<>
			<style>{cssText}</style>
		</>
	);
};

export default MainFrameContainer;
