import { useEffect, useState } from "react";
import cssText from "data-text:~style.css";
import Header from "./Header";
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

export const getStyle = () => {
	const style = document.createElement("style");
	style.textContent = cssText;
	return style;
};

const MainFrameContainer = ({ closePopup }: { closePopup: () => void }) => {
	const [iframeTitle, setIframeTitle] = useState("Save to Obsidian");
	const { currentView, changeView } = useViewStore();

	const [counter, setCounter] = useState(0);

	const [currentTemplate, setCurrentTemplate] = useState<TemplateType>();

	const goBack = () => {
		if (currentView == Views.EditTemplate) changeView(Views.Main);
	};

	const switchView = (view: ViewsKeys) => {
		//changeView(view);
		switch (view) {
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
	};

	const newTemplate = () => {
		changeView(Views.EditTemplate);
	};

	//================================================================================================================================for testing, get rid of this
	useEffect(() => {
		switchView(currentView);
	}, [currentView]);

	return (
		<>
			<div className=" w-full h-full text-text-primary flex flex-col rounded-xl bg-obsidian-100 overflow-hidden">
				<Header
					closePopup={closePopup}
					iframeTitle={iframeTitle}
					currentView={currentView}
					goBack={goBack}
				/>
				<MainContent />
				<p>{counter}</p>
				<button onClick={() => setCounter(counter + 1)}>+</button>
			</div>
			<BodyStyle />
		</>
	);
};

const MainContent = () => {
	const { currentView, changeView } = useViewStore();

	const newTemplate = () => {
		changeView(Views.EditTemplate);
	};

	//================================================================================================================================for testing, get rid of this
	useEffect(() => {
		console.log("reeeeee-render");
	}, [currentView]);

	if (currentView == Views.Main)
		return <TemplateList newTemplate={newTemplate} />;
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
