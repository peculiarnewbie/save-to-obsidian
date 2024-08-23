// entrypoints/example-ui.content/index.ts
import { render } from "solid-js/web";
import Container from "./Container";

export default defineContentScript({
	matches: ["<all_urls>"],

	main(ctx) {
		const ui = createIntegratedUi(ctx, {
			position: "inline",
			onMount: (container) => {
				// Render your app to the UI container
				// document.body.style.position = "relative";
				container.style.position = "absolute";
				container.style.zIndex = "1000";
				container.style.top = "0";
				container.style.right = "0";
				container.style.height = "800px";
				container.style.width = "350px";
				const unmount = render(() => <Container />, container);
			},
			onRemove: (unmount) => {
				// Unmount the app when the UI is removed
				unmount();
			},
		});

		// Call mount to add the UI to the DOM
		console.log("mounting ui");
		ui.mount();
	},
});
