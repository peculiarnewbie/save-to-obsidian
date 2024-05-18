import type { FieldType } from "~types";
import { useTemplateStore, type TemplateStateKeys } from "../Template";
import PropertyField from "./PropertyField";

export default function FieldList(props: { templateState: TemplateStateKeys }) {
	const { currentTemplate } = useTemplateStore();

	const findHovered = (y: position) => {
		console.log(y);
	};

	return (
		<div className=" flex flex-col gap-2">
			{currentTemplate.fields?.map((field: FieldType, i: number) => {
				return (
					<PropertyField
						key={field.key}
						field={field}
						index={i}
						templateState={props.templateState}
					/>
				);
			})}
		</div>
	);
}
