import React, { useState } from "react";

// Create a new context and export
export const PostCommentContext = React.createContext();

// Create a Comment Context Provider
export const PostCommentContextProvider = ({ children }) => {
  const [commentPosted, setCommentPosted] = useState(false);

  return (
    <PostCommentContext.Provider
      value={{
        commentPosted,
        setCommentPosted,
      }}
    >
      {children}
    </PostCommentContext.Provider>
  );
};
