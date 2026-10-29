
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  orderList: [],
  orderDetails: null,
  totalOrders: 0,
  isLoading: false,
};

export const getAllOrdersForAdmin = createAsyncThunk(
  "/order/getAllOrdersForAdmin",
  async () => {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8050/api"}/admin/orders/get`
    );

    return response.data;
  }
);

export const getOrderDetailsForAdmin = createAsyncThunk(
  "/order/getOrderDetailsForAdmin",
  async (id) => {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8050/api"}/admin/orders/details/${id}`
    );

    return response.data;
  }
);

export const updateOrderStatus = createAsyncThunk(
  "/order/updateOrderStatus",
  async ({ id, orderStatus }) => {
    const response = await axios.put(
      `${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8050/api"}/admin/orders/update/${id}`,
      {
        orderStatus,
      }
    );

    return response.data;
  }
);

// Fetch total number of orders
export const getTotalNumberOfOrders = createAsyncThunk(
  "/order/getTotalNumberOfOrders",
  async () => {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8050/api"}/admin/orders/total`
    );
    return response.data;
  }
);

// Delete an order
export const deleteOrder = createAsyncThunk(
  "/order/deleteOrder",
  async (id) => {
    const response = await axios.delete(
      `${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8050/api"}/admin/orders/delete/${id}`
    );
    return response.data;
  }
);

const adminOrderSlice = createSlice({
  name: "adminOrderSlice",
  initialState,
  reducers: {
    resetOrderDetails: (state) => {
      console.log("resetOrderDetails");

      state.orderDetails = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllOrdersForAdmin.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllOrdersForAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderList = action.payload.data;
      })
      .addCase(getAllOrdersForAdmin.rejected, (state) => {
        state.isLoading = false;
        state.orderList = [];
      })
      .addCase(getOrderDetailsForAdmin.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getOrderDetailsForAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderDetails = action.payload.data;
      })
      .addCase(getOrderDetailsForAdmin.rejected, (state) => {
        state.isLoading = false;
        state.orderDetails = null;
      })
      .addCase(getTotalNumberOfOrders.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getTotalNumberOfOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.totalOrders = action.payload.totalOrders;
      })
      .addCase(getTotalNumberOfOrders.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.orderList = state.orderList.filter(
          (order) => order._id !== action.meta.arg
        );
      });

  },
});

export const { resetOrderDetails } = adminOrderSlice.actions;

export default adminOrderSlice.reducer;
