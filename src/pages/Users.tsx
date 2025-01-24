import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useReduxDispatch, useReduxSelector } from "../hook/useRedux";
import { outLogin } from "../redux/loginData";

export default function Users() {
  const { loginData } = useReduxSelector((state) => state.loginData);
  const navigate = useNavigate();
  const dispatch = useReduxDispatch();

  // loginData mavjudligini tekshirish
  useEffect(() => {
    if (!loginData) {
      navigate("/");
    }
  }, [loginData, navigate]);

  if (!loginData) {
    return null; // Agar loginData mavjud bo‘lmasa, hech narsani render qilmaydi
  }

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="bg-white shadow-lg rounded-lg w-full max-w-md p-6">
        <h1 className="text-2xl font-bold text-center text-gray-700">User Details</h1>
        <div className="flex justify-center items-center rounded-full">
          <img src={loginData?.photoURL} alt="User" className="rounded-full w-24 h-24 object-cover" />
        </div>
        <div className="mt-6 space-y-4">
          <div className="flex justify-between">
            <p className="font-medium text-gray-600">Name:</p>
            <p className="text-gray-800">{loginData?.displayName}</p>
          </div>

          <div className="flex justify-between">
            <p className="font-medium text-gray-600">Email:</p>
            <p className="text-gray-800">{loginData?.email}</p>
          </div>
        </div>
        <div className="mt-6 w-full">
          <Link to={"/"}
            onClick={() => {
              dispatch(outLogin())
            }}
            className="text-white w-full px-2 py-2 rounded-lg mt-4 font-bold bg-red-600"
          >
            Log Out
          </Link>
        </div>
        <div className="mt-6 w-full">

          <Link to={"/"}
            className="text-white w-full px-2 py-2 rounded-lg mt-4 font-bold bg-blue-600"
          >
            Back to Home Page
          </Link>
        </div>
      </div>
    </div>
  );
}
