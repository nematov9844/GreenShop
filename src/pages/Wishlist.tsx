import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/store';
import { removeFromWishlist, addToCart } from '../redux/shopSlice';
import Header from '../components/Header';

export default function Wishlist() {
  const wishlist = useSelector((state: RootState) => state.shop.wishlist);
  const dispatch = useDispatch();

  return (
    <div>
      <Header />
      <div className="max-w-[1280px] mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Wishlist</h1>
        {wishlist.length === 0 ? (
          <p>Your wishlist is empty</p>
        ) : (
          <div className="grid grid-cols-3 gap-6">
            {wishlist.map(item => (
              <div key={item._id} className="border p-4 rounded">
                <img src={item.main_image} alt={item.title} className="w-full h-48 object-cover mb-4" />
                <h3 className="font-medium">{item.title}</h3>
                <p className="text-green">${item.discount ? item.discount_price : item.price}</p>
                <div className="flex gap-2 mt-4">
                  <button 
                    onClick={() => dispatch(addToCart(item))}
                    className="bg-green text-white px-4 py-2 rounded"
                  >
                    Add to Cart
                  </button>
                  <button 
                    onClick={() => dispatch(removeFromWishlist(item._id))}
                    className="text-red-600"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 