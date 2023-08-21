export default function sanitizeString(str) {
	return str.replace(/[<>:"/\\|?*]+/g, function (char) {
		switch (char) {
			case "<":
				return "(";
			case ">":
				return ")";
			case ":":
				return "-";
			case '"':
				return "'";
			case "/":
				return "_";
			case "\\":
				return "_";
			case "|":
				return "_";
			case "?":
				return "_";
			case "*":
				return "_";
			default:
				return "";
		}
	});
}
