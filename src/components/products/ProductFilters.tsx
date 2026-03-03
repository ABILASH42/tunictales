import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';

const SIZES = ['M', 'L', 'XL', 'XXL'];

interface ProductFiltersProps {
  selectedSizes: string[];
  priceRange: [number, number];
  onSizesChange: (sizes: string[]) => void;
  onPriceChange: (range: [number, number]) => void;
  onClearFilters: () => void;
}

export function ProductFilters({
  selectedSizes,
  priceRange,
  onSizesChange,
  onPriceChange,
  onClearFilters,
}: ProductFiltersProps) {
  const [openSections, setOpenSections] = useState({
    size: true,
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

  const hasActiveFilters = selectedSizes.length > 0 || priceRange[0] > 0 || priceRange[1] < 5000;

  return (
    <div className="space-y-6">
      {hasActiveFilters && (
        <Button variant="ghost" size="sm" onClick={onClearFilters} className="w-full">
          Clear All Filters
        </Button>
      )}

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
              max={5000}
              step={100}
              className="mb-4"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Rs. {priceRange[0].toLocaleString()}</span>
              <span>Rs. {priceRange[1].toLocaleString()}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
