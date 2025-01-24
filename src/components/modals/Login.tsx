import { Form, Input, message } from "antd";
import { useMutation } from "@tanstack/react-query";
import { useAuthApi } from "../../api/auth";
import googleIcon from "../../assets/icons/google.svg";
import facebookIcon from "../../assets/icons/facebook.svg";
import { auth, googleProvider } from "../../config/firebaseConfig";
import { signInWithPopup } from "firebase/auth";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { setLoginData } from "../../redux/loginDataSlice";
import { setLoginModal } from "../../redux/modalSlice";

interface LoginFormData {
  email: string;
  password: string;
}

interface RegisterData extends LoginFormData {
  surname: string;
  confirmPassword: string;
  name: string;
}

interface UserData {
  _id: string;
  name: string;
  surname: string;
  email: string;
  profile_photo: string;
  user_type: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  zip_code?: string;
  accessToken?: string;
}

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const authApi = useAuthApi();
  const dispatch = useDispatch();

  const loginMutation = useMutation({
    mutationFn: (data: LoginFormData) => authApi.login(data),
    onSuccess: (response) => {
      const { token, user } = response.data;
      const userData: UserData = {
        _id: user._id,
        name: user.name || "",
        surname: user.surname || "",
        email: user.email || undefined,
        profile_photo: user.profile_photo,
        user_type: user.user_type,
        phone: undefined,
        address: undefined,
        city: undefined,
        country: undefined,
        zip_code: undefined,
        accessToken: user.accessToken || ""
      };
      dispatch(setLoginData(userData));
      localStorage.setItem("access_token", token);
      dispatch(setLoginModal(false));
      message.success("Login successful!");
    },
    onError: () => {
      message.error("Login failed! Please try again.");
    }
  });

  const registerMutation = useMutation({
    mutationFn: (data: RegisterData) => authApi.register(data),
    onSuccess: (data) => {
      localStorage.setItem("token", data.token);
      message.success("Registration successful!");
      setIsLogin(true);
    },
    onError: () => {
      message.error("Registration failed! Please try again.");
    }
  });

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      if (result.user) {
        const token = await result.user.getIdToken();
        const userData = {
          displayName: result.user.displayName || "",
          email: result.user.email || undefined,
          photoURL: result.user.photoURL || undefined,
          _id: result.user.uid,
          name: result.user.displayName || "",
          surname: "",
          profile_photo: result.user.photoURL || "",
          user_type: "user",
          phone: undefined,
          address: undefined,
          city: undefined,
          country: undefined,
          zip_code: undefined,
          accessToken: token
        };
        dispatch(setLoginData(userData));
        localStorage.setItem("access_token", token);
        dispatch(setLoginModal(false));
        message.success("Google login successful!");
      }
    } catch (error) {
      message.error("Google login failed!");
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-center gap-4 mb-6">
        <span 
          className={`text-xl cursor-pointer pb-2 border-b-2 transition-colors ${
            isLogin 
              ? "text-green border-green" 
              : "text-gray-400 border-transparent"
          }`}
          onClick={() => setIsLogin(true)}
        >
          Login
        </span>
        <span className="text-gray-400">|</span>
        <span 
          className={`text-xl cursor-pointer pb-2 border-b-2 transition-colors ${
            !isLogin 
              ? "text-green border-green" 
              : "text-gray-400 border-transparent"
          }`}
          onClick={() => setIsLogin(false)}
        >
          Register
        </span>
      </div>

      <p className="text-center text-gray-500 mb-8">
        {isLogin 
          ? "Enter your username and password to login."
          : "Enter your email and password to register."
        }
      </p>

      {isLogin ? (
        <Form layout="vertical" onFinish={(data) => loginMutation.mutate(data as LoginFormData)}>
          <Form.Item
            name="email"
            rules={[{ required: true, message: 'Please input your email!' }]}
          >
            <Input 
              placeholder="almamun_uxui@outlook.com" 
              className="h-12 text-gray-500"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password 
              placeholder="**************" 
              className="h-12"
            />
          </Form.Item>

          <div className="text-right mb-4">
            <a href="#" className="text-green">
              Forgot Password?
            </a>
          </div>

          <button
            type="submit"
            className="w-full h-12 bg-green text-white rounded-md hover:bg-green-700 transition-colors"
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? 'Loading...' : 'Login'}
          </button>
        </Form>
      ) : (
        <Form layout="vertical" onFinish={(data) => registerMutation.mutate(data as RegisterData)}>
          <Form.Item
            name="surname"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input 
              placeholder="name" 
              className="h-12"
            />
          </Form.Item>
          <Form.Item
            name="name"
            rules={[{ required: true, message: 'Please input your name!' }]}
          >
            <Input 
              placeholder="Username" 
              className="h-12"
            />
          </Form.Item>
          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'Please enter a valid email!' }
            ]}
          >
            <Input 
              placeholder="Enter your email address" 
              className="h-12"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: 'Please input your password!' },
              { min: 6, message: 'Password must be at least 6 characters!' }
            ]}
          >
            <Input.Password 
              placeholder="Password" 
              className="h-12"
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            dependencies={['password']}
            rules={[
              { required: true, message: 'Please confirm your password!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('The passwords do not match!'));
                },
              }),
            ]}
          >
            <Input.Password 
              placeholder="Confirm Password" 
              className="h-12"
            />
          </Form.Item>

          <button
            type="submit"
            className="w-full h-12 bg-green text-white rounded-md hover:bg-green transition-colors"
            disabled={registerMutation.isPending}
          >
            {registerMutation.isPending ? 'Loading...' : 'Register'}
          </button>
        </Form>
      )}

      <div className="flex items-center my-6">
        <div className="flex-1 h-[1px] bg-gray-300"></div>
        <span className="px-4 text-gray-500">
          {isLogin ? 'Or login with' : 'Or register with'}
        </span>
        <div className="flex-1 h-[1px] bg-gray-300"></div>
      </div>

      <div className="space-y-4">
        <button
          onClick={handleGoogleLogin}
          className="w-full h-12 border border-gray-300 rounded-md flex items-center justify-center gap-2 hover:border-green transition-colors"
        >
          <img src={googleIcon} alt="Google" className="w-6 h-6" />
          <span>Continue with Google</span>
        </button>

        <button
          className="w-full h-12 border border-gray-300 rounded-md flex items-center justify-center gap-2 hover:border-green transition-colors"
        >
          <img src={facebookIcon} alt="Facebook" className="w-6 h-6" />
          <span>Continue with Facebook</span>
        </button>
      </div>
    </div>
  );
}
