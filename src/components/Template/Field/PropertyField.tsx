import {
	useState,
	type ChangeEvent,
	useEffect,
	useRef,
	type DragEventHandler,
	type DragEvent,
} from "react";
import { type FieldType, type TemplateType } from "~types";
import {
	useTemplateStore,
	type TemplateStateKeys,
	TemplateState,
} from "../Template";
import { isNumber } from "~Helpers/utils";

function PropertyField(props: {
	field: FieldType;
	index: number;
	templateState: TemplateStateKeys;
	fieldsCount: number;
	reorderFields: (index: number, newIndex: number) => void;
}) {
	const { currentTemplate, setCurrentTemplate } = useTemplateStore();

	const [tempField, setTempField] = useState({ ...props.field });
	const [isFocused, setIsFocused] = useState(false);
	const [isDragging, setIsDragging] = useState(false);

	const fieldRef = useRef<HTMLDivElement>(null);

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
		if (props.index === -1) {
			console.log("update filename", newField);
			const { filename, ...rest } = currentTemplate;
			setCurrentTemplate({ filename: newField, ...rest });
		} else {
			const { fields, ...rest } = currentTemplate;

			const newFields = currentTemplate.fields.toSpliced(
				props.index,
				1,
				newField,
			);

			setCurrentTemplate({ fields: newFields, ...rest });
		}
	};

	const deleteField = () => {
		const { fields, ...rest } = currentTemplate;
		const newFields = fields.toSpliced(props.index, 1);
		setCurrentTemplate({ fields: newFields, ...rest });
	};

	useEffect(() => {
		setTempField(props.field);
		console.log(fieldRef.current);
	}, [props.field]);

	const handleStartDrag = () => {
		setIsDragging(true);
	};

	const handleEndDrag = () => {
		setIsDragging(false);
	};

	const handleDrag = (e: DragEvent) => {
		if (!fieldRef.current) return;
		if (
			props.index > 0 &&
			e.pageY < fieldRef.current.getBoundingClientRect().top - 4
		)
			props.reorderFields(props.index, props.index - 1);
		if (
			props.index < props.fieldsCount - 1 &&
			e.pageY > fieldRef.current.getBoundingClientRect().bottom + 4
		)
			props.reorderFields(props.index, props.index + 1);
		e.preventDefault();
	};

	return (
		<div
			className={`relative h-fit w-full overflow-hidden rounded-md border-2 border-t-[3px] outline  -outline-offset-1 outline-obsidian-500 hover:outline-1
				${isFocused ? " border-obsidian-600 outline-1 " : "border-transparent outline-0"} ${isDragging ? "outline-0" : "outline"}`}
			draggable="true"
			ref={fieldRef}
			onDragStart={handleStartDrag}
			onDragEnd={handleEndDrag}
			onDrag={handleDrag}
		>
			<div
				className={`pointer-events-none absolute h-full w-full ${isDragging ? "bg-accent-800" : "bgt-transparent"}`}
			/>

			<div className="flex h-full w-full">
				<input
					className="peer h-7 w-1/4 bg-transparent p-1 pr-2 text-sm font-normal text-white outline-none focus:bg-obsidian-200"
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
						className="order-first w-6 peer-focus:bg-obsidian-200"
						onClick={deleteField}
					>
						d
					</button>
				)}
				{/* {props.templateState == TemplateState.editing ? ( */}
				<input
					className="h-7 min-w-8 grow bg-transparent p-1 pr-2 text-sm font-normal text-white outline-none focus:bg-obsidian-200"
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
			</div>
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
	template: TemplateType,
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
									"specified element don't exist in elements list",
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
			template.pageElements[element].value as string,
		);
	});

	return parsedString;
};
