import { Index } from '@upstash/vector';
import * as dotenv from 'dotenv';
dotenv.config();
export type Listing = {
    id: string;
    imageId: string;
    Name: string;
    Neighborhood: 'Nob Hill' | 'Los Ranchos' | 'Corrales';
    Property: 'Home' | 'Condo' | 'Townhouse';
    Bedrooms: number;
    Bathrooms: number;
    Price: number;
    Href: string;
};
export const db = new Index<Listing>();