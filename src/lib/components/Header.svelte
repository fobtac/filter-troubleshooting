<script>
    import { onMount } from 'svelte';
    import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
    import Menu from 'lucide-svelte/icons/menu';
    

    /**
	 * @type {any}
	 */
    let innerWidth;
</script>

<svelte:window bind:innerWidth />

{#if innerWidth > 768}
<nav class="font-baskerville flex text-white fixed top-0 bg-gray-700 transition-colors duration-300 w-full h-24 z-50">
    <div class="flex place-self-center place-items-center gap-12 ml-5">
        <a href="/" class="btn btn-ghost normal-case lg:text-4xl">Home</a>
        <a href="/properties" class="btn btn-ghost normal-case text-lg">Properties</a>
        
    </div>
</nav>

{:else if innerWidth < 768}
<div class="font-baskerville grid grid-cols-3 grid-rows-1 dropdown w-full fixed top-0 bg-gray-700 px-2 py-5 z-50">
  <DropdownMenu.Root>
    <DropdownMenu.Trigger class="grop inline-flex text-sm font-medium self-center"><Menu /></DropdownMenu.Trigger>
    <DropdownMenu.Content class="text-white bg-gray-700">
      <DropdownMenu.Group>
        <DropdownMenu.Item class="hover:none"><a href="/">Home</a></DropdownMenu.Item>
        <DropdownMenu.Item><a href="/about">About Us</a></DropdownMenu.Item>
        <DropdownMenu.Item><a href="/properties">Properties</a></DropdownMenu.Item>
        <DropdownMenu.Item><a href="/property-management-services">Property Management Services</a></DropdownMenu.Item>
        <DropdownMenu.Item><a href="/concierge-and-cleaning">Concierge And Cleaning</a></DropdownMenu.Item>
        <DropdownMenu.Item><a href="/contact">Contact Us</a></DropdownMenu.Item>
      </DropdownMenu.Group>
    </DropdownMenu.Content>
  </DropdownMenu.Root>
  <a href="/" class="btn btn-ghost text-sm normal-case place-self-end text-white font-bold text-center">Southwest Suites<br><span class="text-xs fonr-normal">Boutique Corporate Housing | Est. 1989</span></a>
</div>
{/if}

