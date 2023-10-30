import React from "react";
import { useAuth } from "../context/AuthContext";
import ReactLoading from "react-loading";
import { useState, useEffect } from "react";
import api from "../api/axiosConfig";
import MyNavbar from "./Navbar";
import { useContext } from "react";
import { CommentContext } from "../context/CommentContext";
import { lastUpdated } from "./helperFunctions";
import Comment from "./Comment";

export const BlogComments = ({ blog_id }) => {
  const { blogCommentLoading, setBlogCommentLoading, commentUpd } =
    useContext(CommentContext);
  const { currUser, currDbUser } = useAuth();
  const [comments, setComments] = useState();

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
        <ReactLoading type={"balls"} color={"blue"} height={50} width={100} />
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
