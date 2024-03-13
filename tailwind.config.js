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
				400: "#f87171",
				500: "#ef4444",
			},
			obsidian: {
				100: "#1e1e1e",
				200: "#262626",
				300: "#363636",
				350: "#3F3F3F",
				500: "#444444",
				600: "#555555",
			},
			accent: {
				500: "#8A5CF5",
				550: "#A68AF9",
			},
		},
	},
};
