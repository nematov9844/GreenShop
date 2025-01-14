import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { setLoginModal } from "../redux/modalSlice";
import { Button, Badge, Input, Drawer } from "antd";
import { 
  ShoppingCartOutlined, 
  HeartOutlined, 
  SearchOutlined, 
  UserOutlined,
  MenuOutlined,
  CloseOutlined
} from "@ant-design/icons";
import { Link, useLocation } from "react-router-dom";
import { setLoginData } from '../redux/loginDataSlice';
import Logo from '../assets/logo.png';
import { useState } from "react";

export default function Header() {
  const dispatch = useDispatch();
  const location = useLocation();
  const { loginData } = useSelector((state: RootState) => state.loginData);
  const cart = useSelector((state: RootState) => state.shop.cart);
  const wishlist = useSelector((state: RootState) => state.shop.wishlist);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  const handleLoginClick = () => {
    dispatch(setLoginModal(true));
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    dispatch(setLoginData(null));
    setIsMenuOpen(false);
  };

  const isActivePath = (path: string) => {
    return location.pathname === path;
  };

  const menuItems = [
    { path: "/", label: "Home" },
    { path: "/shop", label: "Shop" },
    { path: "/plant-care", label: "Plant Care" },
    { path: "/blogs", label: "Blogs" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b flex justify-center w-full">
      <div className="max-w-[1280px] mx-auto w-full">
        {/* Mobile Header */}
        <div className="md:hidden p-4 w-full flex justify-between">
          <div className="flex items-center w-full justify-between">
            <button 
              onClick={() => setIsMenuOpen(true)}
              className="text-2xl"
            >
              <MenuOutlined />
            </button>

            <Link to="/" className="flex items-center gap-2">
              <img src={Logo} alt="GreenShop" className="h-8" />
            </Link>

            <div className="flex items-center gap-4">
              <button onClick={() => setIsSearchVisible(!isSearchVisible)}>
                <SearchOutlined className="text-xl" />
              </button>
              <Link to="/cart">
                <Badge count={cart.length}>
                  <ShoppingCartOutlined className="text-xl" />
                </Badge>
              </Link>
            </div>
          </div>

          {/* Mobile Search */}
          {isSearchVisible && (
            <div className="mt-4">
              <Input.Search placeholder="Find your plants" />
            </div>
          )}
        </div>

        {/* Mobile Menu Drawer */}
        <Drawer
          placement="left"
          onClose={() => setIsMenuOpen(false)}
          open={isMenuOpen}
          closeIcon={<CloseOutlined />}
          title={
            <div className="flex items-center gap-2">
              <img src={Logo} alt="GreenShop" className="h-8" />
              <span className="text-xl font-bold text-green">GREENSHOP</span>
            </div>
          }
        >
          <div className="flex flex-col gap-4">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-lg ${
                  isActivePath(item.path) ? 'text-green' : 'text-gray-600'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}

            <div className="border-t pt-4 mt-4">
              <Link 
                to="/wishlist" 
                className="flex items-center gap-2 text-lg text-gray-600 mb-4"
                onClick={() => setIsMenuOpen(false)}
              >
                <HeartOutlined />
                <span>Wishlist</span>
                <Badge count={wishlist.length} className="ml-auto" />
              </Link>

              {loginData?.name ? (
                <>
                  <Link 
                    to="/user" 
                    className="flex items-center gap-2 text-lg text-gray-600 mb-4"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <UserOutlined />
                    <span>{loginData.name}</span>
                  </Link>
                  <Button 
                    onClick={handleLogout}
                    className="w-full border-green text-green"
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <Button 
                  type="primary" 
                  onClick={handleLoginClick}
                  className="w-full bg-green"
                >
                  Login
                </Button>
              )}
            </div>
          </div>
        </Drawer>

        {/* Desktop Header */}
        <div className="hidden md:flex items-center justify-between p-4 w-full">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img src={Logo} alt="GreenShop" className="h-8" />
            <span className="text-2xl font-bold text-[#46A358]">GREENSHOP</span>
          </Link>

          {/* Navigation */}
          <nav className="flex-1 ml-12">
            <ul className="flex gap-8">
              <li>
                <Link 
                  to="/" 
                  className={`hover:text-green transition-colors ${
                    isActivePath('/') ? 'text-green border-b-2 border-green pb-7' : 'text-gray-600'
                  }`}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  to="/shop" 
                  className={`hover:text-green transition-colors ${
                    isActivePath('/cart') ? 'text-green border-b-2 border-green pb-7' : 'text-gray-600'
                  }`}
                >
                  Shop
                </Link>
              </li>
              <li>
                <Link 
                  to="/plant-care" 
                  className={`hover:text-green transition-colors ${
                    isActivePath('/plant-care') ? 'text-green border-b-2 border-green pb-7' : 'text-gray-600'
                  }`}
                >
                  Plant Care
                </Link>
              </li>
              <li>
                <Link 
                  to="/blogs" 
                  className={`hover:text-green transition-colors ${
                    isActivePath('/blogs') ? 'text-green border-b-2 border-green pb-7' : 'text-gray-600'
                  }`}
                >
                  Blogs
                </Link>
              </li>
            </ul>
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-6">
            {/* Search */}
            <button className="text-xl text-gray-600 hover:text-green transition-colors">
              <SearchOutlined />
            </button>

            {/* Wishlist */}
            <Link to="/wishlist">
              <Badge count={wishlist.length} color="#46A358">
                <HeartOutlined className="text-xl text-gray-600 hover:text-green transition-colors" />
              </Badge>
            </Link>

            {/* Cart */}
            <Link to="/cart">
              <Badge count={cart.length} color="#46A358">
                <ShoppingCartOutlined className="text-xl text-gray-600 hover:text-green transition-colors" />
              </Badge>
            </Link>

            {/* Divider */}
            <div className="w-[1px] h-8 bg-gray-200"></div>

            {/* Login/User */}
            {loginData?.name ? (
              <div className="flex items-center gap-4">
                <Link to="/user" className="text-gray-600 hover:text-green transition-colors">
                  {loginData.name}
                </Link>
                <button 
                  onClick={handleLogout}
                  className="bg-green rounded-md px-3 py-1 border-green  hover:bg-green text-white transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button 
                onClick={handleLoginClick}
                className="bg-green px-3 py-1 rounded-md text-white hover:bg-green-600 transition-colors"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
