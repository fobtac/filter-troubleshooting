import { z } from 'zod'

export const AVAILABLE_PROPERTIES = ['Home', 'Condo', 'Townhouse'] as const;
export const AVAILABLE_NEIGHBORHOODS = ['Nob Hill', 'Los Ranchos', 'Corrales'] as const;
export const AVAILABLE_BEDROOMS_SORT = ['None', 'Bedrooms-asc', 'Bedrooms-desc'] as const;
export const AVAILABLE_PRICE_SORT = ['None', 'Price-asc', 'Price-desc'] as const;

export const ListingFilterValidator = z.object({
    Property: z.array(z.enum(AVAILABLE_PROPERTIES)),
    Neighborhood: z.array(z.enum(AVAILABLE_NEIGHBORHOODS)),
    BedroomsSort: z.enum(AVAILABLE_BEDROOMS_SORT),
    PriceSort: z.enum(AVAILABLE_PRICE_SORT),
    Bedrooms: z.tuple([z.number(), z.number()]),
    Price: z.tuple([z.number(), z.number()])
});

export type ListingState = Omit<z.infer<typeof ListingFilterValidator>, 'Bedrooms' | 'Price'> & {
    Bedrooms: { isCustom: boolean; range: [number, number] };
    Price: { isCustom: boolean; range: [number, number ] };
};