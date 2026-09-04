import { Product, EquipmentProduct, IngredientProduct, CatalogFilterState, CatalogSortOption, ProductDomain } from '@/types/product';

export const EQUIPMENT_CATEGORIES = [
  { slug: 'all', label: 'Tất cả thiết bị' },
  { slug: 'espresso-machines', label: 'Máy Pha Cà Phê' },
  { slug: 'coffee-grinders', label: 'Máy Xay Cà Phê' },
  { slug: 'coffee-roasters', label: 'Máy Rang Cà Phê' },
  { slug: 'barista-gear', label: 'Dụng Cụ Barista' },
  { slug: 'accessories', label: 'Phụ Kiện & Bảo Dưỡng' },
];

export const INGREDIENT_CATEGORIES = [
  { slug: 'all', label: 'Tất cả nguyên liệu' },
  { slug: 'coffee-beans', label: 'Hạt Cà Phê Đặc Sản' },
  { slug: 'syrups', label: 'Siro Pha Chế 1883' },
  { slug: 'sauces', label: 'Sốt Cao Cấp' },
  { slug: 'powders', label: 'Bột & Cốt Đá Xay' },
  { slug: 'matcha', label: 'Matcha & Houjicha Uji' },
  { slug: 'tea', label: 'Trà Đặc Sản' },
  { slug: 'chocolate', label: 'Socola & Cacao' },
];

export const SORT_OPTIONS: { id: CatalogSortOption; label: string; domains: ProductDomain[] }[] = [
  { id: 'curated', label: 'Tuyển chọn Aura (Mặc định)', domains: ['equipment', 'ingredients'] },
  { id: 'price_asc', label: 'Giá: Thấp đến Cao', domains: ['equipment', 'ingredients'] },
  { id: 'price_desc', label: 'Giá: Cao đến Thấp', domains: ['equipment', 'ingredients'] },
  { id: 'newest', label: 'Mới nhất / Vụ mùa mới', domains: ['equipment', 'ingredients'] },
  { id: 'capacity', label: 'Quy mô & Công suất quán', domains: ['equipment'] },
  { id: 'cupping_desc', label: 'Điểm Cupping SCA cao nhất (85+)', domains: ['ingredients'] },
];

export const TRENDING_KEYWORDS = [
  'Sanremo Cafe Racer',
  'Cầu Đất Yellow Bourbon',
  'Matcha Uji',
  'Mahlkönig EK43S',
  'Siro 1883 Yuzu',
  'Giesen Roaster',
];

export function filterProducts(products: Product[], filters: CatalogFilterState): Product[] {
  return products.filter((p) => {
    // 1. Domain match
    if (p.domain !== filters.domain) return false;

    // 2. Category match
    if (filters.category && filters.category !== 'all' && p.category !== filters.category) {
      return false;
    }

    // 3. Search query match
    if (filters.searchQuery && filters.searchQuery.trim()) {
      const q = filters.searchQuery.toLowerCase().trim();
      const nameMatch = p.name.toLowerCase().includes(q);
      const brandMatch = p.brand.toLowerCase().includes(q);
      const descMatch = p.shortDescription.toLowerCase().includes(q);
      const skuMatch = p.sku ? p.sku.toLowerCase().includes(q) : false;

      let specMatch = false;
      if (p.domain === 'equipment') {
        const eq = p as EquipmentProduct;
        specMatch = Boolean(
          (eq.specs.boiler && eq.specs.boiler.toLowerCase().includes(q)) ||
          (eq.specs.power && eq.specs.power.toLowerCase().includes(q)) ||
          (eq.specs.groups && `${eq.specs.groups} group`.includes(q))
        );
      } else {
        const ing = p as IngredientProduct;
        specMatch = Boolean(
          (ing.origin && ing.origin.toLowerCase().includes(q)) ||
          (ing.subRegion && ing.subRegion.toLowerCase().includes(q)) ||
          (ing.flavorNotes && ing.flavorNotes.some((fn) => fn.toLowerCase().includes(q))) ||
          (ing.process && ing.process.toLowerCase().includes(q))
        );
      }

      if (!nameMatch && !brandMatch && !descMatch && !skuMatch && !specMatch) {
        return false;
      }
    }

    // 4. Price range match
    if (filters.minPrice !== undefined && p.price < filters.minPrice) return false;
    if (filters.maxPrice !== undefined && p.price > filters.maxPrice) return false;

    // 5. Brand filter
    if (filters.brand.length > 0 && !filters.brand.includes(p.brand)) {
      return false;
    }

    // 6. Domain-specific filters
    if (filters.domain === 'equipment') {
      const eq = p as EquipmentProduct;

      // Groups filter
      if (filters.groups.length > 0) {
        if (!eq.specs.groups || !filters.groups.includes(eq.specs.groups)) {
          return false;
        }
      }

      // Boiler filter
      if (filters.boiler.length > 0) {
        const b = eq.specs.boiler?.toLowerCase() || '';
        const match = filters.boiler.some((bf) => b.includes(bf.toLowerCase()));
        if (!match) return false;
      }

      // Voltage filter
      if (filters.voltage.length > 0) {
        const v = eq.specs.voltage;
        if (!v || !filters.voltage.some((vf) => v.includes(vf))) {
          return false;
        }
      }

      // Suitable for segment
      if (filters.suitableFor.length > 0) {
        const match = filters.suitableFor.some((sf) => eq.suitableFor?.includes(sf as any));
        if (!match) return false;
      }
    } else {
      const ing = p as IngredientProduct;

      // Origin filter
      if (filters.origin.length > 0) {
        const o = ing.origin || '';
        const match = filters.origin.some((of) => o.toLowerCase().includes(of.toLowerCase()));
        if (!match) return false;
      }

      // Roast profile
      if (filters.roast.length > 0) {
        if (!ing.roastProfile || !filters.roast.includes(ing.roastProfile)) {
          return false;
        }
      }

      // Cupping score
      if (filters.minCupping !== undefined) {
        if (!ing.cuppingScore || ing.cuppingScore < filters.minCupping) {
          return false;
        }
      }
    }

    return true;
  });
}

export function sortProducts(products: Product[], sort: CatalogSortOption): Product[] {
  const list = [...products];

  switch (sort) {
    case 'price_asc':
      return list.sort((a, b) => a.price - b.price);
    case 'price_desc':
      return list.sort((a, b) => b.price - a.price);
    case 'newest':
      return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    case 'capacity':
      return list.sort((a, b) => {
        const aGroups = (a as EquipmentProduct).specs?.groups || 0;
        const bGroups = (b as EquipmentProduct).specs?.groups || 0;
        return bGroups - aGroups;
      });
    case 'cupping_desc':
      return list.sort((a, b) => {
        const aScore = (a as IngredientProduct).cuppingScore || 0;
        const bScore = (b as IngredientProduct).cuppingScore || 0;
        return bScore - aScore;
      });
    case 'curated':
    default:
      return list.sort((a, b) => {
        if (a.isFeatured && !b.isFeatured) return -1;
        if (!a.isFeatured && b.isFeatured) return 1;
        return 0;
      });
  }
}
