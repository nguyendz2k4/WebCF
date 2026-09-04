export type ProductDomain = 'equipment' | 'ingredients';

export type EquipmentCategory =
  | 'espresso-machines'
  | 'coffee-grinders'
  | 'coffee-roasters'
  | 'barista-gear'
  | 'accessories';

export type IngredientCategory =
  | 'coffee-beans'
  | 'syrups'
  | 'sauces'
  | 'powders'
  | 'matcha'
  | 'chocolate'
  | 'tea'
  | 'other';

export type ProductCategory = EquipmentCategory | IngredientCategory;

export interface BaseProduct {
  id: string;
  slug: string;
  sku?: string;
  domain: ProductDomain;
  name: string;
  brand: string;
  shortDescription: string;
  price: number;
  formattedPrice: string;
  priceType: 'fixed' | 'from' | 'contact';
  images: string[];
  inStock: boolean;
  leadTime?: string;
  isFeatured?: boolean;
  createdAt: string;
}

export interface EquipmentProduct extends BaseProduct {
  domain: 'equipment';
  category: EquipmentCategory;
  specs: {
    groups?: number;
    boiler?: string;
    boilerCapacity?: string;
    pump?: string;
    power?: string;
    voltage?: '220V' | '380V' | '220V/380V';
    dimensions?: string;
    weight?: string;
    warranty: string;
    dailyCapacity?: string;
  };
  suitableFor: ('home' | 'boutique-cafe' | 'high-volume' | 'roastery' | 'lab')[];
}

export interface IngredientProduct extends BaseProduct {
  domain: 'ingredients';
  category: IngredientCategory;
  origin?: string;
  subRegion?: string;
  altitude?: string;
  process?: string;
  roastProfile?: 'Light' | 'Medium' | 'Medium-Dark' | 'Dark';
  cuppingScore?: number;
  flavorNotes?: string[];
  packaging: {
    unitSize: string; // e.g. "1kg", "750ml", "Hộp 1kg"
    caseSize?: string; // e.g. "Thùng 6 chai", "Thùng 12 gói"
  };
  shelfLife?: string;
}

export type Product = EquipmentProduct | IngredientProduct;

export type CatalogSortOption =
  | 'curated'
  | 'price_asc'
  | 'price_desc'
  | 'newest'
  | 'capacity'
  | 'cupping_desc';

export interface CatalogFilterState {
  domain: ProductDomain;
  category?: string;
  brand: string[];
  origin: string[];
  roast: ('Light' | 'Medium' | 'Medium-Dark' | 'Dark')[];
  groups: number[];
  boiler: string[];
  voltage: ('220V' | '380V')[];
  suitableFor: string[];
  minPrice?: number;
  maxPrice?: number;
  minCupping?: number;
  searchQuery?: string;
  sort: CatalogSortOption;
  page: number;
  view: 'grid' | 'list';
}

export interface CatalogUrlState {
  domain?: 'equipment' | 'ingredients';
  category?: string;
  brand?: string[];
  origin?: string[];
  roast?: string[];
  groups?: number[];
  boiler?: string[];
  voltage?: string[];
  min_price?: number;
  max_price?: number;
  min_cupping?: number;
  sort?: CatalogSortOption;
  page?: number;
  view?: 'grid' | 'list';
  q?: string;
}
