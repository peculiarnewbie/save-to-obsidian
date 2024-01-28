function Header({ closePopup }: { closePopup: () => void }) {
	return (
		<div className=" plasmo-flex plasmo-justify-between">
			<div>Header</div>
			<button onClick={() => closePopup()}>Close</button>
		</div>
	);
}

export default Header;
