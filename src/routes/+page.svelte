<script lang="ts">
    import { onMount } from 'svelte';
    $: innerWidth = 0;

        /**
	 * @type {any}
	 */
     let scrollY=0;

    const handleWindowScroll = () => {
        scrollY = window.scrollY;
    };



</script>

<svelte:window bind:innerWidth on:scroll={handleWindowScroll} />

<div class="font-baskerville grid grid-cols-1 grid-rows-[100vh_auto_auto] lg:grid-rows-[100vh_auto_auto] overflow-hidden text-white">
<h1>home</h1>
</div>


