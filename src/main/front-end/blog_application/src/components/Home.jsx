import { onAuthStateChanged } from "firebase/auth";
import React from "react";
import { useState, useEffect } from "react";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";
import { useAuth } from "../context/AuthContext";
import ReactLoading from "react-loading";
import MyNavbar from "./Navbar";

export const Home = () => {
  const navigate = useNavigate();
  const { currUser } = useAuth();
  const [currDbUser, setCurrDbUser] = useState();
  const [loading, setLoading] = useState(true);

  const getCurrUser = async () => {
    console.log("Current User from context is", currUser);

    console.log("Calling", "/api/v1/user/fbUser/" + currUser.uid);
    api
      .get("/api/v1/user/fbUser/" + currUser.uid)
      .then((response) => {
        console.log("API Response:", response.data);
        setCurrDbUser(response.data);
        setLoading(false);
      })
      .catch((e) => {
        console.log(e);
        alert(e);
        setLoading(false);
      });
  };

  useEffect(() => {
    console.log("Auth user is set", currUser);
    if (currUser) {
      console.log("User found in context");
      getCurrUser();
    } else {
      navigate("/signin");
    }
  }, []);

  if (loading) {
    return (
      <ReactLoading type={"balls"} color={"blue"} height={667} width={375} />
    );
  }

  return (
    <div className="flex d-flex flex-column">
      <MyNavbar />
      <div>
        {" "}
        <div>Home</div>
        <div>{currUser ? <p>Signed In</p> : <p>Signed Out</p>}</div>
        <div>
          <p>{currDbUser.email}</p>
          <p>{currDbUser.name}</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
