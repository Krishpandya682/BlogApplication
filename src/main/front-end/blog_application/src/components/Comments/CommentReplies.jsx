import React, { useContext, useEffect, useState } from "react";
import ReactLoading from "react-loading";
import api from "../../api/axiosConfig";
import { useAuth } from "../../context/AuthContext";
import { CommentContext } from "../../context/CommentContext";
import Comment from "./Comment";
import MyNavbar from "../Navbar";
import "../styles/CommentReplies.css";

export const CommentReplies = ({ comment_id }) => {
  const { blogCommentLoading, setBlogCommentLoading, commentUpd } =
    useContext(CommentContext);
  const { currUser, currDbUser } = useAuth();
  const [comments, setComments] = useState();
  const [replyLoading, setReplyLoading] = useState(true);

  const getBlogComments = async () => {
    console.log("Replies API CALL!!!!!");
    setReplyLoading(true);
    await api
      .get("api/v1/comment/" + comment_id + "/repliesWithUser")
      .then((response) => {
        setComments(response.data);
        console.log("Api call for getting replies:- ", response.data);
        setReplyLoading(false);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  useEffect(() => {
    console.log("Use effect called with replyUpd value", commentUpd);
    console.log("Comment ID is", comment_id);
    getBlogComments();
  }, [commentUpd]);

  if (replyLoading) {
    return (
      <div className="loading">
        <ReactLoading type={"balls"} color={"blue"} height={50} width={100} />
      </div>
    );
  }
  return (
    <div>
      <div>
        <MyNavbar />
      </div>
      <div className="flex d-flex flex-column p-3 w-100">
        {comments.map((comment) => (
          <div className="reply">
          <Comment comment={comment}></Comment>
          </div>
        ))}
      </div> 
    </div>
  );
};
export default CommentReplies;
