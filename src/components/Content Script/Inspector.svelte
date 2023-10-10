<script lang="ts">
	import DetailedSelector from "./DetailedSelector.svelte";
	import {
		storeMessaging,
		Actions,
		currentSelectedElement,
		docHeaders,
	} from "../../utils/stores";
	import {
		getElementValueFromPath,
		collectValues,
	} from "../../utils/ElementFetcher";
	import { IdType, type FieldsType, type PathType } from "../../utils/types";
	import { onDestroy, onMount, tick } from "svelte";
	import { get } from "svelte/store";

	export let canvas: HTMLCanvasElement;
	export let extensionId: string;
	let selectedElement: HTMLElement;

	let ctx: CanvasRenderingContext2D | null;

	let detailIframe: HTMLIFrameElement;
	let hoverSelecting = true;

	const inspect = async () => {
		let click_count = 0;
		hoverSelecting = true;
		const iframe = document.getElementById(`${extensionId}-iframe`);

		if (iframe) iframe.style.display = "none";

		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		canvas.style.width = "100vw";
		canvas.style.height = "100vh";

		ctx = canvas.getContext("2d");

		document.addEventListener("click", InspectElement, true);
		document.addEventListener("mouseover", HoverElement, true);
		window.addEventListener("mouseout", ClearCanvas, true);

		function InspectElement(event: MouseEvent) {
			click_count++;
			event.preventDefault();
			event.stopPropagation();
			const element = event.target as HTMLElement;
			selectedElement = element;

			if (click_count == 1) {
				document.removeEventListener("click", InspectElement, true);
				document.removeEventListener("mouseover", HoverElement, true);
				window.removeEventListener("mouseout", ClearCanvas, true);
				currentSelectedElement.set(selectedElement);
				storeMessaging.set({ action: Actions.FinishHover });
				hoverSelecting = false;
			}
		}

		function HoverElement(e: MouseEvent) {
			highlightElement(e.target as HTMLElement);
		}
	};

	const generatePath = (selectedElement: HTMLElement) => {
		const CheckForDuplicateIds = (id: string) => {
			let elements;
			try {
				elements = document.querySelectorAll("#" + id);
			} catch (e) {
				return false;
			}

			if (elements.length == 1) {
				return true;
			} else {
				return false;
			}
		};

		const searchElements = (
			elements: HTMLCollectionOf<Element>,
			element: HTMLElement,
		) => {
			for (let i = 0; i < elements.length; i++) {
				if (elements[i] == element) {
					return { found: true, index: i };
				}
			}
			console.error("failed to find element");
			return { found: false, index: 0 };
		};

		const validateClass = (className: string) => {
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

		// console.log("generating path for: ", selectedElement);

		let path: PathType[] = [];
		let currentElement = selectedElement;
		let searchResult = { found: false, index: 0 };

		if (currentElement.tagName == "META") {
			let type = currentElement.getAttribute("property") ?? "";
			// if (type) type.splice(0, 3);
			path.push({ type: IdType.HEAD, value: type, index: 0 });
			return path;
		}

		while (currentElement != document.body) {
			// console.log("while generating: currentElement: ", currentElement);
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

			if (currentElement.parentElement) {
				path.push({
					type: IdType.INDEX,
					value: "",
					index: Array.from(currentElement.parentElement.children).indexOf(
						currentElement,
					),
				});
				currentElement = currentElement.parentElement;
			}
			continue;
		}

		return path.reverse();
	};

	function highlightElement(hoveredElement: HTMLElement) {
		if (!ctx || !hoveredElement) return;

		ClearCanvas();
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
		if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
	}

	const unsub1 = storeMessaging.subscribe((message) => {
		const action = message.action;
		const data = message.data;
		switch (action) {
			case Actions.StartInspect:
				storeMessaging.set({ action: Actions.ClosePopup });
				inspect();
				break;
			case Actions.FinishSelection:
				let treePath = generatePath($currentSelectedElement);
				console.log(treePath, document);
				let value = getElementValueFromPath(treePath, document);
				storeMessaging.set({
					action: Actions.ElementSelected,
					data: { path: treePath, value: value },
				});
				hoverSelecting = true;
				ClearCanvas();
				break;
			case Actions.CollectValues:
				CollectValues(data.fields, data.fromBackground);
				break;
			default:
				break;
		}
	});

	$: {
		highlightElement($currentSelectedElement);
	}

	const unsubscribe = () => {
		unsub1();
	};

	const CollectValues = async (fields: FieldsType, fromBackground: boolean) => {
		let values = [];

		if (!fromBackground) {
			values = collectValues(fields, document);
			storeMessaging.set({
				action: Actions.ValuesCollected,
				data: { values: values },
			});
			return;
		}

		let headDoc: Document;

		chrome.runtime.sendMessage({
			action: "fetchDocument",
		});

		const eventPromise = new Promise<Document>((resolve) => {
			chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
				if (message.action == "documentFetched") {
					console.log("fetched doc: ", message.data);
					const url = message.data;
					let parser = new DOMParser();
					const doc = parser.parseFromString(url, "text/html");
					resolve(doc);
				}
			});
		});

		// wait for background to fetch the updated document
		headDoc = await eventPromise;

		if (headDoc) values = collectValues(fields, document, headDoc);
		else values = collectValues(fields, document);

		storeMessaging.set({
			action: Actions.ValuesCollected,
			data: { values: values },
		});

		// console.log("collect value via url result: ", values)
		// let values = await collectValues(fields, document)
	};

	onMount(() => {
		detailIframe.onload = (ev) => {
			// detailIframe.style.all = "initial";

			let link = document.createElement("link");
			link.rel = "stylesheet";

			if (!import.meta.env.DEV)
				link.href = chrome.runtime.getURL("assets/svelteContent.css");
			else link.href = "src/app.css";

			const headElement = detailIframe.contentDocument?.querySelector("head");
			if (headElement) headElement.appendChild(link);

			if (detailIframe.contentWindow) {
				new DetailedSelector({
					target: detailIframe.contentWindow.document.body,
					//@ts-ignore
					props: { extensionId: { extensionId } },
				});
			}
		};
	});

	let detailIframeStyle = ``;
	$: {
		detailIframeStyle = `position: fixed;
		top: 10px;
		right: 10px;
		width: 260px;
		height: 600px;
		padding: 4px;
		display: ${hoverSelecting ? "none" : "block"};
		pointer-events: ${hoverSelecting ? "none" : "all"};
		z-index: 9999;
		background-color: transparent;
		border: none;`;
	}

	onDestroy(unsubscribe);
</script>

<!-- {#if selectedElement} -->
<iframe
	title="DetailedIframe"
	bind:this={detailIframe}
	style={`${detailIframeStyle}`}
></iframe>
<!-- <div>
		<DetailedSelector
			{extensionId}
			bind:selectedElement
			{getElementValueFromPath}
			{Highlighter}
		/>
	</div> -->
<!-- {/if} -->
