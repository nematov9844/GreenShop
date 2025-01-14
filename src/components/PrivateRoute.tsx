import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { RootState } from '../redux/store';
import { setLoginModal } from '../redux/modalSlice';
import { useDispatch } from 'react-redux';

interface PrivateRouteProps {
  children: React.ReactNode;
}

export default function PrivateRoute({ children }: PrivateRouteProps) {
  const { loginData } = useSelector((state: RootState) => state.loginData);
  const dispatch = useDispatch();

  if (!loginData?.email) {
    dispatch(setLoginModal(true));
    return <Navigate to="/" />;
  }

  return <>{children}</>;
} 