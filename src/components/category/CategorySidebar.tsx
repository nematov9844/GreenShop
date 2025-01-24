import { Button, Slider } from "antd";

interface CategoryType {
  count: number;
  title: string;
  route_path: string;
}

interface CategorySidebarProps {
  categoryData: CategoryType[];
  activePath: string;
  setActivePath: (path: string) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  filterProductsByPrice: () => void;
  allProductsCount: number;
}

export default function CategorySidebar({
  categoryData,
  activePath,
  setActivePath,
  priceRange,
  setPriceRange,
  filterProductsByPrice,
}: CategorySidebarProps) {
  return (
    <div className="w-[260px] flex-shrink-0">
      {/* Categories */}
      <div className="mb-8">
        <h3 className="font-medium mb-4">Categories</h3>
        <div className="flex flex-col gap-2">
     
          {categoryData?.map((category) => (
            <button
              key={category.route_path}
              onClick={() => setActivePath(category.route_path)}
              className={`flex justify-between items-center text-left py-1 hover:text-green ${
                activePath === category.route_path ? "text-green font-medium" : ""
              }`}
            >
              <span>{category.title}</span>
              <span className="text-gray-500">({String(Math.abs(category.count))})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="mb-8">
        <h3 className="font-medium mb-4">Price Range</h3>
        <Slider
          range
          defaultValue={[0, 100]}
          min={0}
          max={100}
          onChange={(value: number[]) => setPriceRange(value as [number, number])}
        />
        <div className="flex justify-between mt-2">
          <span>${priceRange[0]}</span>
          <span>${priceRange[1]}</span>
        </div>
        <Button 
          className="mt-4 w-full" 
          onClick={() => {
            filterProductsByPrice();
          }}
        >
          Filter
        </Button>
      </div>

      {/* Size Filter */}
      <div className="mb-8">
        <h3 className="font-medium mb-4">Size</h3>
        <div className="flex flex-col gap-2">
          <label className="flex items-center gap-2">
            <input type="checkbox" /> Small <span className="text-gray-500">(119)</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" /> Medium <span className="text-gray-500">(86)</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" /> Large <span className="text-gray-500">(78)</span>
          </label>
        </div>
      </div>

      {/* Sale Banner */}
      <div className="relative h-[400px] bg-green-100 rounded-lg overflow-hidden">
        <div className="p-6">
          <h3 className="text-3xl font-bold text-green">Super Sale</h3>
          <p className="text-xl font-bold">UP TO 75% OFF</p>
        </div>
        <img src="https://s3-alpha-sig.figma.com/img/5e3c/6700/3f4b62655ec5dd62c1a46641197d5bbf?Expires=1737331200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=WH1YYTzmzzEspH2uwczaQ3W0ubak~6dgdeV3FFTmw~VqHik1iF748i4utjiWo64CyvGosOPVscZsVJPanlcpTdEs9Tj6Pq5KLFUxQtEKwWXs1o9MWvQL3xOWA5KAnPt0gXSxgYSrCna5UkPf4bMA8F-MXRxs3wUchpBtpwGP-sduiCDOOuEiQ5SrTDXODVmZMehdINyvMvAIQr2toRlUojEYasbkHfcnBWJ7xLliXY0LSfgFfxNliETKoIcrW39-G5osF~mg6kat8UKp1iJCc~~zBdQEfAq38Ua7nbb~Z09UaCzdiPZziiyyxV1a3pVbY7wZKztWYOS6usljwa4Tdw__" alt="" />
      </div>
    </div>
  );
} 