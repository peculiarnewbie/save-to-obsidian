import { useEffect } from "react";
import type { PageElementType } from "~types";

function PageElement({
	pageElement,
	index,
}: {
	pageElement: PageElementType;
	index: number;
}) {
	useEffect(() => {
		console.log(pageElement);
	}, []);
	return (
		<div>
			<div>{index}</div>
			<div>{pageElement.value}</div>
		</div>
	);
}

export default PageElement;
