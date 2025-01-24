import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import Category from "../components/Category";
import PrivateRoute from "../components/PrivateRoute";
import Cart from "../pages/Cart";
import Wishlist from "../pages/Wishlist";
import User from "../pages/User";
import ProductDetails from "../pages/ProductDetails";
import Checkout from "../pages/Checkout";

export const router = createBrowserRouter([
  {
    path: "/cart",
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
  {
    path: "/shop",
    element: (
      <PrivateRoute>
        <Cart />
      </PrivateRoute>
    ),
  },
  {
    path: "/",
    element: <Home />,
    children: [
      {
        path: "/",
        element: <Category />
      },
      {
        path: "/category/:category",
        element: <Category />
      },
      
 
    ]
  }
]); 