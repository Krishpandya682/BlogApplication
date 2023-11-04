import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import React, { useEffect, useState } from "react";
import ReactLoading from "react-loading";
import ReactQuill from "react-quill";
import EditorToolbar, {
  modules,
  formats,
} from "../QuillRichTextEditor/Toolbar";
import "react-quill/dist/quill.snow.css";
import { useNavigate } from "react-router-dom";
import makeAnimated from "react-select/animated";
import CreatableSelect from "react-select/creatable";
import { v4 } from "uuid";
import api from "../../api/axiosConfig";
import { useAuth } from "../../context/AuthContext";
import { storage } from "../../firebase";
import MyNavbar from "../Navbar";
import "../styles/CreateBlog.scss";

const animatedComponents = makeAnimated();

export function CreateBlog() {
  const navigate = useNavigate();
  const { currDbUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState("Loading...");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categories, setCategories] = useState();
  const [selectCategories, setSelectCategories] = useState([]);
  const [imgUpload, setImgUpload] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState();

  const [error, setError] = useState();

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
      setLoadingMessage("Uploading image...");
      await uploadBytes(imageRef, imgUpload);

      console.log("Upload promise returned");
      const downloadUrl = await getDownloadURL(imageRef);
      console.log("Got the Image URL:-", downloadUrl);
      data.url = downloadUrl;
    }

    if (!title || !content || !selectedOptions) {
      setError("Please fill in all fields.");
      window.scrollTo(0, 0);
      setLoading(false);
      return;
    }

    try {
      setLoadingMessage("Uploading post...");
      const response = await api.post(`/api/v1/blog/${currDbUser.id}`, data);

      console.log(response.data);
      if (response.status === 200) {
        console.log("Blog added successfully, now adding categories!");
        const blogCategories = {
          blogId: response.data,
          categories: [],
        };
        selectedOptions.forEach((opt) => {
          blogCategories.categories.push(opt.value);
        });

        try {
          setLoadingMessage("Adding Categories...");
          const addCatsResponse = await api.post(
            "api/v1/category/AddBlogCategories",
            blogCategories
          );
          console.log("Categories added!");
          setLoading(false);
          // alert("Blog created successfully!");
        } catch (error) {
          setLoading(false);
          deleteObject(imageRef).then(() => {});
          console.error(error);
        }

        navigate("/blog/" + response.data);
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
    console.log("Handling create!", selectedOptions);
    setLoading(true);

    let data = {
      categoryName: inputValue,
    };
    api.post("/api/v1/category/", data).then((response) => {
      const newOption = { value: response.data, label: inputValue };
      setLoading(false);
      setSelectCategories((prev) => [...prev, newOption]);
      setSelectedOptions((prev) => {
        if (prev && prev.length > 0) {
          return [...prev, newOption];
        } else {
          return [newOption];
        }
      });
    });
  };

  useEffect(() => {
    api.get("/api/v1/category/").then((response) => {
      setCategories(response.data);
    });
  }, []);

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

  function removeError(e) {
    setError();
  }
  return (
    <div>
      <div>
        <MyNavbar />
      </div>
      <div className="create_page_container">
        <div className="blog_creation_form">
          <h2>Create a New Blog</h2>
          <form onSubmit={handleCreateBlog}>
            {error && <div className="error_group">{error}</div>}
            <div className="form-group">
              <label>Title</label>
              <div className="input">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter the title"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    removeError();
                  }}
                />
              </div>
            </div>
            <div className="form-group">
              <label>Categories</label>
              <div className="input">
                <CreatableSelect
                  closeMenuOnSelect={false}
                  components={animatedComponents}
                  onChange={(newSelected) => {
                    setSelectedOptions(newSelected);
                    removeError();
                  }}
                  isMulti
                  defaultValue={selectedOptions}
                  options={selectCategories}
                  onCreateOption={handleCreate}
                />
              </div>
            </div>

            <div className="form-group h-20 post_content">
              <label>Content</label>
              <div className="input">
                <EditorToolbar />
                <ReactQuill
                  theme="snow"
                  placeholder="Write your blog"
                  value={content}
                  onChange={setContent}
                  onFocus={removeError}
                  modules={modules}
                  formats={formats}
                />
              </div>
            </div>
            <div className="form-group mt-5">
              <label>Add Blog Image</label>
              <div className="input">
                <input
                  type="file"
                  className="form-control mt-1"
                  onChange={(e) => {
                    setImgUpload(e.target.files[0]);
                    removeError();
                  }}
                />
              </div>
            </div>
            <div className="button_group">
              <button type="submit" className="btn btn-primary">
                Create Blog
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateBlog;
