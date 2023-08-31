<script lang="ts">
	import DetailedSelector from "./DetailedSelector.svelte";
	import { storeMessaging, Actions, currentSelectedElement } from "../../utils/stores";
	import { onDestroy, onMount, tick } from "svelte";

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
	let detailIframe:HTMLIFrameElement;
	let hoverSelecting = true;

	$:{console.log(hoverSelecting)}

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
				document.removeEventListener("click", InspectElement, true);
				document.removeEventListener("mouseover", HoverElement, true);
				window.removeEventListener("mouseout", ClearCanvas, true);
				currentSelectedElement.set(selectedElement);
				hoverSelecting = false;
			}
		}

		function HoverElement(e) {
			highlightElement(e.target)
		}

	};

	const generatePath = () => {
		const CheckForDuplicateIds = (id) => {
			let elements = document.querySelectorAll("#" + id);
			if (elements.length > 1) {
				return false;
			} else {
				return true;
			}
		};

		const searchElements = (elements, element) => {
			for (let i = 0; i < elements.length; i++) {
				if (elements[i] == element) {
					return { found: true, index: i };
				}
			}
			console.error("failed to find element");
			return { found: false, index: 0 };
		};

		const validateClass = (className) => {
			if (className.includes(" ")) {
				return false;
			} else if (className.length > 40) {
				return false;
			} else {
				let regex = /\d/;
				if (regex.test(className)) {
					return false;
				} else {
					return true;
				}
			}
		};

		let path = [];
		let currentElement = selectedElement;
		let searchResult = { found: false, index: 0 };

		while (currentElement != document.body) {
			if (currentElement.id != "") {
				if (CheckForDuplicateIds(currentElement.id)) {
					path.push({
						type: IdType.ID,
						value: currentElement.id,
						index: 0,
					});
					break;
				}
			} else if (currentElement.className != "") {
				if (validateClass(currentElement.className)) {
					let queriedElements = document.getElementsByClassName(
						currentElement.className,
					);
					if (queriedElements.length < 5) {
						searchResult = searchElements(queriedElements, currentElement);
						path.push({
							type: IdType.CLASS,
							value: currentElement.className,
							index: searchResult.index,
						});
						break;
					}
				}
			}

			path.push({
				type: IdType.INDEX,
				value: "",
				index: Array.from(currentElement.parentElement.children).indexOf(
					currentElement,
				),
			});
			currentElement = currentElement.parentElement;
			continue;
		}

		return path.reverse();
	};
	


	function highlightElement(hoveredElement) {
		if(!ctx || !hoveredElement) return;

		ClearCanvas()
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

	const unsub1 = storeMessaging.subscribe((message) => {
		const action = message.action;
		const data = message.data
		switch(action){
			case Actions.StartInspect:
				storeMessaging.set({action: Actions.ClosePopup})
				inspect();
				break;
			case Actions.FinishSelection:
				let treePath = generatePath();
				let value = getElementValueFromPath(treePath);
				storeMessaging.set({action: Actions.ElementSelected, data: {path: treePath, value: value}})
				hoverSelecting = true;
				ClearCanvas();
				break;
			case Actions.CollectValues:
				let values = [];
				data.paths.forEach((path, index) => {
					const value = getElementValueFromPath(path)
					// console.log(value)
					values.push(value);
				});
				ValuesCollected(values);
				break;
			default:
				break;
		}
	})

	$:{highlightElement($currentSelectedElement)}

	const unsubscribe = () => {
		unsub1()
	}

	const ValuesCollected = async(values) =>{
		await tick()
		storeMessaging.set({action: Actions.ValuesCollected, data:{values: values}})
	}

	onMount(() => {
		detailIframe.onload = (ev) => {
            // detailIframe.style.all = "initial";

            let link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = chrome.runtime.getURL('assets/svelteContent.css');

            detailIframe.contentDocument.querySelector('head').appendChild(link)

            new DetailedSelector({
                target: detailIframe.contentWindow.document.body,
				props: {extensionId:{extensionId}}
            });
        }


	})

	let detailIframeStyle = ``
	$:{
		detailIframeStyle =
		`position: fixed;
		top: 10px;
		right: 10px;
		width: 320px;
		height: 500px;
		padding: 4px;
		display: ${hoverSelecting ? "none" : "block"};
		pointer-events: ${hoverSelecting ? "none" : "all"};
		z-index: 9999;
		background-color: transparent;`
	}



	onDestroy(unsubscribe)
</script>

<!-- {#if selectedElement} -->
<iframe title="DetailedIframe" bind:this={detailIframe} style={`${detailIframeStyle}`}></iframe>
	<!-- <div>
		<DetailedSelector
			{extensionId}
			bind:selectedElement
			{getElementValueFromPath}
			{Highlighter}
		/>
	</div> -->
<!-- {/if} -->
