import React, { useEffect, useState, useContext } from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/esm/Button";
import api from "../../api/axiosConfig";
import CommentReplies from "./CommentReplies";
import PostComment from "./PostComment";
import { lastUpdated } from "../helperFunctions";
import { AiOutlineDelete } from "react-icons/ai";
import "../styles/Comment.scss";
import { confirmAlert } from "react-confirm-alert"; // Import
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
import { useAuth } from "../../context/AuthContext";
import { CommentContext } from "../../context/CommentContext";

const Comment = ({ comment }) => {
  const { commentUpd, setCommentUpd, setBlogCommentLoading } =
    useContext(CommentContext);
  const { currDbUser } = useAuth();
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

  function handleDeleteButtonClick(e) {
    e.preventDefault();
    confirmAlert({
      title: "Delete Confirmation",
      message: "Are you sure to delete this comment?",
      buttons: [
        {
          label: "Yes",
          onClick: () => deleteComment(),
        },
        {
          label: "No",
          onClick: () => {
            return;
          },
        },
      ],
    });
  }

  function deleteComment() {
    setBlogCommentLoading(true);
    api
      .delete("api/v1/comment/" + comment.comment_id)
      .then((response) => {
        console.log(response.data);

        setCommentUpd(commentUpd + 1);
        setBlogCommentLoading(false);
        return;
      })
      .catch();
  }
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
    <div className="comment">
      <div className="user_section">
        <div className="left">
          <div className="top">
            <img
              className="user-profile-pic"
              src={comment.user_profile_pic}
              alt="User Profile Picture"
            />
            <div className="commentor_name">{comment.commentor_name}</div>
          </div>
          <div className="last_updated">
            <footer>{lastUpdated(comment.updated)}</footer>
          </div>
        </div>
        <div className="right">
          {comment.user_id === currDbUser.id && (
            <AiOutlineDelete size="2rem" onClick={handleDeleteButtonClick} />
          )}
        </div>
      </div>
      <div className="comment_content">
        <div className="comment_text">{comment.comment}</div>
      </div>
      <div className="card_links">
        <div className="p-2">
          {
            <Button onClick={replyToComment}>
              {" "}
              {showFormButton ? "Reply" : "Cancel"}
            </Button>
          }
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
        {showForm && (
          <PostComment
            blog_id={comment.blog_id}
            reply_to={comment.comment_id}
          ></PostComment>
        )}
        {showReplies && (
          <CommentReplies comment_id={comment.comment_id}></CommentReplies>
        )}
      </div>
    </div>
  );
};

export default Comment;
