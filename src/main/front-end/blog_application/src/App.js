import { Route, Routes } from "react-router-dom";
import "./App.css";
import { AuthProvider } from "./context/AuthContext";
import BlogFull from "./components/BlogDetails/BlogFull";
import CreateBlog from "./components/BlogDetails/CreateBlog";
import Profile from "./components/profile/Profile";
import EditProfile from "./components/profile/EditProfile";
import Blogs from "./components/blogsList/Blogs";
import SignIn from "./components/auth/SignIn";
import SignUp from "./components/auth/SignUp";
import Home from "./components/Home";

function App() {
  return (
    <div>
      <link
        href="https://cdn.quilljs.com/1.3.6/quill.snow.css"
        rel="stylesheet"
      ></link>
      <link
        href="https://cdn.quilljs.com/1.3.6/quill.core.css"
        rel="stylesheet"
      ></link>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/profile/:id" element={<Profile />}></Route>
          <Route path="/profile" element={<Profile />}></Route>
          <Route path="/editProfile" element={<EditProfile />}></Route>
          <Route path="/blogs" element={<Blogs />}></Route>
          <Route path="/blogs/:catId" element={<Blogs />}></Route>
          <Route path="/blog/:id" element={<BlogFull />}></Route>
          <Route path="/createBlog" element={<CreateBlog />}></Route>
          <Route path="/signIn" element={<SignIn />}></Route>
          <Route path="/signUp" element={<SignUp />}></Route>
        </Routes>
      </AuthProvider>
      <script src="https://cdn.quilljs.com/1.3.6/quill.js"></script>
    </div>
  );
}

export default App;
