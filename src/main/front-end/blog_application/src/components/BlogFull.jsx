import React from "react";
import Card from "react-bootstrap/Card";
import "./styles/blogFull.scss";
import { onAuthStateChanged } from "firebase/auth";
import { useState, useEffect } from "react";
import { auth } from "../firebase";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axiosConfig";
import { useAuth } from "../context/AuthContext";
import ReactLoading from "react-loading";
import "./styles/Profile.scss";
import MyNavbar from "./Navbar";
import PostComment from "./PostComment";
import BlogComments from "./BlogComments";

export default function BlogFull() {
  const { currDbUser } = useAuth();
  const [blog, setBlog] = useState();
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();

  async function getBlog(id) {
    console.log("Id:=",id);
    api
      .get("/api/v1/blog/" + id + "/BlogCreatorInfo")
      .then((response) => {
        setBlog(response.data);
        console.log(blog);
        setLoading(false);
      })
      .catch((e) => {
        console.log(e);
      });
  }
  useEffect(() => {
    if (!id) {
      navigate("/");
    }
    getBlog(id);
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
      <div className="blog-page">
        <div className="title-section">
          <h1 className="blog-title">{blog.blog_title}</h1>
        </div>
        <div className="creator-section">
          <p className="creator-name">Written by: {blog.creator_name}</p>
          <img
            className="user-profile-pic"
            src={blog.user_profile_pic}
            alt="User Profile Picture"
          />
        </div>
        <div className="content">
          <div className="content-image">
            <img className="blog-image" src={blog.img_url} alt="Blog Image" />
          </div>
          <div className="content_text">
            <div>{blog.content}</div>
          </div>
        </div>
        <p className="last-updated">Last Updated: {blog.updated}</p>
      </div>
      <div>
        <BlogComments blog_id = {id}/>
      </div>
      <div>
        <PostComment blog_id = {id}/>
      </div>
    </div>
  );
}
