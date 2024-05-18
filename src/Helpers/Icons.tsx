export const IconsKeys = {
	Select: "select",
	Delete: "delete",
} as const;

export type IconsType = (typeof IconsKeys)[keyof typeof IconsKeys];

export default function Icons(props: { name: IconsType; className?: string }) {
	let Icon;
	switch (props.name) {
		case IconsKeys.Select:
			Icon = <SelectIconPath />;
			break;
		case IconsKeys.Delete:
			Icon = <DeleteIconPath />;
			break;
		default:
			break;
	}

	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			className="lucide lucide-square-mouse-pointer"
		>
			{Icon}
		</svg>
	);
}

export const SelectIconPath = () => (
	<>
		<path d="M21 11V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h6" />
		<path d="m12 12 4 10 1.7-4.3L22 16Z" />
	</>
);

const DeleteIconPath = () => (
	<>
		<path d="M3 6h18" />
		<path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
		<path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
		<line x1="10" x2="10" y1="11" y2="17" />
		<line x1="14" x2="14" y1="11" y2="17" />
	</>
);
