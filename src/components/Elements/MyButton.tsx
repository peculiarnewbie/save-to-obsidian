export default function MyButton(props: {
	children: React.ReactNode;
	onClick: React.MouseEventHandler<HTMLButtonElement>;
	accented?: boolean;
	warning?: boolean;
}) {
	return (
		<button
			className={`input-shadow hover:hover-shadow w-fit rounded-md px-4 py-2 
			${
				props.warning
					? "bg-red-500 hover:bg-red-400"
					: props.accented
						? " bg-accent-500 hover:bg-accent-550"
						: "bg-obsidian-300 hover:bg-obsidian-350"
			} `}
			onClick={props.onClick}
		>
			{props.children}
		</button>
	);
}
