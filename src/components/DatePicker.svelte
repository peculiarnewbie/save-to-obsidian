<script lang="ts">
    import dayjs from "dayjs";
    import dateBack from "../../public/dateBack.svg";
    import dateForward from "../../public/dateForward.svg"
    import CustomImage from "./CustomImage.svelte";
	import StickyModals from "./StickyModals.svelte";

    import { formTopLimit, formBottomLimit } from "../utils/stores";
    import { get } from "svelte/store";

    export let field;

    let today = dayjs("2023/08/25").format("YYYY-MM-DD");
    // console.log(today, typeof today)
    let currentDate = today;
    let currentMonth = dayjs().month();
    let currentYear = dayjs().year();

    let isEditing = false

    let dateElement: HTMLElement;
    let dateButton: HTMLElement;
    let rows = initRows();
    let startDay = 0;
    let endDay = 0;

    let topLimit = 0;
    let bottomLimit = 0;

    const dayNames = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"]

    const startEditing = (e) => {
        document.addEventListener("click", handleStartEditing);
        updateRows()

        //silly hack to show current day and selected
        changeMonth(1);
        changeMonth(-1);

        isEditing = !isEditing;
    }

    const handleStartEditing = (e) => {
        if(isEditing && !dateElement?.contains(e.target) && e.target != dateButton ){
            isEditing = false;
            currentDate = field.value;
            document.removeEventListener("click", handleStartEditing);
        }
    }

    const selectDate = (date, offset?:boolean ) => {
        if(offset) date < 15 ? changeMonth(1) : changeMonth(-1);
        currentDate = `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-${date.toString().padStart(2, '0')}`;

        field.value = currentDate;
        isEditing = false;
        document.removeEventListener("click", handleStartEditing);
    }


    function initRows() {
        return [
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0]
        ]
    }

    function updateRows() {
        rows = initRows();
        let date = dayjs(currentDate);
        let firstDay = date.startOf("month").day();
        let lastDay = date.endOf("month").date();
        let currentDay = 1;
        let currentRow = 0;
        let currentCol = firstDay;
        let tempRows = initRows();
        while(currentDay <= lastDay) {
            tempRows[currentRow][currentCol] = currentDay;
            currentDay++;
            currentCol++;
            if(currentCol == 7) {
                currentCol = 0;
                currentRow++;
            }
        }

        startDay = firstDay;
        endDay = 7*currentRow + currentCol

        let prevMonthLastDay = dayjs(currentDate).subtract(1, "month").endOf("month").date();
        for(let i = firstDay - 1; i >= 0; i--) {
            tempRows[0][i] = prevMonthLastDay;
            prevMonthLastDay--;
        }

        
        for(let i = 1 ; i < 42 - 7*currentRow + currentCol; i++) {
            tempRows[currentRow][currentCol] = i;
            currentCol++;
            if(currentCol == 7) {
                currentCol = 0;
                currentRow++;
            }
        }
        
        rows = tempRows;
    }

    function changeMonth(offset: number) {
        if(offset == 0) {
            currentDate = today;
            currentMonth = dayjs(currentDate).month();
            currentYear = dayjs(currentDate).year();
        }
        else if(offset > 0) {
            currentDate = dayjs(currentDate).add(1, "month").format("YYYY-MM-DD");
            currentMonth = dayjs(currentDate).month();
            currentYear = dayjs(currentDate).year();
        } else {
            currentDate = dayjs(currentDate).subtract(1, "month").format("YYYY-MM-DD");
            currentMonth = dayjs(currentDate).month();
            currentYear = dayjs(currentDate).year();
        }
        updateRows();
    }

    updateRows();

    field.value = currentDate;

    //For the floating sticky modals

    topLimit = get(formTopLimit)
    bottomLimit = get(formBottomLimit);

</script>

<button 
    bind:this={dateButton}
    on:click={startEditing}
    class=" shadow-md bg-[#363636] rounded-md hover:bg-[#4e4e4e] text-[#bababa] px-2"
    >
    {field.value}
</button>

{#if isEditing}
<StickyModals {topLimit} {bottomLimit} yOffset={24} xOffset={28}>
    <div bind:this={dateElement} class="left-12 flex flex-col text-base shadow-lg text-[#bababa] w-fit bg-[#363636] outline-none p-2 rounded-md">
        <div class="flex justify-between px-1">
            <div class="flex text-2xl">
                <p class="font-bold pr-1">{dayjs(currentDate).format("MMM")}</p>
                <p class="text-violet-500 font-semibold">{currentYear}</p>
            </div>
            <div class="flex justify-end">
                <button class="py-1 px-2 rounded-md hover:bg-[#4e4e4e] text-left" on:click={() => changeMonth(-1)}>
                    <CustomImage src={dateBack} alt="dateBack" width="7px"/>
                </button>
                <button class="py-1 px-2 rounded-md hover:bg-[#4e4e4e] text-xs font-semibold" on:click={() => changeMonth(0)}>TODAY</button>
                <button class="py-1 px-2 rounded-md hover:bg-[#4e4e4e] text-left" on:click={() => changeMonth(1)}>
                    <CustomImage src={dateForward} alt="dateForward" width="7px"/>
                </button>
            </div>
        </div>
        <div class="flex text-[10px] font-semibold justify-around pt-2">
            {#each dayNames as day}
                <p class="w-8 text-center">{day}</p>
            {/each}
        </div>
        {#each rows as col, rIndex}
            <tr class="flex h-8 text-sm">
                {#each col as i, cIndex}
                    <td>
                        <!-- date outside of current month -->
                        {#if (cIndex < startDay && rIndex == 0) || (rIndex*7 + cIndex) >= endDay} 
                            <button class="bg-[#363636] rounded-md hover:bg-[#3f3f3f] w-8 h-8 text-neutral-600" on:click={() => {selectDate(i, true)}}>{i}</button>
                        <!-- current selected date -->
                        {:else if (rIndex*7 + cIndex) == dayjs(field.value).date() + startDay - 1 && dayjs(field.value).month() == currentMonth && dayjs(field.value).year() == currentYear}
                            <button class="bg-violet-600 rounded-md hover:bg-[#4e4e4e] w-8 h-8 text-white" on:click={() => {selectDate(i)}}>{i}</button>
                        <!-- current date -->
                        {:else if (rIndex*7 + cIndex) == dayjs(today).date() + startDay - 1 && dayjs(today).month() == currentMonth && dayjs(today).year() == currentYear}
                            <button class="bg-[#363636] rounded-md hover:bg-[#4e4e4e] w-8 h-8 text-violet-500" on:click={() => {selectDate(i)}}>{i}</button>
                        {:else}
                            <button class={`bg-[#363636] rounded-md hover:bg-[#4e4e4e] w-8 h-8`} on:click={() => {selectDate(i)}}>{i}</button>
                        {/if}
                    </td>
                {/each}
            </tr>
        {/each}
    </div>
</StickyModals>
{/if}
