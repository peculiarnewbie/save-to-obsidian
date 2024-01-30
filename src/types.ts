export const Views = {
	Main: "main",
	Settings: "settings",
	Template: {
		View: "viewTemplate",
		EditNew: "editNewTemplate",
		EditExisting: "editExisting",
	},
} as const;

export type ViewsKeys =
	| typeof Views.Main
	| typeof Views.Settings
	| (typeof Views.Template)[keyof typeof Views.Template];

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

export type FieldType = {
	key: string;
	value?: string;
	finalValue?: string;
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

export type PageElementType = {
	key: string;
	path: PathSteps[];
	header?: boolean;
};

export type TemplateType = {
	title: string;
	directory: string;
	fields?: FieldType[];
	pageElements?: PageElementType[];
	needsBackground: boolean;
};
