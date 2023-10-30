import React, { useState } from "react";

// Create a new context and export
export const EditBlogContext = React.createContext();

// Create a Comment Context Provider
export const EditBlogContextProvider = ({ children }) => {
  const [editing, setEditing] = useState(false);
  const [blogUpd, setBlogUpd] = useState(0);

  return (
    <EditBlogContext.Provider
      value={{
        editing,
        setEditing,
        blogUpd,
        setBlogUpd,
      }}
    >
      {children}
    </EditBlogContext.Provider>
  );
};
