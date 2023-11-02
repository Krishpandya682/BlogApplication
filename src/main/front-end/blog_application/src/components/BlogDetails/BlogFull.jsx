import React from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { EditBlogContextProvider } from "../../context/EditBlogContext";
import BlogComponent from "./BlogComponent";
import MyNavbar from "../Navbar";
import "../styles/blogFull.css";

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
