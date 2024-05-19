import type { FieldType } from "~types";
import { useTemplateStore, type TemplateStateKeys } from "../Template";
import PropertyField from "./PropertyField";
import { useState } from "react";

export default function FieldList(props: { templateState: TemplateStateKeys }) {
	const { currentTemplate, setCurrentTemplate } = useTemplateStore();

	const reorderFields = (index: number, newIndex: number) => {
		const { fields, ...rest } = currentTemplate;
		const newFields = [...currentTemplate.fields];
		newFields[newIndex] = currentTemplate.fields[index];
		newFields[index] = currentTemplate.fields[newIndex];
		setCurrentTemplate({ fields: newFields, ...rest });
		console.log(index, "to", newIndex);
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
						reorderFields={reorderFields}
						fieldsCount={currentTemplate.fields?.length ?? 0}
					/>
				);
			})}
		</div>
	);
}
