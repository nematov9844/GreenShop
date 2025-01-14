import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import Header from '../components/Header';
import { Tabs, Form, Input, Button, Upload, message } from 'antd';
import { UserOutlined, ShoppingOutlined, HeartOutlined, SettingOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';

const { TabPane } = Tabs;

interface UserFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  username: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function User() {
  const { loginData } = useSelector((state: RootState) => state.loginData);
  const [form] = Form.useForm();

  const handleSubmit = (values: UserFormData) => {
    console.log('Form values:', values);
    message.success('Profile updated successfully');
  };
console.log(loginData)
const uploadProps: UploadProps = {
    name: 'photo',
    action: 'http://localhost:8080/api/upload',
    params:{
		access_token: "64bebc1e2c6d3f056a8c85b7"

    },
    onChange(info) {
      if (info.file.status === 'done') {
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
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
              <button className="text-red-500 hover:text-red-600 mt-4">
                Logout
              </button>
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
                  email: loginData?.email,
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
                      { type: 'email', message: 'Please enter a valid email!' }
                    ]}
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item
                    label="Phone Number"
                    name="phone"
                  >
                    <Input addonBefore="+998" />
                  </Form.Item>

                  <Form.Item
                    label="Username"
                    name="username"
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item
                    label="Photo"
                    name="photo"
                  >
                    <div className="flex items-center gap-4">
                      <img 
                        src={loginData?.image || "https://via.placeholder.com/40"} 
                        alt="Profile" 
                        className="w-10 h-10 rounded-full"
                      />
                      <Upload {...uploadProps}>
                        <Button type="primary" className="bg-green">Change</Button>
                      </Upload>
                      <Button>Remove</Button>
                    </div>
                  </Form.Item>
                </div>

                <div className="mt-8">
                  <h3 className="text-lg font-medium mb-6">Password change</h3>
                  <div className="grid grid-cols-2 gap-6">
                    <Form.Item
                      label="Current password"
                      name="currentPassword"
                    >
                      <Input.Password />
                    </Form.Item>

                    <div /> {/* Empty div for grid alignment */}

                    <Form.Item
                      label="New password"
                      name="newPassword"
                    >
                      <Input.Password />
                    </Form.Item>

                    <Form.Item
                      label="Confirm new password"
                      name="confirmPassword"
                    >
                      <Input.Password />
                    </Form.Item>
                  </div>
                </div>

                <Button 
                  type="primary" 
                  htmlType="submit"
                  className="mt-6 bg-green"
                >
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