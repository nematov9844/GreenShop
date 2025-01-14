import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { useAxios } from '../hook/useAxios';

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
      return rejectWithValue(error.response.data);
    }
  }
);

export const addOrder = createAsyncThunk(
  'shop/addOrder',
  async (orderData, { rejectWithValue }) => {
    try {
      const axiosRequest = useAxios();
      const response = await axiosRequest({
        url: '/order/make-order',
        method: 'POST',
        headers: {
          Authorization: localStorage.getItem('token')
        },
        body: orderData
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
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
      return rejectWithValue(error.response.data);
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
      return rejectWithValue(error.response.data);
    }
  }
);

// Cartni olish uchun action
export const fetchCart = createAsyncThunk(
  'shop/fetchCart',
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
      
      // Barcha buyurtmalardan shop_list'i bor bo'lganlarini olamiz
      const ordersWithItems = response.data.filter(order => 
        order.shop_list && order.shop_list.length > 0
      );

      // Eng so'nggi buyurtmani olamiz
      const latestOrder = ordersWithItems[ordersWithItems.length - 1];
      
      if (latestOrder && latestOrder.shop_list) {
        return latestOrder.shop_list.map(item => ({
          _id: item._id,
          title: item.title,
          main_image: item.main_image,
          price: item.price,
          discount: item.discount,
          discount_price: item.discount_price,
          quantity: item.count || 1,
          orderId: latestOrder._id
        }));
      }
      return [];
    } catch (error) {
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

interface ProductType {
  _id: string;
  title: string;
  main_image: string;
  price: number;
  discount: boolean;
  discount_price: string;
  quantity?: number;
}

interface ShopState {
  cart: ProductType[];
  wishlist: ProductType[];
  selectedProduct: ProductType | null;
  orders: any[];
  loading: boolean;
  error: any;
}

const initialState: ShopState = {
  cart: [],
  wishlist: [],
  selectedProduct: null,
  orders: [],
  loading: false,
  error: null
};

const shopSlice = createSlice({
  name: 'shop',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<ProductType>) => {
      const existingProduct = state.cart.find(item => item._id === action.payload._id);
      
      if (existingProduct) {
        // Agar mahsulot mavjud bo'lsa, uning sonini oshiramiz
        existingProduct.quantity = (existingProduct.quantity || 1) + 1;
      } else {
        // Agar mahsulot mavjud bo'lmasa, yangi mahsulot qo'shamiz
        state.cart.push({ ...action.payload, quantity: 1 });
      }
    },
    
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.cart = state.cart.filter(item => item._id !== action.payload);
    },
    
    addToWishlist: (state, action: PayloadAction<ProductType>) => {
      const existingProduct = state.wishlist.find(item => item._id === action.payload._id);
      if (!existingProduct) {
        state.wishlist.push(action.payload);
      }
    },
    
    removeFromWishlist: (state, action: PayloadAction<string>) => {
      state.wishlist = state.wishlist.filter(item => item._id !== action.payload);
    },
    
    setSelectedProduct: (state, action: PayloadAction<ProductType | null>) => {
      state.selectedProduct = action.payload;
    },

    // Mahsulot sonini o'zgartirish uchun yangi action
    updateCartItemQuantity: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
      const product = state.cart.find(item => item._id === action.payload.id);
      if (product) {
        product.quantity = action.payload.quantity;
      }
    },

    updateQuantity: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
      const item = state.cart.find(item => item._id === action.payload.id);
      if (item && action.payload.quantity > 0) {
        item.quantity = action.payload.quantity;
      }
    }
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
        state.cart = action.payload;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete cart item
      .addCase(deleteCartItem.fulfilled, (state, action) => {
        state.cart = state.cart.filter(item => item.orderId !== action.payload);
      });
  }
});

export const { 
  addToCart, 
  removeFromCart, 
  addToWishlist, 
  removeFromWishlist, 
  setSelectedProduct,
  updateCartItemQuantity,
  updateQuantity
} = shopSlice.actions;

export default shopSlice.reducer;
