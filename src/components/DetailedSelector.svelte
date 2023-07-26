<script lang="ts">
	export let extensionId;
	export let selectedElement;
	export let getElementValueFromPath;
	$: currentElement = selectedElement;
	let treePath;

	enum ElementType {
		TEXT,
		IMG,
	}

	$: elementType = determineNodeType(currentElement);
	$: elementValue = determineElementValue(currentElement);

	let selectableElements = [];
	let showChildren = false;
	let showSiblings = false;

	enum IdType {
		ID,
		CLASS,
		INDEX,
	}

	if (!import.meta.env.DEV) {
		chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
			if (request.action == "bgGetElement") {
				const value = getElementValueFromPath(request.path);
				if (value) {
					sendResponse({ success: true, value: value });
				} else {
					sendResponse({ success: false });
				}
			}
		});
	}

	const FinishSelection = () => {
		generatePath();
		let value = getElementValueFromPath(treePath);
		chrome.runtime.sendMessage({
			action: "elementSelected",
			path: treePath,
			value: value,
		});
		selectedElement = null;
	};

	const getParentElement = () => {
		if (currentElement.parentElement) {
			selectedElement = currentElement.parentElement;
		} else {
			return currentElement;
		}
	};

	if (!import.meta.env.DEV) {
		chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
			if (request.action == "bgElementSelected") {
				selectedElement = request.element;
				sendResponse({ success: true });
			}
		});
	}

	const generatePath = () => {
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

		treePath = path.reverse();
		console.log("treePath: ", treePath);
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

	const searchElements = (elements, element) => {
		for (let i = 0; i < elements.length; i++) {
			if (elements[i] == element) {
				return { found: true, index: i };
			}
		}
		console.error("failed to find element");
		return { found: false, index: 0 };
	};

	const CheckForDuplicateIds = (id) => {
		let elements = document.querySelectorAll("#" + id);
		if (elements.length > 1) {
			return false;
		} else {
			return true;
		}
	};

	const determineNodeType = (element) => {
		if (element.nodeName == "IMG") {
			return ElementType.IMG;
		} else {
			return ElementType.TEXT;
		}
	};

	const determineElementValue = (element) => {
		if (element.nodeName == "IMG") {
			return element.src;
		} else {
			return element.innerText;
		}
	};

	const getElementChildren = (element) => {
		let children = [];
		for (let i = 0; i < element.children.length; i++) {
			children.push(element.children[i]);
		}
		return children;
	};

	const getElementSiblings = (element) => {
		let siblings = [];
		for (let i = 0; i < element.parentElement.children.length; i++) {
			siblings.push(element.parentElement.children[i]);
		}
		return siblings;
	};

	const buttonStyle = `
        background-color: #363636;
        color: white;
        border-top: 1px solid #242424;
        border-left: 1px solid #3f3f3f;
        border-right: 1px solid #3f3f3f;
        box-shadow: 0 2px 5px -2px rgba(0,0,0,0.67);
        border-radius: 6px;
        padding: 0 20px 0 20px;
        align-items: center;
        height: 36px;
        cursor: pointer;
    `;

	const rootStyle = `
        all:initial; 
        display:flex; 
        background-color: #242424; 
        width: fit-content;
        border-radius: 6px; 
        font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
    `;

	const parentStyle = `
        display: flex;
        flex-direction: column;
        padding: 8px;
        gap: 12px;
    `;

	const imgContainer = `
        max-width: 250px;
        height: 250px;
        max-height: 250px;
    `;

	const imgElement = `
        max-width: 100%;
        max-height: 100%;
    `;

	const resultBox = `
        background-color: #1e1e1e;
        height:fit-content;
        padding:4px;
        margin-top:8px;
        min-height: 50px;
        max-width: 250px;
        max-height: 250px;
        overflow-y: auto;
        overflow-x: auto;
    `;

	const testSelectImage = () => {
		let imgTest = document.createElement("img");
		imgTest.src =
			"https://e.snmc.io/i/600/w/291a2a8451de99ede908023514823338/10297048/paramore-this-is-why-Cover-Art.jpg";
		imgTest.alt = "ParamoreTest";
		selectedElement = imgTest;
	};
	const testLongItem = () => {
		let longTest = document.createElement("p");
		longTest.innerText = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
        Donec euismod, nisl eget ultricies ultrices, nisl nisl aliquam nisl, vitae 
        aliquam nisl nisl vitae nisl. Donec euismod, nisl eget ultricies ultrices, 
        nisl nisl aliquam nisl, vitae aliquam nisl nisl vitae nisl. Donec euismod, 
        nisl eget ultricies ultrices, nisl nisl aliquam nisl, vitae aliquam nisl 
        nisl vitae nisl. Donec euismod, nisl eget ultricies ultrices, nisl nisl 
        aliquam nisl, vitae aliquam nisl nisl vitae nisl. Donec euismod, nisl eget 
        ultricies ultrices, nisl nisl aliquam nisl, vitae aliquam nisl nisl vitae nisl. 
        Donec euismod, nisl eget ultricies ultrices, nisl nisl aliquam nisl, vitae 
        aliquam nisl nisl vitae nisl. Donec euismod, nisl eget ultricies ultrices, 
        nisl nisl aliquam nisl, vitae aliquam nisl nisl vitae nisl. Donec euismod, 
        nisl eget ultricies ultrices, nisl nisl aliquam nisl, vitae aliquam nisl nisl vitae nisl.
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
        Donec euismod, nisl eget ultricies ultrices, nisl nisl aliquam nisl, vitae 
        aliquam nisl nisl vitae nisl. Donec euismod, nisl eget ultricies ultrices, 
        nisl nisl aliquam nisl, vitae aliquam nisl nisl vitae nisl. Donec euismod, 
        nisl eget ultricies ultrices, nisl nisl aliquam nisl, vitae aliquam nisl 
        nisl vitae nisl. Donec euismod, nisl eget ultricies ultrices, nisl nisl 
        aliquam nisl, vitae aliquam nisl nisl vitae nisl. Donec euismod, nisl eget 
        ultricies ultrices, nisl nisl aliquam nisl, vitae aliquam nisl nisl vitae nisl. 
        Donec euismod, nisl eget ultricies ultrices, nisl nisl aliquam nisl, vitae 
        aliquam nisl nisl vitae nisl. Donec euismod, nisl eget ultricies ultrices, 
        nisl nisl aliquam nisl, vitae aliquam nisl nisl vitae nisl. Donec euismod, 
        nisl eget ultricies ultrices, nisl nisl aliquam nisl, vitae aliquam nisl nisl vitae nisl.`;
		selectedElement = longTest;
	};
</script>

<div style={`${rootStyle}`}>
	<div style={`${parentStyle}`}>
		<div style="all:unset; color: white;">
			Result:
			<div id="resultBox" style={resultBox}>
				{#if elementType == ElementType.TEXT}
					<p>{elementValue}</p>
				{:else if elementType == ElementType.IMG}
					<div style={`${imgContainer}`}>
						<img
							style={`all:unset ${imgElement}`}
							src={elementValue}
							alt="selected"
						/>
					</div>
				{/if}
			</div>
		</div>
		<div style="all:unset; display: flex; gap:12px">
			<button style={`all:unset; ${buttonStyle}`} on:click={getParentElement}
				>Select Parent</button
			>
			<button style={`all:unset; ${buttonStyle}`} on:click={FinishSelection}
				>Done</button
			>
		</div>
	</div>
</div>

{#if import.meta.env.DEV}
	<button id="testButton" style={buttonStyle} on:click={testSelectImage}
		>Test Image</button
	>
	<button id="testButton" style={buttonStyle} on:click={testLongItem}
		>Test Long</button
	>
{/if}

<style>
	.no {
	}
</style>
