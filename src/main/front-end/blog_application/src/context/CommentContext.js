
import React, { useState } from "react";
  
  
// Create a new context and export
export const CommentContext = React.createContext();

  // Create a Comment Context Provider
export const CommentContextProvider = ({ children }) => {
    const [commentUpd, setCommentUpd] = useState(0);
    const [blogCommentLoading, setBlogCommentLoading] = useState(true);

    return (
      <CommentContext.Provider
        value={{
          commentUpd,
          setCommentUpd,
          blogCommentLoading,
          setBlogCommentLoading,
        }}
      >
        {children}
      </CommentContext.Provider>
    );
  };
