import React, { useContext, useEffect, useState } from "react";
import ReactLoading from "react-loading";
import api from "../../api/axiosConfig";
import { useAuth } from "../../context/AuthContext";
import { CommentContext } from "../../context/CommentContext";
import Comment from "../Comments/Comment";
import MyNavbar from "../Navbar";

export const BlogComments = ({ blog_id }) => {
  const { blogCommentLoading, setBlogCommentLoading, commentUpd } =
    useContext(CommentContext);
  const { currUser, currDbUser } = useAuth();
  const [comments, setComments] = useState();
  const [loadingMessage, setLoadingMessage] = useState("Loading...");


  const getBlogComments = async () => {
    console.log("API");
    await api
      .get("api/v1/comment/blog/" + blog_id + "/commentsWithUser")
      .then((response) => {
        setComments(response.data);
        console.log("Api call for getting blog comments:- ", response.data);
        setBlogCommentLoading(false);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  useEffect(() => {
    console.log("Use effect called with commenUPd value", commentUpd);
    getBlogComments();
  }, [commentUpd]);


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
  return (
    <div>
      <div>
        <MyNavbar />
      </div>
      <div className="flex d-flex flex-column px-3 pb-3 w-100">
        {comments.map((comment) => (
          <div className="px-2 pb-2">
            <Comment comment={comment}></Comment>
          </div>
        ))}
      </div>
    </div>
  );
};
export default BlogComments;
