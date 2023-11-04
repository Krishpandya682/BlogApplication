import React, { useEffect, useState } from "react";
import ReactLoading from "react-loading";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";
import { useAuth } from "../context/AuthContext";
import MyNavbar from "./Navbar";
import Blogs from "./blogsList/Blogs";
import "./styles/Home.css";
import "./styles/base.css";

export const Home = () => {
  const navigate = useNavigate();
  const { currUser } = useAuth();
  const [currDbUser, setCurrDbUser] = useState();
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState();
  const [loadingMessage, setLoadingMessage] = useState("Loading...");
  

  const getCurrUser = async () => {
    console.log("Current User from context is", currUser);
    setLoadingMessage("Getting User...");
    console.log("Calling", "/api/v1/user/fbUser/" + currUser.uid);
    api
      .get("/api/v1/user/fbUser/" + currUser.uid)
      .then((response) => {
        console.log("API Response:", response.data);
        setCurrDbUser(response.data);
        setLoadingMessage("Getting Categories...");
        api.get("/api/v1/category/").then((response) => {
          setCategories(response.data);
          setLoading(false);
        });
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
    <div className="flex d-flex flex-column">
      <MyNavbar />
      <div className="mt-3 d-flex flex-column">
        <div className="categories_section">
          
          <div className="categories_list">
            {categories.map((cat) => {
              return (
                <div className="category_tag">
                  <a href={"/blogs/" + cat.id}>{cat.categoryName}</a>
                </div>
              );
            })}
          </div>
        </div>

        <div className="blogs">
          
          <Blogs />
        </div>
      </div>
    </div>
  );
};

export default Home;
