export default function MyButton(props: {
	children: React.ReactNode;
	onClick: React.MouseEventHandler<HTMLButtonElement>;
}) {
	return (
		<button
			className={` py-2 px-4 rounded-md bg-obsidian-300 hover:bg-obsidian-350 w-fit `}
			onClick={props.onClick}
		>
			{props.children}
		</button>
	);
}
