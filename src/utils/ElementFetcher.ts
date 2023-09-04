export const IdType = {
    ID : "id",
    CLASS: "class",
    INDEX: "index",
    HEAD: "head"

} as const

/** collect values from current doc on the dom. If headDoc is provided, it will fetch the meta elements from headDoc */
export const collectValues = (fields:[{path:[{type:string, value:string}], value:string}], doc:Document, headDoc?:Document) => {
    let values:string[] = [];

    // console.log("fields in fetcher: ", fields, "doc: ", doc);

    fields.forEach((field, index) => {
        // console.log("fetching field: ", field)
        let value;
        if(field.path){
            if(field.path[0].type == IdType.HEAD && headDoc) value = getElementValueFromPath(field.path, headDoc); 
            else value = getElementValueFromPath(field.path, doc);
        }
        else value = field.value;

        // console.log("each fetcher: ", value);

        values.push(value);
    });

    return values
}

export const fetchDocument = async (url:string) => {
    let doc:Document;

    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
    } as RequestInit;
      
    const res = await fetch(url, requestOptions)
    
    console.log("res body: ", res);

    const resText = await res.text()

    return resText
}

export const getElementValueFromPath = (path, document) => {

    const getHeaderElement = (type) => {
    
        switch(type){
            case "title":
                return document.querySelector('meta[property="og:title"]') as HTMLMetaElement;
            case "url":
                return document.querySelector('meta[property="og:url"]') as HTMLMetaElement;
            case "image":
                return document.querySelector('meta[property="og:image"]') as HTMLMetaElement;
    
        }
    }

    const determineElementValue = (element) => {
        console.log("determining element: ", element)
		if(element.nodeName == "META"){
			return element.content;
		}
		else if (element.nodeName == "IMG") {
			return element.src;
		} else {
			return element.innerText;
		}
	};

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
            case IdType.HEAD:
                return getHeaderElement(currentPath.value)
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
