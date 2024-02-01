import { useState, type ChangeEvent } from "react";
import { Views, type FieldType } from "~types";
import { useTemplateStore } from "./Template";
import { useViewStore } from "~components/MainFrameContainer";

function PropertyField({ field, index }: { field: FieldType; index: number }) {
	const { currentTemplate, setCurrentTemplate } = useTemplateStore();
	const { currentView, changeView } = useViewStore();

	const [tempField, setTempField] = useState({ ...field });

	const handleKeyChange = (e: ChangeEvent) => {
		const newKey = (e.target as HTMLInputElement).value;
		const updatedField = { ...tempField };
		updatedField.key = newKey;
		setTempField(updatedField);
	};

	const handleUpdateKey = () => {
		const newField = { ...field };
		newField.key = tempField.key;

		updateTemplate(newField);
	};

	const updateTemplate = (newField: FieldType) => {
		const newFields = currentTemplate.fields.toSpliced(index, 1, newField);
		const updatedTemplate = { ...currentTemplate };
		updatedTemplate.fields = newFields;

		setCurrentTemplate(updatedTemplate);
	};

	const deleteField = () => {
		const { fields, ...rest } = currentTemplate;
		const newFields = fields.toSpliced(index, 1);
		setCurrentTemplate({ fields: newFields, ...rest });
	};

	const handleSelectElement = () => {
		changeView(Views.Selection.Hover);
	};

	return (
		<div>
			<div className=" flex gap-2">
				<input
					value={tempField.key}
					onChange={handleKeyChange}
					onBlur={() => handleUpdateKey()}
				/>
				<p>{tempField.key}</p>
				<p>{tempField.value}</p>
				<button onClick={deleteField}>delete field</button>
				<button onPointerDown={handleSelectElement}>Select</button>
			</div>
		</div>
	);
}

export default PropertyField;
