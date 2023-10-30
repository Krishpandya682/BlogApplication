import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axiosConfig";
import MyNavbar from "./Navbar";
import ReactLoading from "react-loading";
import "./styles/PostComment.scss";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { CommentContext } from "../context/CommentContext";
import { PostCommentContext } from "../context/PostComment";

export function PostComment({ blog_id, /*refreshComments,*/ reply_to }) {
  const { commentUpd, setCommentUpd, setBlogCommentLoading } =
    useContext(CommentContext);
  const navigate = useNavigate();
  const { currDbUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");

  const handlePostComment = async (e) => {
    e.preventDefault();
    console.log("Replying to :- ", reply_to);
    const data = {
      replyTo: reply_to,
      comment: content,
      commentor_id: currDbUser.id,
      blog_id: blog_id,
    };

    if (!content) {
      alert("Can't make an empty.");
      return;
    }
    setLoading(true);
    const response = await api
      .post("/api/v1/comment/blog/" + blog_id + "/user/" + currDbUser.id, data)
      .then((response) => {
        console.log("Comment posted with ID=" + response.data);
        if (response.status === 200) {
          setContent("");
          console.log("Comment section emptied");
          setBlogCommentLoading(true);
          console.log("blog comment set to leading");
          setCommentUpd(commentUpd + 1);
          console.log("Comment update value updated");
          setLoading(false);
          console.log("Comment section loading stopped");
          // You can redirect the user or perform other actions here
        } else {
          console.log("Error:", response.statusText);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  if (loading) {
    return (
      <ReactLoading type={"balls"} color={"blue"} height={667} width={375} />
    );
  }
  return (
    <div>
      <div className="post_comment">
        <h2>Comments</h2>
        <form onSubmit={handlePostComment}>
          <div className="form-group">
            <textarea
              className="form-control"
              rows="3"
              placeholder="Write your comment"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
          <div className="form-group_button">
            {" "}
            <button type="submit" className="btn btn-primary">
              Post Comment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PostComment;
