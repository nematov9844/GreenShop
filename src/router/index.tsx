import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import Cart from "../pages/Cart";
import Wishlist from "../pages/Wishlist";
import User from "../pages/User";
import PrivateRoute from "../components/PrivateRoute";
import ProductDetails from "../pages/ProductDetails";
import Checkout from "../pages/Checkout";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/cart",
    element: (
      <PrivateRoute>
        <Cart />
      </PrivateRoute>
    ),
  },
  {
    path: "/shop",
    element: (
      <PrivateRoute>
        <Cart />
      </PrivateRoute>
    ),
  },
  {
    path: "/wishlist",
    element: (
      <PrivateRoute>
        <Wishlist />
      </PrivateRoute>
    ),
  },
  {
    path: "/user",
    element: (
      <PrivateRoute>
        <User />
      </PrivateRoute>
    ),
  },
  {
    path: "/product/:category/:id",
    element: <ProductDetails />
  },
  {
    path: "/checkout",
    element: (
      <PrivateRoute>
        <Checkout />
      </PrivateRoute>
    ),
  },
]); 