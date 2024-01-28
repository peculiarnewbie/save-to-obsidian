import { Views, type ViewsKeys } from "../types";

function Header({
	closePopup,
	iframeTitle,
	currentView,
	goBack,
}: {
	closePopup: () => void;
	iframeTitle?: string;
	currentView: ViewsKeys;
	goBack: () => void;
}) {
	return (
		<div className=" flex justify-between bg-obsidian-300">
			<div className="flex text-2xl text-white font-bold items-center">
				{currentView != Views.Main && <button>back</button>}
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
