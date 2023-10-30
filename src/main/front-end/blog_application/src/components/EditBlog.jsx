import React, { useContext, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axiosConfig";
import MyNavbar from "./Navbar";
import ReactLoading from "react-loading";
import "./styles/EditBlog.scss";
import { useNavigate } from "react-router-dom";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { storage } from "../firebase";
import { v4 } from "uuid";
import { EditBlogContext } from "../context/EditBlogContext";

export function EditBlog({ blog }) {
  const navigate = useNavigate();
  const { currDbUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imgUpload, setImgUpload] = useState(null);
  const { editing, setEditing, blogUpd, setBlogUpd } =
    useContext(EditBlogContext);

  let imageRef = null;
  const handleEditBlog = async (e) => {
    e.preventDefault();
    let data = {};
    if (title && title != "" && title != blog.title) {
      data.title = title;
    }
    if (content && content != "" && content != blog.content) {
      data.content = content;
    }
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
    console.log("Trying to write data: ", data, blog);
    try {
      const response = await api.put(`/api/v1/blog/${blog.blog_id}`, data);
      setLoading(false);
      console.log(response.data);
      if (response.status === 200) {
        alert("Blog Updated successfully!");

        navigate("/blogs/" + blog.blog_id);
        setEditing(false);
        setBlogUpd(blogUpd + 1);
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
        <h2>Edit the Blog</h2>
        <form onSubmit={handleEditBlog}>
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              className="form-control"
              defaultValue={blog.blog_title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Content</label>
            <textarea
              className="form-control"
              rows="5"
              defaultValue={blog.content}
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
          <div className="form-group form_group_footer mt-3">
            <button type="submit" className="btn btn-primary">
              Update Blog
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditBlog;
