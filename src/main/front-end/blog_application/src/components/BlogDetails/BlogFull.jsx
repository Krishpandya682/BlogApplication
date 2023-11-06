

import React from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { EditBlogContextProvider } from "../../context/EditBlogContext";
import BlogComponent from "./BlogComponent";
import MyNavbar from "../Navbar";
import "../styles/blogFull.css";

export default function BlogFull() {
  // Accessing authentication data
  const { currDbUser } = useAuth();

  // Get the 'id' parameter from the URL
  const { id } = useParams();

  return (
    <div>
      {/* Render the navigation bar */}
      <div>
        <MyNavbar />
      </div>

      {/* Provide the EditBlogContext for the BlogComponent */}
      <EditBlogContextProvider>
        <div className="blogComponent">
          {/* Render the BlogComponent with the retrieved 'id' */}
          <BlogComponent id={parseInt(id)} />
        </div>
      </EditBlogContextProvider>
    </div>
  );
}
