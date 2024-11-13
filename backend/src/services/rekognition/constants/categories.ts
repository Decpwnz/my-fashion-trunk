import { CategoryMapping } from '../interfaces/rekognition.interface';

export const CATEGORY_MAPPING: CategoryMapping = {
  allowed: {
    'Fashion accessories': ['Accessory', 'Jewelry', 'Watch', 'Belt', 'Scarf'],
    'All types of clothes': ['Clothing', 'Apparel', 'Dress', 'Shirt', 'Pants'],
    'All kinds of footwear': ['Shoe', 'Footwear', 'Boot', 'Sandal', 'Sneaker'],
    'Children toys': ['Toy', 'Game', 'Stuffed Toy', 'Doll', 'Puzzle'],
    'Tech accessories': ['Electronics', 'Headphone', 'Phone Case', 'Charger'],
    'Pet care products': ['Pet Supply', 'Pet Toy', 'Pet Accessory', 'Pet Care'],
  },
  prohibited: {
    'Food products': ['Food', 'Beverage', 'Drink', 'Snack'],
    'Cleaning products': ['Cleaning', 'Detergent', 'Soap', 'Sanitizer'],
    'Medical products': ['Medicine', 'Medical', 'Drug', 'Healthcare'],
    'Sporting goods': ['Sports Equipment', 'Exercise', 'Fitness'],
    'Vehicles and automotive parts': [
      'Vehicle',
      'Car',
      'Automotive',
      'Auto Part',
    ],
    'Natural by-products': ['Plant', 'Flower', 'Herb', 'Natural Product'],
  },
};

export const MIN_CONFIDENCE: number = 70;
