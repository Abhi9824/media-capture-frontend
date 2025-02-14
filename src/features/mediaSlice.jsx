import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../utils/baseUrl";
import { toast } from "react-toastify";
const api = `${BASE_URL}/user`;

export const fetchAllUserMedia = createAsyncThunk(
  "media/fetchUserMedia",
  async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token is missing, authentication error");
      }
      const response = await axios.get(`${api}/media/getUserMedia`, {
        headers: {
          Authorization: token,
        },
      });
      if (response.status === 200) {
        const data = response.data;
        return data.media;
      }
    } catch (error) {
      throw new Error("Failed to fetch media");
    }
  }
);

export const addMediaAsync = createAsyncThunk(
  "media/addMedia",
  async (mediaFiles) => {
    console.log("Media Files", mediaFiles);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token is missing, authentication error");

      const formData = new FormData();

      // Appending each file to FormData
      mediaFiles.forEach((file) => {
        formData.append("files", file);
      });

      const response = await axios.post(`${api}/addMedia`, formData, {
        headers: {
          Authorization: token,
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.status.ok) {
        const data = response.data;
        return data.media;
      }
    } catch (error) {
      throw new Error("Failed to upload media");
    }
  }
);

export const deleteMediaAsync = createAsyncThunk(
  "post/deleteMedia",
  async (mediaId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token is missing");
      }
      const response = await axios.delete(`${api}/media/${mediaId}`, {
        headers: {
          Authorization: token,
        },
      });
      if (response.status === 200) {
        const data = response.data;
        return data.media;
      }
    } catch (error) {
      throw new Error("Failed to delete the media");
    }
  }
);

export const getMediaByIdAsync = createAsyncThunk(
  "media/getMediaById",
  async (mediaId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token is missing, authentication error");
      }
      const response = await axios.get(`${api}/media/${mediaId}`, {
        headers: {
          Authorization: token,
        },
      });
      if (response.status.ok) {
        const data = response.data;
        return data.media;
      }
    } catch (error) {
      throw new Error("Failed to fetch media");
    }
  }
);

const mediaSlice = createSlice({
  name: "media",
  initialState: {
    media: [],
    mediaStatus: "idle",
    mediaError: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllUserMedia.pending, (state) => {
        state.mediaStatus = "loading";
      })
      .addCase(fetchAllUserMedia.fulfilled, (state, action) => {
        console.log("Fetched media:", action.payload);
        state.mediaStatus = "success";
        state.media = action.payload;
      })
      .addCase(fetchAllUserMedia.rejected, (state, action) => {
        state.mediaStatus = "failed";
        state.mediaError = action.payload;
      })
      .addCase(addMediaAsync.pending, (state) => {
        state.mediaStatus = "loading";
      })
      .addCase(addMediaAsync.fulfilled, (state, action) => {
        state.mediaStatus = "success";
        // state.media = [...state.media, action.payload];
        state.media = [...state.media, action.payload];

        toast.success("Media added");
      })
      .addCase(addMediaAsync.rejected, (state, action) => {
        state.mediaStatus = "failed";
        state.mediaError = action.payload;
      })
      .addCase(deleteMediaAsync.pending, (state) => {
        state.mediaStatus = "loading";
      })
      .addCase(deleteMediaAsync.fulfilled, (state, action) => {
        state.mediaStatus = "success";
        state.media = state.media.filter((m) => m?._id !== action.payload._id);
        toast.success("Media deleted");
      })
      .addCase(deleteMediaAsync.rejected, (state, action) => {
        state.mediaStatus = "failed";
        state.mediaError = action.error.message;
      });
  },
});

export default mediaSlice.reducer;
