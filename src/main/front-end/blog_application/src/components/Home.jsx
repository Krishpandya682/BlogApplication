import React, { useEffect, useState } from "react";
import ReactLoading from "react-loading";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";
import { useAuth } from "../context/AuthContext";
import MyNavbar from "./Navbar";
import Blogs from "./blogsList/Blogs";
import Button from "react-bootstrap/esm/Button";

export const Home = () => {
  const navigate = useNavigate();
  const { currUser } = useAuth();
  const [currDbUser, setCurrDbUser] = useState();
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState();

  const getCurrUser = async () => {
    console.log("Current User from context is", currUser);

    console.log("Calling", "/api/v1/user/fbUser/" + currUser.uid);
    api
      .get("/api/v1/user/fbUser/" + currUser.uid)
      .then((response) => {
        console.log("API Response:", response.data);
        setCurrDbUser(response.data);
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
      <ReactLoading type={"balls"} color={"blue"} height={667} width={375} />
    );
  }

  return (
    <div className="flex d-flex flex-column">
      <MyNavbar />
      <div className="d-flex flex-column">
        <div className="create_blog_btn mt-3">
          <Button href="/createBlog">Create Blog</Button>
        </div>{" "}
        <div className="blogs">
          <Blogs />
        </div>
        <div className="categories_list">
          {categories.map((cat) => {
            return (
              <div>
                <a href={"/blogs/" + cat.id}>{cat.categoryName}</a>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Home;
