import { useState } from "react";
import cssText from "data-text:~style.css";
import Header from "./Header";
import { Views, type ViewsKeys, type TemplateType } from "../types";
import TemplateList from "./Template/TemplateList";
import Template from "./Template/Template";

export const getStyle = () => {
	const style = document.createElement("style");
	style.textContent = cssText;
	return style;
};

const MainFrameContainer = ({ closePopup }: { closePopup: () => void }) => {
	const [iframeTitle, setIframeTitle] = useState("Save to Obsidian");
	const [currentView, setCurrentView] = useState<ViewsKeys>(Views.Main);

	const [currentTemplate, setCurrentTemplate] = useState<TemplateType>();

	const goBack = () => {
		if (currentView == Views.EditTemplate) changeView(Views.Main);
	};

	const changeView = (view: ViewsKeys) => {
		setCurrentView(view);
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

	const MainContent = () => {
		if (currentView == Views.Main)
			return <TemplateList newTemplate={newTemplate} />;
		else if (currentView == Views.EditTemplate)
			return <Template isEditing={true} />;
	};

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
			</div>
			<BodyStyle />
		</>
	);
};

const BodyStyle = () => {
	return (
		<>
			<style>{cssText}</style>
		</>
	);
};

export default MainFrameContainer;
