import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axiosConfig";
import MyNavbar from "./Navbar";
import ReactLoading from "react-loading";
import "./styles/CreateBlog.scss";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";

import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { storage } from "../firebase";
import { v4 } from "uuid";

export function CreateBlog() {
  const navigate = useNavigate();
  const { currDbUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imgUpload, setImgUpload] = useState(null);
  let imageRef = null;
  const handleCreateBlog = async (e) => {
    e.preventDefault();
    let data = {
      title: title,
      content: content,
      creator_id: currDbUser.id,
    };
    console.log("Method called");
    if (imgUpload != null) {
      console.log("Image is not null", imgUpload);
      const fileName = "blog_images/" + imgUpload.name + v4();
      imageRef = ref(storage, "images/" + fileName);

      console.log("ref is ", imageRef);

      setLoading(true);
      await uploadBytes(imageRef, imgUpload);

      console.log("Upload promise returned");
      const downloadUrl = await getDownloadURL(imageRef);
      console.log("Got the Image URL:-", downloadUrl);
      data.url = downloadUrl;
    }

    if (!title || !content) {
      alert("Please fill in all fields.");
      return;
    }
    try {
      const response = await api.post(`/api/v1/blog/${currDbUser.id}`, data);
      setLoading(false);
      console.log(response.data);
      if (response.status === 200) {
        alert("Blog created successfully!");
        navigate("/blogs/" + response.data);
        // You can redirect the user or perform other actions here
      } else {
        console.log("Error:", response.statusText);
      }
    } catch (error) {
      deleteObject(imageRef).then(() => {});
      console.error(error);
    }
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
            <ReactQuill></ReactQuill>
            <textarea
              className="form-control"
              rows="5"
              placeholder="Write your blog content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
          <div className="form-group mt-3">
            <label>Profile Pic</label>
            <input
              type="file"
              className="form-control mt-1"
              onChange={(e) => {
                setImgUpload(e.target.files[0]);
              }}
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
