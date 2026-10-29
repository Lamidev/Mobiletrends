import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import safeLocalStorage from "@/lib/safe-storage";

const CACHE_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 hours

const initialState = {
  isLoading: false,
  productList: (() => {
    try { return JSON.parse(safeLocalStorage.getItem("productList")) || []; } catch { return []; }
  })(),
  productDetails: (() => {
    try { return JSON.parse(safeLocalStorage.getItem("productDetails")) || null; } catch { return null; }
  })(),
};

// Utility: Get cache safely and remove expired entries
function getValidCache() {
  const raw = safeLocalStorage.getItem("productDetailsCache");
  const cache = (() => { try { return JSON.parse(raw) || {}; } catch { return {}; } })();
  const now = Date.now();
  const validCache = {};

  Object.keys(cache).forEach((id) => {
    const { timestamp, data } = cache[id];
    if (now - timestamp < CACHE_EXPIRY_MS) {
      validCache[id] = { data, timestamp };
    }
  });

  safeLocalStorage.setItem("productDetailsCache", JSON.stringify(validCache));
  return validCache;
}

const API_BASE = typeof process !== "undefined" && process.env?.NEXT_PUBLIC_API_BASE_URL
  ? process.env.NEXT_PUBLIC_API_BASE_URL
  : (typeof window !== "undefined" ? window.__NEXT_PUBLIC_API_BASE_URL__ : "") || "http://localhost:8050/api";

const getApiBase = () => {
  if (typeof window !== "undefined") {
    return process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8050/api";
  }
  return "http://localhost:8050/api";
};

// Fetch all filtered products
export const fetchAllFilteredProducts = createAsyncThunk(
  "/products/fetchAllProducts",
  async ({ filterParams, sortParams }) => {
    const query = new URLSearchParams({
      ...filterParams,
      sortBy: sortParams,
    });
    const result = await axios.get(
      `${getApiBase()}/shop/products/get?${query}`
    );

    safeLocalStorage.setItem("productList", JSON.stringify(result.data.data));
    return result.data;
  }
);

// Fetch product details (with caching + expiry)
export const fetchProductDetails = createAsyncThunk(
  "/products/fetchProductDetails",
  async (productId) => {
    const cache = getValidCache();

    if (cache[productId]) {
      return { data: cache[productId].data, fromCache: true };
    }

    const result = await axios.get(
      `${getApiBase()}/shop/products/get/${productId}`
    );

    const updatedCache = {
      ...cache,
      [productId]: {
        data: result.data.data,
        timestamp: Date.now(),
      },
    };

    safeLocalStorage.setItem("productDetailsCache", JSON.stringify(updatedCache));
    safeLocalStorage.setItem("productDetails", JSON.stringify(result.data.data));

    return result.data;
  }
);

const shoppingProductSlice = createSlice({
  name: "shoppingProducts",
  initialState,
  reducers: {
    setProductDetails: (state) => {
      state.productDetails = null;
      safeLocalStorage.removeItem("productDetails");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllFilteredProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllFilteredProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productList = action.payload.data;
      })
      .addCase(fetchAllFilteredProducts.rejected, (state) => {
        state.isLoading = false;
        console.error("Failed to fetch products");
      })
      .addCase(fetchProductDetails.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchProductDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productDetails = action.payload.data;

        if (!action.payload.fromCache) {
          safeLocalStorage.setItem(
            "productDetails",
            JSON.stringify(action.payload.data)
          );
        }
      })
      .addCase(fetchProductDetails.rejected, (state) => {
        state.isLoading = false;
        console.error("Failed to fetch product details");
      });
  },
});

export const { setProductDetails } = shoppingProductSlice.actions;
export default shoppingProductSlice.reducer;
