export default function MyButton(props: {
	children: React.ReactNode;
	onClick: React.MouseEventHandler<HTMLButtonElement>;
	accented?: boolean;
	warning?: boolean;
	wfull?: boolean;
	onMouseEnter?: React.MouseEventHandler<HTMLButtonElement>;
	onMouseLeave?: React.MouseEventHandler<HTMLButtonElement>;
}) {
	return (
		<button
			className={`input-shadow hover:hover-shadow rounded-md px-4 py-2 
			${
				props.warning
					? "bg-red-500 hover:bg-red-400"
					: props.accented
						? " bg-accent-500 hover:bg-accent-550"
						: "bg-obsidian-300 hover:bg-obsidian-350"
			} ${props.wfull ? "w-full" : "w-fit"} `}
			onClick={props.onClick}
			onMouseEnter={props.onMouseEnter}
			onMouseLeave={props.onMouseLeave}
		>
			{props.children}
		</button>
	);
}
