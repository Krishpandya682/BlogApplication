import React, { useContext, useEffect, useState } from "react";
import ReactLoading from "react-loading";
import api from "../../api/axiosConfig";
import { useAuth } from "../../context/AuthContext";
import { CommentContext } from "../../context/CommentContext";
import Comment from "../Comments/Comment";
import MyNavbar from "../Navbar";

export const BlogComments = ({ blog_id }) => {
  // Context and Auth data
  const { blogCommentLoading, setBlogCommentLoading, commentUpd } =
    useContext(CommentContext);

  // State for comments and loading status
  const [comments, setComments] = useState();
  const [loadingMessage, setLoadingMessage] = useState("Loading...");
  const [error, setError] = useState("");

  // Fetching blog comments
  const getBlogComments = async () => {
    try {
      const response = await api.get(
        "api/v1/comment/blog/" + blog_id + "/commentsWithUser"
      );
      setComments(response.data);
      // console.log("Api call for getting blog comments:- ", response.data);
      setBlogCommentLoading(false);
    } catch (error) {
      setError("Could not fetch comments");
      setBlogCommentLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    console.log("Use effect called with commentUpd value", commentUpd);
    getBlogComments();
  }, [commentUpd]);

  // Render loading state if comments are still loading
  if (blogCommentLoading) {
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

  // Render the blog comments if available
  return (
    <div>
      <div>
        <MyNavbar />
      </div>
      <div className="flex d-flex flex-column px-3 pb-3 w-100">
        {error && <div className="error_group">{error}</div>}
        {comments &&
          comments.map((comment) => (
            <div className="px-2 pb-2" key={comment.id}>
              <Comment comment={comment}></Comment>
            </div>
          ))}
      </div>
    </div>
  );
};

export default BlogComments;
