<script lang="ts">
	import { onDestroy, onMount } from "svelte";
    import { formScroll, formTopLimit } from "../utils/stores";

    export let needToFlip = true;
    export let topLimit = 70;
    export let bottomLimit = 700;
    export let yOffset = 0;
    export let xOffset = 0;
    export let menuTarget = null;
    
    let divHeight = 0;
    let formScrollValue = 0;
    let thisElement: HTMLElement;

    function getcurrentScroll(){return formScrollValue}
    let yTransform = 0;
    let initScroll = 0;
    let initTop = 0;

    let mounted = false;

    $: {
        if(mounted){
            const temp = formScrollValue;
            outputPos()
        }
    }

    onMount(() => {
        if(menuTarget) menuTarget.appendChild(thisElement);
        const rect = thisElement.getBoundingClientRect()
        divHeight = rect.height;
        initTop = rect.top - formScrollValue;
        initScroll = yTransform = getcurrentScroll()
        mounted = true;
    })

    function outputPos(){
        const bottomPos = initTop + divHeight + (initScroll - formScrollValue)
        // console.log("formScrollValue: ", formScrollValue, "initScroll: ", initScroll, "initTop: ", initTop, "bottomPos: ", bottomPos)
        // console.log("topLimit: ", topLimit, "botLimit: ", bottomLimit)
        if(formScrollValue - initScroll > initTop - topLimit){
            // console.log("exceed top");
            yTransform = initTop + initScroll - topLimit;
        }
        else if(bottomPos > bottomLimit){
            // console.log("exceed bot");
            if(bottomPos < bottomLimit + divHeight + yOffset && needToFlip){
                yTransform = formScrollValue + divHeight + yOffset;
            }
            else{
                yTransform = formScrollValue + bottomPos - bottomLimit;
            }
        }
        else{
            yTransform = formScrollValue;
        }
    }

    const unsubscribe = formScroll.subscribe((value) => {
        formScrollValue = value;
    })

    onDestroy(unsubscribe)
</script>


<div class="absolute overscroll-none p-2" bind:this={thisElement} style={`will-change:transform; transform: translate3d(${xOffset}px, ${yOffset-yTransform}px, 0px); z-index: 9999999`}>
    <slot/>
</div>