// Importing necessary dependencies and components
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import MyNavbar from "../Navbar";
import "../styles/AuthPage.css";

// Functional component for the Sign In page
export default function SignInPage(props) {
  const navigate = useNavigate();

  // State variables for email, password, and error handling
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Accessing signIn function from AuthContext
  const { signIn } = useAuth();

  // Handling the Sign In process
  async function handleSignIn(e) {
    setError(""); // Clear any previous errors
    e.preventDefault(); // Prevent default form submission behavior

    // Validating email and password
    if (!email) {
      setError("Email cannot be empty");
      return;
    }
    if (!password) {
      setError("Password cannot be empty");
      return;
    }

    try {
      await signIn(email, password); // Attempting sign in
    } catch (error) {
      setError("Incorrect Username or Password"); // Handling sign in errors
      return;
    }

    navigate("/"); // Navigating to the home page after successful sign in
  }

  // Rendering the Sign In form
  return (
    <div>
      <MyNavbar />
      <div className="Auth-form-container">
        <form className="Auth-form" onSubmit={handleSignIn}>
          <div className="Auth-form-content">
            <div className="Auth-form-title">
              <h2>Sign In</h2>
            </div>

            {/* Link to SignUp page */}
            <div className="text-center">
              Not registered yet? <Link to="/signUp">Sign Up</Link>
            </div>

            {/* Displaying errors if any */}
            {error && <div className="error_group">{error}</div>}

            {/* Email input field */}
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

            {/* Password input field */}
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

            {/* Submit button */}
            <div className="button_group">
              <button className="btn btn-primary myButton">Submit</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
