import React, { Fragment, useEffect } from "react";
// import {CgMouse} from "react-icons/all"
import "./Home.css";
import Title from "../layout/header/Title";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useNavigation } from "react-router-dom";
import { getAllProducts } from "../../redux/product/productSlice";
import Loader from "../layout/Loader/Loader";
import { useAlert } from "react-alert";
import ProductCard from "./ProductCard";
import {VideoJS} from "../VideoPlayer/VideoPlayer";
import videojs from 'video.js';

export default function Home() {
  const { products, productCount, loading, error, errorMessage } = useSelector(
    (state: any) => state.products
  );
  const dispatch = useDispatch<any>();
  const bottomAlert = useAlert();

  useEffect((): any => {
    if (error) {
      bottomAlert.error(errorMessage);
      return ;
    }
    dispatch(getAllProducts({}));
  }, [dispatch, error, bottomAlert]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const playerRef = React.useRef(null);
  const videoJsOptions = {
    autoplay: true,
    controls: true,
    responsive: true,
    fluid: true,
    sources: [{ src: 'https://res.cloudinary.com/drsqqay9m/video/upload/v1710878560/fo8a8vokddirmswuuwfk.mp4', type: 'video/mp4' }]
  };

  const handlePlayerReady = (player:any) => {
    playerRef.current = player;
    // You can handle player events here, for example:
    player.on('waiting', () => {
      videojs.log('Player is waiting');
    });
    player.on('dispose', () => {
      videojs.log('Player will dispose');
    });
  };


  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
       <>
        <VideoJS options={videoJsOptions} onReady={handlePlayerReady} />
        </>
      )}
    </Fragment>
  );
}
