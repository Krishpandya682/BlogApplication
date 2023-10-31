import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axiosConfig";
import MyNavbar from "./Navbar";
import ReactLoading from "react-loading";
import "./styles/CreateBlog.scss";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { storage } from "../firebase";
import { v4 } from "uuid";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import CreatableSelect from "react-select/creatable";

const animatedComponents = makeAnimated();

export function CreateBlog() {
  const navigate = useNavigate();
  const { currDbUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categories, setCategories] = useState();
  const [selectCategories, setSelectCategories] = useState([]);
  const [imgUpload, setImgUpload] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState();
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

    if (!title || !content || !selectedOptions) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      const response = await api.post(`/api/v1/blog/${currDbUser.id}`, data);

      console.log(response.data);
      if (response.status === 200) {
        console.log(
          "Blog added successfully, now adding categories!"
        )
        const blogCategories = {
          blogId: response.data,
          categories: [],
        };
        selectedOptions.forEach((opt) => {
          blogCategories.categories.push(opt.value);
        });

        try {
          const addCatsResponse = await api.post(
            "api/v1/category/AddBlogCategories",
            blogCategories
          );
          console.log(
            "Categories added!"
          )
          setLoading(false);
          alert("Blog created successfully!");

        } catch (error) {
          setLoading(false);
          deleteObject(imageRef).then(() => {});
          console.error(error);
        }

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

  const handleCreate = (inputValue) => {
    setLoading(true);

    let data = {
      categoryName: inputValue,
    };
    api.post("/api/v1/category/", data).then((response) => {
      const newOption = { value: response, label: inputValue };
      setLoading(false);
      setSelectCategories((prev) => [...prev, newOption]);
    });
  };

  useEffect(() => {
    api.get("/api/v1/category/").then((response) => {
      setCategories(response.data);
    });
  }, []);

  useEffect(() => {
    console.log("Selected Options Updated:-", selectedOptions);
  }, [selectedOptions]);

  useEffect(() => {
    if (categories) {
      let arr = [];
      categories.map((cat) => {
        arr.push({ value: cat.id, label: cat.categoryName });
      });
      setSelectCategories(arr);
      setLoading(false);
    }
  }, [categories]);

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
            <CreatableSelect
              closeMenuOnSelect={false}
              components={animatedComponents}
              onChange={(newSelected) => setSelectedOptions(newSelected)}
              isMulti
              options={selectCategories}
              onCreateOption={handleCreate}
            />
          </div>

          <div className="form-group">
            <label>Content</label>
            <ReactQuill
              theme="snow"
              placeholder="Write your blog"
              value={content}
              onChange={setContent}
            />
          </div>
          <div className="form-group mt-3">
            <label>Add Blog Image</label>
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
