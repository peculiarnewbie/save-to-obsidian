import "../styles.css";
import { css } from "@tokenami/css";

export default function Container() {
	return (
		<div
			style={css({
				"--padding": 20,
				"--background-color": "var(--color_primary)",
			})}
		>
			container
		</div>
	);
}
