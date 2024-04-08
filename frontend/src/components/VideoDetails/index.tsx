import React, { Dispatch, useContext, useEffect, useState } from "react";
import ReactPlayer from "react-player";
import "./videoDetails.css";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Avatar, useEditable } from "@chakra-ui/react";
import { ago, convertSecondsToTime } from "../../utils/util";
import { contents } from "../VideoList/data";
import { MenuContext } from "../../context/MainContext";
import { BiLike } from "react-icons/bi";
import { BiDislike } from "react-icons/bi";
import { BiSolidDislike } from "react-icons/bi";
import { BiSolidLike } from "react-icons/bi";
import { PiShareFatLight } from "react-icons/pi";
import { useAlert } from "react-alert";
import Comments from "./Comments";
import { connect } from "react-redux";
import { RootState } from "../../redux/store";
import { getVideoDetails } from "../../redux/content/videoDetails";
import { getVideoDetailsList } from "../../redux/content/videoDetailsListSlice";
import {
  callChangeLikeStatusApi,
  changeLikeStatus,
  getVideoDetailsLikes,
} from "../../redux/content/videoDetailsLikes";

const VideoDetails = ({
  getVideoList,
  video,
  getVideoDetailsList,
  videoDetailsList,
  videoDetailsLikes,
  getVideoDetailsLikes,
  changeLikeStatus,
  myLike,
  loggedUser,
}: {
  getVideoList: any;
  video: any;
  getVideoDetailsList: any;
  videoDetailsList: any;
  videoDetailsLikes: any;
  getVideoDetailsLikes: any;
  changeLikeStatus: any;
  myLike: boolean | null;
  loggedUser: RootState["login"];
}) => {
  const [searchParams] = useSearchParams();
  const videoId = searchParams.get("v");
  const navigation = useNavigate();
  const { isDarkTheme } = useContext(MenuContext);

  const bottomAlert = useAlert();

  if (!videoId) {
    navigation(`/`);
  }

  const onClickUser = (userId: number) => {
    navigation(`/user/${userId}`, { state: { preserveScroll: false } });
  };

  const onClickVideo = (id: number) => {
    window.scrollTo(0, 0);
    navigation(`/video?v=${id}`, {
      preventScrollReset: false,
    });
  };

  const onclickLikeDisLike = (isLike: boolean | null) => {
    if (!loggedUser.isAuthenticated) {
      alert("Please Login to your account to make any changes");
      return;
    }
    if (!video?.videoId) {
      return;
    }
    if (myLike == isLike) {
      changeLikeStatus(null, video?.videoId);
    } else {
      changeLikeStatus(isLike, video?.videoId);
    }
  };

  const handleOnShare = async () => {
    const currentUrl = window.location.href;
    await navigator.clipboard.writeText(currentUrl);
    bottomAlert.success("Share Link Copied successfully", {
      position: "top center",
    });
  };

  useEffect(() => {
    getVideoList(videoId);
    getVideoDetailsList(videoId);
    getVideoDetailsLikes(videoId);
  }, [videoId]);

  // useEffect(() => {
  //   if (videoDetailsLikes?.isUserLikeOrDisLike != null) {
  //     setIsLiked(videoDetailsLikes?.isUserLikeOrDisLike);
  //   }
  // }, [videoDetailsLikes.isUserLikeOrDisLike]);

  return (
    <div className="videoDetailsContainer">
      <div className="subVideoDetailsContainer">
        <div className="leftContainer">
          <div className="playerContainer">
            <ReactPlayer
              url={video?.videoUrl || window.location.href}
              controls
              playing
              className={"videoPlyer"}
              width={"100%"}
              height={"auto"}
            />
          </div>
          <h1>{video.title}</h1>
          <div className="videoDetailsOwner">
            <span>
              <Avatar
                onClick={(e) => {
                  e.stopPropagation();
                  onClickUser(video.user.userId);
                }}
                className="videoDetailsAv"
                size={"sm"}
                name={String(video.user?.userName || "")}
                src={String(video.user?.avatar?.url)}
              />
              <h2
                onClick={(e) => {
                  e.stopPropagation();
                  onClickUser(video.user.userId);
                }}
                style={{
                  fontWeight: "600",
                  textTransform: "capitalize",
                }}
              >
                {video?.user?.userName}
              </h2>
            </span>
            <span className="userInputSubContainer">
              <span className="likeContainer">
                <span
                  onClick={() => {
                    onclickLikeDisLike(true);
                  }}
                  style={{
                    background: isDarkTheme
                      ? "rgb(44, 43, 43)"
                      : "rgb(230, 230, 230)",
                  }}
                >
                  {myLike ? <BiSolidLike /> : <BiLike />}
                  <pre className="prevent-select">
                    {videoDetailsLikes?.totalLikes}
                  </pre>
                </span>
                <div>
                  <div></div>
                </div>
                <span
                  onClick={() => {
                    onclickLikeDisLike(false);
                  }}
                  style={{
                    background: isDarkTheme
                      ? "rgb(44, 43, 43)"
                      : "rgb(230, 230, 230)",
                  }}
                >
                  {!myLike && myLike != null ? (
                    <BiSolidDislike />
                  ) : (
                    <BiDislike />
                  )}
                  <pre className="prevent-select">
                    {videoDetailsLikes?.totalDisLikes}
                  </pre>
                </span>
              </span>
              <span
                className="shareContainer"
                onClick={handleOnShare}
                style={{
                  background: isDarkTheme
                    ? "rgb(44, 43, 43)"
                    : "rgb(230, 230, 230)",
                }}
              >
                <PiShareFatLight />
                <p className="prevent-select">Share</p>
              </span>
            </span>
          </div>
          <div className="commentContainer">
            <Comments
              commentId={
                contents.find((item: any) => item?.videoId == videoId)
                  ?.videoId || NaN
              }
            />
          </div>
        </div>

        <div className="videoDetailsList">
          <div className="videoDetailsListSubContainer">
            {videoDetailsList?.map((video: any, key: number) => {
              return (
                <div
                  style={{
                    background: isDarkTheme ? "black" : "white",
                    color: !isDarkTheme ? "black" : "white",
                  }}
                  className="videoDetailsListItem"
                  key={key}
                  onClick={() => {
                    onClickVideo(video.videoId);
                  }}
                >
                  <div className="videoDetailsListImgContainer">
                    <img
                      src={video.thumbnail}
                      className="videoDetailsItemThumbnail"
                    ></img>
                    <span>{convertSecondsToTime(video.videoTime)}</span>
                  </div>
                  <div className="videoDetailsListDetails">
                    <span>
                      <p>
                        <h3>{video.title}</h3>
                      </p>
                      <p
                        onClick={(e) => {
                          e.stopPropagation();
                          onClickUser(video.user.userId);
                        }}
                        style={{
                          color: "gray",
                          fontSize: "small",
                          fontWeight: "600",
                          textTransform: "capitalize",
                          display: "inline-block",
                        }}
                      >
                        {video?.user?.userName.slice(0, 80)}
                      </p>
                      <span className="viewsCreatedAt">
                        {video.totalViews} Views <span className="dot"></span>
                        {ago(video.createdAt)}
                      </span>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="commentBottomContainer">
        <Comments
          commentId={
            contents.find((item: any) => item?.videoId == videoId)?.videoId ||
            NaN
          }
        />
      </div>
    </div>
  );
};

const mapStateToProps = (state: RootState) => {
  return {
    video: state.videoDetails.videoDetails,
    videoDetailsList: state.videoDetailsList.containsList,
    videoDetailsLikes: state.videoDetailsLikes,
    myLike: state.videoDetailsLikes.isUserLikeOrDisLike,
    loggedUser: state.login,
  };
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  getVideoList: (videoId: number) => {
    dispatch(getVideoDetails({ id: videoId }));
  },
  getVideoDetailsList: (videoId: number) => {
    dispatch(getVideoDetailsList({ videoDetailID: videoId }));
  },
  getVideoDetailsLikes: (videoId: number) => {
    dispatch(getVideoDetailsLikes({ videoId }));
  },
  changeLikeStatus: (like: boolean | null, videoId: number) => {
    dispatch(changeLikeStatus({ like }));
    dispatch(callChangeLikeStatusApi({ videoId, like }));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(VideoDetails);
