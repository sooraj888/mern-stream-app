import React, { Dispatch, Fragment, useEffect, useState } from "react";
// import {CgMouse} from "react-icons/all"
import "./Home.css";
import Title from "../layout/header/Title";
import { connect, useDispatch, useSelector } from "react-redux";
import { useNavigate, useNavigation } from "react-router-dom";
import { getAllProducts } from "../../redux/product/productSlice";
import Loader from "../layout/Loader/Loader";
import { useAlert } from "react-alert";
import ProductCard from "./ProductCard";

import ReactPlayer from "react-player";
import VideoList from "../VideoList";
import { RootState } from "../../redux/store";
import { getVideoList } from "../../redux/content/videoListSlice";
import { Action } from "@reduxjs/toolkit";

const Home = ({
  videos,
  getVideoList,
}: {
  videos: RootState["videoList"];
  getVideoList: () => void;
}) => {
  useEffect(() => {
    if (videos && videos?.containsList?.length > 1) {
    } else {
      getVideoList();
    }
  }, []);

  return (
    <>
      {videos.loading ? (
        <Loader />
      ) : (
        <div>
          <VideoList videos={videos?.containsList} />
        </div>
      )}
    </>
  );
};

const mapStateToProps = (state: RootState) => {
  return { videos: state.videoList };
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  getVideoList: () => {
    dispatch(getVideoList({}));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);
