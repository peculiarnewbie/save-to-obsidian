<script lang="ts">
	import { get } from "svelte/store";
	import StickyModals from "../StickyModals.svelte";
	import { InputEnum, type FieldInputKeys } from "../../utils/FieldInputType";
	import { HeaderTypes, docHeaders } from "../../utils/stores";
	import { IdType } from "../../utils/ElementFetcher";
	import HoverMenu from "../HoverMenu.svelte";
	import Icons, { icons } from "../Icons.svelte";

	export let changingType = false;
	export let menuTarget;
	export let field;

	export let inspect;
	export let deleteField;

	export let iconName;
	export let updateIcon;

	let typeMenu;

	const changeFieldType = (type) => {
		field.type = type;
		updateIcon(type);

		changingType = false;
	};

	const selectHead = (type: HeaderTypes) => {
		let header: HTMLMetaElement;
		let path: string;
		switch (type) {
			case HeaderTypes.Title:
				header = get(docHeaders).title;
				path = "title";
				break;
			case HeaderTypes.URL:
				header = get(docHeaders).url;
				path = "url";
				break;
			case HeaderTypes.Image:
				header = get(docHeaders).image;
				path = "image";
				break;
		}
		field.value = header.content;
		field.path = [{ type: IdType.HEAD, value: path }];
		field.type = type;

		updateIcon(type);

		changingType = false;
	};
</script>

<StickyModals
	needToFlip={false}
	defaultLimits={true}
	{menuTarget}
	bind:isActive={changingType}
>
	<div
		bind:this={typeMenu}
		class="flex flex-col font-normal text-base text-left shadow-lg text-white w-fit min-w-[40px] bg-[#262626] outline-none rounded-md p-2 border border-[#3f3f3f]"
	>
		<HoverMenu iconName={icons.paragraph} buttonText="Property type"
			><div
				class="flex flex-col font-normal text-base text-left shadow-lg text-white w-fit min-w-[40px] bg-[#262626] outline-none rounded-md p-2 border border-[#3f3f3f]"
			>
				<button
					class="flex gap-2 items-center hover:bg-[#363636] px-2 py-[2px] rounded-md w-32"
					on:click={() => changeFieldType(InputEnum.Text)}
				>
					<div class=" h-4 w-4">
						<Icons iconName={icons.text}></Icons>
					</div>
					<p>Text</p>
				</button>
				<button
					class="flex gap-2 items-center hover:bg-[#363636] px-2 py-[2px] rounded-md w-32"
					on:click={() => changeFieldType(InputEnum.Date)}
				>
					<div class=" h-4 w-4">
						<Icons iconName={icons.date}></Icons>
					</div>
					<p>Date</p>
				</button>
				<!-- <button
					class="p-1 rounded-md hover:bg-[#363636] text-left"
					on:click={() => changeFieldType(InputEnum.List)}>List</button
				>
				<button
					class="p-1 rounded-md hover:bg-[#363636] text-left"
					on:click={() => changeFieldType(InputEnum.MultiList)}
					>MultiList</button
				> -->
			</div></HoverMenu
		>
		<HoverMenu iconName={icons.header} buttonText="Header">
			<div
				class="flex flex-col font-normal text-base text-left shadow-lg text-white w-fit min-w-[40px] bg-[#262626] outline-none rounded-md p-2 border border-[#3f3f3f]"
			>
				<button
					class="flex gap-2 items-center hover:bg-[#363636] px-2 py-[2px] rounded-md w-32"
					on:click={() => selectHead(HeaderTypes.Title)}
				>
					<div class=" h-4 w-4">
						<Icons iconName={icons.title}></Icons>
					</div>
					<p>Title</p>
				</button>
				<button
					class="flex gap-2 items-center hover:bg-[#363636] px-2 py-[2px] rounded-md w-32"
					on:click={() => selectHead(HeaderTypes.URL)}
				>
					<div class=" h-4 w-4">
						<Icons iconName={icons.url}></Icons>
					</div>
					<p>URL</p>
				</button>
				<button
					class="flex gap-2 items-center hover:bg-[#363636] px-2 py-[2px] rounded-md w-32"
					on:click={() => selectHead(HeaderTypes.Image)}
				>
					<div class=" h-4 w-4">
						<Icons iconName={icons.image}></Icons>
					</div>
					<p>Image</p>
				</button>
			</div>
		</HoverMenu>
		<button
			class="text-left hover:bg-[#363636] w-full flex p-1 rounded-md justify-between gap-3 items-center h-7"
			on:click={() => {
				changingType = false;
				inspect();
			}}
		>
			<div class="flex gap-2 items-center">
				<div class=" h-4 w-4">
					<Icons iconName={icons.inspect}></Icons>
				</div>
				<p>Element</p>
			</div>
		</button>
		<button
			class="text-left hover:bg-[#363636] w-full flex p-1 rounded-md justify-between gap-3 items-center h-7"
			on:click={() => {
				changingType = false;
				deleteField();
			}}
		>
			<div class="flex gap-2 items-center">
				<div class=" h-4 w-4">
					<Icons iconName={icons.bin}></Icons>
				</div>
				<p>Remove</p>
			</div>
		</button>
	</div>
</StickyModals>
