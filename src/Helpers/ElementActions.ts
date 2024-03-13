import {
	IdType,
	type FieldType,
	type PathStep,
	type PageElementType,
} from "~types";

export const generatePath = (selectedElement: HTMLElement) => {
	// choose id as identifier if no duplicates found
	const CheckForDuplicateIds = (id: string) => {
		let elements: NodeListOf<Element>;
		try {
			elements = document.querySelectorAll("#" + id);
			if (elements.length == 1) return true;
		} catch (e) {
			return false;
		}
		return false;
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

	// choose class as identifier if it's a single class and less than 40 characters long
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

	let path: PathStep[] = [];
	let searchResult = { found: false, index: 0 };

	let currentElement = selectedElement;

	if (currentElement?.tagName == "META") {
		let type = currentElement.getAttribute("property") ?? "";
		// if (type) type.splice(0, 3);
		path.push({ type: IdType.Header, value: type, index: 0 });
		return path;
	}

	while (currentElement != document.body) {
		// console.log("while generating: currentElement: ", currentElement);
		if (currentElement.id) {
			if (CheckForDuplicateIds(currentElement.id)) {
				path.push({
					type: IdType.Id,
					value: currentElement.id,
					index: 0,
				});
				break;
			}
		} else if (
			currentElement.className != "" &&
			!(currentElement instanceof SVGElement) // this is incredibly silly
		) {
			if (validateClass(currentElement.className)) {
				let queriedElements = document.getElementsByClassName(
					currentElement.className,
				);
				if (queriedElements.length < 5) {
					searchResult = searchElements(
						queriedElements,
						currentElement,
					);
					path.push({
						type: IdType.Class,
						value: currentElement.className,
						index: searchResult.index,
					});
					break;
				}
			}
		}

		if (currentElement.parentElement) {
			path.push({
				type: IdType.Index,
				value: "",
				index: Array.from(
					currentElement.parentElement.children,
				).indexOf(currentElement),
			});
			currentElement = currentElement.parentElement;
		}
		continue;
	}

	return path.reverse();
};

export const getElementValueFromPath = (
	path: PathStep[] | undefined,
	document: Document,
) => {
	const getHeaderElement = (type: string) => {
		switch (type) {
			case "title":
				return document.querySelector(
					'meta[property="og:title"]',
				) as HTMLMetaElement;
			case "url":
				return document.querySelector(
					'meta[property="og:url"]',
				) as HTMLMetaElement;
			case "image":
				return document.querySelector(
					'meta[property="og:image"]',
				) as HTMLMetaElement;
		}
	};

	const determineElementValue = (element: Element) => {
		if (!element) return;
		console.log("determining element: ", element);
		if (element.nodeName == "META" && element instanceof HTMLMetaElement) {
			return element.content;
		} else if (
			element.nodeName == "IMG" &&
			element instanceof HTMLImageElement
		) {
			return element.src;
		} else if (element instanceof HTMLElement) {
			return element.innerText;
		}
		// ============ should we handle other Element types??
	};

	const getElementFromCurrentPath = (
		currentPath: PathStep,
		currentElement: Element,
	) => {
		if (!currentElement) return;
		switch (currentPath.type) {
			case IdType.Id:
				return currentElement.querySelectorAll("#" + currentPath.value)[
					currentPath.index
				];
			case IdType.Class:
				return currentElement.querySelectorAll("." + currentPath.value)[
					currentPath.index
				];
			case IdType.Index:
				return currentElement.children[currentPath.index];
			case IdType.Header:
				return getHeaderElement(currentPath.value);
		}
	};

	if (!path || path.length < 1) {
		return "";
	}

	let element: Element;
	element = getElementFromCurrentPath(path[0], document.body) as Element;

	for (let i = 1; i < path.length; i++) {
		if (element) {
			element = getElementFromCurrentPath(path[i], element) as Element;
		}
	}

	return determineElementValue(element) ?? "";
};

/** collect values from current doc on the dom. If headDoc is provided, it will fetch the meta elements from headDoc */
export const collectValues = (
	pageElements: PageElementType[],
	doc: Document,
	headDoc?: Document,
) => {
	let newPageElements = [...pageElements];
	// console.log("fields in fetcher: ", fields, "doc: ", doc);

	newPageElements.forEach((element, index) => {
		let value: string;
		if (element.path[0].type == IdType.Header && headDoc)
			value = getElementValueFromPath(element.path, headDoc);
		else value = getElementValueFromPath(element.path, doc);

		newPageElements[index].value = value;
	});

	return newPageElements;
};

export const fetchDocument = async (url: string) => {
	let doc: Document;

	var requestOptions = {
		method: "GET",
		redirect: "follow",
	} as RequestInit;

	const res = await fetch(url, requestOptions);

	console.log("res body: ", res);

	const resText = await res.text();

	return resText;
};
