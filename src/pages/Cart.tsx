import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../redux/store';
import { 
   
  fetchCart, 
  removeFromCart,
  updateCartQuantity
} from '../redux/shopSlice';
import { Button, Input, message, Spin, Space } from 'antd';
import { DeleteOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import Header from '../components/Header';
import { Link, useNavigate } from 'react-router-dom';

export default function Cart() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const {  cartProducts, loading } = useSelector((state: RootState) => state.shop);
  const { loginData } = useSelector((state: RootState) => state.loginData);

  useEffect(() => {
    if (loginData) {
      dispatch(fetchCart());
    }
  }, [dispatch, loginData]);

  const handleQuantityChange = (id: string, quantity: number) => {
    if (quantity > 0) {
      dispatch(updateCartQuantity({ id, quantity }));
    }
  };

  const handleRemoveItem = (id: string) => {
    console.log(id);
    try {
      dispatch(removeFromCart(id));
      message.success('Item removed from cart');
    } catch (error) {
      message.error('Failed to remove item');
    }
  };

  const handleCheckout = async () => {
    try {
      if (!loginData) {
        message.error('Please login first');
        return;
      }

      navigate('/checkout');
    } catch (error) {
      if (error instanceof Error) {
        message.error(error.message);
      } else {
        message.error('Failed to proceed to checkout');
      }
    }
  };


  if (loading) {
    return (
      <>
        <Header />
        <div className="flex justify-center items-center h-[60vh]">
          <Spin size="large" />
        </div>
      </>
    );
  }

  if (!cartProducts?.length) {
    return (
      <>
        <Header />
        <div className="max-w-[1280px] mx-auto px-4 py-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
          <Link to="/shop">
            <Button type="primary" className="bg-green">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </>
    );
  }

  const subtotal = cartProducts?.reduce((sum, item) => {
    const price = item.discount ? Number(item.discount_price) : item.price;
    return sum + (price * (item.quantity || 1));
  }, 0);
  const shipping = 16.00;
  const total = subtotal + shipping;

  return (
    <>
      <Header />
      
      {/* Mobile Cart */}
      <div className="md:hidden">
        <div className="p-4 border-b flex items-center gap-2">
          <Link to="/" className="text-gray-600">
            <ArrowLeftOutlined />
          </Link>
          <h1 className="text-xl font-medium">Cart</h1>
        </div>

        <div className="p-4 space-y-4">
          {cartProducts?.map((item) => (
            <div key={`${item._id}_${item.quantity}`} className="flex gap-4 border-b pb-4">
              <img 
                src={item.main_image} 
                alt={item.title} 
                className="w-20 h-20 object-cover rounded-lg"
              />
              <div className="flex-1">
                <h3 className="font-medium">{item.title}</h3>
                <p className="text-sm text-gray-500">Size: {item.size || 'M'}</p>
                <p className="text-green font-medium">
                  ${item.discount ? item.discount_price : item.price}
                </p>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-2">
                    <button 
                      className="w-8 h-8 border rounded-full flex items-center justify-center"
                      onClick={() => handleQuantityChange(item._id, (item.quantity || 1) - 1)}
                    >
                      -
                    </button>
                    <span>{item.quantity || 1}</span>
                    <button 
                      className="w-8 h-8 border rounded-full flex items-center justify-center"
                      onClick={() => handleQuantityChange(item._id, (item.quantity || 1) + 1)}
                    >
                      +
                    </button>
                  </div>
                  <button 
                    onClick={() => {
                      if (item._id) {
                        handleRemoveItem(item._id);
                      } else {
                        message.error('Cannot delete item: missing order ID');
                      }
                    }}
                    className="text-red-500"
                  >
                    <DeleteOutlined />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 bg-gray-50">
          <div className="flex justify-between mb-2">
            <Input 
              placeholder="Enter coupon code here..."
              className="flex-1 mr-2"
            />
            <Button className="bg-green text-white">Apply</Button>
          </div>

          <div className="space-y-2 mt-4">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${subtotal?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Coupon Discount</span>
              <span className="text-red-500">(-) $0.00</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <div className="text-right">
                <span>${shipping.toFixed(2)}</span>
                <Link to="#" className="block text-xs text-green">View shipping charge</Link>
              </div>
            </div>
          </div>

          <div className="flex justify-between font-bold mt-4 pt-4 border-t">
            <span>Total</span>
            <span className="text-green">${total.toFixed(2)}</span>
          </div>

          <Button 
            type="primary" 
            className="w-full bg-green mt-4"
            onClick={handleCheckout}
          >
            Proceed To Checkout
          </Button>
        </div>
      </div>

      {/* Desktop Cart */}
      <div className="hidden md:block max-w-[1280px] mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-8">Shopping Cart</h1>
        
        <div className="flex gap-8">
          {/* Cart Items */}
          <div className="flex-1">
            <div className="bg-white rounded-lg p-6">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left pb-4">Product</th>
                    <th className="text-center pb-4">Size</th>
                    <th className="text-center pb-4">Quantity</th>
                    <th className="text-right pb-4">Price</th>
                    <th className="pb-4"></th>
                  </tr>
                </thead>
                <tbody>
                  {cartProducts?.map((item) => (
                    <tr key={item._id} className="border-b">
                      <td className="py-4">
                        <div className="flex items-center gap-4">
                          <img 
                            src={item.main_image} 
                            alt={item.title} 
                            className="w-16 h-16 object-cover rounded"
                          />
                          <div>
                            <h3 className="font-medium">{item.title}</h3>
                            <p className="text-sm text-gray-500">SKU: {item._id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="text-center">${item.discount ? item.discount_price : item.price}</td>
                      <td className="text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Button 
                            onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            -
                          </Button>
                          <span>{item.quantity}</span>
                          <Button 
                            onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                          >
                            +
                          </Button>
                        </div>
                      </td>
                      <td className="text-center">${((item.discount ? Number(item.discount_price) : item.price) * item.quantity).toFixed(2)}</td>
                      <td className="text-center">
                        <Button 
                          type="text" 
                          danger
                          icon={<DeleteOutlined />}
                          onClick={() => handleRemoveItem(item._id)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Order Summary */}
          <div className="w-[400px]">
            <div className="bg-white rounded-lg p-6">
              <h2 className="text-xl font-bold mb-6">Order Summary</h2>
              
              <Space.Compact className="w-full">
                <Input 
                  placeholder="Enter coupon code here..."
                  className="w-[calc(100%-90px)]"
                />
                <Button className="w-[90px] bg-green text-white">
                  Apply
                </Button>
              </Space.Compact>

              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${subtotal?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Coupon Discount</span>
                  <span className="text-red-500">(-) $0.00</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <div className="text-right">
                    <span>${shipping.toFixed(2)}</span>
                    <Link to="#" className="block text-xs text-green">
                      View shipping charge
                    </Link>
                  </div>
                </div>
                <div className="flex justify-between font-bold pt-4 border-t">
                  <span>Total</span>
                  <span className="text-green">${total.toFixed(2)}</span>
                </div>
              </div>

              <Button 
                type="primary" 
                className="w-full bg-green mt-6"
                onClick={handleCheckout}
              >
                Proceed To Checkout
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
