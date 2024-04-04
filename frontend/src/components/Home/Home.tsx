import React, { Fragment, useEffect, useState } from "react";
// import {CgMouse} from "react-icons/all"
import "./Home.css";
import Title from "../layout/header/Title";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useNavigation } from "react-router-dom";
import { getAllProducts } from "../../redux/product/productSlice";
import Loader from "../layout/Loader/Loader";
import { useAlert } from "react-alert";
import ProductCard from "./ProductCard";

import ReactPlayer from "react-player";
import VideoList from "../VideoList";

export default function Home() {
  const { products, productCount, loading, error, errorMessage } = useSelector(
    (state: any) => state.products
  );
  const dispatch = useDispatch<any>();
  const bottomAlert = useAlert();

  useEffect((): any => {
    if (error) {
      bottomAlert.error(errorMessage);
      return;
    }
    dispatch(getAllProducts({}));
  }, [dispatch, error, bottomAlert]);

  return <>{loading ? <Loader /> : <VideoList />}</>;
}
