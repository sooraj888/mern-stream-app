import React, { useContext, useEffect } from "react";
import "./VideoList.css";
import { contents } from "./data";
import { useNavigate } from "react-router-dom";
import { MenuContext } from "../../context/MainContext";
import { ago, convertSecondsToTime } from "../../utils/util";
import { Avatar, useEditable } from "@chakra-ui/react";

export default function VideoList({ videos }: { videos?: any[] }) {
  const navigation = useNavigate();
  const { isDarkTheme } = useContext(MenuContext);

  const onClickUser = (userId: number) => {
    navigation(`/user/${userId}`);
  };

  const onClickVideo = (videoId: number) => {
    navigation(`/video?v=${videoId}`, {
      preventScrollReset: false,
    });
  };

  return (
    <div className="containerVideo">
      <div className="videoListContainer">
        {videos &&
          videos.map((video) => {
            return (
              <div
                style={{
                  background: isDarkTheme ? "black" : "white",
                  color: !isDarkTheme ? "black" : "white",
                }}
                className="videoContainer"
                key={video.videoId}
                onClick={() => {
                  onClickVideo(video?.videoId);
                }}
              >
                <div className="imgContainer">
                  <img src={video?.thumbnail} className="thumbnail"></img>
                  <span>{convertSecondsToTime(video?.videoTime)}</span>
                </div>
                <div className="videoDetails">
                  <Avatar
                    onClick={(e) => {
                      e.stopPropagation();
                      onClickUser(video?.user.userId);
                    }}
                    className="videoDetailsAv"
                    size={"sm"}
                    name={String(video?.user?.name || "")}
                    src={String(video?.user?.avatar?.url)}
                  />
                  <span>
                    <p>
                      <b style={{ textTransform: "capitalize" }}>
                        {video.title}
                      </b>
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
  );
}
