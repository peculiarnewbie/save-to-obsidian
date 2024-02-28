export default function MyButton(props: {
	children: React.ReactNode;
	onClick: React.MouseEventHandler<HTMLButtonElement>;
	accented?: boolean;
}) {
	return (
		<button
			className={` py-2 px-4 rounded-md  w-fit input-shadow hover:hover-shadow ${props.accented ? " bg-accent-500 hover:bg-accent-550" : "bg-obsidian-300 hover:bg-obsidian-350"} `}
			onClick={props.onClick}
		>
			{props.children}
		</button>
	);
}
