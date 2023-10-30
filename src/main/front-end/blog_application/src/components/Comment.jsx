import React, { useEffect, useState, useContext } from "react";
import { lastUpdated } from "./helperFunctions";
import Button from "react-bootstrap/esm/Button";
import {} from "./styles/Comment.scss";
import Card from "react-bootstrap/Card";
import PostComment from "./PostComment";
import CommentReplies from "./CommentReplies";
import api from "../api/axiosConfig";

const Comment = ({ comment }) => {
  const [showFormButton, setShowFormButton] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [showRepliesButton, setShowRepliesButton] = useState(true);
  const [repliesNum, setRepliesNum] = useState(0);

  const showReplies_Click = () => {
    setShowReplies(!showReplies);
    setShowRepliesButton(!showRepliesButton);
  };

  const replyToComment = () => {
    setShowForm(!showForm);
    setShowFormButton(!showFormButton);
  };
  useEffect(() => {
    // if (commentPosted) {
    //   showForm = false;
    //   showFormButton = true;
    //   showReplies = false;
    //   showRepliesButton = true;
    // }
    api
      .get("api/v1/comment/" + comment.comment_id + "/NumReplies")
      .then((response) => {
        console.log(response.data);
        setRepliesNum(response.data);
      })
      .catch();
  }, []);

  return (
    <Card>
      <Card.Body>
        <div>
          <div className="user_section">
            <img
              className="user-profile-pic"
              src={comment.user_profile_pic}
              alt="User Profile Picture"
            />
            <div className="commentor_name">{comment.commentor_name}</div>
          </div>
          <div className="comment_content">
            <Card.Text className="px-2">
              <div className="comment_text">{comment.comment}</div>
            </Card.Text>
            <div className="last_updated">
              <footer>{lastUpdated(comment.updated)}</footer>
            </div>
          </div>
          <div className="card_links">
            <div className="p-2">
              {showFormButton && (
                <Button onClick={replyToComment}>Reply</Button>
              )}
            </div>

            <div className="p-2">
              <Button onClick={showReplies_Click} disabled={repliesNum == 0}>
                {(showRepliesButton ? "Show Replies " : "Hide Replies") +
                  "(" +
                  repliesNum +
                  ")"}
              </Button>
            </div>
          </div>

          <div className="replies_section">
            {showReplies && (
              <CommentReplies comment_id={comment.comment_id}></CommentReplies>
            )}
          </div>
          {showForm && (
            <PostComment
              blog_id={comment.blog_id}
              reply_to={comment.comment_id}
            ></PostComment>
          )}
        </div>
      </Card.Body>
    </Card>
  );
};

export default Comment;
