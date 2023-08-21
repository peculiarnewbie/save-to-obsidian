export const InputEnum = {
    Filename : "filename",
    Text : "text",
} as const;

export type FieldInputKeys = typeof InputEnum[keyof typeof InputEnum];