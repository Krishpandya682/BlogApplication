import React, { useState } from "react";
import { auth } from "../../firebase";
import "../styles/AuthPage.scss";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/axiosConfig";
import { useAuth } from "../../context/AuthContext";
import MyNavbar from "../Navbar";
export default function (props) {
  const navigate = useNavigate();
  let [email, setEmail] = useState();
  let [password, setPassword] = useState();
  let [fullName, setFullName] = useState();
  const { signUp } = useAuth();

  async function handleSignUp(e) {
    e.preventDefault();
    console.log("handling signup");
    const usercreds = await signUp(email, password);
    console.log("FB UID= ");
    console.log(usercreds.user.uid);
    console.log(fullName);
    console.log(email);
    const data = {
      name: fullName,
      email: email,
      firebaseId: usercreds.user.uid,
    };
    console.log("Data:-");
    console.log(data);
    api
      .post("/api/v1/user", data)
      .then((response) => {
        if (response.status===200){
        navigate("/");
        }else{
          console.log("DISPLAY ERROR", response.statusText);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  return (
    <div>
      <MyNavbar />
      <div className="Auth-form-container">
        <form className="Auth-form" onSubmit={handleSignUp}>
          <div className="Auth-form-content">
            <div className="Auth-form-title">
              <h2>Sign Up</h2>
            </div>

            <div className="text-center">
              Already registered? <Link to="/signIn">Sign In</Link>
            </div>
            <div className="form-group mt-3">
              <label>Full Name</label>
              <input
                type="text"
                className="form-control mt-1"
                placeholder="e.g Jane Doe"
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value);
                }}
              />
            </div>
            <div className="form-group mt-3">
              <label>Email address</label>
              <input
                type="email"
                className="form-control mt-1"
                placeholder="Email Address"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
            </div>
            <div className="form-group mt-3">
              <label>Password</label>
              <input
                type="password"
                className="form-control mt-1"
                placeholder="Password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
            </div>
            <div className="d-grid gap-2 mt-3">
              <button className="btn btn-primary">Submit</button>
            </div>
            <p className="text-center mt-2">
              Forgot <a href="#">password?</a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
