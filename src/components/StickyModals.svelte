<script lang="ts">
	import { onDestroy, onMount } from "svelte";
    import { formScroll } from "../utils/stores";

    export let topLimit = 40;
    export let bottomLimit = 660;
    export let divHeight = 272;

    let formScrollValue = 0;
    
    let thisElement: HTMLElement;

    function getcurrentScroll(){return formScrollValue}
    let xTransform = 0;
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
        const rect = thisElement.getBoundingClientRect()
        initTop = rect.top - formScrollValue;
        initScroll = xTransform = getcurrentScroll()
        mounted = true;
    })

    function outputPos(){
        const bottomPos = initTop + divHeight + (initScroll - formScrollValue)
        console.log("formScrollValue: ", formScrollValue, "initScroll: ", initScroll, "initTop: ", initTop, "bottomPos: ", bottomPos)
        if(formScrollValue - initScroll > initTop - topLimit){
            xTransform = initTop + initScroll - topLimit
        }
        else if(bottomPos > bottomLimit){
            if(bottomPos < bottomLimit + divHeight + 35){
                xTransform = formScrollValue + divHeight + 35
            }
            else{
                xTransform = formScrollValue + bottomPos - bottomLimit
            }
        }
        else{
            xTransform = formScrollValue;
        }
    }

    const unsubscribe = formScroll.subscribe((value) => {
        formScrollValue = value;
    })

    onDestroy(unsubscribe)
</script>


<div class="absolute" bind:this={thisElement} style={`will-change:transform; transform: translate3d(0px, ${32 - xTransform}px, 0px);`}>
    <slot/>
</div>