import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import safeLocalStorage from "@/lib/safe-storage";

const getApiBase = () =>
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "http://localhost:8050/api";

// Helper function to safely parse localStorage data — SSR safe
const getStoredFeatureImages = () => {
  try {
    const stored = safeLocalStorage.getItem("featureImageList");
    if (!stored || stored === "undefined" || stored === "null") return [];
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("Error parsing stored feature images:", error);
    safeLocalStorage.removeItem("featureImageList");
    return [];
  }
};

const initialState = {
  isLoading: false,
  featureImageList: [],
};

// Fetch feature images (stale-while-revalidate)
export const getFeatureImages = createAsyncThunk(
  "/common/getFeatureImages",
  async (_, { dispatch }) => {
    // Load cached images instantly (stale)
    const cached = getStoredFeatureImages();
    if (cached && cached.length > 0) {
      dispatch(setFeatureImages(cached));
    }

    // Fetch fresh data in the background
    const response = await axios.get(
      `${getApiBase()}/common/features/get`
    );

    const newData = response.data.data || [];
    const cachedString = JSON.stringify(cached);
    const newString = JSON.stringify(newData);

    if (cachedString !== newString) {
      safeLocalStorage.setItem("featureImageList", JSON.stringify(newData));
      dispatch(setFeatureImages(newData));
    }

    return response.data;
  }
);

// Add new feature image
export const addFeatureImage = createAsyncThunk(
  "/common/addFeatureImage",
  async (imageUrl, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${getApiBase()}/common/features/add`,
        { image: imageUrl }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Delete feature image
export const deleteFeatureImage = createAsyncThunk(
  "/common/deleteFeatureImage",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${getApiBase()}/common/features/delete/${id}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const commonSlice = createSlice({
  name: "commonSlice",
  initialState,
  reducers: {
    setFeatureImages: (state, action) => {
      state.featureImageList = action.payload;
    },
    clearFeatureImages: (state) => {
      state.featureImageList = [];
      safeLocalStorage.removeItem("featureImageList");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getFeatureImages.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getFeatureImages.fulfilled, (state, action) => {
        state.isLoading = false;
        state.featureImageList = action.payload.data || [];
      })
      .addCase(getFeatureImages.rejected, (state) => {
        state.isLoading = false;
        console.error("Failed to fetch feature images");
      })
      .addCase(addFeatureImage.fulfilled, (state, action) => {
        if (action.payload.data) {
          state.featureImageList.push(action.payload.data);
          safeLocalStorage.setItem(
            "featureImageList",
            JSON.stringify(state.featureImageList)
          );
        }
      })
      .addCase(deleteFeatureImage.fulfilled, (state, action) => {
        state.featureImageList = state.featureImageList.filter(
          (img) => img._id !== action.meta.arg
        );
        safeLocalStorage.setItem(
          "featureImageList",
          JSON.stringify(state.featureImageList)
        );
      });
  },
});

export const { setFeatureImages, clearFeatureImages } = commonSlice.actions;
export default commonSlice.reducer;
