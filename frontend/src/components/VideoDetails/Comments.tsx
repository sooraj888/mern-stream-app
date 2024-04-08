import React, { useState } from "react";
import "./Comments.css";
import { Avatar } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { ago } from "../../utils/util";
export default function Comments({ commentId }: { commentId: number }) {
  const [commentText, setCommentText] = useState("");
  const navigation = useNavigate();
  const onChangeText = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCommentText(e.target.value);
  };

  const onClickUser = (userId: number) => {
    navigation(`/user/${userId}`, { state: { preserveScroll: false } });
  };

  return (
    <div style={{ width: "inherit" }}>
      <div className="commentInputContainer">
        <Avatar
          onClick={(e) => {
            //   e.stopPropagation();
            //   onClickUser(data.user.userId);
          }}
          className="videoDetailsAv"
          size={"sm"}
          name={String(data.user?.userName || "")}
          src={String(data.user?.avatar?.url)}
        />
        <input
          value={commentText}
          id="commentInput"
          className="commentInput"
          onChange={onChangeText}
        />
      </div>
      <div className="commentSubmitContainer prevent-select">
        <button
          onClick={() => {
            setCommentText("");
          }}
        >
          Cancel
        </button>
        <button
          className={commentText.trim() == "" ? "disable" : ""}
          onClick={() => {
            setCommentText("");
          }}
        >
          Comment
        </button>
      </div>
      <div>
        {commentsD.map((item) => {
          return (
            <div className="commentItem">
              <Avatar
                onClick={(e) => {
                  //   e.stopPropagation();
                  onClickUser(data.user.userId);
                }}
                className="videoDetailsAv"
                size={"sm"}
                name={String(item.user?.userName || "")}
                src={String(item.user?.avatar?.url)}
              />
              <div>
                <div className="commentUserContainer">
                  <b>@{item.user?.userName}</b>
                  <span>{ago(item.createdAt)}</span>
                </div>
                <span>
                  {item.commentMessage}asdfak fasdf a sdf as dfhas df asd hfkash
                  df asdfak fasdf a sdf as dfhas df asd hfkash df a sdf as
                  fhaskfkshdf ksahf sd fksahdfk skfhasdfak fasdf a sdf as dfhas
                  df asd hfkash df a sdf as fhaskfkshdf ksahf sd fksahdfk
                  skfhasdfak fasdf a sdf as dfhas df asd hfkash df a sdf as
                  fhaskfkshdf ksahf sd fksahdfk skfhasdfak fasdf a sdf as dfhas
                  df asd hfkash df a sdf as fhaskfkshdf ksahf sd fksahdfk
                  skfhasdfak fasdf a sdf as dfhas df asd hfkash df a sdf as
                  fhaskfkshdf ksahf sd fksahdfk skfhasdfak fasdf a sdf as dfhas
                  df asd hfkash df a sdf as fhaskfkshdf ksahf sd fksahdfk
                  skfhasdfak fasdf a sdf as dfhas df asd hfkash df a sdf as
                  fhaskfkshdf ksahf sd fksahdfk skfhasdfak fasdf a sdf as dfhas
                  df asd hfkash df a sdf as fhaskfkshdf ksahf sd fksahdfk
                  skfhasdfak fasdf a sdf as dfhas df asd hfkash df a sdf as
                  fhaskfkshdf ksahf sd fksahdfk skfhasdfak fasdf a sdf as dfhas
                  df asd hfkash df a sdf as fhaskfkshdf ksahf sd fksahdfk skfh a
                  sdf as fhaskfkshdf ksahf sd fksahdfk skfh
                </span>
              </div>
            </div>
          );
        })}
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

const commentsD = [
  {
    commentId: 7,
    commentUserId: 12,
    commentMessage: "loooo",
    commentVideoId: 2,
    createdAt: "2024-04-08T04:59:31.063Z",
    updatedAt: "2024-04-08T04:59:31.063Z",
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
  },
  {
    commentId: 6,
    commentUserId: 12,
    commentMessage: "deee",
    commentVideoId: 2,
    createdAt: "2024-04-08T04:41:54.940Z",
    updatedAt: "2024-04-08T04:41:54.940Z",
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
  },
  {
    commentId: 5,
    commentUserId: 12,
    commentMessage: "hii",
    commentVideoId: 2,
    createdAt: "2024-03-21T09:40:50.684Z",
    updatedAt: "2024-03-21T09:40:50.684Z",
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
  },
];
