import React, { useState } from "react";
import "../styles/AuthPage.scss";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import MyNavbar from "../Navbar";

export default function (props) {
  const navigate = useNavigate();
  let [email, setEmail] = useState();
  let [password, setPassword] = useState();
  const { signIn } = useAuth();

  async function handleSignIn(e) {
    e.preventDefault();
    console.log(email,password)
    await signIn(email, password);
    navigate("/");
  }

  return (
    <div>
      <MyNavbar/>
    <div className="Auth-form-container">
      <form className="Auth-form" onSubmit={handleSignIn}>
        <div className="Auth-form-content">
          <div className="Auth-form-title">
            <h2>Sign In</h2>
          </div>

          <div className="text-center">
            Not registered yet?{" "}
            <Link to = "/signUp">
              Sign Up
            </Link>
          </div>
          <div className="form-group mt-3">
            <label>Email address</label>
            <input
              type="email"
              className="form-control mt-1"
              placeholder="Enter email"
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
              placeholder="Enter password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
          </div>
          <div className="d-grid gap-2 mt-3">
            <button className="btn btn-primary">
              Submit
            </button>
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
