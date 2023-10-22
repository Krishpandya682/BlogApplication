import { onAuthStateChanged } from "firebase/auth";
import React from "react";
import { useState, useEffect } from "react";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";
import { useAuth } from "../context/AuthContext";
import ReactLoading from "react-loading";
import "./styles/Profile.scss";
import MyNavbar from "./Navbar";

export const Home = () => {
  const { loading, currUser, currDbUser } = useAuth();
  // const [currDbUser, setCurrDbUser] = useState();
  // const [loading, setLoading] = useState(true);


  if (loading) {
    return (
      <div className="loading">
        <ReactLoading type={"balls"} color={"blue"} height={50} width={100} />
      </div>
    );
  }

  return (
    <div className="flex-col">
      <div><MyNavbar/></div>
      
      <div>Home</div>
      <div>{currUser ? <p>Signed In</p> : <p>Signed Out</p>}</div>
      <div>
        <p>{currDbUser.email}</p>
        <p>{currDbUser.name}</p>
      </div>
    </div>
  );
};

export default Home;
