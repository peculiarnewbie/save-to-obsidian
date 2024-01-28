/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./src/**/*.{tsx,html}"],
	darkMode: "media",
	theme: {
		colors: {
			transparent: "transparent",
			current: "currentColor",
			white: "#ffffff",
			black: "#000000",
			text: {
				primary: "#EEEEF0",
			},
			red: {
				500: "#ef4444",
			},
			obsidian: {
				100: "#1e1e1e",
				300: "#363636",
			},
		},
	},
};
