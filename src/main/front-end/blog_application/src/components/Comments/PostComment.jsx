// import React, { useContext, useState } from "react";
// import ReactLoading from "react-loading";
// import { useNavigate } from "react-router-dom";
// import api from "../../api/axiosConfig";
// import { useAuth } from "../../context/AuthContext";
// import { CommentContext } from "../../context/CommentContext";
// import "../styles/PostComment.css";

// export function PostComment({ blog_id, /*refreshComments,*/ reply_to }) {
//   const { commentUpd, setCommentUpd, setBlogCommentLoading } =
//     useContext(CommentContext);
//   const navigate = useNavigate();
//   const { currDbUser } = useAuth();
//   const [loading, setLoading] = useState(false);
//   const [loadingMessage, setLoadingMessage] = useState("Loading...");
//   const [content, setContent] = useState("");
//   const [error, setError] = useState();

//   function removeError(e) {
//     setError();
//   }
//   const handlePostComment = async (e) => {
//     e.preventDefault();
//     console.log("Replying to :- ", reply_to);
//     const data = {
//       replyTo: reply_to,
//       comment: content,
//       commentor_id: currDbUser.id,
//       blog_id: blog_id,
//     };

//     if (!content) {
//       setError("Can't make an empty comment.");
//       return;
//     }
//     setLoading(true);
//     await api
//       .post("/api/v1/comment/blog/" + blog_id + "/user/" + currDbUser.id, data)
//       .then((response) => {
//         console.log("Comment posted with ID=" + response.data);
//         if (response.status === 200) {
//           setContent("");
//           console.log("Comment section emptied");
//           setBlogCommentLoading(true);
//           console.log("blog comment set to leading");
//           setCommentUpd(commentUpd + 1);
//           console.log("Comment update value updated");
//           setLoading(false);
//           console.log("Comment section loading stopped");
//           // You can redirect the user or perform other actions here
//         } else {
//           console.log("Error:", response.statusText);
//         }
//       })
//       .catch((error) => {
//         console.error(error);
//       });
//   };
//   if (loading) {
//     return (
//       <div className="post_comment mb-5">
//         <div className="loading">
//           <div className="loading_bar">
//             <ReactLoading
//               type={"balls"}
//               color={"#63051e"}
//               height={50}
//               width={100}
//             />
//           </div>
//           <div className="loading_message">{loadingMessage}</div>
//         </div>
//       </div>
//     );
//   }
//   return (
//     <div className="post_comment mb-5">
//       <form onSubmit={handlePostComment}>
//         <div className="form-group d-flex flex-row">
//           <textarea
//             className="form-control w-75 mx-2"
//             rows="1"
//             placeholder="Write your comment"
//             value={content}
//             onChange={(e) => {
//               setContent(e.target.value);
//               removeError();
//             }}
//           />
//           <button type="submit" className="btn btn-primary w-25 ml-2">
//             Post Comment
//           </button>
//         </div>

//         {error && <div className="error_group w-70">{error}</div>}
//       </form>
//     </div>
//   );
// }

// export default PostComment;

import React, { useContext, useState } from "react";
import ReactLoading from "react-loading";
import { useNavigate } from "react-router-dom";
import api from "../../api/axiosConfig";
import { useAuth } from "../../context/AuthContext";
import { CommentContext } from "../../context/CommentContext";
import "../styles/PostComment.css";

export function PostComment({ blog_id, reply_to }) {
  const { commentUpd, setCommentUpd, setBlogCommentLoading } =
    useContext(CommentContext);
  const navigate = useNavigate();
  const { currDbUser } = useAuth();

  // State variables to manage comment submission and loading status
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("Loading...");
  const [content, setContent] = useState("");
  const [error, setError] = useState();

  // Function to remove error message
  function removeError() {
    setError("");
  }

  // Function to handle the submission of a new comment
  const handlePostComment = async (e) => {
    e.preventDefault();

    const data = {
      replyTo: reply_to,
      comment: content,
      commentor_id: currDbUser.id,
      blog_id: blog_id,
    };

    if (!content) {
      setError("Can't make an empty comment.");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post(
        "/api/v1/comment/blog/" + blog_id + "/user/" + currDbUser.id,
        data
      );
      if (response.status === 200) {
        setContent("");
        setBlogCommentLoading(true);
        setCommentUpd(commentUpd + 1);
        setLoading(false);
      } else {
        console.log("Error:", response.statusText);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Display loading spinner while comment is being posted
  if (loading) {
    return (
      <div className="post_comment mb-5">
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
      </div>
    );
  }

  // Render the comment form
  return (
    <div className="post_comment mb-5">
      <form onSubmit={handlePostComment}>
        <div className="form-group d-flex flex-row">
          <textarea
            className="form-control w-75 mx-2"
            rows="1"
            placeholder="Write your comment"
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              removeError();
            }}
          />
          <button type="submit" className="btn btn-primary w-25 ml-2">
            Post Comment
          </button>
        </div>

        {error && <div className="error_group w-70">{error}</div>}
      </form>
    </div>
  );
}

export default PostComment;
