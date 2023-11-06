import React, { useContext, useEffect, useState } from "react";
import ReactLoading from "react-loading";
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
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import "react-quill/dist/quill.core.css";
import DOMPurify from "dompurify";
import { deleteObject, ref } from "firebase/storage";
import { storage } from "../../firebase";
import { AiOutlineClose, AiOutlineDelete } from "react-icons/ai";
import { FaEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const BlogComponent = ({ id }) => {
  const navigate = useNavigate();
  const [blog, setBlog] = useState();
  const [profileURL, setProfileURL] = useState("/Profile");
  const [loading, setLoading] = useState(true);
  const { editing, setEditing, blogUpd, setBlogUpd } =
    useContext(EditBlogContext);
  const { currDbUser } = useAuth();
  const [loadingMessage, setLoadingMessage] = useState("Loading...");
  const [error, setError] = useState("");

  // Fetch blog data by ID
  async function getBlog(id) {
    setLoadingMessage("Getting Blog...");
    api
      .get("/api/v1/blog/" + id + "/BlogCreatorInfo")
      .then((response) => {
        setBlog(response.data);
        if (!blog) {
          setBlogUpd(!blogUpd);
        } else {
          setProfileURL("/Profile/" + blog.user_id);
        }
        setLoading(false);
      })
      .catch((e) => {
        setError("Could not fetch error");
        setLoading(false);
        console.log("Could not fetch:", e);
      });
  }

  useEffect(() => {
    if (!id) {
      navigate("/");
    }
    getBlog(id);
  }, [blogUpd]);

  // Refresh blog comments
  const refreshBlogComments = () => {
    BlogComments.getBlogComments();
  };

  // Delete blog post
  async function deleteBlog() {
    if (blog.img_url) {
      const oldRef = ref(storage, blog.img_url);
      await deleteObject(oldRef);
    }
    api
      .delete("/api/v1/blog/" + id)
      .then(() => {
        navigate("/");
      })
      .catch((e) => {
        setError("Could not delete blog");
      });
  }

  // Handle delete button click
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

  // Handle edit button click
  function handleEditButtonClick(e) {
    e.preventDefault();
    setEditing(!editing);
  }

  // Render loading state if still loading
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
    <div className="blog-page">
      {error && <div className="error_group">{error}</div>}

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
          )}
        </div>
      )}

      <div className="title-section">
        <h1 className="blog-title">{blog.blog_title}</h1>
      </div>
      <a className="myLink" href={profileURL}>
        <div className="creator-section">
          <img
            className="user-profile-pic"
            src={blog.user_profile_pic}
            alt="User Profile Picture"
          />
          <p className="creator-name">Written by: {blog.creator_name}</p>
        </div>
      </a>
      <div className="content">
        {blog.img_url && (
          <div className="content-image">
            <img className="blog-image" src={blog.img_url} alt="Blog Image" />
          </div>
        )}

        <div className="blog_categories_section">
          <div className="categories_list">
            {blog.categories.map((cat) => {
              return (
                <a className="category_tag" href={"/blogs/" + cat.id}>
                  <div className="category_tag_div">{cat.categoryName}</div>
                </a>
              );
            })}
          </div>
        </div>
        <div className="content_text">
          <div className="ql-snow">
            <div
              className="ql-editor"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(blog.content),
              }}
            />
          </div>
        </div>
      </div>

      <p className="last-updated">Last Updated: {lastUpdated(blog.updated)}</p>
      <hr></hr>

      <CommentContextProvider>
        <div className="px-5">
          <div className="post_comment_component">
            <PostComment blog_id={id} reply_to={-1} />
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
