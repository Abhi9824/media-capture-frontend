import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { BASE_URL } from "../utils/baseUrl";
import axios from "axios";
import { toast } from "react-toastify";

const api = `${BASE_URL}/user`;

export const signupUser = createAsyncThunk("user/signup", async (userData) => {
  try {
    const response = await axios.post(`${api}/signup`, userData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.status === 201) {
      const data = response.data;
      if (data?.token) {
        localStorage.setItem("token", data.token);
      }
      return data.user;
    }
  } catch (error) {
    throw new Error("SignUp Failed:", error);
  }
});

export const loginUser = createAsyncThunk("user/login", async (credentials) => {
  try {
    const response = await axios.post(`${api}/login`, credentials, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status === 200) {
      const data = response.data;
      if (data?.token) {
        localStorage.setItem("token", data?.token);
      }
      return data.user;
    }
  } catch (error) {
    throw new Error("Error in Logging in");
  }
});

export const fetchProfileAsync = createAsyncThunk("user/profile", async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Token is missing, authentication error");
    }
    const response = await axios.get(`${api}/profile`, {
      headers: {
        Authorization: token,
      },
    });
    if (response.status === 200) {
      const data = response.data;
      return data.profile;
    }
  } catch (error) {
    throw new Error("Failed to fetch profile");
  }
});

const userSlice = createSlice({
  name: "user",
  initialState: {
    users: [],
    status: "idle",
    error: null,
    isLoggedIn: false,
    token: localStorage.getItem("token") || null,
    user: {},
  },
  reducers: {
    logoutUser: (state) => {
      localStorage.removeItem("token");
      state.token = null;
      state.user = null;
      state.status = "idle";
      state.isLoggedIn = false;
      toast.success("Logout Successful");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signupUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.status = "success";
        state.isLoggedIn = true;
        state.user = action.payload;
        state.users.push(action.payload);
        toast.success("Signup successful");
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "success";
        state.isLoggedIn = true;
        state.user = action.payload;
        toast.success("Login Successful");
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchProfileAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProfileAsync.fulfilled, (state, action) => {
        state.status = "success";
        state.isLoggedIn = true;
        state.user = action.payload;
      })
      .addCase(fetchProfileAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default userSlice.reducer;
export const { logoutUser } = userSlice.actions;
