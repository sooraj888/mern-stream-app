import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios, { CancelTokenSource } from "axios";
import { CancelToken } from "axios";
import { contains } from "validator";
var source = axios.CancelToken.source();
export const getVideoDetails = createAsyncThunk(
  "videoDetails/getVideoDetails",
  async (
    {
      id,
    }: {
      id?: number;
    },
    { rejectWithValue }
  ) => {
    source?.cancel("Operation canceled by the user.");
    source = axios.CancelToken.source();
    const options: any = {
      cancelToken: source?.token,
    };

    const res = await axios
      .get(`/api/v1/contentDetails/${id}`, options)
      .then((e) => e)
      .catch((e) => {
        if (axios.isCancel(e)) {
          console.log("Request canceled", e.message);
        } else {
        }
        return rejectWithValue(e.response || e);
      });
    return res;
  }
);

export const videoDetails = createSlice({
  name: "videoDetails",
  initialState: {
    loading: false,
    error: false,
    errorMessage: "",
    videoDetails: {},
  },

  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getVideoDetails.pending, (state) => {
        state.loading = true;
        state.errorMessage = "";
        state.error = false;
      })
      .addCase(getVideoDetails.fulfilled, (state, { payload: { data } }) => {
        state.loading = false;
        state.error = false;
        state.videoDetails = data?.contentDetails;
      })
      .addCase(getVideoDetails.rejected.type, (state, action: any) => {
        state.loading = false;
        state.errorMessage =
          action?.payload?.data?.error ||
          action?.payload?.statusText ||
          "ERROR: Something Went Wrong";
        state.error = true;
        if (axios.isCancel(action?.payload)) {
          state.error = false;
          state.errorMessage = "";
        }
      });
  },
});

export default videoDetails.reducer;
