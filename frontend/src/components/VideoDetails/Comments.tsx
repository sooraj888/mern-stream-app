import React, { Dispatch, useState } from "react";
import "./Comments.css";
import { Avatar } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { ago } from "../../utils/util";
import { connect } from "react-redux";
import { RootState } from "../../redux/store";
import {
  addComments,
  getVideoDetailsComments,
} from "../../redux/content/videoDetailsComment";
function Comments({
  commentId,
  loggedUser,
  comments,
  addComments,
  totalComments,
}: {
  commentId: number;
  loggedUser: any;
  comments: any;
  addComments: any;
  totalComments: number;
}) {
  const [commentText, setCommentText] = useState("");
  const navigation = useNavigate();
  // const { isAuthenticated, loading, response }: any = useSelector(
  //   (state: RootState) => state.login
  // );
  const onChangeText = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCommentText(e.target.value);
  };

  const onClickUser = (userId: number) => {
    navigation(`/user/${userId}`, { state: { preserveScroll: false } });
  };

  const handleOnSendComment = () => {
    addComments(commentId, commentText);
    setCommentText("");
  };

  return (
    <div style={{ width: "inherit" }}>
      <h2 className="largeFont">{totalComments} Comments</h2>
      {loggedUser.isAuthenticated && (
        <div className="commentInputContainer">
          <Avatar
            className="videoDetailsAv"
            size={"sm"}
            name={String(loggedUser?.response?.user?.userName || "")}
            src={String(loggedUser?.response?.user?.avatar?.url)}
          />
          <input
            value={commentText}
            id="commentInput"
            className="commentInput"
            onChange={onChangeText}
          />
        </div>
      )}
      {loggedUser.isAuthenticated && (
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
            onClick={handleOnSendComment}
          >
            Comment
          </button>
        </div>
      )}
      <div>
        {comments &&
          comments?.map((item: any) => {
            return (
              <div className="commentItem">
                <Avatar
                  onClick={(e) => {
                    if (item?.user.userId == loggedUser.response.user.userId) {
                      return;
                    }
                    onClickUser(item?.user.userId);
                  }}
                  className="videoDetailsAv"
                  size={"sm"}
                  name={String(item?.user?.userName || "")}
                  src={String(item?.user?.avatar?.url)}
                />
                <div>
                  <div className="commentUserContainer">
                    <b
                      onClick={(e) => {
                        if (
                          item?.user.userId == loggedUser.response.user.userId
                        ) {
                          return;
                        }
                        onClickUser(item?.user.userId);
                      }}
                    >
                      @{item?.user?.userName}
                    </b>
                    <span>{ago(item?.createdAt)}</span>
                  </div>
                  <span>{item?.commentMessage}</span>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}

const mapStateToProps = (state: RootState) => {
  return {
    loggedUser: state.login,
    comments: state.videoDetailsComment.comments,
    totalComments: state.videoDetailsComment.totalComments,
  };
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  addComments: (videoId: number, commentMessage: string) => {
    dispatch(addComments({ commentMessage, videoId }));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Comments);
