function Header({
	closePopup,
	iframeTitle,
	backButton,
}: {
	closePopup: () => void;
	iframeTitle?: string;
	backButton?: boolean;
}) {
	return (
		<div className=" flex justify-between bg-obsidian-300">
			<div className="flex text-2xl text-white font-bold items-center">
				{backButton && <button>back</button>}
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
