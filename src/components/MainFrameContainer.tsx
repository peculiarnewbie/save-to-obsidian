import { useEffect, useState } from "react";
import cssText from "data-text:~style.css";
import Header, { useIframeTitleStore } from "./Header";
import { Views, type ViewsKeys, type TemplateType } from "../types";
import TemplateList from "./Template/TemplateList";
import Template from "./Template/Template";

import { create } from "zustand";

interface ViewState {
	currentView: ViewsKeys;
	changeView: (view: ViewsKeys) => void;
}

export const useViewStore = create<ViewState>()((set) => ({
	currentView: Views.Main,
	changeView: (view) => set({ currentView: view }),
}));

interface TemplateState {
	currentTemplate: TemplateType;
	setCurrentTemplate: (template: TemplateType) => void;
}

export const useTemplateStore = create<TemplateState>()((set) => ({
	currentTemplate: {} as TemplateType,
	setCurrentTemplate: (template) => set({ currentTemplate: template }),
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

	return (
		<>
			<div className=" w-full h-full text-text-primary flex flex-col rounded-xl bg-obsidian-100 overflow-hidden">
				<Header
					closePopup={closePopup}
					currentView={currentView}
					goBack={goBack}
				/>
				<MainContent />
			</div>
			<BodyStyle />
		</>
	);
};

const MainContent = () => {
	const { currentView, changeView } = useViewStore();

	if (currentView == Views.Main) return <TemplateList />;
	else if (currentView == Views.EditTemplate)
		return <Template isEditing={true} />;
};

const BodyStyle = () => {
	return (
		<>
			<style>{cssText}</style>
		</>
	);
};

export default MainFrameContainer;
