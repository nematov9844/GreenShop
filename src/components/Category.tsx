import { useEffect, useState } from 'react';
import { useAxios } from '../hook/useAxios';
import { Spin } from 'antd';
import { useParams, useSearchParams } from 'react-router-dom';
import ProductCard from './category/ProductCard';
import TopFilter from './category/TopFilter';
import Sidebar from './category/Sidebar';

const categories = [
  { name: 'House Plants', path: 'house-plants', count: 33 },
  { name: 'Potter Plants', path: 'potter-plants', count: 12 },
  { name: 'Seeds', path: 'seeds', count: 65 },
  { name: 'Small Plants', path: 'small-plants', count: 39 },
  { name: 'Big Plants', path: 'big-plants', count: 23 },
  { name: 'Succulents', path: 'succulents', count: 17 }
];

export default function Category() {
  const { category } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<{ _id: string; title: string; price: number; discount?: boolean; discount_price?: number; main_image: string; }[]>([]);
  const [loading, setLoading] = useState(false);
  
  // URL dan price range va sort qiymatlarini olish
  const [range_min, setrange_min] = useState(Number(searchParams.get('range_min')) || 0);
  const [range_max, setrange_max] = useState(Number(searchParams.get('range_max')) || 1000);
  const [sort, setSort] = useState(searchParams.get('sort') || '');
  const [selectedCategory, setSelectedCategory] = useState(category || 'house-plants');

  const axiosRequest = useAxios();

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axiosRequest({
        url: `/flower/category/${selectedCategory}`,
        method: "GET",
        params: {
          range_min,
          range_max,
          sort
        }
      });

      if (response.data) {
        setProducts(response.data);
      }
    } catch (err) {
      console.error("Mahsulotlarni yuklashda xatolik:", err);
    } finally {
      setLoading(false);
    }
  };

  // URL parametrlarini yangilash
  const updateSearchParams = () => {
    const params = new URLSearchParams();
    if (range_min > 0) params.set('range_min', range_min.toString());
    if (range_max < 1000) params.set('range_max', range_max.toString());
    if (sort) params.set('sort', sort);
    setSearchParams(params, { replace: true });
  };

  useEffect(() => {
    fetchProducts();
    updateSearchParams();
  }, [selectedCategory, range_min, range_max, sort]);

  const handlePriceChange = (value: [number, number]) => {
    setrange_min(value[0]);
    setrange_max(value[1]);
  };

  const handleSortChange = (value: string) => {
    setSort(value);
  };

  return (
    <div className="max-w-[1280px] mx-auto px-4 py-8">
      <TopFilter 
        selectedCategory={selectedCategory}
        onSortChange={handleSortChange}
        categoryName={categories.find(c => c.path === selectedCategory)?.name || 'All Plants'}
      />

      <div className="flex gap-8">
        <Sidebar 
          categories={categories}
          selectedCategory={selectedCategory}
          range_min={range_min}
          range_max={range_max}
          onPriceChange={handlePriceChange}
          onCategoryChange={setSelectedCategory}
        />

        <div className="flex-1">
          {loading ? (
            <div className="flex justify-center items-center h-[400px]">
              <Spin size="large" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onViewProduct={() => {}}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
