import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axiosConfig";
import MyNavbar from "./Navbar";
import ReactLoading from "react-loading";
import './styles/CreateBlog.scss'
import { useNavigate } from "react-router-dom";

export function CreateBlog() {
  const navigate = useNavigate();
  const { currDbUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [url, setUrl] = useState("");

  const handleCreateBlog = async (e) => {
    e.preventDefault();
    const data = {
      title: title,
      content: content,
      url: url,
      creator_id: currDbUser.id,
    };

    if (!title || !content || !url) {
      alert("Please fill in all fields.");
      return;
    }
    setLoading(true);
    const response = await api
      .post(`/api/v1/blog/${currDbUser.id}`, data)
      .then((response) => {
        setLoading(false);
        console.log(response.data)
        if (response.status === 200) {
          alert("Blog created successfully!");
          navigate("/blogs/"+response.data);
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
      <div>
        <MyNavbar />
      </div>
      <div className="blog_creation_form">
        <h2>Create a New Blog</h2>
        <form onSubmit={handleCreateBlog}>
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter the title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Content</label>
            <textarea
              className="form-control"
              rows="5"
              placeholder="Write your blog content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>URL</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter a URL"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Create Blog
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateBlog;
