'use client';

import React, { useState, useMemo, useCallback, useTransition } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Product, ProductDomain, CatalogFilterState, CatalogSortOption } from '@/types/product';
import { filterProducts, sortProducts } from './catalogUtils';
import { CatalogHeader } from './CatalogHeader';
import { CatalogSearchBar } from './CatalogSearchBar';
import { CategorySubBar } from './CategorySubBar';
import { EditorialFilterRail } from './EditorialFilterRail';
import { ActiveFilterChips } from './ActiveFilterChips';
import { SortControl } from './SortControl';
import { ProductGrid } from './ProductGrid';
import { QuickSpecDrawer } from './QuickSpecDrawer';
import { CatalogPagination } from './CatalogPagination';
import { EmptyCatalogState } from './EmptyCatalogState';
import { MobileFilterDrawer } from './MobileFilterDrawer';

const ITEMS_PER_PAGE = 12;

export const CatalogClientView: React.FC<{ products: Product[] }> = ({ products }) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  // Derive filters directly from URL SearchParams (Single Source of Truth)
  const filters: CatalogFilterState = useMemo(() => {
    const domain = (searchParams.get('domain') as ProductDomain) || 'equipment';
    const category = searchParams.get('category') || 'all';
    const brand = searchParams.get('brand') ? searchParams.get('brand')!.split(',').filter(Boolean) : [];
    const origin = searchParams.get('origin') ? searchParams.get('origin')!.split(',').filter(Boolean) : [];
    const roast = (searchParams.get('roast')
      ? searchParams.get('roast')!.split(',').filter(Boolean)
      : []) as ('Light' | 'Medium' | 'Medium-Dark' | 'Dark')[];
    const groups = searchParams.get('groups')
      ? searchParams.get('groups')!.split(',').filter(Boolean).map(Number)
      : [];
    const boiler = searchParams.get('boiler') ? searchParams.get('boiler')!.split(',').filter(Boolean) : [];
    const voltage = (searchParams.get('voltage')
      ? searchParams.get('voltage')!.split(',').filter(Boolean)
      : []) as ('220V' | '380V')[];
    const suitableFor = searchParams.get('suitableFor')
      ? searchParams.get('suitableFor')!.split(',').filter(Boolean)
      : [];
    const minPrice = searchParams.get('min_price')
      ? Number(searchParams.get('min_price'))
      : undefined;
    const maxPrice = searchParams.get('max_price')
      ? Number(searchParams.get('max_price'))
      : undefined;
    const minCupping = searchParams.get('min_cupping')
      ? Number(searchParams.get('min_cupping'))
      : undefined;
    const searchQuery = searchParams.get('q') || '';
    const sort = (searchParams.get('sort') as CatalogSortOption) || 'curated';
    const page = searchParams.get('page') ? Number(searchParams.get('page')) : 1;
    const view = (searchParams.get('view') as 'grid' | 'list') || 'grid';

    return {
      domain,
      category,
      brand,
      origin,
      roast,
      groups,
      boiler,
      voltage,
      suitableFor,
      minPrice,
      maxPrice,
      minCupping,
      searchQuery,
      sort,
      page,
      view,
    };
  }, [searchParams]);

  // Quick Spec Drawer State
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Mobile Filter Drawer State
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Helper to commit state changes to URL
  const updateUrl = useCallback(
    (updates: Partial<CatalogFilterState>, resetPage = true) => {
      const next: CatalogFilterState = {
        ...filters,
        ...updates,
        page: resetPage ? 1 : updates.page || filters.page,
      };

      const params = new URLSearchParams();

      if (next.domain !== 'equipment') params.set('domain', next.domain);
      if (next.category && next.category !== 'all') params.set('category', next.category);
      if (next.brand.length > 0) params.set('brand', next.brand.join(','));
      if (next.origin.length > 0) params.set('origin', next.origin.join(','));
      if (next.roast.length > 0) params.set('roast', next.roast.join(','));
      if (next.groups.length > 0) params.set('groups', next.groups.join(','));
      if (next.boiler.length > 0) params.set('boiler', next.boiler.join(','));
      if (next.voltage.length > 0) params.set('voltage', next.voltage.join(','));
      if (next.suitableFor.length > 0) params.set('suitableFor', next.suitableFor.join(','));
      if (next.minPrice !== undefined) params.set('min_price', next.minPrice.toString());
      if (next.maxPrice !== undefined) params.set('max_price', next.maxPrice.toString());
      if (next.minCupping !== undefined) params.set('min_cupping', next.minCupping.toString());
      if (next.searchQuery) params.set('q', next.searchQuery);
      if (next.sort !== 'curated') params.set('sort', next.sort);
      if (next.page > 1) params.set('page', next.page.toString());
      if (next.view !== 'grid') params.set('view', next.view);

      const qs = params.toString();
      const targetUrl = qs ? `${pathname}?${qs}` : pathname;

      if (params.toString() === searchParams.toString()) return;

      startTransition(() => {
        router.replace(targetUrl, { scroll: false });
      });
    },
    [filters, pathname, router, searchParams]
  );

  // Domain Switch Handler
  const handleDomainChange = (domain: ProductDomain) => {
    updateUrl({
      domain,
      category: 'all',
      brand: [],
      origin: [],
      roast: [],
      groups: [],
      boiler: [],
      voltage: [],
      suitableFor: [],
      minPrice: undefined,
      maxPrice: undefined,
      minCupping: undefined,
      searchQuery: '',
      sort: 'curated',
      page: 1,
    });
  };

  // Category change
  const handleCategoryChange = (category: string) => {
    updateUrl({ category });
  };

  // Search query change
  const handleSearchChange = useCallback((searchQuery: string) => {
    updateUrl({ searchQuery });
  }, [updateUrl]);

  // Sort change
  const handleSortChange = (sort: CatalogSortOption) => {
    updateUrl({ sort }, false);
  };

  // View change (grid / list)
  const handleViewChange = (view: 'grid' | 'list') => {
    updateUrl({ view }, false);
  };

  // Pagination page change
  const handlePageChange = (page: number) => {
    updateUrl({ page }, false);
  };

  // Remove single active filter chip
  const handleRemoveFilter = (key: keyof CatalogFilterState, value?: any) => {
    if (key === 'searchQuery') {
      updateUrl({ searchQuery: '' });
    } else if (key === 'minPrice' || key === 'maxPrice') {
      updateUrl({ minPrice: undefined, maxPrice: undefined });
    } else if (key === 'minCupping') {
      updateUrl({ minCupping: undefined });
    } else if (Array.isArray(filters[key])) {
      const currentList = filters[key] as any[];
      const updated = currentList.filter((item) => item !== value);
      updateUrl({ [key]: updated });
    }
  };

  // Reset all filters (preserves active domain)
  const handleResetAll = () => {
    updateUrl({
      category: 'all',
      brand: [],
      origin: [],
      roast: [],
      groups: [],
      boiler: [],
      voltage: [],
      suitableFor: [],
      minPrice: undefined,
      maxPrice: undefined,
      minCupping: undefined,
      searchQuery: '',
      sort: 'curated',
      page: 1,
    });
  };

  // Quick Spec Drawer open handler
  const handleOpenQuickSpec = (product: Product) => {
    setSelectedProduct(product);
    setIsDrawerOpen(true);
  };

  // Compute active filter count
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.category && filters.category !== 'all') count++;
    if (filters.brand.length > 0) count += filters.brand.length;
    if (filters.origin.length > 0) count += filters.origin.length;
    if (filters.roast.length > 0) count += filters.roast.length;
    if (filters.groups.length > 0) count += filters.groups.length;
    if (filters.boiler.length > 0) count += filters.boiler.length;
    if (filters.voltage.length > 0) count += filters.voltage.length;
    if (filters.suitableFor.length > 0) count += filters.suitableFor.length;
    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) count++;
    if (filters.minCupping !== undefined) count++;
    if (filters.searchQuery) count++;
    return count;
  }, [filters, products]);

  // Filtered and Sorted Products
  const filteredProducts = useMemo(() => {
    return filterProducts(products, filters);
  }, [filters, products]);

  const sortedProducts = useMemo(() => {
    return sortProducts(filteredProducts, filters.sort);
  }, [filteredProducts, filters.sort]);

  // Paginated Slice
  const totalCount = sortedProducts.length;
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);
  const paginatedProducts = useMemo(() => {
    const start = (filters.page - 1) * ITEMS_PER_PAGE;
    return sortedProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [sortedProducts, filters.page]);

  // Featured flagship recommendations for empty recovery
  const featuredFlagships = useMemo(() => {
    return products.filter((p) => p.domain === filters.domain && p.isFeatured);
  }, [filters.domain, products]);

  return (
    <section className="min-h-screen bg-[var(--cream-base)]">
      {/* 1. Chapter Header & Domain Switcher */}
      <CatalogHeader
        activeDomain={filters.domain}
        onDomainChange={handleDomainChange}
        totalCount={totalCount}
      />

      {/* 2. Utility Control Bar: Search & Sub-Navigation */}
      <div className="border-b border-[var(--cream-shadow)] py-4 bg-[var(--cream-base)]">
        <div className="max-w-[var(--container-max)] mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-4">
          <CatalogSearchBar
            value={filters.searchQuery || ''}
            onChange={handleSearchChange}
            domain={filters.domain}
            products={products.filter((p) => p.domain === filters.domain)}
            onSelectCategory={handleCategoryChange}
            onOpenQuickSpec={handleOpenQuickSpec}
          />
        </div>
      </div>

      {/* 3. Horizontal Category Sub-Bar */}
      <CategorySubBar
        domain={filters.domain}
        activeCategory={filters.category || 'all'}
        onSelectCategory={handleCategoryChange}
        allProducts={products}
      />

      {/* 4. Main Catalog Content Area (Left Editorial Rail + Product Grid) */}
      <main className="max-w-[var(--container-max)] mx-auto px-6 md:px-12 py-10">
        <div className="flex gap-10 lg:gap-14">
          {/* Desktop Left Editorial Filter Rail */}
          <div className="hidden lg:block">
            <EditorialFilterRail
              filters={filters}
              onFilterChange={(updates) => updateUrl(updates)}
              onResetAll={handleResetAll}
              allProducts={products}
            />
          </div>

          {/* Right Product Listing Area */}
          <div className="flex-1 min-w-0">
            {/* Active Filter Chips */}
            <ActiveFilterChips
              filters={filters}
              onRemoveFilter={handleRemoveFilter}
              onResetAll={handleResetAll}
            />

            {/* Sort & View Control Bar */}
            <SortControl
              domain={filters.domain}
              sort={filters.sort}
              onSortChange={handleSortChange}
              view={filters.view}
              onViewChange={handleViewChange}
              totalCount={totalCount}
              onOpenMobileFilter={() => setIsMobileFilterOpen(true)}
              activeFilterCount={activeFilterCount}
            />

            {/* Product Grid or Empty State */}
            {paginatedProducts.length > 0 ? (
              <>
                <ProductGrid
                  products={paginatedProducts}
                  view={filters.view}
                  onOpenQuickSpec={handleOpenQuickSpec}
                />

                {/* Editorial Pagination */}
                <CatalogPagination
                  currentPage={filters.page}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </>
            ) : (
              <EmptyCatalogState
                onResetFilters={handleResetAll}
                featuredProducts={featuredFlagships}
                onOpenQuickSpec={handleOpenQuickSpec}
              />
            )}
          </div>
        </div>
      </main>

      {/* Quick Spec Slide-over Drawer */}
      <QuickSpecDrawer
        product={selectedProduct}
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          setSelectedProduct(null);
        }}
      />

      {/* Mobile Filter Drawer (Responsive Bottom Sheet) */}
      <MobileFilterDrawer
        isOpen={isMobileFilterOpen}
        onClose={() => setIsMobileFilterOpen(false)}
        filters={filters}
        onFilterChange={(updates) => updateUrl(updates)}
        onResetAll={handleResetAll}
        allProducts={products}
        matchingCount={filteredProducts.length}
      />
    </section>
  );
};
