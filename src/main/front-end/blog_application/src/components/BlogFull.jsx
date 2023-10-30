import Card from "react-bootstrap/Card";
import "./styles/blogFull.scss";
import { onAuthStateChanged } from "firebase/auth";
import React, { useState, useEffect, createContext, useContext } from "react";
import { auth } from "../firebase";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../api/axiosConfig";
import { useAuth } from "../context/AuthContext";
import ReactLoading from "react-loading";
import "./styles/Profile.scss";
import MyNavbar from "./Navbar";
import PostComment from "./PostComment";
import BlogComments from "./BlogComments";
import EditBlog from "./EditBlog";
import Button from "react-bootstrap/Button";
import BlogComponent from "./BlogComponent";
import { EditBlogContextProvider } from "../context/EditBlogContext";

export default function BlogFull() {
  const { currDbUser } = useAuth();
  const { id } = useParams();

  return (
    <div>
      <div>
        <MyNavbar />
      </div>
      <EditBlogContextProvider>
        <div className="blogComponent">
          <BlogComponent id={id}></BlogComponent>
        </div>
      </EditBlogContextProvider>
    </div>
  );
}
