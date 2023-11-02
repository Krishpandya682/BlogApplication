import { Route, Routes } from "react-router-dom";
import "./App.css";
import { AuthProvider } from './context/AuthContext';
import BlogFull from "./components/BlogDetails/BlogFull";
import CreateBlog from "./components/BlogDetails/CreateBlog";
import Profile from "./components/profile/Profile";
import EditProfile from "./components/profile/EditProfile";
import Blogs from "./components/blogsList/Blogs";
import SignIn from "./components/auth/SignIn";
import SignUp from "./components/auth/SignUp";
import Home from "./components/Home";


function App() {
  // const [users, setUsers] = useState();
  // const postUser = async (formData) => {
  //   const response = await api.post("/api/v1/user", formData);
  // };

  // async function handleSubmit(event) {
  //   event.preventDefault();
  //   const form = event.target;
  //   const formData = new FormData(form);
  //   console.log("Form Data");
  //   console.log(formData);
  //   // Or you can work with it as a plain object:
  //   const formJson = Object.fromEntries(formData.entries());
  //   console.log(formJson);
  //   await postUser(formJson);
  //   window.location.reload(false);
  // }
  // const getUsers = async () => {
  //   const response = await api.get("/api/v1/user");
  //   try {
  //     console.log(response.data);
  //     setUsers(response.data);
  //   } catch (e) {
  //     console.log(e);
  //   }
  // };

  // useEffect(() => {
  //   getUsers();
  // }, []);

  return (
    // <div className="App">
    //   {users?.map((user) => {
    //     return <p>{user.name}</p>;
    //   })}

    //   <form method="post" onSubmit={handleSubmit}>
    //     <label>
    //       User name: <input name="name" placeholder="Enter Username" required />
    //     </label>
    //     <label>
    //       Email: <input name="email" placeholder="Enter Email" required />
    //     </label>
    //     <input type="submit"></input>
    //   </form>
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
    // </div>
  );
}

export default App;
