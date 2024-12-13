<script lang="ts" >
    import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
    import ListingSkeleton from "$lib/components/ListingSkeleton.svelte";
    import Listing from "$lib/components/Listing.svelte";
    import type { Listing as TListing } from '$lib/server/db';
    import type { QueryResult } from '@upstash/vector';
    import ChevronDown from 'lucide-svelte/icons/chevron-down';
    import Filter from 'lucide-svelte/icons/filter';
    import debounce from "lodash.debounce";
    import * as Accordion from "$lib/components/ui/accordion"
    import { Slider } from "$lib/components/ui/slider"
	import { cn } from "$lib/utils";
	import ScrollArea from "$lib/components/ui/scroll-area/scroll-area.svelte";

	let form = $props();
    let userEmail = $state();
	let errorMessage = '';
    

    const BEDROOMS_SORT_OPTIONS = [
        { name: 'None', value: 'None' },
        { name: 'Size : Small to Large', value: 'Bedrooms-asc' },
        { name: 'Size : Large to Small ', value: 'Bedrooms-desc'}
    ] as const;

    const PRICE_SORT_OPTIONS = [
        { name: 'None', value: 'None' },
        { name: 'Size : Small to Large', value: 'Price-asc' },
        { name: 'Size : Large to Small ', value: 'Price-desc'}
    ] as const;
    

    const NEIGHBORHOOD_FILTERS = {
        id: 'Neighborhood',
        name: 'Neighborhood',
        options: [
            { value: 'Nob Hill', label: 'Nob Hill' },
            { value: 'Los Ranchos', label: 'Los Ranchos' },
            { value: 'Corrales', label: 'Corrales' }
        ] as const
    };
    const PROPERTY_FILTERS = {
        id: 'Property',
        name: 'Property',
        options: [
            { value: 'Home', label: 'Home' },
            { value: 'Condo', label: 'Condo' },
            { value: 'Townhouse', label: 'Townhouse' }
        ] 
    } as const;
    const BEDROOMS_FILTERS = {
        id: 'Bedrooms',
        name: 'Bedrooms',
        options: [
            { value: [0, 10], label: 'Any number' },
            { value: [1, 1], label: '1' },
            { value: [2, 2], label: '2' },
            { value: [3, 3], label: '3' },
            { value: [4, 10], label: '4 and above' },
        ]
    } as const;

    const DEFAULT_CUSTOM_BEDROOMS = [1, 10] as [number, number];

    const PRICE_FILTERS = {
        id: 'Price',
        name: 'Price',
        options: [
            { value: [0, 10000], label: 'Any Price' },
            { value: [0, 1999], label: 'Under $2000' },
            { value: [2000, 2999], label: '$2000 - $2999' },
            { value: [3000, 3999], label: '$3000 - $3999' },
            { value: [4000, 10000], label: '$4000 and above' },
        ]
    } as const;

    const DEFAULT_CUSTOM_PRICE = [1, 10000] as [number, number];

        let filter = $state({
            Neighborhood: ['Nob Hill', 'Los Ranchos', 'Corrales'],
            Bedrooms: { isCustom: false, range: DEFAULT_CUSTOM_BEDROOMS },
            Price: { isCustom: false, range: DEFAULT_CUSTOM_PRICE },
            Property: ['Home', 'Condo', 'Townhouse'],
            BedroomsSort: 'None',
            PriceSort: 'None'
        });

        function applyArrayFilter({
            category,
            value
        }: {
            category: keyof Omit<typeof filter, 'Bedrooms' | 'BedroomsSort' | 'Price' | 'PriceSort' >;
            value: string;
        }) {
            const isFilterApplied = filter[category].includes(value as never);
            if (isFilterApplied) {
                filter[category] = filter[category].filter((v) => v !== value) as typeof filter.Neighborhood &
                    typeof filter.Property;
            } else {
                filter[category].push(value as never);
            }
        }

        const minBedrooms = $derived(Math.min(filter.Bedrooms.range[0], filter.Bedrooms.range[1]));
        const maxBedrooms = $derived(Math.max(filter.Bedrooms.range[0], filter.Bedrooms.range[1]));

        const minPrice = $derived(Math.min(filter.Price.range[0], filter.Price.range[1]));
        const maxPrice = $derived(Math.max(filter.Price.range[0], filter.Price.range[1]));

        async function getListings() {
            const listings = (await (
                await fetch('http://localhost:5173/api/listings', {
                    method: 'POST',
                    body: JSON.stringify({
                        filter: {
                            BedroomsSort: filter.BedroomsSort,
                            PriceSort: filter.PriceSort,
                            Neighborhood: filter.Neighborhood,
                            Bedrooms: filter.Bedrooms.range,
                            Price: filter.Price.range,
                            Property: filter.Property
                        }
                    }),
                    headers: {
                        'content-type': 'application/json'
                    }
                })
            ).json()) as QueryResult<TListing>[];

            return listings;
        }

        const onSubmit = (range: number[]) => {
            const [newMin, newMax] = range;
            filter.Bedrooms = {
                isCustom: true,
                range: [newMin, newMax]
            };
            filter.Price = {
                isCustom: true,
                range: [newMin, newMax]
            };
        };

        const debouncedSubmit = debounce(onSubmit, 400);
