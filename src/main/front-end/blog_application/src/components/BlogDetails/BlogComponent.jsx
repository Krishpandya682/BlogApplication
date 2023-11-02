import React, { useContext, useEffect, useState } from "react";
import { AiOutlineClose, AiOutlineDelete } from "react-icons/ai";
import { FaEdit } from "react-icons/fa";
import ReactLoading from "react-loading";
import { useNavigate } from "react-router-dom";
import api from "../../api/axiosConfig";
import { useAuth } from "../../context/AuthContext";
import { CommentContextProvider } from "../../context/CommentContext";
import { EditBlogContext } from "../../context/EditBlogContext";
import BlogComments from "./BlogComments";
import EditBlog from "./EditBlog";
import PostComment from "../Comments/PostComment";
import "../helperFunctions";
import { lastUpdated } from "../helperFunctions";
import "../styles/BlogComponent.css";
import { confirmAlert } from "react-confirm-alert"; // Import
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css

import DOMPurify from "dompurify";

const BlogComponent = ({ id }) => {
  const navigate = useNavigate();
  const [blog, setBlog] = useState();
  const [profileURL, setProfileURL] = useState("/Profile");
  const [loading, setLoading] = useState(true);
  const { editing, setEditing, blogUpd, setBlogUpd } =
    useContext(EditBlogContext);
  const { currDbUser } = useAuth();
  async function getBlog(id) {
    console.log("Id:=", id);
    api
      .get("/api/v1/blog/" + id + "/BlogCreatorInfo")
      .then((response) => {
        setBlog(response.data);
        console.log("This is the blog", blog);
        if (!blog) {
          setBlogUpd(!blogUpd);
        }
        console.log("Blog user_id", blog.user_id);
        setProfileURL("/Profile/" + blog.user_id);
        setLoading(false);
      })
      .catch((e) => {
        console.log(e);
      });
  }
  useEffect(() => {
    // console.log("Curr logged in user not the same as creator",blog.user_id == currDbUser.id);
    console.log("Blogupd changed to :-", blogUpd);

    if (!id) {
      navigate("/");
    }
    getBlog(id);
  }, [blogUpd]);

  const refreshBlogComments = () => {
    BlogComments.getBlogComments();
  };

  function deleteBlog() {
    api.delete("/api/v1/blog/" + id).then(() => {
      navigate("/");
    });
  }
  function handleDeleteButtonClick(e) {
    e.preventDefault();
    confirmAlert({
      title: "Delete Confirmation",
      message: "Are you sure to delete this blog?",
      buttons: [
        {
          label: "Yes",
          onClick: () => deleteBlog(),
        },
        {
          label: "No",
          onClick: () => {
            return;
          },
        },
      ],
    });
  }
  function handleEditButtonClick(e) {
    e.preventDefault();
    setEditing(!editing);
    console.log("Edit Button Clicked");
  }

  if (loading) {
    return (
      <div className="loading">
        <ReactLoading type={"balls"} color={"blue"} height={50} width={100} />
      </div>
    );
  }

  return (
    <div className="blog-page">
      <div>
        {blog.user_id == currDbUser.id && (
          <div>
            <div className="edit_button">
              {!editing ? (
                <div>
                  <FaEdit size="2rem" onClick={handleEditButtonClick} />
                  <AiOutlineDelete
                    size="2rem"
                    onClick={handleDeleteButtonClick}
                  />
                </div>
              ) : (
                <AiOutlineClose size="2rem" onClick={handleEditButtonClick} />
              )}
            </div>
            {editing && (
              <div className="editComponent">
                <EditBlog blog={blog} />
              </div>
            )}{" "}
          </div>
        )}

        <div className="title-section">
          <h1 className="blog-title">{blog.blog_title}</h1>
        </div>
        <div className="creator-section">
          <img
            className="user-profile-pic"
            src={blog.user_profile_pic}
            alt="User Profile Picture"
          />
          <p className="creator-name">
            Written by: <a href={profileURL}>{blog.creator_name}</a>
          </p>
        </div>
        <div className="content">
          {blog.img_url && (
            <div className="content-image">
              <img className="blog-image" src={blog.img_url} alt="Blog Image" />
            </div>
          )}
          <div className="tags">
            Tags:-
            {blog.categories.map((category) => {
              console.log("Category is:-", category);
              return (
                <a id="category" href={"/blogs/" + category.id}>
                  {category.categoryName}
                </a>
              );
            })}
          </div>
          <div className="content_text">
            <div
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(blog.content),
              }}
            />
          </div>
        </div>
        <p className="last-updated">
          Last Updated: {lastUpdated(blog.updated)}
        </p>
      </div>
      <hr></hr>
      <CommentContextProvider>
        <div className="px-5">
          {" "}
          <div className="post_comment_component">
            <PostComment
              blog_id={id}
              /*refreshComments={refreshBlogComments}*/ reply_to={-1}
            />
          </div>
          <div className="comments_component">
            <BlogComments blog_id={id} refreshComments={refreshBlogComments} />
          </div>
        </div>
      </CommentContextProvider>
    </div>
  );
};

export default BlogComponent;
