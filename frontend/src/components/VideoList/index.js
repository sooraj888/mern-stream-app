import React, { useContext } from "react";
import "./VideoList.css";
import { contents } from "./data";
import { useNavigate } from "react-router-dom";
import { MenuContext } from "../../context/MainContext";
import { ago, convertSecondsToTime } from "../../utils/util";
import { Avatar } from "@chakra-ui/react";

export default function VideoList() {
  const navigation = useNavigate();
  const { isDarkTheme } = useContext(MenuContext);

  const onClickUser = (userId) => {
    navigation(`/user/${userId}`, { state: { preserveScroll: true } });
  };

  const onClickVideo = (videoId) => {
    navigation(`/video/${videoId}`, { state: { preserveScroll: true } });
  };
  return (
    <div className="videoListContainer">
      {contents.map((video, key) => {
        if (key >= 50) {
          return;
        }
        return (
          <div
            style={{
              background: isDarkTheme ? "black" : "white",
              color: !isDarkTheme ? "black" : "white",
            }}
            className="videoContainer"
            key={key}
            onClick={() => {
              onClickVideo(video.videoId);
            }}
          >
            <div className="imgContainer">
              <img src={video.thumbnail} className="thumbnail"></img>
              <span>{convertSecondsToTime(video.videoTime)}</span>
            </div>
            <div className="videoDetails">
              <Avatar
                onClick={(e) => {
                  e.stopPropagation();
                  onClickUser(video.user.userId);
                }}
                className="videoDetailsAv"
                size={"sm"}
                name={String(video?.user?.name || "")}
                src={String(video?.user?.avatar?.url)}
              />
              <span>
                <p>
                  <b>{video.title.slice(0, 40)}</b>
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
  );
}
