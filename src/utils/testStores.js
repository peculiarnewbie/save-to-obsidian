import { writable } from 'svelte/store';

export const testForms = writable({
    name: "example",
    directory: "example/",
    fields: [
        { key: "title", value: "Example Title" },
        { key: "tags", value: "example, tags" },
        { key: "description", value: "Example Description" },
    ],
});