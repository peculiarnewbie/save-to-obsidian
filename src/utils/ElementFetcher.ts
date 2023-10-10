import {
	IdType,
	type FieldsType,
	type PathType,
	type HeaderTypeKeys,
} from "./types";

/** collect values from current doc on the dom. If headDoc is provided, it will fetch the meta elements from headDoc */
export const collectValues = (
	fields: FieldsType,
	doc: Document,
	headDoc?: Document,
) => {
	let values: string[] = [];

	// console.log("fields in fetcher: ", fields, "doc: ", doc);

	fields.forEach((field, index) => {
		// console.log("fetching field: ", field)
		let value: string;
		if (field.path) {
			if (field.path[0].type == IdType.HEAD && headDoc)
				//@ts-ignore
				value = getElementValueFromPath(field.path, headDoc);
			//@ts-ignore
			else value = getElementValueFromPath(field.path, doc);
		} else value = field.value;

		// console.log("each fetcher: ", value);

		values.push(value);
	});

	return values;
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

export const getElementValueFromPath = (
	path: PathType[],
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

	const determineElementValue = (
		element: HTMLElement | HTMLMetaElement | HTMLImageElement,
	) => {
		if (!element) return;
		console.log("determining element: ", element);
		if (element.nodeName == "META" && element instanceof HTMLMetaElement) {
			return element.content;
		} else if (
			element.nodeName == "IMG" &&
			element instanceof HTMLImageElement
		) {
			return element.src;
		} else {
			return element.innerText;
		}
	};

	const getElementFromCurrentPath = (
		currentPath: PathType,
		currentElement: Element,
	) => {
		if (!currentElement) return;
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
			case IdType.HEAD:
				return getHeaderElement(currentPath.value);
		}
	};

	if (!path) {
		return "";
	}

	let element: Element | undefined;
	element = getElementFromCurrentPath(path[0], document.body);

	for (let i = 1; i < path.length; i++) {
		if (element) {
			element = getElementFromCurrentPath(path[i], element);
		}
	}

	//@ts-ignore
	return determineElementValue(element);
};
