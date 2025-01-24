import { Modal } from 'antd';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../redux/shopSlice';
import { CartItem } from '../../redux/shopSlice';

const ProductView = ({ product }: { product: { _id: string; main_image: string; title: string; discount?: boolean; discount_price?: number; price: number; description: string; category_path?: string; } }) => {
  const dispatch = useDispatch();

  if (!product) return null;

  const handleAddToCart = () => {
    dispatch(addToCart({ ...product, quantity: 1 } as CartItem));
  };

  return (
    <Modal
      open={true}
      onCancel={() => {}}
      footer={null}
      width={800}
      centered
    >
      <div className="flex gap-8">
        <div className="w-1/2">
          <img 
            src={product.main_image} 
            alt={product.title} 
            className="w-full rounded-lg"
          />
        </div>
        <div className="w-1/2">
          <h2 className="text-2xl font-bold mb-4">{product.title}</h2>
          <p className="text-xl text-green font-bold mb-4">
            ${product.discount ? product.discount_price : product.price}
          </p>
          <p className="mb-4">{product.description}</p>
          <button 
            className="bg-green text-white px-6 py-2 rounded-lg hover:bg-green-700"
            onClick={handleAddToCart}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ProductView; 