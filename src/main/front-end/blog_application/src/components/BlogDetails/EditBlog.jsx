import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import React, { useContext, useState, useEffect } from "react";
import ReactLoading from "react-loading";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useNavigate } from "react-router-dom";
import makeAnimated from "react-select/animated";
import CreatableSelect from "react-select/creatable";
import { v4 } from "uuid";
import api from "../../api/axiosConfig";
import { useAuth } from "../../context/AuthContext";
import { EditBlogContext } from "../../context/EditBlogContext";
import { storage } from "../../firebase";
import MyNavbar from "../Navbar";
import "../styles/EditBlog.css";

const animatedComponents = makeAnimated();

export function EditBlog({ blog }) {
  const navigate = useNavigate();
  const { currDbUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categories, setCategories] = useState();
  const [selectCategories, setSelectCategories] = useState([]);
  const [imgUpload, setImgUpload] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState();

  const [error, setError] = useState();
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

        const blogCategories = {
          blogId: blog.blog_id,
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
          console.log("Categories added!");
          setLoading(false);
          alert("Blog created successfully!");
        } catch (error) {
          setLoading(false);
          deleteObject(imageRef).then(() => {});
          console.error(error);
        }
        navigate("/blog/" + blog.blog_id);
        



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

      let preSelectedCategories = [];
      blog.categories.forEach((cat) => {
        preSelectedCategories.push({
          value: cat.id,
          label: cat.categoryName,
        });
        console.log("PReselected is:", preSelectedCategories);
        setSelectCategories(preSelectedCategories);
        setSelectedOptions(preSelectedCategories);
        console.log("Selected Options: ", selectedOptions);
      });
    });
  }, []);

  function removeError(e) {
    setError();
  }
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
          <div className="form-group">
            <label>Content</label>

            <ReactQuill defaultValue={blog.content} onChange={setContent} />
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
