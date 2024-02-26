import { useState, type ChangeEvent, useEffect } from "react";
import { Views, type FieldType, type PageElementType } from "~types";
import { useTemplateStore } from "./Template";
import { useViewStore } from "~components/MainFrameContainer";
import { isNumber } from "~Helpers/utils";

function PropertyField({ field, index }: { field: FieldType; index: number }) {
	const { currentTemplate, setCurrentTemplate } = useTemplateStore();
	const { currentView, changeView } = useViewStore();

	const [isEditing, setIsEditing] = useState(true);
	const [tempField, setTempField] = useState({ ...field });

	const handleKeyChange = (e: ChangeEvent) => {
		const el = e.target as HTMLInputElement;
		const key = el.name;
		const newValue = el.value;
		const updatedField = { ...tempField };
		//@ts-expect-error
		updatedField[key] = newValue;
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

	const parseInput = (input: string) => {
		console.log("parsing", input);
		if (!input) return "";
		const checkElement = (index: number): number => {
			let point = 1;

			if (input[index + point] === "{") {
				let numString: string = "";
				while (true) {
					point++;
					if (isNumber(input[index + point])) {
						numString += input[index + point];
						continue;
					} else if (input[index + point] === "}") {
						point++;
						if (input[index + point] === "}") {
							// if closing double brackets
							if (numString) {
								if (
									currentTemplate.pageElements[
										parseInt(numString)
									]
								)
									return parseInt(numString);
								else
									throw new Error(
										"specified element don't exist in elements list"
									);
							}
						}
					}
					return -1;
				}
			}
			return -1;
		};

		let elements: number[] = [];
		for (let i = 0; i < input.length; i++) {
			if (input[i] == "{") {
				let element = -1;
				try {
					element = checkElement(i);
					console.log("try", input[i], element);
				} catch (e) {
					console.error(e);
				}
				if (element !== -1) elements.push(element);
			}
		}

		if (elements.length === 0) return input;

		let parsedString = input;

		elements?.forEach((element) => {
			parsedString = parsedString.replaceAll(
				`{{${element}}}`,
				currentTemplate.pageElements[element].value as string
			);
		});

		return parsedString;
	};

	useEffect(() => {
		if (currentView == Views.Template.View) {
			setIsEditing(false);
		} else {
			setIsEditing(true);
		}
	}, [currentView]);

	/* 
		might be better to do this everytime 
		the field is updated instead 
	*/
	useEffect(() => {
		console.log("isEditing", isEditing);
		if (!isEditing) {
			const { finalValue, ...rest } = { ...tempField };
			const newField = {
				finalValue: parseInput(rest.value as string),
				...rest,
			};
			console.log("setting", newField);
			setTempField(newField);
			updateTemplate(newField);
		}
	}, [isEditing]);

	return (
		<div>
			<div className=" w-full bg-obsidian-100 flex border rounded-md h-fit">
				<input
					className="font-normal text-sm text-white h-7 bg-transparent outline-none p-1 pr-2"
					value={tempField.key}
					onChange={handleKeyChange}
					onBlur={() => handleUpdateKey()}
					name="key"
					disabled={!isEditing}
				/>
				{isEditing ? (
					<input
						className=" min-w-8 font-normal text-sm text-white h-7 bg-transparent outline-none p-1 pr-2"
						value={tempField.value}
						onChange={handleKeyChange}
						onBlur={() => handleUpdateKey()}
						name="value"
						disabled={!isEditing}
					/>
				) : (
					<p>val: {tempField.finalValue}</p>
				)}

				<button onClick={deleteField}>delete</button>
				<button onPointerDown={handleSelectElement}>Select</button>
			</div>
			{JSON.stringify(tempField)}
		</div>
	);
}

export default PropertyField;

const TextInput = ({ value }: { value: string }) => {
	return (
		<div>
			<input />
			<p>{value}</p>
		</div>
	);
};
