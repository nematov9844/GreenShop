import { Form, Input, Radio, Select, message } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../redux/store';
import { addOrder, removeFromCart } from '../redux/shopSlice';
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import visa from '../assets/icons/visa.png';
import mastercard from '../assets/icons/mastercard.png';
import paypal from '../assets/icons/paypal.png';
// Country va State options
const countryStates = {
  'saudi-arabia': [
    { value: 'riyadh', label: 'Riyadh' },
    { value: 'jeddah', label: 'Jeddah' },
    { value: 'mecca', label: 'Mecca' },
    { value: 'medina', label: 'Medina' },
    { value: 'dammam', label: 'Dammam' }
  ],
  'uae': [
    { value: 'dubai', label: 'Dubai' },
    { value: 'abu-dhabi', label: 'Abu Dhabi' },
    { value: 'sharjah', label: 'Sharjah' },
    { value: 'ajman', label: 'Ajman' }
  ],
  'uzbekistan': [
    { value: 'tashkent', label: 'Tashkent' },
    { value: 'samarkand', label: 'Samarkand' },
    { value: 'bukhara', label: 'Bukhara' },
    { value: 'andijan', label: 'Andijan' }
  ]
};

const countries = [
  { value: 'saudi-arabia', label: 'Saudi Arabia' },
  { value: 'uae', label: 'UAE' },
  { value: 'uzbekistan', label: 'Uzbekistan' }
];

// Apartment types
const apartmentTypes = [
  { value: 'apartment', label: 'Apartment' },
  { value: 'house', label: 'House' },
  { value: 'villa', label: 'Villa' },
  { value: 'office', label: 'Office' },
  { value: 'studio', label: 'Studio' }
];

export default function Checkout() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { cart } = useSelector((state: RootState) => state.shop);
  const { loginData } = useSelector((state: RootState) => state.loginData);
  const [selectedCountry, setSelectedCountry] = useState<keyof typeof countryStates>('saudi-arabia');
  const [form] = Form.useForm();
