import { db } from '$lib/server/db/index.js'
import { ListingFilterValidator } from '$lib/validators/product-validator';
import { json } from '@sveltejs/kit'
class Filter {
    private filters: Map<string, string[]> = new Map();

    hasFilter() {
        return this.filters.size > 0;
    }

    add(key: string, operator: string, value: string | number) {
        const filter = this.filters.get(key) || [];
        filter.push(`${key} ${operator} ${typeof value === 'number' ? value : `"${value}"`}`);
        this.filters.set(key, filter);
    }

    addRaw(key: string, rawFilter: string) {
        this.filters.set(key, [rawFilter]);
    }

    get() {
        const parts: string[] = [];
        this.filters.forEach((filter) => {
            const groupedValues = filter.join(` OR `);
            parts.push(`(${groupedValues})`);
        });
        return parts.join(' AND ');
    }
}

const AVG_LISTING_BEDROOMS = 5;
const MAX_LISTING_BEDROOMS = 10;

const AVG_LISTING_PRICE = 3000;
const MAX_LISTING_PRICE = 9999;

export const POST = async ({ request }) => {
    const body = await request.json();
    const { Neighborhood, Bedrooms, Price, Property, BedroomsSort, PriceSort } = ListingFilterValidator.parse(body.filter);
    const filter = new Filter();

    if (Neighborhood.length > 0) Neighborhood.forEach((Neighborhood) => filter.add('Neighborhood', '=', Neighborhood));
    else if (Neighborhood.length === 0) filter.addRaw('Neighborhood', `Neighborhood = ""`)

    if (Property.length > 0) Property.forEach((Property) => filter.add('Property', '=', Property));
    else if (Property.length === 0) filter.addRaw('Property', `Property = ""`)

    filter.addRaw('Bedrooms', `Bedrooms >= ${Bedrooms[0]} AND Bedrooms <= ${Bedrooms[1]}`);
    filter.addRaw('Price', `Price >= ${Price[0]} AND Price <= ${Price[1]}`);    
    const listings = await db.query({
        topK: 24,
        vector: [
            0, 
            0, 
            BedroomsSort === 'None' ? AVG_LISTING_BEDROOMS : BedroomsSort === 'Bedrooms-asc' ? 0 : MAX_LISTING_BEDROOMS,
            PriceSort === 'None' ? AVG_LISTING_PRICE : PriceSort === 'Price-asc' ? 0 : MAX_LISTING_PRICE
        ],
        includeMetadata: true,
        filter: filter.hasFilter() ? filter.get() : undefined
    });
    return json(listings);
};