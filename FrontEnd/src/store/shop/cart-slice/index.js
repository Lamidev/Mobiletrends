import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getOrCreateSessionId } from "@/components/utils/session";
import safeLocalStorage from "@/lib/safe-storage";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8050/api";

const initialState = {
  cartItems: [],
  isLoading: false,
};

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ productId, quantity }, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const user = state.auth.user;
      const userId = user?.id || getOrCreateSessionId();
      const isGuest = !user?.id;

      const response = await axios.post(
        `${API_BASE_URL}/shop/cart/add`,
        { userId, productId, quantity, isGuest }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchCartItems = createAsyncThunk(
  "cart/fetchCartItems",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const user = state.auth.user;
      const userId = user?.id || getOrCreateSessionId();

      const response = await axios.get(
        `${API_BASE_URL}/shop/cart/get`,
        { params: { userId } }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateCartQuantity = createAsyncThunk(
  "cart/updateCartQuantity",
  async ({ productId, quantity }, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const user = state.auth.user;
      const userId = user?.id || getOrCreateSessionId();

      const response = await axios.put(
        `${API_BASE_URL}/shop/cart/update-cart`,
        { userId, productId, quantity }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteCartItem = createAsyncThunk(
  "cart/deleteCartItem",
  async ({ productId }, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const user = state.auth.user;
      const userId = user?.id || getOrCreateSessionId();

      const response = await axios.delete(
        `${API_BASE_URL}/shop/cart/delete`,
        {
          data: {
            userId,
            productId,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const mergeCarts = createAsyncThunk(
  "cart/mergeCarts",
  async ({ userId }, { rejectWithValue }) => {
    try {
      const guestId = getOrCreateSessionId();

      const response = await axios.post(
        `${API_BASE_URL}/shop/cart/merge`,
        { guestId, userId }
      );

      safeLocalStorage.removeItem("guestSessionId");

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const shoppingCartSlice = createSlice({
  name: "shoppingCart",
  initialState,
  reducers: {
    clearCart: (state) => {
      state.cartItems = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addToCart.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.success) {
          state.cartItems =
            action.payload.data?.items || action.payload.items || [];
        }
      })
      .addCase(addToCart.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(fetchCartItems.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCartItems.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.success) {
          state.cartItems =
            action.payload.data?.items || action.payload.items || [];
        }
      })
      .addCase(fetchCartItems.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(updateCartQuantity.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateCartQuantity.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.success) {
          state.cartItems =
            action.payload.data?.items || action.payload.items || [];
        }
      })
      .addCase(updateCartQuantity.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(deleteCartItem.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteCartItem.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.success) {
          state.cartItems =
            action.payload.data?.items || action.payload.items || [];
        }
      })
      .addCase(deleteCartItem.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(mergeCarts.fulfilled, (state, action) => {
        if (action.payload.success) {
          state.cartItems =
            action.payload.data?.items || action.payload.items || [];
        }
      });
  },
});

export const { clearCart } = shoppingCartSlice.actions;
export default shoppingCartSlice.reducer;
