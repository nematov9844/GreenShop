import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../redux/store';
import { removeFromCart, updateQuantity, addOrder, fetchCart, deleteCartItem } from '../redux/shopSlice';
import { Button, Input, message, Spin, Space } from 'antd';
import { DeleteOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import Header from '../components/Header';
import { Link } from 'react-router-dom';
import { useReduxSelector } from '../hook/useRedux';

export default function Cart() {
  const dispatch = useDispatch<AppDispatch>();
  const { cart, loading } = useReduxSelector((state: RootState) => state.shop);
  const { loginData } = useSelector((state: RootState) => state.loginData);


  useEffect(() => {
    const getCartItems = async () => {
      try {
        const result = await dispatch(fetchCart()).unwrap();
        console.log('Cart data:', result);
      } catch (error) {
        console.error('Failed to fetch cart:', error);
        message.error('Failed to load cart items');
      }
    };

    getCartItems();
  }, [dispatch]);

  console.log('Current cart state:', cart);

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

  if (cart.length === 0) {
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

  const subtotal = cart.reduce((sum, item) => {
    const price = item.discount ? Number(item.discount_price) : item.price;
    return sum + (price * (item.quantity || 1));
  }, 0);
  const shipping = 16.00;
  const total = subtotal + shipping;

  const handleCheckout = async () => {
    try {
      if (!loginData) {
        message.error('Please login first');
        return;
      }

      const orderData = {
        shop_list: cart.map(item => ({
          _id: item._id,
          count: item.quantity || 1
        })),
        extra_shop_info: {
          total: total,
          method: "cash-on-delivery"
        },
        billing_address: {
          name: loginData.name,
          surname: loginData.surname,
          phone: loginData.phone || "+998901234567",
          address: loginData.address || "Test Address",
          city: loginData.city || "Test City",
          country: loginData.country || "Uzbekistan",
          zip_code: loginData.zip_code || "100000"
        }
      };

      console.log('Checkout Data:', orderData);
      await dispatch(addOrder(orderData)).unwrap();
      message.success('Order placed successfully!');
      dispatch(fetchCart());
    } catch (error) {
      console.error('Checkout Error:', error);
      message.error('Failed to place order');
    }
  };

  const handleDelete = async (orderId: string) => {
    try {
      console.log('Deleting order:', orderId);
      await dispatch(deleteCartItem(orderId)).unwrap();
      message.success('Item removed from cart');
      await dispatch(fetchCart()).unwrap();
    } catch (error) {
      console.error('Delete Error:', error);
      message.error('Failed to remove item');
    }
  };

  const handleQuantityUpdate = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    try {
      if (!loginData) {
        message.error('Please login first');
        return;
      }

      const orderData = {
        shop_list: [{
          _id: itemId,
          count: newQuantity
        }],
        extra_shop_info: {
          total: total,
          method: "cash-on-delivery"
        },
        billing_address: {
          name: loginData?.name || '',
          surname: loginData?.surname || '',
          phone: loginData?.phone || "+998901234567",
          address: loginData?.address || "Test Address",
          city: loginData?.city || "Test City",
          country: loginData?.country || "Uzbekistan",
          zip_code: loginData?.zip_code || "100000"
        }
      };

      console.log('Updating quantity:', { itemId, newQuantity });
      await dispatch(addOrder(orderData)).unwrap();
      await dispatch(fetchCart()).unwrap();
      message.success('Quantity updated');
    } catch (error) {
      console.error('Update Error:', error);
      message.error('Failed to update quantity');
    }
  };

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
          {cart.map((item) => (
            <div key={`${item._id}_${item.orderId}`} className="flex gap-4 border-b pb-4">
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
                      onClick={() => handleQuantityUpdate(item._id, (item.quantity || 1) - 1)}
                    >
                      -
                    </button>
                    <span>{item.quantity || 1}</span>
                    <button 
                      className="w-8 h-8 border rounded-full flex items-center justify-center"
                      onClick={() => handleQuantityUpdate(item._id, (item.quantity || 1) + 1)}
                    >
                      +
                    </button>
                  </div>
                  <button 
                    onClick={() => {
                      if (item.orderId) {
                        handleDelete(item.orderId);
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
              <span>${subtotal.toFixed(2)}</span>
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
                  {cart.map((item) => (
                    <tr key={`${item._id}_${item.orderId}`} className="border-b">
                      <td className="py-4">
                        <div className="flex items-center gap-4">
                          <img 
                            src={item.main_image} 
                            alt={item.title} 
                            className="w-20 h-20 object-cover rounded-lg"
                          />
                          <h3 className="font-medium">{item.title}</h3>
                        </div>
                      </td>
                      <td className="text-center">{item.size || 'M'}</td>
                      <td className="text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button 
                            className="w-8 h-8 border rounded-full flex items-center justify-center"
                            onClick={() => handleQuantityUpdate(item._id, (item.quantity || 1) - 1)}
                          >
                            -
                          </button>
                          <span>{item.quantity || 1}</span>
                          <button 
                            className="w-8 h-8 border rounded-full flex items-center justify-center"
                            onClick={() => handleQuantityUpdate(item._id, (item.quantity || 1) + 1)}
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="text-right">${item.price * (item.quantity || 1)}</td>
                      <td className="text-right">
                        <button 
                          onClick={() => {
                            if (item.orderId) {
                              handleDelete(item.orderId);
                            } else {
                              message.error('Cannot delete item: missing order ID');
                            }
                          }}
                          className="text-red-500"
                        >
                          <DeleteOutlined />
                        </button>
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
                  <span>${subtotal.toFixed(2)}</span>
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
