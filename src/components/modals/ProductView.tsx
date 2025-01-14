import { Modal } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../redux/store';
import { addToCart } from '../../redux/shopSlice';
import { useAxios } from "../../hook/useAxios";

export default function ProductView({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const product = useSelector((state: RootState) => state.shop.selectedProduct);
  const dispatch = useDispatch();
  const axiosRequest = useAxios();

  if (!product) return null;

  const handleAddToCart = () => {
    dispatch(addToCart(product));
    onClose();
  };

  const fetchProductDetails = async (id: string) => {
    return await axiosRequest({ 
      url: `/flower/product/${id}`, 
      method: "GET" 
    });
  };

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
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
} 