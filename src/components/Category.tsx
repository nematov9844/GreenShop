import { useState, useEffect } from "react";
import { useAxios } from "../hook/useAxios";
import { Pagination } from "antd";
import { useDispatch } from 'react-redux';
import { setSelectedProduct } from '../redux/shopSlice';
import ProductView from './modals/ProductView';
import CategorySidebar from './category/CategorySidebar';
import TopFilter from './category/TopFilter';
import ProductCard from './category/ProductCard';
import { useSearchParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { HomeOutlined, HeartOutlined, ShoppingCartOutlined, EyeOutlined, UserOutlined, FilterOutlined } from '@ant-design/icons';
import { Drawer, Button, Input } from 'antd';

interface CategoryType {
  count: number;
  title: string;
  route_path: string;
}

interface ProductType {
  _id: string;
  title: string;
  main_image: string;
  price: number;
  discount: boolean;
  discount_price: string;
}

export default function Category() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [categoryData, setCategoryData] = useState<CategoryType[]>([]);
  const [products, setProducts] = useState<ProductType[]>([]);
  const [allProducts, setAllProducts] = useState<ProductType[]>([]);
  const [isProductViewOpen, setIsProductViewOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  
  const activePath = searchParams.get('category') || 'all';
  const minPrice = Number(searchParams.get('minPrice')) || 0;
  const maxPrice = Number(searchParams.get('maxPrice')) || 1000;
  const sort = searchParams.get('sort') || 'default';
  const page = Number(searchParams.get('page')) || 1;
  const pageSize = 9;

  const axiosRequest = useAxios();
  const dispatch = useDispatch();

  // Kategoriyalarni yuklash
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosRequest({ 
          url: "/flower/category", 
          method: "GET" 
        });
        
        if (response.data) {
          setCategoryData(response.data);
        }
      } catch (err) {
        console.error("Kategoriyalarni yuklashda xatolik:", err);
      }
    };

    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axiosRequest({ 
        url: `/flower/category/${activePath}`, 
        method: "GET",
        params: {
          minPrice,
          maxPrice,
          sort,
          page,
          limit: pageSize
        }
      });

      if (response.data) {
        setProducts(response.data);
        setAllProducts(response.data);
      }
    } catch (err) {
      console.error("Mahsulotlarni yuklashda xatolik:", err);
    } finally {
      setLoading(false);
    }
  };

  // Use fetchProducts in useEffect
  useEffect(() => {
    fetchProducts();
  }, [activePath, minPrice, maxPrice, sort, page]);

  // URL parametrlarini yangilash
  const updateSearchParams = (newParams: Record<string, string | number>) => {
    const currentParams = Object.fromEntries(searchParams.entries());
    const updatedParams = {
      ...currentParams,
      ...Object.fromEntries(
        Object.entries(newParams).map(([key, value]) => [key, String(value)])
      )
    };
    setSearchParams(updatedParams);
  };

  // Kategoriyani o'zgartirish
  const handleCategoryChange = (newCategory: string) => {
    updateSearchParams({ 
      category: newCategory,
      page: 1 // Kategoriya o'zgarganda 1-betga qaytish
    });
  };

  // Narx filterini o'zgartirish
  const handlePriceChange = (range: [number, number]) => {
    updateSearchParams({ 
      minPrice: range[0],
      maxPrice: range[1],
      page: 1
    });
  };

  // Saralashni o'zgartirish
  const handleSortChange = (newSort: string) => {
    updateSearchParams({ 
      sort: newSort,
      page: 1
    });
  };

  // Sahifani o'zgartirish
  const handlePageChange = (newPage: number) => {
    updateSearchParams({ page: newPage });
  };

  return (
    <div className="max-w-[1280px] mx-auto px-4 py-8">
      {/* Mobile Filter Button & Search */}
      <div className="md:hidden mb-4 space-y-4">
        {/* <Input.Search placeholder="Find your plants" className="w-full" /> */}
        <div className="flex justify-between items-center">
          <Button 
            icon={<FilterOutlined />}
            onClick={() => setIsFilterDrawerOpen(true)}
            className="border-green text-green"
          >
            Filter
          </Button>
          <select 
            value={sort}
            onChange={(e) => handleSortChange(e.target.value)}
            className="border rounded px-2 py-1"
          >
            <option value="default">Default sorting</option>
            <option value="price_low">Price: Low to High</option>
            <option value="price_high">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      <Drawer
        title="Filters"
        placement="left"
        onClose={() => setIsFilterDrawerOpen(false)}
        open={isFilterDrawerOpen}
        className="md:hidden"
      >
        <CategorySidebar 
          categoryData={categoryData}
          activePath={activePath}
          setActivePath={(path) => {
            handleCategoryChange(path);
            setIsFilterDrawerOpen(false);
          }}
          priceRange={[minPrice, maxPrice]}
          setPriceRange={handlePriceChange}
          allProductsCount={allProducts?.length}
          filterProductsByPrice={() => {
            handlePriceChange([minPrice, maxPrice]);
            fetchProducts();
            setIsFilterDrawerOpen(false);
          }}
        />
      </Drawer>

      {/* Desktop TopFilter */}
      <div className="hidden md:block">
        <TopFilter 
          activePath={activePath}
          setActivePath={handleCategoryChange}
          sort={sort}
          onSortChange={handleSortChange}
        />
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Desktop Sidebar */}
        <div className="hidden md:block">
          <CategorySidebar 
            categoryData={categoryData}
            activePath={activePath}
            setActivePath={handleCategoryChange}
            priceRange={[minPrice, maxPrice]}
            setPriceRange={handlePriceChange}
            allProductsCount={allProducts?.length}
            filterProductsByPrice={() => {
              handlePriceChange([minPrice, maxPrice]);
              fetchProducts();
            }}
          />
        </div>

        {/* Right Side - Products Grid */}
        <div className="flex-1">
          {loading ? (
            <div className="flex justify-center items-center h-96">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green"></div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products?.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    onViewProduct={() => {
                      dispatch(setSelectedProduct(product));
                      setIsProductViewOpen(true);
                    }}
                  />
                ))}
              </div>

              {products?.length > 0 && (
                <div className="flex justify-center mt-8">
                  <Pagination
                    current={page}
                    total={allProducts.length}
                    pageSize={pageSize}
                    onChange={handlePageChange}
                    showSizeChanger={false}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <ProductView 
        isOpen={isProductViewOpen} 
        onClose={() => setIsProductViewOpen(false)} 
      />

      {/* Mobile Bottom Navigation - only show on mobile */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t md:hidden">
        <div className="flex justify-around p-4">
          <Link to="/" className="text-center">
            <HomeOutlined className="text-xl" />
            <span className="text-xs block">Home</span>
          </Link>
          <Link to="/wishlist" className="text-center">
            <HeartOutlined className="text-xl" />
            <span className="text-xs block">Wishlist</span>
          </Link>
          <Link to="/cart" className="text-center">
            <ShoppingCartOutlined className="text-xl" />
            <span className="text-xs block">Cart</span>
          </Link>
          <Link to="/user" className="text-center">
            <UserOutlined className="text-xl" />
            <span className="text-xs block">Profile</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
