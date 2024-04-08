import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios, { CancelTokenSource } from "axios";
import { CancelToken } from "axios";
import { contains } from "validator";
var source = axios.CancelToken.source();
export const getVideoDetailsLikes = createAsyncThunk(
  "videoLikes/getVideoDetailsLikes",
  async (
    {
      videoId,
    }: {
      videoId: number;
    },
    { rejectWithValue }
  ) => {
    // alert("category" + category);
    source?.cancel("Operation canceled by the user.");
    source = axios.CancelToken.source();
    const options: any = {
      cancelToken: source?.token,
      params: { videoId },
    };

    const res = await axios
      .get(`/api/v1/getLike/`, options)
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

export const callChangeLikeStatusApi = createAsyncThunk(
  "videoLikes/callChangeLikeStatusApi",
  async (
    {
      videoId,
      like,
    }: {
      videoId: number;
      like: boolean | null;
    },
    { rejectWithValue }
  ) => {
    source?.cancel("Operation canceled by the user.");
    source = axios.CancelToken.source();
    const options: any = {
      cancelToken: source?.token,
    };
    const data = {
      videoId: videoId,
      isLike: like,
      deleteLikeDisLike: false,
    };
    if (like == null) {
      data.deleteLikeDisLike = true;
    }
    const res = await axios
      .post(`/api/v1/addLike/`, data, options)
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

// changeLikeStatus

type initialStateType = {
  loading: boolean;
  error: boolean;
  errorMessage: string;
  totalLikes: number;
  totalDisLikes: number;
  isUserLikeOrDisLike: null | boolean;
};
const initialState: initialStateType = {
  loading: false,
  error: false,
  errorMessage: "",
  totalLikes: 0,
  totalDisLikes: 0,
  isUserLikeOrDisLike: null,
};

export const videoDetailsLikes = createSlice({
  name: "videoLikes",
  initialState: initialState,

  reducers: {
    changeLikeStatus: (state, action) => {
      switch (action.payload.like) {
        case true:
          if (state.isUserLikeOrDisLike) {
            return;
          }
          if (state.isUserLikeOrDisLike == false) {
            state.totalDisLikes -= 1;
          }
          state.totalLikes += 1;
          state.isUserLikeOrDisLike = true;
          break;
        case false:
          if (state.isUserLikeOrDisLike == false) {
            return;
          }
          if (state.isUserLikeOrDisLike) {
            state.totalLikes -= 1;
          }
          state.totalDisLikes += 1;
          state.isUserLikeOrDisLike = false;
          break;
        case null:
          if (state?.isUserLikeOrDisLike != null) {
            if (state.isUserLikeOrDisLike) {
              state.totalLikes -= 1;
            } else {
              state.totalDisLikes -= 1;
            }
            state.isUserLikeOrDisLike = null;
          }
          break;
        default:
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getVideoDetailsLikes.pending, (state) => {
        state.loading = true;
        state.errorMessage = "";
        state.error = false;
      })
      .addCase(
        getVideoDetailsLikes.fulfilled,
        (state, { payload: { data } }) => {
          state.loading = false;
          state.error = false;
          state.totalLikes = data?.totalLikes || 0;
          state.totalDisLikes = data?.totalDisLikes || 0;
          state.isUserLikeOrDisLike = data?.isUserLikeOrDisLike;
        }
      )
      .addCase(getVideoDetailsLikes.rejected.type, (state, action: any) => {
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

export const { changeLikeStatus } = videoDetailsLikes.actions;

export default videoDetailsLikes.reducer;
