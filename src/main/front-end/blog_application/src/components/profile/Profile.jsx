// import React, { useEffect, useState } from "react";
// import ReactLoading from "react-loading";
// import { Link, useParams, useNavigate } from "react-router-dom";
// import api from "../../api/axiosConfig";
// import { useAuth } from "../../context/AuthContext";
// import MyNavbar from "../Navbar";
// import "../styles/Profile.scss";
// import Blogs from "../blogsList/Blogs";
// import Button from "react-bootstrap/esm/Button";

// export const Home = () => {
//   const { currUser, currDbUser } = useAuth();
//   const navigate = useNavigate();
//   const { id } = useParams();
//   const [user, setUser] = useState(currDbUser);
//   const [loading, setLoading] = useState(true);
//   const [loadingMessage, setLoadingMessage] = useState("Loading...");

//   const getUser = async () => {
//     try {
//       // console.log("API");
//       const response = await api.get("api/v1/user/" + id);
//       setUser(response.data);
//       // console.log("Api call:- ", response.data);
//       setLoading(false);
//     } catch (e) {
//       console.log(e);
//     }
//   };
//   useEffect(() => {
//     if (!currUser) {
//       navigate("/signIn");
//     }
//     console.log("Id is", id);
//     if (!id || id == currDbUser.id) {
//       setUser(currDbUser);
//       setLoading(false);
//     } else {
//       getUser(id);
//     }
//   }, []);

//   if (loading) {
//     return (
//       <div className="loading">
//         <div className="loading_bar">
//           <ReactLoading
//             type={"balls"}
//             color={"#63051e"}
//             height={50}
//             width={100}
//           />
//         </div>
//         <div className="loading_message">{loadingMessage}</div>
//       </div>
//     );
//   }
//   return (
//     <div className="flex-col">
//       <div>
//         <MyNavbar />
//       </div>

//       <div className="profile_container">
//         <div className="imageContanier">
//           <img
//             className="user-profile-pic_profile_page"
//             src={user.profile_pic}
//             alt="User Profile Picture"
//           />
//         </div>
//         <div className="user_info">
//           <div className="user_name">
//             <p>{user.name}</p>
//           </div>
//           <div className="user_bio">
//             <p>{user.bio}</p>
//           </div>
//           <div className="user_email">
//             <p>{user.email}</p>
//           </div>
//           <div className="editButton">
//             { (!id || id == currDbUser.id) &&
//               <Button className="myButton" href="/EditProfile">
//                 Edit Profile
//               </Button>
//             }
//           </div>
//         </div>
//       </div>
//       <div className="user_posts">
//         <Blogs userId={id ? id : currDbUser.id} />
//       </div>
//     </div>
//   );
// };

// export default Home;

import React, { useEffect, useState } from "react";
import ReactLoading from "react-loading";
import { Link, useParams, useNavigate } from "react-router-dom";
import api from "../../api/axiosConfig";
import { useAuth } from "../../context/AuthContext";
import MyNavbar from "../Navbar";
import "../styles/Profile.scss";
import Blogs from "../blogsList/Blogs";
import Button from "react-bootstrap/esm/Button";

export const Home = () => {
  const { currUser, currDbUser } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const [user, setUser] = useState(currDbUser);
  const [loading, setLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState("Loading...");

  // Function to fetch user details from the server
  const getUser = async () => {
    try {
      const response = await api.get("api/v1/user/" + id);
      setUser(response.data);
      setLoading(false);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (!currUser) {
      navigate("/signIn");
    }

    if (!id || id === currDbUser.id) {
      setUser(currDbUser);
      setLoading(false);
    } else {
      getUser(id);
    }
  }, []);

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
    <div className="flex-col">
      <div>
        <MyNavbar />
      </div>

      <div className="profile_container">
        <div className="imageContanier">
          <img
            className="user-profile-pic_profile_page"
            src={user.profile_pic}
            alt="User Profile Picture"
          />
        </div>
        <div className="user_info">
          <div className="user_name">
            <p>{user.name}</p>
          </div>
          <div className="user_bio">
            <p>{user.bio}</p>
          </div>
          <div className="user_email">
            <p>{user.email}</p>
          </div>
          <div className="editButton">
            {(!id || id === currDbUser.id) && (
              <Button className="myButton" href="/EditProfile">
                Edit Profile
              </Button>
            )}
          </div>
        </div>
      </div>
      <div className="user_posts">
        <Blogs userId={id ? id : currDbUser.id} />
      </div>
    </div>
  );
};

export default Home;
