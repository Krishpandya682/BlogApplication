import React, { useEffect, useState } from "react";
import ReactLoading from "react-loading";
import { useParams } from "react-router-dom";
import api from "../../api/axiosConfig";
import { useAuth } from "../../context/AuthContext";
import BlogCard from "./BlogCard";
import MyNavbar from "../Navbar";
import Button from "react-bootstrap/esm/Button";
import "../styles/BlogList.css";

export const Blogs = ({ userId }) => {
  const { currUser, currDbUser } = useAuth();
  const [blogs, setBlogs] = useState();
  const [userName, setUserName] = useState();
  const [categoryName, setCategoryName] = useState();
  const [loading, setLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState("Loading...");
  let { catId } = useParams();

  const getBlogs = async () => {
    try {
      console.log("Blogs API Call");
      const response = await api.get("api/v1/blog/getBlogCardsInfo");
      setBlogs(response.data);
      console.log("Api call:- ", response.data);
      setLoading(false);
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  };
  const getUserBlogs = async () => {
    try {
      console.log("Blogs API Call");
      console.log("Calling posts for:-", userId);
      const response = await api.get("api/v1/blog/byCreator/" + userId);
      setBlogs(response.data);
      console.log("Api call:- ", response.data);
      console.log("Getting User name");
      api.get("api/v1/user/" + userId).then((response) => {
        setUserName(response.data.name);
        setLoading(false);
      });
    } catch (e) {
      console.log(e);
    }
  };
  const getCategoryBlogs = async () => {
    try {
      console.log("Blogs API Call for category");
      console.log("Calling posts for category:-", catId);
      const response = await api.get("api/v1/category/blogByCategory/" + catId);
      setBlogs(response.data);
      console.log("Category Api call:- ", response.data);
      console.log("Getting Category name");
      api.get("api/v1/category/" + catId).then((response) => {
        console.log("Cat name response", response.data.categoryName);
        setCategoryName(response.data.categoryName);
        setLoading(false);
      });
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    console.log("User Id= ", userId);
    console.log("Category Id= ", catId);
    setLoadingMessage("Getting the blogs...");
    if (userId) {
      getUserBlogs();
    } else if (catId) {
      getCategoryBlogs();
    } else {
      getBlogs();
    }
  }, []);

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

  return (
    <div>
      <div>
        <MyNavbar />
      </div>
      <div className="content_container">
        <div className="d-flex align-items-center justify-content-between">
          <div className="title">
            {!userName && !categoryName && <h2> Recent Blogs</h2>}
            {userName && <h2>{userName}'s Recent Blogs</h2>}
            {categoryName && <h2>Recent {categoryName} Blogs</h2>}
          </div>
          <div className="create_blog_btn">
            <Button className="myButton" href="/createBlog">
              Create Blog
            </Button>
          </div>
        </div>
        <hr></hr>
        <div className="blog_list flex d-flex flex-row p-3 w-80">
          {blogs.length == 0 ? (
            <p>{"No posts yet"}</p>
          ) : (
            blogs.map((blog, index) => {
              return <BlogCard blog={blog} index={index} />;
            })
          )}
        </div>
      </div>
    </div>
  );
};
export default Blogs;
