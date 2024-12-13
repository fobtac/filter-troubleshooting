<script lang="ts">
    import type { Listing } from '$lib/server/db'
    let { listing }: { listing: Listing } = $props();
</script>

<div class="group relative drop-shadow-xl p-3">
    <a href={ listing.Href }>
    <div
        class="aspect-h-1 aspect-w-1 lg:aspect-video w-full overflow-hidden rounded-md drop-shadow-2xl bg-gray-200 group-hover:opacity-75"
    >
        
        <img src={listing.imageId} alt="listing" class="h-full w-full object-cover object-center" />    
        
    </div>
    </a>
    <div class="mt-4 flex justify-between">
        <div>
            <h3 class="text-sm font-bold text-gray-700">{listing.Name}</h3>
            <p class="mt-1 text-sm font-medium text-gray-500">
                Type: {listing.Property} <br>Neighborhood: {listing.Neighborhood} <br>Price: {listing.Price} <br>Bedrooms: {listing.Bedrooms} <br> Bathrooms: {listing.Bathrooms}
            </p>
        </div>
    </div>
</div>