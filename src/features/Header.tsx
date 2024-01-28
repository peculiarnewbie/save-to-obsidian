function Header({ closePopup }: { closePopup: () => void }) {
	return (
		<>
			<div>Header</div>
			<button onClick={() => closePopup()}>Close</button>
		</>
	);
}

export default Header;
