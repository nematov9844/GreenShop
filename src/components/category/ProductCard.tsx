import { HeartOutlined, ShoppingCartOutlined, EyeOutlined } from "@ant-design/icons";
import { message } from "antd";
import { useDispatch } from 'react-redux';
import { addToCart } from '../../redux/shopSlice';
import { addToWishlist } from '../../redux/shopSlice';
import { setProducts } from '../../redux/productSlice';
import { Link } from 'react-router-dom';
import { CartItem } from '../../redux/shopSlice';

interface ProductCardProps {
  product: { 
    _id: string; 
    title: string; 
    price: number; 
    discount?: boolean; 
    discount_price?: number; 
    main_image: string; 
    category_path?: string;
    size?: string;
  };
  onViewProduct: () => void;
}

export default function ProductCard({ product }: ProductCardProps) {
  const dispatch = useDispatch();
 const loginData = JSON.parse(localStorage.getItem("loginData") || "{}");
  const handleAddToCart = async () => {
    try {
      if (!loginData) {
        message.error('Please login first');
        return;
      }
      
      const productWithCategory: CartItem = {
        ...product,
        category_path: product.category_path || 'house-plants',
        quantity: 1,
        discount: product.discount || false,
        discount_price: Number(product.discount_price),
        size: product.size || "M"
      };
      
      dispatch(addToCart(productWithCategory));
      message.success('Added to cart');
    } catch (error) {
      if (error instanceof Error) {
        message.error(error.message);
      } else {
        message.error('Failed to add to cart');
      }
    }
  };

  const handleAddToWishlist = () => {
    try {
      if (!loginData) {
        message.error('Please login first');
        return;
      }
      dispatch(addToWishlist({ ...product, discount: product.discount || false, discount_price: Number(product.discount_price) }));
      message.success('Added to wishlist');
    } catch (error) {
      message.error('Failed to add to wishlist');
    }
  };
const saveProduct = () => {
    dispatch(setProducts(product))
}
  return (
    <div className="group relative">
      <div className="relative">
        <img 
          src={product.main_image} 
          alt={product.title}
          className="w-full h-[300px] object-cover rounded-lg"
        />
        <div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
          <button className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:bg-green hover:text-white">
            <HeartOutlined
              className="hover-icon"
              onClick={handleAddToWishlist}
            />
          </button>
          <button 
            className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:bg-green hover:text-white"
            onClick={handleAddToCart}
          >
            <ShoppingCartOutlined className="hover-icon" />
          </button>
          <button onClick={()=>saveProduct()} className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:bg-green hover:text-white">
            <Link to={`/product/${product.category_path || 'house-plants'}/${product._id}`}>
              <EyeOutlined className="hover-icon" />
            </Link>
          </button>
        </div>
      </div>
      <div className="mt-4">
        <h3 className="font-medium">{product.title}</h3>
        <p className="text-green font-medium">
          ${product.discount ? product.discount_price : product.price}
        </p>
      </div>
    </div>
  );
} 