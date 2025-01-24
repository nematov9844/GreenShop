import { Select } from 'antd';
const { Option } = Select;

interface TopFilterProps {
  selectedCategory: string;
  onSortChange: (value: string) => void;
  categoryName: string;
}

export default function TopFilter({  onSortChange, categoryName }: TopFilterProps) {
  return (
    <div className="mb-8 flex justify-between items-center">
      <h2 className="text-2xl font-bold">{categoryName}</h2>
      <div className="flex gap-4">
        <Select
          defaultValue=""
          style={{ width: 200 }}
          onChange={onSortChange}
        >
          <Option value="">Default Sorting</Option>
          <Option value="price_asc">Price Low to High</Option>
          <Option value="price_desc">Price High to Low</Option>
          <Option value="newest">Newest</Option>
        </Select>
      </div>
    </div>
  );
} 