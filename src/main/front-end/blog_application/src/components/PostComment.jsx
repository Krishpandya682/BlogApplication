import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axiosConfig";
import MyNavbar from "./Navbar";
import ReactLoading from "react-loading";
import "./styles/CreateBlog.scss";
import { useNavigate } from "react-router-dom";

export function PostComment({blog_id}) {
  const navigate = useNavigate();
  const { currDbUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");
  

  const handlePostComment = async (e) => {
    e.preventDefault();
    const data = {
      comment: content,
      commentor_id: currDbUser.id,
      blog_id: blog_id
    };

    if (!content) {
      alert("Can't make an empty.");
      return;
    }
    setLoading(true);
    const response = await api
      .post("/api/v1/comment/blog/"+blog_id+"/user/"+currDbUser.id, data)
      .then((response) => {
        setLoading(false);
        console.log(response.data);
        if (response.status === 200) {
          alert("Comment created successfully!");
          setContent("");
          // You can redirect the user or perform other actions here
        } else {
          console.log("Error:", response.statusText);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  if (loading) {
    return (
      <ReactLoading type={"balls"} color={"blue"} height={667} width={375} />
    );
  }
  return (
    <div>
      <div className="blog_creation_form">
        <h2>Comments</h2>
        ID - {blog_id}
        <form onSubmit={handlePostComment}>
          <div className="form-group">
            <textarea
              className="form-control"
              rows="3"
              placeholder="Write your blog content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>

          <button type="submit" className="btn btn-primary">
            Post Comment
          </button>
        </form>
      </div>
    </div>
  );
}

export default PostComment;
