import { type Listing, db } from '.';
import * as dotenv from 'dotenv';

dotenv.config();

const getRandomBedroom = () => {
	const BEDROOMS = [1, 2, 3, 4, 5];
	return BEDROOMS[Math.floor(Math.random() * BEDROOMS.length)];
};

const getRandomBathroom = () => {
	const BATHROOMS = [1, 2, 3, 4, 5];
	return BATHROOMS[Math.floor(Math.random() * BATHROOMS.length)];
};


const getRandomPrice = () => {
	const PRICE = [1000, 2000, 3000, 4000, 5000, 6000];
	return PRICE[Math.floor(Math.random() * PRICE.length)];
};

const NEIGHBORHOODS = ['Nob Hill', 'Los Ranchos', 'Corrales'] as const;
const PROPERTIES = ['Home', 'Condo', 'Townhouse'] as const;

const seed = async () => {
	const listings: Listing[] = [];

	// 3 example listings
	for (let i = 0; i < 3; i++) {
		for (let j = 0; j < NEIGHBORHOODS.length; j++) {
			for (let k = 0; k < PROPERTIES.length; k++) {
				const Property = PROPERTIES[k];
				const Neighborhood = NEIGHBORHOODS[j];
				listings.push({
					id: `${Neighborhood}-${Property}-${i + 1}`,
					imageId: `${Neighborhood}-${Property}-${i + 1}.webp`,
					Neighborhood,
					Name: `${Neighborhood.slice(0, 1).toUpperCase() + Neighborhood.slice(1)} ${Property} ${i + 1}`,
					Property,
					Bedrooms: getRandomBedroom(),
					Bathrooms: getRandomBathroom(),
					Price: getRandomPrice(),
					Href: `http://localhost:5173/${Neighborhood}/${Property}-${i + 1}`,
				});
			}
		}
	}

	const PROPERTY_MAP = {
		Home: 0,
		Condo: 1,
		Townhouse: 2
	};

	const NEIGHBORHOOD_MAP = {
		'Nob Hill': 0,
		'Los Ranchos': 1,
		'Corrales': 2,
	};

	await db.upsert(
		listings.map((listing) => ({
			id: listing.id,
			vector: [NEIGHBORHOOD_MAP[listing.Neighborhood], PROPERTY_MAP[listing.Property], listing.Bedrooms, listing.Price],
			metadata: listing
		}))
	);
};

seed();