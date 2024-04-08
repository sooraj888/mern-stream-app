import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios, { CancelTokenSource } from "axios";
import { CancelToken } from "axios";
import { contains } from "validator";
var source = axios.CancelToken.source();
export const getVideoList = createAsyncThunk(
  "videos/getVideoList",
  async (
    {
      page,
      search,
    }: {
      page?: number;
      search?: string;
    },
    { rejectWithValue }
  ) => {
    // alert("category" + category);
    source?.cancel("Operation canceled by the user.");
    source = axios.CancelToken.source();
    const options: any = {
      cancelToken: source?.token,
      params: {},
    };
    if (page) {
      options.params["page"] = page;
    }
    if (search) {
      options.params["search"] = search;
    }

    const res = await axios
      .get(`/api/v1/contentList/`, options)
      .then((e) => e)
      .catch((e) => {
        if (axios.isCancel(e)) {
          console.log("Request canceled", e.message);
        } else {
          // handle error
        }
        return rejectWithValue(e.response || e);
      });
    return res;
  }
);

export const videoListSlice = createSlice({
  name: "videos",
  initialState: {
    loading: false,
    error: false,
    errorMessage: "",
    containsList: [],
    totalVideoCount: 0,
  },

  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getVideoList.pending, (state) => {
        state.loading = true;
        state.errorMessage = "";
        state.error = false;
      })
      .addCase(getVideoList.fulfilled, (state, { payload: { data } }) => {
        state.loading = false;
        state.error = false;
        state.containsList = data?.contents;
        state.totalVideoCount = 0;
      })
      .addCase(getVideoList.rejected.type, (state, action: any) => {
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

export default videoListSlice.reducer;
