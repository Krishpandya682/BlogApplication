import React, { useState } from "react";
import "../styles/AuthPage.scss";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/axiosConfig";
import { useAuth } from "../../context/AuthContext";
import MyNavbar from "../Navbar";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { auth, storage } from "../../firebase";
import { v4 } from "uuid";

export default function (props) {
  const navigate = useNavigate();
  let [email, setEmail] = useState();
  let [password, setPassword] = useState();
  let [fullName, setFullName] = useState();
  let [bio, setBio] = useState();
  const { signUp } = useAuth();
  const [imgUpload, setImgUpload] = useState(null);


  async function handleSignUp(e) {
    e.preventDefault();
    console.log("handling signup");
    const usercreds = await signUp(email, password);
    console.log("FB UID= ");
    console.log(usercreds.user.uid);
    console.log(fullName);
    console.log(email);

    console.log("Method called");
    if (imgUpload == null) {
      return;
    }

    console.log("Image is not null", imgUpload);
    const fileName = "profile_pic/"+imgUpload.name + v4();
    const imageRef = ref(storage, "images/" + fileName);

    console.log("ref is ", imageRef);
    uploadBytes(imageRef, imgUpload)
      .then(() => {
        console.log("Upload promise returned");
        getDownloadURL(imageRef)
          .then((downloadUrl) => {
            console.log("Got the Image URL:-", downloadUrl);
            const data = {
              bio: bio,
              name: fullName,
              email: email,
              firebaseId: usercreds.user.uid,
              profile_pic: downloadUrl,
            };
            console.log("Data:-");
            console.log(data);
            api
              .post("/api/v1/user", data)
              .then((response) => {
                if (response.status === 200) {
                  navigate("/");
                } else {
                  console.log("DISPLAY ERROR", response.statusText);
                }
              })
              .catch((error) => {
                deleteObject(imageRef).then(() => {});
                console.error(error);
              });
          })
          .catch(() => {
            console.log("Download URL could not be retrieved");
            deleteObject(imageRef).then(() => {});
          });
      })
      .catch((e) => {
        console.log("ERROR:- ", e);
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
            <div className="form-group mt-3">
              <label>Profile Pic</label>
              <input
                type="file"
                className="form-control mt-1"
                onChange={(e) => {
                  setImgUpload(e.target.files[0]);
                }}
              />
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
            </div><div className="form-group mt-3">
              <label>Bio</label>
              <input
                type="text"
                className="form-control mt-1"
                placeholder="Wirte your bio"
                value={bio}
                onChange={(e) => {
                  setBio(e.target.value);
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
