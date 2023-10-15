import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react"
import { auth } from "../../firebase";

export default function (props) {
  let [authMode, setAuthMode] = useState("signin")
  let [email, setEmail] = useState();
  let [password, setPassword] = useState();
  let [fullName, setFullName] = useState();

  const changeAuthMode = () => {
    setAuthMode(authMode === "signin" ? "signup" : "signin")
  }

  const signIn = (e) =>{
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password).then((usercreds)=>{
      console.log(usercreds);
    });
  }
  const signUp = (e) =>{
    e.preventDefault();
    createUserWithEmailAndPassword(auth, email, password).then((usercreds)=>{
      console.log(usercreds);
    });
    setAuthMode("signin")
  }
  if (authMode === "signin") {
    return (
      <div className="Auth-form-container">
        <form className="Auth-form" onSubmit={signIn}>
          <div className="Auth-form-content">
            <h3 className="Auth-form-title">Sign In</h3>
            <div className="text-center">
              Not registered yet?{" "}
              <span className="link-primary" onClick={changeAuthMode}>
                Sign Up
              </span>
            </div>
            <div className="form-group mt-3">
              <label>Email address</label>
              <input
                type="email"
                className="form-control mt-1"
                placeholder="Enter email"
                value={email}
                onChange={(e)=>{setEmail(e.target.value)}}
              />
            </div>
            <div className="form-group mt-3">
              <label>Password</label>
              <input
                type="password"
                className="form-control mt-1"
                placeholder="Enter password"
                value={password}
                onChange={(e)=>{setPassword(e.target.value)}}
              />
            </div>
            <div className="d-grid gap-2 mt-3">
              <button type="submit" className="btn btn-primary">
                Submit
              </button>
            </div>
            <p className="text-center mt-2">
              Forgot <a href="#">password?</a>
            </p>
          </div>
        </form>
      </div>
    )
  }

  return (
    <div className="Auth-form-container">
      <form className="Auth-form" onSubmit={signUp}>
        <div className="Auth-form-content">
          <h3 className="Auth-form-title">Sign In</h3>
          <div className="text-center">
            Already registered?{" "}
            <span className="link-primary" onClick={changeAuthMode}>
              Sign In
            </span>
          </div>
          <div className="form-group mt-3">
            <label>Full Name</label>
            <input
              type="text"
              className="form-control mt-1"
              placeholder="e.g Jane Doe"
              value={fullName}
              onChange={(e)=>{setFullName(e.target.value)}}
            />
          </div>
          <div className="form-group mt-3">
            <label>Email address</label>
            <input
              type="email"
              className="form-control mt-1"
              placeholder="Email Address"
              value={email}
              onChange={(e)=>{setEmail(e.target.value)}}
            />
          </div>
          <div className="form-group mt-3">
            <label>Password</label>
            <input
              type="password"
              className="form-control mt-1"
              placeholder="Password"
              value={password}
              onChange={(e)=>{setPassword(e.target.value)}}
            />
          </div>
          <div className="d-grid gap-2 mt-3">
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </div>
          <p className="text-center mt-2">
            Forgot <a href="#">password?</a>
          </p>
        </div>
      </form>
    </div>
  )
}

