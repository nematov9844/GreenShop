import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { updateUser } from '../redux/loginDataSlice';

const Login: React.FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const userData = localStorage.getItem('loginData');
    if (userData) {
      dispatch(updateUser(JSON.parse(userData))); // localStorage dan olingan ma'lumotlarni redux ga qo'shish
    }
  }, [dispatch]);

  return (
    <div>
      {/* Rest of the component code */}
    </div>
  );
};

export default Login; 