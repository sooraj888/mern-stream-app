import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios, { CancelTokenSource } from "axios";
import { CancelToken } from "axios";
import { contains } from "validator";
var source = axios.CancelToken.source();
export const getVideoDetailsComments = createAsyncThunk(
  "videoDetailsComment/getVideoDetailsComments",
  async (
    {
      videoId,
    }: {
      videoId: any;
    },
    { rejectWithValue }
  ) => {
    source?.cancel("Operation canceled by the user.");
    source = axios.CancelToken.source();
    const options: any = {
      cancelToken: source?.token,
    };

    const res = await axios
      .get(`/api/v1/getComments/${videoId}`, options)
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

export const addComments = createAsyncThunk(
  "videoDetailsComment/addComments",
  async (
    {
      videoId,
      commentMessage,
    }: {
      videoId: number;
      commentMessage: string;
    },
    { rejectWithValue }
  ) => {
    source?.cancel("Operation canceled by the user.");
    source = axios.CancelToken.source();
    const options: any = {
      cancelToken: source?.token,
    };

    const res = await axios
      .post(
        `/api/v1/addComment/${videoId}`,
        {
          commentMessage,
        },
        options
      )
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
type initialState = {
  loading: boolean;
  error: boolean;
  errorMessage: string;
  comments: Array<any>;
  totalComments: number;
};
const initialState: initialState = {
  loading: false,
  error: false,
  errorMessage: "",
  comments: [],
  totalComments: 0,
};
export const videoDetailsComment = createSlice({
  name: "videoDetailsComment",
  initialState: initialState,

  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getVideoDetailsComments.pending, (state) => {
        state.loading = true;
        state.errorMessage = "";
        state.error = false;
      })
      .addCase(
        getVideoDetailsComments.fulfilled,
        (state, { payload: { data } }) => {
          state.loading = false;
          state.error = false;
          state.comments = data?.comments;
          state.totalComments = state.comments.length;
        }
      )
      .addCase(getVideoDetailsComments.rejected.type, (state, action: any) => {
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
      })
      .addCase(addComments.pending, (state) => {})
      .addCase(addComments.fulfilled, (state, action: any) => {
        state.comments.unshift(action?.payload?.data?.comment);
        state.totalComments = state.comments.length;
      })
      .addCase(addComments.rejected.type, (state, action: any) => {});
  },
});

export default videoDetailsComment.reducer;
