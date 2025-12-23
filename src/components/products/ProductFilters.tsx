import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { SIZES, COLORS, PRICE_RANGES } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { Category } from '@/types';

interface ProductFiltersProps {
  categories: Category[];
  selectedCategory?: string;
  selectedSizes: string[];
  selectedColors: string[];
  priceRange: [number, number];
  onCategoryChange: (category: string | undefined) => void;
  onSizesChange: (sizes: string[]) => void;
  onColorsChange: (colors: string[]) => void;
  onPriceChange: (range: [number, number]) => void;
  onClearFilters: () => void;
}

export function ProductFilters({
  categories,
  selectedCategory,
  selectedSizes,
  selectedColors,
  priceRange,
  onCategoryChange,
  onSizesChange,
  onColorsChange,
  onPriceChange,
  onClearFilters,
}: ProductFiltersProps) {
  const [openSections, setOpenSections] = useState({
    category: true,
    size: true,
    color: true,
    price: true,
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const toggleSize = (size: string) => {
    if (selectedSizes.includes(size)) {
      onSizesChange(selectedSizes.filter(s => s !== size));
    } else {
      onSizesChange([...selectedSizes, size]);
    }
  };

  const toggleColor = (color: string) => {
    if (selectedColors.includes(color)) {
      onColorsChange(selectedColors.filter(c => c !== color));
    } else {
      onColorsChange([...selectedColors, color]);
    }
  };

  const hasActiveFilters = selectedCategory || selectedSizes.length > 0 || selectedColors.length > 0 || priceRange[0] > 0 || priceRange[1] < 1000;

  return (
    <div className="space-y-6">
      {hasActiveFilters && (
        <Button variant="ghost" size="sm" onClick={onClearFilters} className="w-full">
          Clear All Filters
        </Button>
      )}

      {/* Categories */}
      <div className="border-b border-border pb-4">
        <button
          onClick={() => toggleSection('category')}
          className="flex items-center justify-between w-full py-2 font-medium"
        >
          Categories
          <ChevronDown className={cn('h-4 w-4 transition-transform', openSections.category && 'rotate-180')} />
        </button>
        {openSections.category && (
          <div className="mt-2 space-y-2">
            <button
              onClick={() => onCategoryChange(undefined)}
              className={cn(
                'block w-full text-left py-1 text-sm transition-colors',
                !selectedCategory ? 'text-accent font-medium' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              All Products
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => onCategoryChange(cat.slug)}
                className={cn(
                  'block w-full text-left py-1 text-sm transition-colors',
                  selectedCategory === cat.slug ? 'text-accent font-medium' : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {cat.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Sizes */}
      <div className="border-b border-border pb-4">
        <button
          onClick={() => toggleSection('size')}
          className="flex items-center justify-between w-full py-2 font-medium"
        >
          Size
          <ChevronDown className={cn('h-4 w-4 transition-transform', openSections.size && 'rotate-180')} />
        </button>
        {openSections.size && (
          <div className="mt-2 flex flex-wrap gap-2">
            {SIZES.map(size => (
              <button
                key={size}
                onClick={() => toggleSize(size)}
                className={cn(
                  'px-3 py-1 text-sm border rounded-sm transition-colors',
                  selectedSizes.includes(size)
                    ? 'border-accent bg-accent text-accent-foreground'
                    : 'border-border hover:border-accent'
                )}
              >
                {size}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Colors */}
      <div className="border-b border-border pb-4">
        <button
          onClick={() => toggleSection('color')}
          className="flex items-center justify-between w-full py-2 font-medium"
        >
          Color
          <ChevronDown className={cn('h-4 w-4 transition-transform', openSections.color && 'rotate-180')} />
        </button>
        {openSections.color && (
          <div className="mt-2 flex flex-wrap gap-2">
            {COLORS.map(color => (
              <button
                key={color.name}
                onClick={() => toggleColor(color.name)}
                className={cn(
                  'w-8 h-8 rounded-full border-2 transition-all',
                  selectedColors.includes(color.name)
                    ? 'border-accent ring-2 ring-accent ring-offset-2'
                    : 'border-border hover:border-accent'
                )}
                style={{ backgroundColor: color.hex }}
                title={color.name}
              />
            ))}
          </div>
        )}
      </div>

      {/* Price */}
      <div>
        <button
          onClick={() => toggleSection('price')}
          className="flex items-center justify-between w-full py-2 font-medium"
        >
          Price
          <ChevronDown className={cn('h-4 w-4 transition-transform', openSections.price && 'rotate-180')} />
        </button>
        {openSections.price && (
          <div className="mt-4 px-2">
            <Slider
              value={priceRange}
              onValueChange={(value) => onPriceChange(value as [number, number])}
              min={0}
              max={1000}
              step={10}
              className="mb-4"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>${priceRange[0]}</span>
              <span>${priceRange[1]}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}