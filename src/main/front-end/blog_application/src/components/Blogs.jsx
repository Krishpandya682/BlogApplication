import React from "react";
import { useAuth } from "../context/AuthContext";
import ReactLoading from "react-loading";
import { useState, useEffect } from "react";
import api from "../api/axiosConfig";
import { useSearchParams } from "react-router-dom";
import MyNavbar from "./Navbar";
import BlogCard from "./BlogCard";

export const Blogs = () => {
  const { currUser, currDbUser } = useAuth();
  const [blogs, setBlogs] = useState();
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const id = searchParams.get("id");

  const getBlogs = async () => {
    try {
      console.log("API");
      const response = await api.get("api/v1/blog/getBlogCardsInfo");
      setBlogs(response.data);
      console.log("Api call:- ", response.data);
      setLoading(false);
    } catch (e) {
      console.log(e);
    }
  };
  const getUserBlogs = async () => {
    try {
      console.log("API");
      const response = await api.get("api/v1/blog/byCreator/" + id);
      setBlogs(response.data);
      console.log("Api call:- ", response.data);
      setLoading(false);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (!id) {
      getBlogs();
    } else {
      getUserBlogs();
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
        <MyNavbar/>
      </div>
      Blogs for <p>{currDbUser.id}</p>
      <p>Number of Blogs: {blogs.length}</p>
      
      <div className="flex d-flex flex-column p-3 w-50">
      {blogs.map((blog) => (
        <p><BlogCard blog={blog} /></p>
      ))}
      </div>
    </div>
  );
};
export default Blogs;
