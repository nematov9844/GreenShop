import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../redux/store';
import { Form, Input, Select, Radio, Button, message } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { addOrder, fetchCart } from '../redux/shopSlice';
import PaypalIcon from '../assets/icons/paypal.png';
import MasterCardIcon from '../assets/icons/mastercard.png';
import VisaIcon from '../assets/icons/visa.png';
import AmexIcon from '../assets/icons/amex.png';

export default function Checkout() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [shipToDifferentAddress, setShipToDifferentAddress] = useState(false);
  const { cart } = useSelector((state: RootState) => state.shop);
  const { loginData } = useSelector((state: RootState) => state.loginData);

  const subtotal = cart.reduce((sum, item) => {
    const price = item.discount ? Number(item.discount_price) : item.price;
    return sum + (price * (item.quantity || 1));
  }, 0);
  const shipping = 16.00;
  const total = subtotal + shipping;

  const handlePlaceOrder = async (values: any) => {
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
          method: form.getFieldValue('paymentMethod') || "cash-on-delivery"
        },
        billing_address: {
          name: values.firstName,
          surname: values.lastName,
          phone: values.phone,
          address: values.address,
          city: values.city,
          country: values.country,
          zip_code: values.zip
        }
      };

      await dispatch(addOrder(orderData)).unwrap();
      message.success('Order placed successfully!');
      dispatch(fetchCart());
      navigate('/');
    } catch (error) {
      message.error('Failed to place order');
    }
  };

  return (
    <>
      <Header />
      <div className="max-w-[1280px] mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm mb-8">
          <Link to="/" className="text-gray-500">Home</Link>
          <span>/</span>
          <Link to="/shop" className="text-gray-500">Shop</Link>
          <span>/</span>
          <span>Checkout</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Billing Form */}
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-6">Billing Address</h2>
            <Form
              form={form}
              layout="vertical"
              initialValues={{
                firstName: loginData?.name || '',
                lastName: loginData?.surname || '',
                country: '',
                city: '',
                address: '',
                state: '',
                zip: '',
                email: loginData?.email || '',
                phone: loginData?.phone || ''
              }}
              onFinish={handlePlaceOrder}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Form.Item
                  label="First Name"
                  name="firstName"
                  rules={[{ required: true, message: 'Please input your first name!' }]}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  label="Last Name"
                  name="lastName"
                  rules={[{ required: true, message: 'Please input your last name!' }]}
                >
                  <Input />
                </Form.Item>
              </div>

              <Form.Item
                label="Country / Region"
                name="country"
                rules={[{ required: true }]}
              >
                <Select placeholder="Select a country">
                  <Select.Option value="uzbekistan">Uzbekistan</Select.Option>
                  {/* Add more countries */}
                </Select>
              </Form.Item>

              <Form.Item
                label="Town / City"
                name="city"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Street Address"
                name="address"
                rules={[{ required: true }]}
              >
                <Input.TextArea 
                  rows={2}
                  placeholder="House number and street name"
                />
              </Form.Item>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Form.Item
                  label="State"
                  name="state"
                  rules={[{ required: true }]}
                >
                  <Select placeholder="Select a state">
                    <Select.Option value="tashkent">Tashkent</Select.Option>
                    {/* Add more states */}
                  </Select>
                </Form.Item>

                <Form.Item
                  label="ZIP"
                  name="zip"
                  rules={[{ required: true }]}
                >
                  <Input />
                </Form.Item>
              </div>

              <Form.Item
                label="Email address"
                name="email"
                rules={[{ required: true, type: 'email' }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Phone Number"
                name="phone"
                rules={[{ required: true }]}
              >
                <Input addonBefore="+998" />
              </Form.Item>

              <Form.Item>
                <div className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    checked={shipToDifferentAddress}
                    onChange={(e) => setShipToDifferentAddress(e.target.checked)}
                  />
                  <span>Ship to a different address?</span>
                </div>
              </Form.Item>

              {shipToDifferentAddress && (
                // Shipping address form fields
                <div className="mt-4">
                  {/* Add shipping address fields similar to billing fields */}
                </div>
              )}

              <Form.Item
                label="Order notes (optional)"
                name="notes"
              >
                <Input.TextArea 
                  rows={4}
                  placeholder="Notes about your order, e.g. special notes for delivery"
                />
              </Form.Item>

              <Button 
                type="primary"
                className="w-full bg-green"
                size="large"
                htmlType="submit"
              >
                Place Order
              </Button>
            </Form>
          </div>

          {/* Order Summary */}
          <div className="lg:w-[400px]">
            <div className="bg-white rounded-lg p-6 border">
              <h2 className="text-xl font-bold mb-6">Your Order</h2>
              
              <div className="border-b pb-4 mb-4">
                <div className="flex justify-between font-medium mb-2">
                  <span>Products</span>
                  <span>Subtotal</span>
                </div>
                {cart.map((item) => (
                  <div key={item._id} className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <img 
                        src={item.main_image} 
                        alt={item.title}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div>
                        <p className="font-medium">{item.title}</p>
                        <p className="text-sm text-gray-500">× {item.quantity}</p>
                      </div>
                    </div>
                    <span>${(item.price * (item.quantity || 1)).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>${shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold pt-2 border-t">
                  <span>Total</span>
                  <span className="text-green">${total.toFixed(2)}</span>
                </div>
              </div>

              <div className="space-y-4">
                <Radio.Group className="w-full">
                  <div className="space-y-2">
                    <Radio value="direct" className="w-full p-3 border rounded">
                      Direct bank transfer
                    </Radio>
                    <Radio value="card" className="w-full p-3 border rounded flex items-center gap-2">
                      <span>Credit Card</span>
                      <div className="flex gap-2">
                      <img src={PaypalIcon} alt="PayPal" className="h-6" />
                <img src={MasterCardIcon} alt="MasterCard" className="h-6" />
                <img src={VisaIcon} alt="Visa" className="h-6" />
                <img src={AmexIcon} alt="American Express" className="h-6" />
                      </div>
                    </Radio>
                    <Radio value="cash" className="w-full p-3 border rounded">
                      Cash on delivery
                    </Radio>
                  </div>
                </Radio.Group>

                <Button 
                  type="primary"
                  className="w-full bg-green"
                  size="large"
                >
                  Place Order
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 