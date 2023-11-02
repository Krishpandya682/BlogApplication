import React, { useEffect, useState } from "react";
import ReactLoading from "react-loading";
import { useParams } from "react-router-dom";
import api from "../../api/axiosConfig";
import { useAuth } from "../../context/AuthContext";
import BlogCard from "./BlogCard";
import MyNavbar from "../Navbar";
import "../styles/BlogList.css";

export const Blogs = ({ userId }) => {
  const { currUser, currDbUser } = useAuth();
  const [blogs, setBlogs] = useState();
  const [userName, setUserName] = useState();
  const [categoryName, setCategoryName] = useState();
  const [loading, setLoading] = useState(true);
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
        <ReactLoading type={"balls"} color={"blue"} height={50} width={100} />
      </div>
    );
  }
  return (
    <div>
      <div>
        <MyNavbar />
      </div>
      <div className="content_container">
        <div className="title">
          {!userName && !categoryName && <h2> Recent Blogs</h2>}
          {userName && <h2>{userName}'s Recent Blogs</h2>}
          {categoryName && <h2>Recent {categoryName} Blogs</h2>}
        </div>
        <hr></hr>
        <div className="flex d-flex flex-column p-3 w-50">
          {blogs.length == 0 ? (
            <p>{"No posts yet"}</p>
          ) : (
            blogs.map((blog) => <BlogCard blog={blog} />)
          )}
        </div>
      </div>
    </div>
  );
};
export default Blogs;
