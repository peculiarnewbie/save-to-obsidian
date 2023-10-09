export const InputEnum = {
    Filename : "filename",
    Text : "text",
    Date : "date",
    List : "list",
    MultiList : "multiList",
} as const;

export type FieldInputKeys = typeof InputEnum[keyof typeof InputEnum];