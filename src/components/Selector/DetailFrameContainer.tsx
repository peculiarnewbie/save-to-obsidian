import DetailSelector from "./DetailSelector";

function DetailFrameContainer({ shown }: { shown: boolean }) {
	return (
		<>
			<div
				className={`${shown ? "flex" : "hidden"} text-text-primary flex-col rounded-xl w-full h-full bg-obsidian-100 overflow-hidden`}
			>
				detail select
				<DetailSelector />
			</div>
		</>
	);
}

export default DetailFrameContainer;
