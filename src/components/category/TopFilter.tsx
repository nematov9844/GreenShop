import { Button, Select } from "antd";

interface TopFilterProps {
  activePath: string;
  setActivePath: (path: string) => void;
  sort: string;
  onSortChange: (sort: string) => void;
}

export default function TopFilter({ 
  activePath, 
  setActivePath,
  sort,
  onSortChange
}: TopFilterProps) {
  return (
    <div className="flex justify-between items-center mb-6 md:w-[60%] w-full ml-auto">
      <div className="flex gap-4">
        <Button 
          type={activePath === "all" ? "primary" : "link"} 
          className={activePath === "all" ? "bg-green" : "text-gray-500"}
          onClick={() => setActivePath("all")}
        >
          All Plants
        </Button>
        <Button type="link">New Arrivals</Button>
        <Button type="link">Sale</Button>
      </div>
      <Select
        value={sort}
        style={{ width: 200 }}
        onChange={onSortChange}
        options={[
          { value: 'default', label: 'Sort by: Default sorting' },
          { value: 'price_low', label: 'Price: Low to High' },
          { value: 'price_high', label: 'Price: High to Low' },
          { value: 'newest', label: 'Newest' },
        ]}
      />
    </div>
  );
} 