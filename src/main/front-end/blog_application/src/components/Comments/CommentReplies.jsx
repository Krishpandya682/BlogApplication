import React, { useContext, useEffect, useState } from "react";
import ReactLoading from "react-loading";
import api from "../../api/axiosConfig";
import { useAuth } from "../../context/AuthContext";
import { CommentContext } from "../../context/CommentContext";
import Comment from "./Comment";
import MyNavbar from "../Navbar";
import "../styles/CommentReplies.css";

export const CommentReplies = ({ comment_id }) => {
  // Contexts to manage comment-related state
  const { blogCommentLoading, setBlogCommentLoading, commentUpd } =
    useContext(CommentContext);
  const { currUser, currDbUser } = useAuth();
  const [error, setError] = useState();

  // State variables for handling replies and loading status
  const [comments, setComments] = useState();
  const [replyLoading, setReplyLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState("Loading...");

  // Function to fetch comment replies
  const getBlogComments = async () => {
    console.log("Replies API CALL!!!!!");
    setReplyLoading(true);
    try {
      const response = await api.get(
        "api/v1/comment/" + comment_id + "/repliesWithUser"
      );
      setComments(response.data);
      console.log("Api call for getting replies:- ", response.data);
      setReplyLoading(false);
    } catch (e) {
      console.log(e);
      setError("Could not get replies");
      setReplyLoading(false);
    }
  };

  useEffect(() => {
    // Fetch comments when commentUpd or comment_id changes
    console.log("Use effect called with replyUpd value", commentUpd);
    console.log("Comment ID is", comment_id);
    getBlogComments();
  }, [commentUpd]);

  // If replies are loading, display a loading spinner
  if (replyLoading) {
    return (
      <div className="loading">
        <div className="loading_bar">
          <ReactLoading
            type={"balls"}
            color={"#63051e"}
            height={50}
            width={100}
          />
        </div>
        <div className="loading_message">{loadingMessage}</div>
      </div>
    );
  }

  // Display comments if loaded
  return (
    <div className="flex d-flex flex-column p-3 w-100">
      {comments.map((comment) => (
        <div className="reply">
          {error && <div className="error_group">{error}</div>}

          <Comment comment={comment}></Comment>
        </div>
      ))}
    </div>
  );
};

export default CommentReplies;
