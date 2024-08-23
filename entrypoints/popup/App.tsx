import { createSignal } from "solid-js";
import solidLogo from "@/assets/solid.svg";
import wxtLogo from "/wxt.svg";
import "../styles.css";
import { css } from "@tokenami/css";

function App() {
	const [count, setCount] = createSignal(0);

	return (
		<>
			<div style={css({ "--padding": 20 })}>
				<a href="https://wxt.dev" target="_blank" rel="noreferrer">
					<img src={wxtLogo} class="logo" alt="WXT logo" />
				</a>
				<a href="https://solidjs.com" target="_blank" rel="noreferrer">
					<img src={solidLogo} class="logo solid" alt="Solid logo" />
				</a>
			</div>
			<h1>WXT + Solid</h1>
			<div class="card">
				<button type="button" onClick={() => setCount((count) => count + 1)}>
					{count()}
				</button>
			</div>
			<div>cmon</div>
		</>
	);
}

export default App;
