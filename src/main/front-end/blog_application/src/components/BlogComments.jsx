import React from "react";
import { useAuth } from "../context/AuthContext";
import ReactLoading from "react-loading";
import { useState, useEffect } from "react";
import api from "../api/axiosConfig";
import MyNavbar from "./Navbar";

export const BlogComments = ({blog_id}) => {
  const { currUser, currDbUser } = useAuth();
  const [comments, setComments] = useState();
  const [loading, setLoading] = useState(true);

  const getBlogComments = async () => {
    try {
      console.log("API");
      const response = await api.get("api/v1/comment/blog/"+blog_id+"/comments");
      setComments(response.data);
      console.log("Api call:- ", response.data);
      setLoading(false);
    } catch (e) {
      console.log(e);
    }
  };
  
  useEffect(() => {
    getBlogComments();
  }, []);
  if (loading) {
    return (
      <div className="loading">
        <ReactLoading type={"balls"} color={"blue"} height={50} width={100} />
      </div>
    );
  }
  return (
    <div>
      <div>
        <MyNavbar/>
      </div>
      Comments for <p>{blog_id}</p>
      <p>Number of Comments: {comments.length}</p>
      
      <div className="flex d-flex flex-column p-3 w-50">
      {comments.map((comment) => (
        <p>{comment.comment}</p>
      ))}
      </div>
    </div>
  );
};
export default BlogComments;
