function TemplateList({ newTemplate }: { newTemplate: () => void }) {
	return (
		<div>
			<div>List</div>
			<button onClick={newTemplate}>New Template</button>
		</div>
	);
}

export default TemplateList;
