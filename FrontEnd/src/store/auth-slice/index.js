import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

axios.defaults.withCredentials = true;

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8050/api";

function getStoredToken() {
  if (typeof window === "undefined") return null;
  try {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    if (!token || token === "undefined" || token === "null") return null;
    return token;
  } catch {
    return null;
  }
}

function setStoredToken(token) {
  if (typeof window === "undefined" || !token || token === "undefined") return;
  try {
    localStorage.setItem("token", token);
    sessionStorage.setItem("token", token);
  } catch {
    // ignore storage errors
  }
}

function clearStoredToken() {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
  } catch {
    // ignore storage errors
  }
}

const initialState = {
  isAuthenticated: false,
  user: null,
  isLoading: false,
  isCheckingAuth: true,
  error: null,
  message: null,
};

export const registerUser = createAsyncThunk(
  "auth/register",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE}/auth/register`, formData, {
        withCredentials: true,
      });
      if (response.data?.token) {
        setStoredToken(response.data.token);
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.response?.data?.error ||
          error.message ||
          "Error registering user"
      );
    }
  }
);

export const verifyEmail = createAsyncThunk(
  "auth/verify-email",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_BASE}/auth/verify-email`,
        formData,
        { withCredentials: true }
      );
      clearStoredToken();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Error verifying email"
      );
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async (formData, { rejectWithValue, dispatch }) => {
    try {
      const response = await axios.post(`${API_BASE}/auth/login`, formData, {
        withCredentials: true,
      });

      if (response.data?.token) {
        setStoredToken(response.data.token);
      }
      if (response.data?.user) {
        dispatch(setUser(response.data.user));
      }

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Error logging in"
      );
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      dispatch(clearAuthState());
      await axios.post(
        `${API_BASE}/auth/logout`,
        {},
        { withCredentials: true }
      );
      return {};
    } catch (error) {
      dispatch(clearAuthState());
      return rejectWithValue("Error logging out");
    }
  }
);

export const forgotPassword = createAsyncThunk(
  "auth/forgot-password",
  async ({ email }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_BASE}/auth/forgot-password`,
        { email },
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Error sending reset email"
      );
    }
  }
);

export const resetPassword = createAsyncThunk(
  "auth/reset-password",
  async ({ token, formData }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_BASE}/auth/reset-password/${token}`,
        formData,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Error resetting password"
      );
    }
  }
);

export const checkAuth = createAsyncThunk(
  "auth/check-auth",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const token = getStoredToken();
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const response = await axios.get(`${API_BASE}/auth/check-auth`, {
        headers,
        withCredentials: true,
      });

      if (response.data?.user) {
        dispatch(setUser(response.data.user));
      }
      return response.data;
    } catch (error) {
      clearStoredToken();
      return rejectWithValue(
        error.response?.data?.message || error.message || "Unauthenticated"
      );
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = Boolean(action.payload);
    },
    clearError: (state) => {
      state.error = null;
    },
    clearMessage: (state) => {
      state.message = null;
    },
    clearAuthState: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.isLoading = false;
      state.error = null;
      state.message = null;
      clearStoredToken();
    },
    directLogout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.isLoading = false;
      state.error = null;
      state.message = null;
      clearStoredToken();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.isAuthenticated = Boolean(action.payload.success);
        if (action.payload.token) {
          setStoredToken(action.payload.token);
        }
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })
      .addCase(verifyEmail.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verifyEmail.fulfilled, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        clearStoredToken();
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        if (action.payload.token) {
          setStoredToken(action.payload.token);
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })
      .addCase(logoutUser.pending, () => {})
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(forgotPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.message = action.payload.message;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(resetPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(checkAuth.pending, (state) => {
        state.isCheckingAuth = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isCheckingAuth = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.isCheckingAuth = false;
        state.isAuthenticated = false;
        state.user = null;
      });
  },
});

export const {
  setUser,
  clearError,
  clearMessage,
  clearAuthState,
  directLogout,
} = authSlice.actions;

export default authSlice.reducer;
