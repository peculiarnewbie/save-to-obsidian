<script lang="ts">
	import DetailedSelector from "./DetailedSelector.svelte";
	import { storeMessaging, Actions } from "../../utils/stores";

	export let canvas: HTMLCanvasElement;
	export let extensionId;
	let selectedElement;

	let ctx: CanvasRenderingContext2D;

	enum IdType {
		ID,
		CLASS,
		INDEX,
	}

	let Highlighter = {canvas, ctx, highlightElement}

	chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
		if (request.action === "bgValuesUpdate") {
			let values = [];
			request.paths.forEach((path, index) => {
				values.push(getElementValueFromPath(path));
			});
			sendResponse({ success: true, values: values });
		}
	});

	const inspect = async () => {
		let click_count = 0;

		document.getElementById(`${extensionId}-iframe`).style.display = "none";

		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		canvas.style.width = "100vw";
		canvas.style.height = "100vh";

		ctx = canvas.getContext("2d");

		document.addEventListener("click", InspectElement, true);
		document.addEventListener("mouseover", HoverElement, true);
		window.addEventListener("mouseout", ClearCanvas, true);

		function InspectElement(event) {
			click_count++;
			event.preventDefault();
			event.stopPropagation();
			const element = event.target;
			selectedElement = element;

			if (click_count == 1) {
				// ctx.clearRect(0, 0, canvas.width, canvas.height);
				document.removeEventListener("click", InspectElement, true);
				document.removeEventListener("mouseover", HoverElement, true);
				window.removeEventListener("mouseout", ClearCanvas, true);
			}
		}

		function HoverElement(e) {
			highlightElement(e.target)
		}

	};

	function highlightElement(hoveredElement) {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.fillStyle = "rgba(0, 0, 255, 0.2)";
		const hoveredDom = hoveredElement.getBoundingClientRect();
		// ctx.fillRect(100, 100, 200, 200);
		ctx.fillRect(
			hoveredDom.left,
			hoveredDom.top,
			hoveredDom.width,
			hoveredDom.height,
		);
	}

	function ClearCanvas() {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
	}

	const getElementValueFromPath = (path) => {
		const getElementFromCurrentPath = (currentPath, currentElement) => {
			switch (currentPath.type) {
				case IdType.ID:
					return currentElement.querySelectorAll("#" + currentPath.value)[
						currentPath.index
					];
				case IdType.CLASS:
					return currentElement.querySelectorAll("." + currentPath.value)[
						currentPath.index
					];
				case IdType.INDEX:
					return currentElement.children[currentPath.index];
			}
		};

		if (!path) {
			return "";
		}

		let element;
		element = getElementFromCurrentPath(path[0], document.body);

		for (let i = 1; i < path.length; i++) {
			element = getElementFromCurrentPath(path[i], element);
		}

		return determineElementValue(element);
	};

	const determineElementValue = (element) => {
		if (element.nodeName == "IMG") {
			return element.src;
		} else {
			return element.innerText;
		}
	};

	storeMessaging.subscribe((message) => {
		const action = message.action;
		const data = message.data
		switch(action){
			case Actions.StartInspect:
				inspect();
				break;
			case Actions.ElementSelected:
				ClearCanvas();
				break;
			case Actions.CollectValues:
				let values = [];
				data.paths.forEach((path, index) => {
					values.push(getElementValueFromPath(path));
				});
				storeMessaging.set({action: Actions.ValueUpdated, data:{values: values}})
				break;
			default:
				break;
		}
	})
</script>

{#if selectedElement}
	<div>
		<DetailedSelector
			{extensionId}
			bind:selectedElement
			{getElementValueFromPath}
			{Highlighter}
		/>
	</div>
{/if}
