import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { useAxios } from '../hook/useAxios';
import { RootState } from './store';

// Async actions
export const fetchOrders = createAsyncThunk(
  'shop/fetchOrders',
  async (_, { rejectWithValue }) => {
    try {
      const axiosRequest = useAxios();
      const response = await axiosRequest({
        url: '/order/get-order',
        method: 'GET',
        headers: {
          Authorization: localStorage.getItem('token')
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error  || null);
    }
  }
);

export const addOrder = createAsyncThunk(
  'shop/addOrder',
  async (orderData: {
    shop_list: { _id: string; count: number }[];
    billing_address: {
      name: string;
      surname: string;
      phone: string;
      address: string;
      city: string;
      country: string;
      zip_code: string;
    };
    extra_shop_info: {
      total: number;
      method: string;
    };
  }, { rejectWithValue }) => {
    try {
      const axiosRequest = useAxios();
      const response = await axiosRequest({
        url: '/order/make-order',
        method: 'POST',
        headers: {
          Authorization: localStorage.getItem('access_token')
        },
        body: orderData
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error || null);
    }
  }
);

export const deleteOrder = createAsyncThunk(
  'shop/deleteOrder',
  async (orderId, { rejectWithValue }) => {
    try {
      const axiosRequest = useAxios();
      await axiosRequest({
        url: '/order/delete-order',
        method: 'DELETE',
        headers: {
          Authorization: localStorage.getItem('token')
        },
        body: { _id: orderId }
      });
      return orderId;
    } catch (error) {
      return rejectWithValue(error || null);
    }
  }
);

export const addToCartAsync = createAsyncThunk(
  'shop/addToCartAsync',
  async (product: ProductType, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const user = state.loginData.loginData;

      if (!user) {
        throw new Error('User not logged in');
      }

      const axiosRequest = useAxios();
      const response = await axiosRequest({
        url: '/order/make-order',
        method: 'POST',
        headers: {
          Authorization: localStorage.getItem('token')
        },
        body: {
          shop_list: [{
            _id: product._id,
            count: 1
          }],
          extra_shop_info: {
            total: product.price,
            method: "cash-on-delivery"
          },
          billing_address: {
            name: user.name,
            surname: user.surname,
            phone: user.phone || "+998901234567",
            address: user.address || "Test Address",
            city: user.city || "Test City",
            country: user.country || "Uzbekistan",
            zip_code: user.zip_code || "100000"
          }
        }
      });
      return { product, orderData: response.data };
    } catch (error) {
      return rejectWithValue(error || null);
    }
  }
);

// Cartni olish uchun action
export const fetchCart = createAsyncThunk(
  'shop/fetchCart',
  async (_, { getState, rejectWithValue }) => {
    try {
      const axiosRequest = useAxios();
      const state = getState() as RootState;
      const cartItems = state.shop.cart;

      if (!cartItems.length) return [];

      const cartProducts = await Promise.all(
        cartItems.map(async (item) => {
          try {
            const response = await axiosRequest({
              url: `/flower/category/${item.category_path}/${item._id}`,
              method: 'GET'
            });
            return {
              ...response.data,
              quantity: item.quantity,
              category_path: item.category_path
            };
          } catch (error) {
            console.error(`Error fetching product ${item._id}:`, error);
            return null;
          }
        })
      );

      return cartProducts.filter(Boolean); // Remove null values
    } catch (error) {
      console.error('Fetch cart error:', error);
      return rejectWithValue(error);
    }
  }
);

// Delete cart item action
export const deleteCartItem = createAsyncThunk(
  'shop/deleteCartItem',
  async (orderId: string, { rejectWithValue }) => {
    try {
      const axiosRequest = useAxios();
      await axiosRequest({
        url: '/order/delete-order',
        method: 'DELETE',
        headers: {
          Authorization: localStorage.getItem('token')
        },
        body: { 
          _id: orderId 
        }
      });
      return orderId;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// CartItem interfeysi
export interface CartItem {
  _id: string | number;
  title: string;
  price: number;
  discount: boolean;
  discount_price: number; // number turida
  main_image: string;
  category_path?: string;
  quantity: number;
  size?: string; // optional
}

// ProductType interfeysi
export interface ProductType {
  _id?: string;
title?: string;
main_image?: string;
detailed_images?: string[];
price?: number;
discount?: boolean;
discount_price?: string | number;
description?: string;
size?: string;
sku?: string;
category?: string;
}

// Cart va wishlist ni localStorage dan olish
const getInitialState = () => ({
  cart: [] as CartItem[],
  cartProducts: [] as CartItem[],
  wishlist: [] as ProductType[],
  selectedProduct: null,
  orders: [],
  loading: false,
  error: null
});

const shopSlice = createSlice({
  name: 'shop',
  initialState: getInitialState(),
  reducers: {
    addToCart: (state, action: PayloadAction<ProductType>) => {
      const cartItem: CartItem = {
        ...action.payload,
        category_path: action.payload.category_path || 'house-plants',
        quantity: 1
      };

      const existingItem = state.cart.find(item => item._id === cartItem._id);
      
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.cart.push(cartItem);
      }
      
      localStorage.setItem('cart', JSON.stringify(state.cart));
    },

    addToWishlist: (state, action: PayloadAction<ProductType>) => {
      const existingProduct = state.wishlist.find(item => item._id === action.payload._id);
      if (!existingProduct) {
        state.wishlist.push(action.payload);
        localStorage.setItem('wishlist', JSON.stringify(state.wishlist));
      }
    },

    updateCartQuantity: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
      const cartItem = state.cart.find(item => item._id === action.payload.id);
      const productItem = state.cartProducts.find(item => item._id === action.payload.id);
      
      if (cartItem && productItem && action.payload.quantity > 0) {
        cartItem.quantity = action.payload.quantity;
        productItem.quantity = action.payload.quantity;
        localStorage.setItem('cart', JSON.stringify(state.cart));
      }
    },

    removeFromCart: (state, action: PayloadAction<string>) => {
      console.log(state.cart)
      console.log(action.payload)
      try {
        state.cart = state.cart.filter(item => item._id !== action.payload);
        state.cartProducts = state.cartProducts.filter(item => item._id !== action.payload);
        localStorage.setItem('cart', JSON.stringify(state.cart));
      } catch (error) {
        console.error('Error removing item from cart:', error);
        throw error;
      }
    },

    removeFromWishlist: (state, action: PayloadAction<string>) => {
      state.wishlist = state.wishlist.filter(item => item._id !== action.payload);
      localStorage.setItem('wishlist', JSON.stringify(state.wishlist));
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch orders
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add order
      .addCase(addOrder.fulfilled, (state, action) => {
        state.orders.push(action.payload);
      })
      // Delete order
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.orders = state.orders.filter(order => order._id !== action.payload);
      })
      // Add to cart async cases
      .addCase(addToCartAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(addToCartAsync.fulfilled, (state, action) => {
        state.loading = false;
        const existingProduct = state.cart.find(item => item._id === action.payload.product._id);
        
        if (existingProduct) {
          existingProduct.quantity = (existingProduct.quantity || 1) + 1;
        } else {
          state.cart.push({ ...action.payload.product, quantity: 1 });
        }
        saveCartToStorage(state.cart);
      })
      .addCase(addToCartAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch cart
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cartProducts = action.payload;
        console.log('Fetched cart products:', action.payload);
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete cart item
      .addCase(deleteCartItem.fulfilled, (state, action) => {
        state.cart = state.cart.filter(item => item.orderId !== action.payload);
        saveCartToStorage(state.cart);
      });
  }
});

export const { 
  addToCart, 
  removeFromCart, 
  addToWishlist, 
  removeFromWishlist, 
  updateCartQuantity
} = shopSlice.actions;

const saveCartToStorage = (cart: CartItem[]) => {
  localStorage.setItem('cart', JSON.stringify(cart));
};

export default shopSlice.reducer;
