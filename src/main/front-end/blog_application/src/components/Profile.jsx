import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import ReactLoading from "react-loading";
import "./styles/Profile.scss";
import MyNavbar from "./Navbar";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import api from "../api/axiosConfig";

export const Home = () => {
  const { currUser, currDbUser } = useAuth();
  const { id } = useParams();
  const [user, setUser] = useState(currDbUser);
  const [loading, setLoading] = useState(true);

  const getUser = async () => {
    try {
      console.log("API");
      const response = await api.get("api/v1/user/" +id);
      setUser(response.data);
      console.log("Api call:- ", response.data);
      setLoading(false);
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    console.log("Id is", id);
    if (!id || id == currDbUser.id) {
      setUser(currDbUser)
      setLoading(false);
    } else {
      getUser(id);
    }
  }, []);

  if (loading) {
    return (
      <div className="loading">
        <ReactLoading type={"balls"} color={"blue"} height={50} width={100} />
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
        <div className="userInfo">
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
            <Link underline="hover" to="/EditProfile">
              Edit Profile
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
