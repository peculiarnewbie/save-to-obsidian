import { useState, type ChangeEvent, useEffect } from "react";
import { type FieldType, type TemplateType } from "~types";
import {
	useTemplateStore,
	type TemplateStateKeys,
	TemplateState,
} from "./Template";
import { isNumber } from "~Helpers/utils";

function PropertyField(props: {
	field: FieldType;
	index: number;
	templateState: TemplateStateKeys;
}) {
	const { currentTemplate, setCurrentTemplate } = useTemplateStore();

	const [tempField, setTempField] = useState({ ...props.field });
	const [isFocused, setIsFocused] = useState(false);

	const handleKeyChange = (e: ChangeEvent) => {
		const el = e.target as HTMLInputElement;
		const key = el.name;
		const newValue = el.value;
		const updatedField = { ...tempField };
		//@ts-expect-error
		updatedField[key] = newValue;
		setTempField(updatedField);
	};

	const updateTemplate = (newField: FieldType) => {
		// console.log("update template", newField);
		if (props.index === -1) {
			console.log("update filename", newField);
			const { filename, ...rest } = currentTemplate;
			setCurrentTemplate({ filename: newField, ...rest });
		} else {
			const { fields, ...rest } = currentTemplate;

			const newFields = currentTemplate.fields.toSpliced(
				props.index,
				1,
				newField
			);

			setCurrentTemplate({ fields: newFields, ...rest });
		}
	};

	const deleteField = () => {
		const { fields, ...rest } = currentTemplate;
		const newFields = fields.toSpliced(props.index, 1);
		setCurrentTemplate({ fields: newFields, ...rest });
	};

	/* 
		might be better to do this everytime 
		the field is updated instead 
	*/
	// useEffect(() => {
	// 	if (props.templateState == TemplateState.viewing) {
	// 		const { finalValue, ...rest } = { ...tempField };
	// 		const newField = {
	// 			finalValue: parseInput(rest.value as string, currentTemplate),
	// 			...rest,
	// 		};
	// 		setTempField(newField);

	// 		updateTemplate(newField);
	// 	}
	// }, [props.templateState]);

	return (
		<div
			className={` w-full bg-obsidian-100 flex border-2 border-t-[3px] outline -outline-offset-1 rounded-md h-fit  hover:outline-1 outline-obsidian-500
				${isFocused ? " border-obsidian-600 outline-1 " : "outline-0 border-transparent"}
			`}
		>
			<input
				className="font-normal text-sm text-white h-7 peer bg-transparent outline-none p-1 pr-2 w-1/4 focus:bg-obsidian-200"
				value={tempField.key ?? ""}
				onChange={handleKeyChange}
				name="key"
				onFocus={() => setIsFocused(true)}
				onBlur={() => {
					setIsFocused(false);
					updateTemplate(tempField);
				}}
				disabled={
					props.templateState !== TemplateState.editing ||
					props.index === -1
				}
			/>
			{props.index !== -1 && (
				<button
					className="w-6 peer-focus:bg-obsidian-200 order-first"
					onClick={deleteField}
				>
					d
				</button>
			)}
			{/* {props.templateState == TemplateState.editing ? ( */}
			<input
				className="grow min-w-8 font-normal text-sm text-white h-7 bg-transparent outline-none p-1 pr-2 focus:bg-obsidian-200"
				value={
					props.templateState === TemplateState.editing
						? tempField.value ?? ""
						: tempField.finalValue
				}
				onChange={handleKeyChange}
				name={
					props.templateState === TemplateState.editing
						? "value"
						: "finalValue"
				}
				onFocus={() => setIsFocused(true)}
				onBlur={() => {
					setIsFocused(false);
					updateTemplate(tempField);
				}}
			/>
			{/* ) : (
					<p className="grow">val: {tempField.finalValue}</p>
				)} */}
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

export const parseInput = (
	input: string | undefined,
	template: TemplateType
) => {
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
							if (template.pageElements[parseInt(numString)])
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
			template.pageElements[element].value as string
		);
	});

	return parsedString;
};