console.log(cart);

  const subtotal = cart.reduce((sum: number, item: { price: number; quantity: number }) => {
    return sum + (item.price * item.quantity);
  }, 0);

  const shipping = 16.00;
  const total = subtotal + shipping;

  const handleCountryChange = (value: keyof typeof countryStates) => {
    setSelectedCountry(value);
    form.setFieldsValue({ state: undefined }); // Reset state when country changes
  };

  const onFinish = async (values: any) => {
    try {
      if (!loginData) {
        message.error('Please login first');
        return;
      }

      const orderData = {
        shop_list: cart.map((item: { _id: string; quantity: number }) => ({
          _id: item._id,
          count: item.quantity
        })),
        billing_address: {
          name: values.firstName,
          surname: values.lastName,
          phone: values.phone,
          address: values.address,
          city: values.city,
          country: values.country,
          zip_code: values.zip
        },
        extra_shop_info: {
          total: total,
          method: values.paymentMethod || "cash-on-delivery"
        }
      };

      // Order yaratish
      await dispatch(addOrder(orderData)).unwrap();
      message.success('Order placed successfully!');
      
      // To'lov muvaffaqiyatli bo'lgandan keyin cartni tozalash
      cart.forEach((item: { _id: string }) => dispatch(removeFromCart(item._id)));
      
      navigate('/');
    } catch (error) {
      if (error instanceof Error) {
        message.error(error.message);
      } else {
        message.error('Failed to place order');
      }
    }
  };

  return (
    <div>
      <Header />
      <div className="max-w-[1280px] mx-auto px-4 py-8">
        <div className="text-sm breadcrumbs mb-8">
          <span>Home</span> / <span>Shop</span> / <span>Checkout</span>
        </div>

        <Form 
          form={form}
          layout="vertical" 
          onFinish={onFinish}
          initialValues={{
            firstName: loginData?.name,
            email: loginData?.email,
            paymentMethod: 'cash'
          }}
        >
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Side - Billing Form */}
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-6">Billing Address</h2>
              <div className='w-full'>
                <div className="grid grid-cols-2 gap-4">
                  <Form.Item 
                    label="First Name" 
                    name="firstName"
                    rules={[{ required: true, message: 'Required' }]}
                  >
                    <Input defaultValue={loginData?.name} />
                  </Form.Item>

                  <Form.Item 
                    label="Last Name" 
                    name="lastName"
                    rules={[{ required: true, message: 'Required' }]}
                  >
                    <Input />
                  </Form.Item>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Form.Item 
                    label="Country / Region" 
                    name="country"
                    rules={[{ required: true, message: 'Required' }]}
                  >
                    <Select
                      showSearch
                      placeholder="Select country"
                      optionFilterProp="children"
                      onChange={handleCountryChange}
                      filterOption={(input, option) =>
                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                      }
                      options={countries}
                    />
                  </Form.Item>

                  <Form.Item 
                    label="State" 
                    name="state"
                    rules={[{ required: true, message: 'Required' }]}
                  >
                    <Select
                      showSearch
                      placeholder={selectedCountry ? "Select state" : "Please select country first"}
                      optionFilterProp="children"
                      disabled={!selectedCountry}
                      filterOption={(input, option) =>
                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                      }
                      options={selectedCountry ? countryStates[selectedCountry] : []}
                    />
                  </Form.Item>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Form.Item 
                    label="Street Address" 
                    name="address"
                    rules={[{ required: true, message: 'Required' }]}
                  >
                    <Input placeholder="House number and street name" />
                  </Form.Item>

                  <Form.Item 
                    label="Apartment Type" 
                    name="apartment"
                  >
                    <Select
                      showSearch
                      placeholder="Select apartment type"
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                      }
                      options={apartmentTypes}
                    />
                  </Form.Item>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Form.Item 
                    label="ZIP" 
                    name="zip"
                    rules={[{ required: true, message: 'Required' }]}
                  >
                    <Input />
                  </Form.Item>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Form.Item 
                    label="Email address" 
                    name="email"
                    rules={[{ required: true, message: 'Required', type: 'email' }]}
                  >
                    <Input defaultValue={loginData?.email} />
                  </Form.Item>

                  <Form.Item 
                    label="Phone Number" 
                    name="phone"
                    rules={[{ required: true, message: 'Required' }]}
                  >
                    <Input addonBefore="+966" />
                  </Form.Item>
                </div>

                <Form.Item name="notes" label="Order notes (optional)">
                  <Input.TextArea rows={4} />
                </Form.Item>
              </div>
            </div>

            {/* Right Side - Order Summary */}
            <div className="w-full lg:w-[450px]">
              <div className="bg-gray-50 p-6 rounded-lg sticky top-4">
                <h2 className="text-xl font-bold mb-6">Your Order</h2>
                
                {/* Products List */}
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between pb-2 border-b">
                    <span className="text-gray-600">Products</span>
                    <span className="text-gray-600">Subtotal</span>
                  </div>
                  {cart?.map((item) => (
                    <div key={item._id} className="flex items-center gap-3 pb-4 border-b">
                      <img 
                        src={item.main_image} 
                        alt={item.title} 
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium">{item.title}</h3>
                        <p className="text-sm text-gray-500">SKU: {item._id}</p>
                        <p className="text-sm text-green">(x{item.quantity})</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Summary */}
                <div className="space-y-3">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <div className="text-right">
                      <span>${shipping.toFixed(2)}</span>
                      <p className="text-xs text-green underline cursor-pointer">
                        View shipping charge
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Coupon Discount</span>
                    <span>(-) $0.00</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-3 border-t">
                    <span>Total</span>
                    <span className="text-green">${total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Coupon Code */}
                <div className="mt-4 mb-6">
                  <p className="text-sm text-gray-600">
                    Have a coupon code? <span className="text-green cursor-pointer">Click here</span>
                  </p>
                </div>

                {/* Payment Method */}
                <Form.Item 
                  name="paymentMethod" 
                  label="Payment Method"
                  className="mb-4"
                >
                  <Radio.Group className="w-full space-y-2">
                    <Radio value="card" className="w-full border p-3 rounded flex items-center">
                      <span>Credit Card</span>
                      <div className="ml-auto flex gap-2">
                        <img src={paypal} alt="PayPal" className="h-6" />
                        <img src={visa} alt="Visa" className="h-6" />
                        <img src={mastercard} alt="Mastercard" className="h-6" />
                      </div>
                    </Radio>
                    <Radio value="bank" className="w-full border p-3 rounded">
                      Direct bank transfer
                    </Radio>
                    <Radio value="cash" className="w-full border p-3 rounded">
                      Cash on delivery
                    </Radio>
                  </Radio.Group>
                </Form.Item>

                {/* Place Order Button */}
                <Form.Item>
                  <button 
                    type="submit"
                    className="w-full bg-green text-white py-3 rounded-lg font-medium hover:bg-green-600"
                  >
                    Place Order
                  </button>
                </Form.Item>
              </div>
            </div>
          </div>
        </Form>
      </div>
    </div>
  );
} 
