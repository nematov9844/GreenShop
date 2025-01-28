// Axios bilan Upload komponentini sozlash
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import Header from '../components/Header';
import { Form, Input, Button, message, List } from 'antd';
import { UserOutlined, ShoppingOutlined, HeartOutlined, SettingOutlined } from '@ant-design/icons';
import { useAxios } from '../hook/useAxios';
import { useState, useEffect } from 'react';
import Wishlist from './Wishlist';
import { useDispatch } from 'react-redux';
import { updateUser } from '../redux/loginDataSlice';
import { useNavigate } from 'react-router-dom';

interface UserFormData {
  _id?: string;
  name?: string;
  surname?: string | any;
  email?: string;
  phone_number?: string | any;
  username?: string;
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
  lastName?: string;
  phone?: string;
  firstName?: string;
  photo?: File[];
}

export default function User() {
  const dispatch = useDispatch();
  const { loginData } = useSelector((state: RootState) => state.loginData);
  const [form] = Form.useForm();
  const axios = useAxios();
  const [currentTab, setCurrentTab] = useState('account');
  const [orders, setOrders] = useState<Order[]>([]);
  const navigate = useNavigate();
console.log(loginData);

  const handleTabChange = (tab: string) => {
    setCurrentTab(tab);
  };

  const handleSubmit = async (values: UserFormData) => {
    const updatedValues = {
      _id: loginData?._id,
      name: values.firstName,
      surname: values.lastName,
      email: values.email,
      phone_number: values.phone,
      username: values.username,
      profile_photo: loginData?.photoURL || null,
    };

    if (values.photo && values.photo.length > 0) {
      const uploadedPhoto = await handleUpload(values.photo[0]);
      updatedValues.profile_photo = uploadedPhoto;
    }

    console.log('Form values:', updatedValues);
    message.success('Profile updated successfully');

    try {
      const response = await axios({
        url: '/user/account-details',
        method: 'POST',
        body: updatedValues,
      });

      dispatch(updateUser(response.data));
      navigate('/');
    } catch (error) {
      console.error('Error updating profile:', error);
      message.error('Failed to update profile');
    }
  };

  const handleUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    try {
      const response = await axios({
        url: '/upload',
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      message.success(`${file.name} uploaded successfully!`);
      return response.data.path || "https://s8.hostingkartinok.com/uploads/images/2020/01/59e1ec409d67a06cdab2a3557918bd56.jpg";
    } catch (error) {
      message.error(`${file.name} upload failed.`);
      console.error('Upload error:', error);
      return "https://s8.hostingkartinok.com/uploads/images/2020/01/59e1ec409d67a06cdab2a3557918bd56.jpg";
    }
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios({
          url: '/order/get-order',
          method: 'GET',
        });
        
        setOrders(response.data);
      } catch (error) {
        message.error('Failed to fetch orders');
      }
    };

    fetchOrders();
  }, []);

  const handleDeleteOrder = async (orderId: string) => {
    try {
      await axios({
        url: '/order/delete-order',
        method: 'DELETE',
        body: { _id: orderId },
      
      });
      message.success('Order deleted successfully!');
      setOrders(orders.filter(order => order._id !== orderId));
    } catch (error) {
      message.error('Failed to delete order');
    }
  };

  return (
    <>
      <Header />
      <div className="max-w-[1280px] mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Left Sidebar */}
          <div className="w-[260px] flex-shrink-0">
            <h2 className="text-xl font-bold mb-4">My Account</h2>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-green font-medium" onClick={() => handleTabChange('account')}>
                <UserOutlined />
                <span>Account Details</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600 hover:text-green" onClick={() => handleTabChange('orders')}>
                <ShoppingOutlined />
                <span>Orders</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600 hover:text-green" onClick={() => handleTabChange('wishlist')}>
                <HeartOutlined />
                <span>Wishlist</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600 hover:text-green" onClick={() => handleTabChange('support')}>
                <SettingOutlined />
                <span>Support</span>
              </div>
              <button className="text-red-500 hover:text-red-600 mt-4">Logout</button>
            </div>
          </div>

          {/* Right Content */}
          <div className="flex-1">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-medium mb-6">{currentTab === 'wishlist' ? 'Your Wishlist' : 'Personal Information'}</h3>
              {currentTab === 'account' ? (
                <Form
                  form={form}
                  layout="vertical"
                  onFinish={handleSubmit}
                  initialValues={{
                    firstName: loginData?.name,
                    lastName: loginData?.surname,
                    email: loginData?.email,
                    phone_number: loginData?.phone_number,
                    username: loginData?.username,
                    photo: loginData?.profile_photo ? [new File([], loginData.profile_photo)] : undefined,
                  }}
                >
                  <div className="grid grid-cols-2 gap-6">
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

                    <Form.Item
                      label="Email address"
                      name="email"
                      rules={[
                        { required: true, message: 'Please input your email!' },
                        { type: 'email', message: 'Please enter a valid email!' },
                      ]}
                    >
                      <Input />
                    </Form.Item>

                    <Form.Item label="Phone Number" name="phone">
                      <Input addonBefore="+998" />
                    </Form.Item>

                    <Form.Item label="User Name" name="username">
                      <Input />
                    </Form.Item>

                    <Form.Item label="Photo" name="photo">
                      <div className="flex items-center gap-4">
                        <img
                          src={loginData?.profile_photo}
                          alt="Profile"
                          className="w-10 h-10 rounded-full"
                        />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              handleUpload(e.target.files[0]);
                            }
                          }}
                        />
                      </div>
                    </Form.Item>
                  </div>

                  <Button type="primary" htmlType="submit" className="mt-6 bg-green">
                    Save Change
                  </Button>
                </Form>
              ) : currentTab === 'wishlist' ? (
                <div>
                  <Wishlist/>
                </div>
              ) : (
                <div>
                  <h2 className="text-xl font-bold mb-4">Your Orders</h2>
                  <List
                    itemLayout="horizontal"
                    dataSource={orders}
                    renderItem={item => (
                      <List.Item
                        actions={[
                          <Button type="link" danger onClick={() => handleDeleteOrder(item._id)}>Delete</Button>,
                        ]}
                      >
                        <List.Item.Meta
                          title={item.title}
                          description={`Order ID: ${item._id} - Total: $${item?.extra_shop_info?.total?.toFixed(2)}`}
                        />
                      </List.Item>
                    )}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
