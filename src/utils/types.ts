export const IdType = {
	ID: "id",
	CLASS: "class",
	INDEX: "index",
	HEAD: "head",
} as const;

type IdTypeKeys = (typeof IdType)[keyof typeof IdType];

export const ElementType = {
	TEXT: "text",
	IMG: "img",
} as const;

export type ElementTypeKeys = (typeof ElementType)[keyof typeof ElementType];

export const InputEnum = {
	Filename: "filename",
	Text: "text",
	Date: "date",
	List: "list",
	MultiList: "multiList",
} as const;

export type FieldInputKeys = (typeof InputEnum)[keyof typeof InputEnum];

export const HeaderTypes = {
	Title: "title",
	URL: "url",
	Image: "image",
} as const;

export type HeaderTypeKeys = (typeof HeaderTypes)[keyof typeof HeaderTypes];

export type PathType = { type: IdTypeKeys; value: string; index: number };

export type FieldType = {
	key: string;
	value: string;
	type: FieldInputKeys | HeaderTypeKeys;
	path?: PathType[];
};

export type FieldsType = FieldType[];

export type FormType = {
	name: string;
	directory: string;
	fields: FieldsType;
	fromBackground: boolean;
};

export type AllDataType = { [key: string]: FormType };
