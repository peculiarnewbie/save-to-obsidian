export const Views = {
	Main: "main",
	Settings: "settings",
	Template: "template",
	EditTemplate: "editTemplate",
} as const;

export type ViewsKeys = (typeof Views)[keyof typeof Views];

export const FieldTypes = {
	Filename: "filename",
	Text: "text",
	Number: "number",
	List: "list",
	Date: "date",
	Image: "image",
	Checkbox: "checkbox",
} as const;

export type FieldTypesKeys = (typeof FieldTypes)[keyof typeof FieldTypes];

export type Field = {
	key: string;
	value: string;
	finalValue: string;
	type: FieldTypesKeys;
};

export const IdType = {
	Id: "id",
	Class: "class",
	Index: "index",
	Header: "header",
} as const;

type IdTypeKeys = (typeof IdType)[keyof typeof IdType];

export type PathSteps = {
	type: IdTypeKeys;
	value: string;
	index: number;
};

export type PageElement = {
	key: string;
	path: PathSteps[];
	header?: boolean;
};

export type TemplateType = {
	title: string;
	directory: string;
	fields?: Field[];
	needsBackground: boolean;
};
