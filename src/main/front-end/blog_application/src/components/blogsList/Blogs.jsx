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

  // State variables for holding data
  const [blogs, setBlogs] = useState();
  const [userName, setUserName] = useState();
  const [categoryName, setCategoryName] = useState();
  const [loading, setLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState("Loading...");
  const [error, setError] = useState();
  let { catId } = useParams();

  // Function to fetch all blogs
  const getBlogs = async () => {
    try {
      const response = await api.get("api/v1/blog/getBlogCardsInfo");
      setBlogs(response.data);
      setLoading(false);
    } catch (e) {
      console.log(e);
      setError("Could not fetch blogs!");
      setLoading(false);
    }
  };

  // Function to fetch blogs by a specific user
  const getUserBlogs = async () => {
    try {
      const response = await api.get("api/v1/blog/byCreator/" + userId);
      setBlogs(response.data);

      // Fetch the user's name based on the provided userId
      api.get("api/v1/user/" + userId).then((response) => {
        setUserName(response.data.name);
        setLoading(false);
      });
    } catch (e) {
      console.log(e);
    }
  };

  // Function to fetch blogs by a specific category
  const getCategoryBlogs = async () => {
    try {
      const response = await api.get("api/v1/category/blogByCategory/" + catId);
      setBlogs(response.data);

      // Fetch the category name based on the provided category ID
      api.get("api/v1/category/" + catId).then((response) => {
        setCategoryName(response.data.categoryName);
        setLoading(false);
      });
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    setLoadingMessage("Getting the blogs...");

    // Determine the API call based on the available userId or catId
    if (userId) {
      getUserBlogs();
    } else if (catId) {
      getCategoryBlogs();
    } else {
      getBlogs();
    }
  }, []);

  if (loading) {
    // Display loading spinner while fetching data
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
      <MyNavbar />
      <div className="content_container">
        <div className="d-flex align-items-center justify-content-between">
          <div className="title">
            {error && <div className="error_group">{error}</div>}

            {/* Display title based on fetched userName or categoryName */}
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
        <hr />
        <div className="blog_list flex d-flex flex-row p-3 w-80">
          {blogs && blogs.length === 0 ? (
            <p>No posts yet</p>
          ) : (
            // Map through the blogs and render individual BlogCard components
            blogs.map((blog, index) => {
              return <BlogCard key={index} blog={blog} index={index} />;
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default Blogs;
