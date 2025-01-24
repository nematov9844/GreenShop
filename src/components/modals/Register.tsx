/** @format */

import { Form, Input, message } from "antd";
import googleIcon from "../../assets/icons/google.svg";
import facebookIcon from "../../assets/icons/facebook.svg";
import { useAxios } from "../../hook/useAxios";
import { useReduxDispatch } from "../../hook/useRedux";
import { setLogin } from "../../redux/loginData";
import { useState } from "react";
import { signInWithPopup, UserCredential } from "firebase/auth";
import { auth, googleProvider } from "../../config/firebaseConfig"; // Firebase config import

interface RegisterFormValues {
  name: string;
  surname: string;
  email: string;
  password: string;
  confirmPassword?: string;
}

export default function Register() {
  const axios = useAxios();
  const dispatch = useReduxDispatch();
  const [loading, setLoading] = useState<boolean>(false);

  const handleFinish = async (values: RegisterFormValues): Promise<void> => {
    setLoading(true);
    try {
      const res = await axios({
        url: "/user/sign-up",
        method: "POST",
        body: {
          name: values.name,
          surname: values.surname,
          password: values.password,
          email: values.email,
        },
      });
      localStorage.setItem("token", res.data.token);
      dispatch(setLogin(res.data));
      message.success("Ro'yxatdan o'tish muvaffaqiyatli!");
    } catch (error) {
      console.error(error);
      message.error("Ro'yxatdan o'tishda xatolik yuz berdi!");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = async (): Promise<void> => {
    try {
      const result: UserCredential = await signInWithPopup(auth, googleProvider);
      const token = await result.user.getIdToken();
      const user = result.user;
      console.log("Google foydalanuvchi ma'lumotlari:", user);

      localStorage.setItem("token", token);

      const res = await axios({
        url: "/user/sign-up/google",
        method: "POST",
        body: {
          email: user.email,
        },
      });
      dispatch(setLogin(res.data));
      message.success("Google orqali muvaffaqiyatli ro'yxatdan o'tdingiz!");
    } catch (error) {
      console.error(error);
      message.error("Google orqali ro'yxatdan o'tishda xatolik yuz berdi!");
    }
  };

  return (
    <div className="w-full p-6 max-w-md mx-auto">
      <div className="text-center">
        <p className="text-lg mt-2">Enter your email and password to register.</p>
      </div>
      <Form className="w-full mt-6" onFinish={handleFinish}>
        <Form.Item
          name="name"
          rules={[{ required: true, message: "Please input your name!" }]}
        >
          <Input className="h-[40px]" placeholder="Name" />
        </Form.Item>

        <Form.Item
          name="surname"
          rules={[{ required: true, message: "Please input your surname!" }]}
        >
          <Input className="h-[40px]" placeholder="Surname" />
        </Form.Item>

        <Form.Item
          name="email"
          rules={[{ required: true, type: "email", message: "Please input a valid email address!" }]}
        >
          <Input className="h-[40px]" placeholder="Enter your email address" />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[
            { required: true, message: "Please input your password!" },
            { min: 8, message: "Password must be at least 8 characters long!" },
          ]}
        >
          <Input.Password className="h-[40px]" placeholder="Password" />
        </Form.Item>

        <Form.Item
          name="confirmPassword"
          dependencies={["password"]}
          rules={[
            { required: true, message: "Please confirm your password!" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("The two passwords do not match!"));
              },
            }),
          ]}
        >
          <Input.Password className="h-[40px]" placeholder="Confirm Password" />
        </Form.Item>

        <Form.Item>
          <button
            className="w-full h-[40px] bg-green text-white rounded-md text-lg mt-5"
            type="submit"
            disabled={loading}
          >
            {loading ? "Loading..." : "Register"}
          </button>
        </Form.Item>
      </Form>

      <div className="flex items-center mt-6">
        <span className="w-full h-[2px] bg-gray-300"></span>
        <h1 className="mx-4 w-4/5 text-gray-400">Or register with</h1>
        <span className="w-full h-[2px] bg-gray-300"></span>
      </div>

      <div className="mt-4">
        <div
          className="w-full rounded-md flex items-center justify-center border-2 border-gray-300 py-2 px-2 gap-3 mb-4 cursor-pointer"
          onClick={handleGoogleRegister}
        >
          <img src={googleIcon} alt="Google Icon" />
          <h1 className="text-gray-400">Continue with Google</h1>
        </div>
        <div
          className="w-full flex items-center justify-center border border-gray-300 py-2 px-2 mt-4 cursor-pointer"
        >
          <img src={facebookIcon} alt="Facebook" />
          <p className="ml-2 text-gray-500">Login with Facebook</p>
        </div>
      </div>
    </div>
  );
}
