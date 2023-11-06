import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import React, { useEffect, useState } from "react";
import ReactLoading from "react-loading";
import ReactQuill from "react-quill";
import { AiOutlineClose } from "react-icons/ai";
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
import { HttpStatusCode } from "axios";

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
  const [imgUpload, setImgUpload] = useState();
  const [selectedOptions, setSelectedOptions] = useState();
  const [error, setError] = useState();
  let imageRef = null;

  // Function to handle the creation of a blog
  const handleCreateBlog = async (e) => {
    e.preventDefault();
    let data = {
      title: title,
      content: content,
      creator_id: currDbUser.id,
    };

    if (imgUpload && imgUpload !== null) {
      const fileName = "blog_images/" + imgUpload.name + v4();
      imageRef = ref(storage, "images/" + fileName);

      setLoading(true);
      setLoadingMessage("Uploading image...");
      await uploadBytes(imageRef, imgUpload);

      const downloadUrl = await getDownloadURL(imageRef);
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

      if (response.status === HttpStatusCode.Created) {
        const blogCategories = {
          blogId: response.data,
          categories: [],
        };

        selectedOptions.forEach((opt) => {
          blogCategories.categories.push(opt.value);
        });

        setLoadingMessage("Adding Categories...");
        const addCatsResponse = await api.post(
          "api/v1/category/AddBlogCategories",
          blogCategories
        );

        setLoading(false);
        navigate("/blog/" + response.data);
      } else {
        setError("Could not create blog!");
        setLoading(false);
        console.log("Error:", response);
      }
    } catch (error) {
      deleteObject(imageRef).then(() => {});
      console.log("Error: ", error);
      setError("Create request did not go through!");
      setLoading(false);
    }
  };

  // Function to handle the creation of a new category
  const handleCreate = (inputValue) => {
    setLoading(true);
    let data = {
      categoryName: inputValue,
    };

    api
      .post("/api/v1/category/", data)
      .then((response) => {
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
      })
      .catch((e) => {
        console.log(e);
        setError("Could not create category!");
        setLoading(false);
      });
  };

  // Fetch categories on component mount
  useEffect(() => {
    api.get("/api/v1/category/").then((response) => {
      setCategories(response.data);
    }).catch((e) => {
      console.log(e);
      setError("Could not get categories!");
      setLoading(false);
    });;
  }, []);

  // Update categories once they are fetched
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

  // Rendering loading state while data is being fetched
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

  // Function to remove error
  function removeError() {
    setError();
  }

  return (
    <div>
      <MyNavbar />
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
              <div className="input d-flex align-items-center">
                <input
                  type="file"
                  className="form-control mt-1 mr-2"
                  accept="image/png, image/gif, image/jpeg"
                  onChange={(e) => {
                    if (e.target.files[0]) {
                      setImgUpload(e.target.files[0]);
                    }

                    removeError();

                    if (e.target.files[0] && e.target.files[0].size > 2097152) {
                      setError("File is too big (Maximum image size: 2MB)!");
                      setImgUpload();
                      return;
                    }
                  }}
                />
                <AiOutlineClose
                  size={"2rem"}
                  onClick={() => {
                    setImgUpload();
                  }}
                ></AiOutlineClose>
              </div>
              <label>
                Selected: {imgUpload && imgUpload !== null && imgUpload.name}
              </label>
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
