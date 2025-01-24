// Axios bilan Upload komponentini sozlash
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import Header from '../components/Header';
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, ShoppingOutlined, HeartOutlined, SettingOutlined } from '@ant-design/icons';
import { useAxios } from '../hook/useAxios';

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
  lastName?: string
  phone?:string
}

export default function User() {
  const { loginData } = useSelector((state: RootState) => state.loginData);
  const [form] = Form.useForm();
  const axios = useAxios();

  const handleSubmit = (values: UserFormData) => {
    const updatedValues = {
      _id: loginData?._id,
      name: loginData?.name,
      surname: values?.lastName || null,
      phone_number: values?.phone || null,
      email: values.email,
      username: values.username,
    };
    console.log('Form values:', updatedValues);
    message.success('Profile updated successfully');
    axios({
      url: '/user/account-details',
      method: 'POST',
      body: updatedValues,
    });
  };

  const handleUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('photo', file);
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
      return response.data;
    } catch (error) {
      message.error(`${file.name} upload failed.`);
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
              <div className="flex items-center gap-2 text-green font-medium">
                <UserOutlined />
                <span>Account Details</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600 hover:text-green">
                <ShoppingOutlined />
                <span>Orders</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600 hover:text-green">
                <HeartOutlined />
                <span>Wishlist</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600 hover:text-green">
                <SettingOutlined />
                <span>Support</span>
              </div>
              <button className="text-red-500 hover:text-red-600 mt-4">Logout</button>
            </div>
          </div>

          {/* Right Content */}
          <div className="flex-1">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-medium mb-6">Personal Information</h3>
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
                  photo: loginData?.photoURL,
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
                        src={loginData?.photoURL || 'https://via.placeholder.com/40'}
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
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