</script>

<main class="grid font-baskerville bg-gradient-to-b from-blue-300 to-white">

    <section class="grid mt-32 row-start-2 max-w-7xl place-self-center z-20 px-7">
        <h1 class="grid text-6xl font-bold tracking-tight text-blue-900 place-self-center text-center pb-5 lg:p-10">
            Property Search
        </h1>
        <div class="grid grid-cols-1 gap-x-8 gap-y-10">

            <div class="block">

                <Accordion.Root multiple class="lg:grid-cols-4 lg:flex gap-16">
                    <Accordion.Item value="Neighborhood">
                        <Accordion.Trigger class="py-3 text-sm text-gray-400 hover:text-gray-500">
                            <span class="font-medium text-gray-900"> Neighborhood </span>
                        </Accordion.Trigger>
                        <Accordion.Content class="pt-6 ">
                            <ul class="space-y-4">
                                {#each NEIGHBORHOOD_FILTERS.options as { label, value }, id}
                                    <li class="flex items-center">
                                        <input
                                            type="checkbox"
                                            id={`Neighborhood-${id}`}
                                            class="size-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                            onchange={() =>
                                                applyArrayFilter({
                                                    category: 'Neighborhood',
                                                    value
                                                })}
                                            checked={filter.Neighborhood.includes(value)}
                                        />
                                        <label for={`Neighborhood-${id}`} class="ml-3 text-sm text-gray-600">
                                            {label}
                                        </label>
                                    </li>
                                {/each}
                            </ul>
                        </Accordion.Content>
                    </Accordion.Item>
                    <Accordion.Item value="Property">
                        <Accordion.Trigger class="py-3 text-sm text-gray-400 hover:text-gray-500">
                            <span class="font-medium text-gray-900"> Property </span>
                        </Accordion.Trigger>
                        <Accordion.Content class="pt-6 ">
                            <ul class="space-y-4">
                                {#each PROPERTY_FILTERS.options as { label, value }, id}
                                    <li class="flex items-center">
                                        <input
                                            type="checkbox"
                                            id={`Property-${id}`}
                                            class="size-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                            onchange={() =>
                                                applyArrayFilter({
                                                    category: 'Property',
                                                    value
                                                })}
                                            checked={filter.Property.includes(value)}
                                        />
                                        <label for={`size-${id}`} class="ml-3 text-sm text-gray-600">
                                            {label}
                                        </label>
                                    </li>
                                {/each}
                            </ul>
                        </Accordion.Content>
                    </Accordion.Item>
                    <Accordion.Item value="Bedrooms">
                        <Accordion.Trigger class="py-3 text-sm text-gray-400 hover:text-gray-500">
                            <span class="font-medium text-gray-900"> Bedrooms </span>
                        </Accordion.Trigger>
                        <Accordion.Content class="pt-6 ">
                            <ul class="space-y-4">
                                {#each BEDROOMS_FILTERS.options as { label, value }, id}
                                    <li class="flex items-center">
                                        <input 
                                            type="radio"
                                            id={`Bedrooms-${id}`}
                                            class="size-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                            onchange={() => {
                                                filter.Bedrooms = {
                                                    isCustom: false,
                                                    range: [...value]
                                                };
                                            }}
                                            checked={!filter.Bedrooms.isCustom &&
                                                filter.Bedrooms.range[0] === value[0] &&
                                                filter.Bedrooms.range[1] === value[1]}
                                        />
                                        <label for={`Bedrooms-${id}`} class="ml-3 text-sm text-gray-600">
                                            {label}
                                        </label>
                                    </li>
                                {/each}
                                
                            </ul>
                        </Accordion.Content>
                    </Accordion.Item>
                    <Accordion.Item value="Price">
                        <Accordion.Trigger class="py-3 text-sm text-gray-400 hover:text-gray-500">
                            <span class="font-medium text-gray-900"> Price </span>
                        </Accordion.Trigger>
                        <Accordion.Content class="pt-6 ">
                            <ul class="space-y-4">
                                {#each PRICE_FILTERS.options as { label, value }, id}
                                    <li class="flex items-center">
                                        <input 
                                            type="radio"
                                            id={`Price-${id}`}
                                            class="size-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                            onchange={() => {
                                                filter.Price = {
                                                    isCustom: false,
                                                    range: [...value]
                                                };
                                            }}
                                            checked={!filter.Price.isCustom &&
                                                filter.Price.range[0] === value[0] &&
                                                filter.Price.range[1] === value[1]}
                                        />
                                        <label for={`Price-${id}`} class="ml-3 text-sm text-gray-600">
                                            {label}
                                        </label>
                                    </li>
                                {/each}
                               
                            </ul>
                        </Accordion.Content>
                    </Accordion.Item>
                </Accordion.Root>
               
                <div class="flex items-center place-self-end mt-4">
                    <DropdownMenu.Root>
                        <DropdownMenu.Trigger
                            class="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900"
                            >Price Sort
                            <ChevronDown />
                        </DropdownMenu.Trigger>
                        <DropdownMenu.Content align="end">
                            {#each PRICE_SORT_OPTIONS as { name, value }}
                                <button
                                    onclick={() => {
                                        filter.PriceSort = value;
                                    }}
                                    class="block w-full p-2 px-4 text-left text-sm"
                                    class:text-gray-900={value === filter.PriceSort}
                                    class:bg-gray-100={value === filter.PriceSort}
                                    class:text-gray-500={value === filter.PriceSort}>{name}</button
                                >
                            {/each}
                        </DropdownMenu.Content>
                    </DropdownMenu.Root>

                </div>
            </div>
            <ScrollArea class="h-[1000px] w-auto rounded-md border bg-white mb-10">
                <ul class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4 lg:col-span-4">
                    {#await getListings()}
                        {#each { length: 24 } as _}
                            <ListingSkeleton />
                        {/each}
                    {:then listings}
                        {#each listings as listing}
                            <Listing listing={listing.metadata!} />
                        {/each}
                    {/await}
                </ul>
            </ScrollArea>
        </div>
    </section>
        <fieldset class="grid row-start-3 m-7 h-auto w-full lg:w-96 place-self-center">
            <h2 class="text-2xl lg:text-4xl mt-4 text-center text-black font-bold">
                Share this property!
            </h2>
            <form method="post" class="grid place-items-center">
                <div class="flex flex-col place-items-center gap-5 p-5 w-full">
                    <input name="userEmail" type="email" class="input border border-white bg-cyan-500 w-full max-w-md placeholder-white focus:border-white rounded-sm p-2" placeholder="Enter your Email..." required bind:value={userEmail} />
                </div>

                <button type="submit" class="btn bg-cyan-500 text-white rounded-3xl text-xl p-3 m-5 w-1/2 place-self-center hover:bg-cyan-300 text-center">Submit</button>

              </form>
        </fieldset>
</main>