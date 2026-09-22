import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiURL } from "../utils/exports";

const BASE_URL = apiURL;

// Helper to initialize state from localStorage safely in Next.js
const getSavedAuth = () => {
  if (typeof window !== "undefined") {
    try {
      const token = localStorage.getItem("token");
      const user = localStorage.getItem("user");
      return {
        token: token || null,
        user: user ? JSON.parse(user) : null,
      };
    } catch (e) {
      console.error("Error parsing auth data", e);
      return { token: null, user: null };
    }
  }
  return { token: null, user: null };
};

const savedAuth = getSavedAuth();

const initialState = {
  token: savedAuth.token,
  user: savedAuth.user,
  registeredUsers: [], // Optional: for local tracking
  loginStatus: "idle",
  signupStatus: "idle",
  error: null,
};

// --- SIGNUP THUNK ---
export const signupUser = createAsyncThunk(
  "auth/signupUser",
  async ({ name, email, password }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/users/add-user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const result = await response.json();

      if (!response.ok) {
        return rejectWithValue(result.message || "Signup failed");
      }

      // If your signup API also returns a token immediately:
      if (result.token && result.user) {
        localStorage.setItem("token", result.token);
        localStorage.setItem("user", JSON.stringify(result.user));
      }

      return result;
    } catch (error) {
      return rejectWithValue(error.message || "Network error");
    }
  },
);

// --- LOGIN THUNK ---
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/admin/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (!response.ok) {
        return rejectWithValue(result.message || "Login failed");
      }

      // Store in LocalStorage for persistence
      localStorage.setItem("token", result.token);
      localStorage.setItem("user", JSON.stringify(result.user));

      return result;
    } catch (error) {
      return rejectWithValue(error.message || "Network error");
    }
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.token = null;
      state.user = null;
      state.loginStatus = "idle";
      state.signupStatus = "idle";
      state.error = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
    clearAuthError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Signup Handlers
      .addCase(signupUser.pending, (state) => {
        state.signupStatus = "loading";
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.signupStatus = "succeeded";
        // If signup logs the user in automatically:
        if (action.payload.token) {
          state.token = action.payload.token;
          state.user = action.payload.user;
        }
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.signupStatus = "failed";
        state.error = action.payload;
      })
      // Login Handlers
      .addCase(loginUser.pending, (state) => {
        state.loginStatus = "loading";
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loginStatus = "succeeded";
        state.token = action.payload.token;
        state.user = action.payload.user; // Full user object (avatar, company, etc.)
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loginStatus = "failed";
        state.error = action.payload;
      });
  },
});

export const { logout, clearAuthError } = authSlice.actions;
export default authSlice.reducer;
