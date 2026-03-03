import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { SIZES, COLORS, PRICE_RANGES } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { Category } from '@/types';

interface ProductFiltersProps {
  priceRange: [number, number];
  onPriceChange: (range: [number, number]) => void;
  onClearFilters: () => void;
}

export function ProductFilters({
  priceRange,
  onPriceChange,
  onClearFilters,
}: ProductFiltersProps) {
  const [openSections, setOpenSections] = useState({
    price: true,
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const hasActiveFilters = priceRange[0] > 0 || priceRange[1] < 50000;

  return (
    <div className="space-y-6">
      {hasActiveFilters && (
        <Button variant="ghost" size="sm" onClick={onClearFilters} className="w-full">
          Clear All Filters
        </Button>
      )}

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
              max={50000}
              step={500}
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