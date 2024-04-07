import React, { useContext, useState } from "react";
import ReactPlayer from "react-player";
import "./videoDetails.css";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Avatar } from "@chakra-ui/react";
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

export default function VideoDetails() {
  const [searchParams] = useSearchParams();
  const videoId = searchParams.get("v");
  const navigation = useNavigate();
  const { isDarkTheme } = useContext(MenuContext);
  const [isLiked, setIsLiked] = useState(null);
  const bottomAlert = useAlert();

  if (!videoId) {
    navigation(`/`);
  }

  const onClickUser = (userId) => {
    navigation(`/user/${userId}`, { state: { preserveScroll: false } });
  };

  const onClickVideo = (id) => {
    window.scrollTo(0, 0);
    navigation(`/video?v=${id}`, {
      preventScrollReset: false,
    });
  };

  const onclickLikeDisLike = (isLike) => {
    setIsLiked((prev) => {
      if (prev == isLike) {
        return null;
      } else {
        return isLike;
      }
    });
  };

  const handleOnShare = async () => {
    const currentUrl = window.location.href;
    await navigator.clipboard.writeText(currentUrl);
    bottomAlert.success("Share Link Copied successfully", {
      position: "top center",
    });
  };

  return (
    <div className="videoDetailsContainer">
      <div className="subVideoDetailsContainer">
        <div>
          <div className="playerContainer">
            <ReactPlayer
              url={contents.find((item) => item.videoId == videoId)?.videoUrl}
              controls
              playing
              className={"videoPlyer"}
              width={"100%"}
              height={"auto"}
            />
          </div>
          <h1>{data.title}</h1>
          <div className="videoDetailsOwner">
            <span>
              <Avatar
                onClick={(e) => {
                  e.stopPropagation();
                  onClickUser(data.user.userId);
                }}
                className="videoDetailsAv"
                size={"sm"}
                name={String(data.user?.name || "")}
                src={String(data.user?.avatar?.url)}
              />
              <h2
                onClick={(e) => {
                  e.stopPropagation();
                  onClickUser(data.user.userId);
                }}
                style={{
                  fontWeight: "600",
                  textTransform: "capitalize",
                }}
              >
                {data.user.userName}
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
                  {isLiked ? <BiSolidLike /> : <BiLike />}
                  <pre className="prevent-select">{123}</pre>
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
                  {!isLiked && isLiked != null ? (
                    <BiSolidDislike />
                  ) : (
                    <BiDislike />
                  )}
                  <pre className="prevent-select">{123}</pre>
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
                contents.find((item) => item.videoId == videoId)?.videoId
              }
            />
          </div>
        </div>

        <div className="videoDetailsList">
          <div className="videoDetailsListSubContainer">
            {contents.map((video, key) => {
              if (key >= 10) {
                return;
              }
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
                        {video.user.userName.slice(0, 80)}
                      </p>
                      <span className="viewsCreatedAt">
                        {video.totalViews} Views <span class="dot"></span>
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
          commentId={contents.find((item) => item.videoId == videoId)?.videoId}
        />
      </div>
    </div>
  );
}

const data = {
  videoId: 2,
  title: "my first video steam app",
  createdAt: "2024-03-19T20:02:41.715Z",
  updatedAt: "2024-03-19T20:02:41.716Z",
  description: "mm",
  thumbnail:
    "https://res.cloudinary.com/drsqqay9m/video/upload/v1710878560/fo8a8vokddirmswuuwfk.png",
  videoUrl:
    "https://res.cloudinary.com/drsqqay9m/video/upload/sp_auto/v1710878560/fo8a8vokddirmswuuwfk.m3u8",
  videoTime: "5.312",
  likes: "0",
  dislikes: "0",
  videoMetaData: {
    url: "http://res.cloudinary.com/drsqqay9m/video/upload/v1710878560/fo8a8vokddirmswuuwfk.mp4",
    etag: "d55bddf8d62910879ed9f605522149a8",
    tags: [],
    type: "upload",
    audio: {
      codec: "aac",
      bit_rate: "384828",
      channels: 6,
      frequency: 48000,
      channel_layout: "5.1",
    },
    bytes: 1055736,
    pages: 0,
    video: {
      dar: "16:9",
      codec: "h264",
      level: 31,
      profile: "Main",
      bit_rate: "1205959",
      time_base: "1/12800",
      pix_format: "yuv420p",
    },
    width: 1280,
    folder: "",
    format: "mp4",
    height: 720,
    api_key: "825267688972368",
    version: 1710878560,
    asset_id: "47afd2f5c0e402e37ca54cb308802d8a",
    bit_rate: 1589963,
    duration: 5.312,
    is_audio: false,
    rotation: 0,
    nb_frames: 132,
    public_id: "fo8a8vokddirmswuuwfk",
    signature: "23c37e821c818ebf79298f354f7e505a0f0c7883",
    created_at: "2024-03-19T20:02:40Z",
    frame_rate: 25,
    secure_url:
      "https://res.cloudinary.com/drsqqay9m/video/upload/v1710878560/fo8a8vokddirmswuuwfk.mp4",
    version_id: "090f1a4a7db83d5bf2ed4d24d1781bbd",
    access_mode: "public",
    placeholder: false,
    playback_url:
      "https://res.cloudinary.com/drsqqay9m/video/upload/sp_auto/v1710878560/fo8a8vokddirmswuuwfk.m3u8",
    resource_type: "video",
    original_filename: "file",
  },
  totalViews: "85",
  createdUserId: 12,
  user: {
    userId: 12,
    userName: "sooraj",
    createdAt: "2024-03-19T14:20:31.091Z",
    updatedAt: "2024-03-19T14:20:31.092Z",
    email: "soorajsagar8888@gmail.com",
    avatar: {
      url: "https://res.cloudinary.com/drsqqay9m/image/upload/v1710858030/file_kpviq2.jpg",
      public_id: "file_kpviq2",
    },
  },
};
