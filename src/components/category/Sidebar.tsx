import { Radio, Slider } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useCallback, useRef } from 'react';

interface CategoryType {
  name: string;
  path: string;
  count?: number;
}

interface SidebarProps {
  categories: CategoryType[];
  selectedCategory: string;
  range_min: number;
  range_max: number;
  onPriceChange: (value: [number, number]) => void;
  onCategoryChange: (value: string) => void;
}

export default function Sidebar({ 
  categories, 
  selectedCategory, 
  range_min, 
  range_max, 
  onPriceChange,
  onCategoryChange 
}: SidebarProps) {
  const navigate = useNavigate();
  const debounceTimer = useRef<NodeJS.Timeout>();

  const handlePriceChange = useCallback((value: [number, number]) => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    
    debounceTimer.current = setTimeout(() => {
      onPriceChange(value);
    }, 500);
  }, [onPriceChange]);

  const handleCategoryChange = (value: string) => {
    onCategoryChange(value);
    navigate(`/category/${value}`, { replace: true });
  };

  return (
    <div className="w-64 flex-shrink-0">
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Categories</h3>
        <Radio.Group 
          value={selectedCategory}
          onChange={(e) => handleCategoryChange(e.target.value)}
          className="flex flex-col gap-2"
        >
          {categories.map(cat => (
            <Radio key={cat.path} value={cat.path}>
              {cat.name} ({cat.count || 0})
            </Radio>
          ))}
        </Radio.Group>
      </div>

      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Price Range</h3>
        <Slider
          range
          min={0}
          max={1000}
          value={[range_min, range_max]}
          onChange={()=>handlePriceChange}
        />
        <div className="flex justify-between mt-2">
          <span>${range_min}</span>
          <span>${range_max}</span>
        </div>
      </div>
    </div>
  );
} 