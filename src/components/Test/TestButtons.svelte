<script lang="ts">
	export let selectedElement;

	const buttonStyle = `
        background-color: #363636;
        color: white;
        border-top: 1px solid #242424;
        border-left: 1px solid #3f3f3f;
        border-right: 1px solid #3f3f3f;
        box-shadow: 0 2px 5px -2px rgba(0,0,0,0.67);
        border-radius: 6px;
        padding: 0 20px 0 20px;
        align-items: center;
        height: 36px;
        cursor: pointer;
    `;

	const testSelectImage = () => {
		let imgTest = document.createElement("img");
		imgTest.src =
			"https://e.snmc.io/i/600/w/291a2a8451de99ede908023514823338/10297048/paramore-this-is-why-Cover-Art.jpg";
		imgTest.alt = "ParamoreTest";
		selectedElement = imgTest;
	};
	const testLongItem = () => {
		let longTest = document.createElement("p");
		longTest.innerText = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
        Donec euismod, nisl eget ultricies ultrices, nisl nisl aliquam nisl, vitae 
        aliquam nisl nisl vitae nisl. Donec euismod, nisl eget ultricies ultrices, 
        nisl nisl aliquam nisl, vitae aliquam nisl nisl vitae nisl. Donec euismod, 
        nisl eget ultricies ultrices, nisl nisl aliquam nisl, vitae aliquam nisl 
        nisl vitae nisl. Donec euismod, nisl eget ultricies ultrices, nisl nisl 
        aliquam nisl, vitae aliquam nisl nisl vitae nisl. Donec euismod, nisl eget 
        ultricies ultrices, nisl nisl aliquam nisl, vitae aliquam nisl nisl vitae nisl. 
        Donec euismod, nisl eget ultricies ultrices, nisl nisl aliquam nisl, vitae 
        aliquam nisl nisl vitae nisl. Donec euismod, nisl eget ultricies ultrices, 
        nisl nisl aliquam nisl, vitae aliquam nisl nisl vitae nisl. Donec euismod, 
        nisl eget ultricies ultrices, nisl nisl aliquam nisl, vitae aliquam nisl nisl vitae nisl.
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
        Donec euismod, nisl eget ultricies ultrices, nisl nisl aliquam nisl, vitae 
        aliquam nisl nisl vitae nisl. Donec euismod, nisl eget ultricies ultrices, 
        nisl nisl aliquam nisl, vitae aliquam nisl nisl vitae nisl. Donec euismod, 
        nisl eget ultricies ultrices, nisl nisl aliquam nisl, vitae aliquam nisl 
        nisl vitae nisl. Donec euismod, nisl eget ultricies ultrices, nisl nisl 
        aliquam nisl, vitae aliquam nisl nisl vitae nisl. Donec euismod, nisl eget 
        ultricies ultrices, nisl nisl aliquam nisl, vitae aliquam nisl nisl vitae nisl. 
        Donec euismod, nisl eget ultricies ultrices, nisl nisl aliquam nisl, vitae 
        aliquam nisl nisl vitae nisl. Donec euismod, nisl eget ultricies ultrices, 
        nisl nisl aliquam nisl, vitae aliquam nisl nisl vitae nisl. Donec euismod, 
        nisl eget ultricies ultrices, nisl nisl aliquam nisl, vitae aliquam nisl nisl vitae nisl.`;
		selectedElement = longTest;
	};

	const testDownload = () => {
		let content = "# This is a markdown file\n\nThis is some content.";
		let blob = new Blob([content], { type: "text/markdown" });
		let url = URL.createObjectURL(blob);

		let link = document.createElement("a");
		link.href = url;
		link.download = "Obsidian/file.md";
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};
</script>

<br />
<div>
	<button style={buttonStyle} on:click={testSelectImage}> Test Image </button>
	<button style={buttonStyle} on:click={testLongItem}> Test Long </button>
</div>
<br />
<button type="button" style={buttonStyle} on:click={testDownload}>
	Download
</button>
