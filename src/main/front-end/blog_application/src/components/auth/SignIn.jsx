import React, { useState } from "react";
import "../styles/AuthPage.css";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import MyNavbar from "../Navbar";

export default function (props) {
  const navigate = useNavigate();
  let [email, setEmail] = useState();
  const [error, setError] = useState();
  let [password, setPassword] = useState();
  const { signIn } = useAuth();

  async function handleSignIn(e) {
    setError();
    e.preventDefault();
    console.log(email, password);
    if (!email) {
      setError("Email cannot be empty");
      return;
    }
    if (!password) {
      setError("Password cannot be empty");
      return;
    }
    try {
      await signIn(email, password);
    } catch (error) {
      setError("Incorrect Username or Password");
      return;
    }
    navigate("/");
  }

  return (
    <div>
      <MyNavbar />
      <div className="Auth-form-container">
        <form className="Auth-form" onSubmit={handleSignIn}>
          <div className="Auth-form-content">
            <div className="Auth-form-title">
              <h2>Sign In</h2>
            </div>

            <div className="text-center">
              Not registered yet? <Link to="/signUp">Sign Up</Link>
            </div>
            {error && <div className="error_group">{error}</div>}
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
                required
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
                required
              />
            </div>
            <div className="button_group">
              <button className="btn btn-primary myButton">Submit</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
