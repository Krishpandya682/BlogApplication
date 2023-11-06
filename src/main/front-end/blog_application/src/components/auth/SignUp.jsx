// Importing necessary dependencies and components
import React, { useState } from "react";
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
import { storage } from "../../firebase";
import { v4 } from "uuid";
import ReactLoading from "react-loading";
import { getAuth, deleteUser } from "firebase/auth";
import { HttpStatusCode } from "axios";

// Functional component for the Sign Up page
export default function SignUpPage(props) {
  // Firebase auth and navigation hook
  const auth = getAuth();
  const navigate = useNavigate();

  // State variables for user details, errors, and loading status
  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");
  let [fullName, setFullName] = useState("");
  const [error, setError] = useState("");
  let [bio, setBio] = useState("");
  const { signUp, setSigningUp, setProfileUpd, profileUpd } = useAuth();
  const [imgUpload, setImgUpload] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("Loading...");

  // Function to handle the Sign Up process
  function handleSignUp(e) {
    console.log("Signing Up");
    e.preventDefault();
    setLoading(true);
    setSigningUp(true);

    // Validating if profile picture is uploaded
    if (imgUpload == null) {
      setError("Profile Picture cannot be empty!");
      return;
    }

    // Signing up the user with email and password from AuthContext
    signUp(email, password)
      .then((usercreds) => {
        const fileName = "profile_pic/" + imgUpload.name + v4();
        const imageRef = ref(storage, "images/" + fileName);

        //Uploading profile picture
        uploadBytes(imageRef, imgUpload)
          .then(() => {
            getDownloadURL(imageRef)
              .then((downloadUrl) => {
                const data = {
                  bio: bio,
                  name: fullName,
                  email: email,
                  firebaseId: usercreds.user.uid,
                  profile_pic: downloadUrl,
                };

                // Posting user data to the backend
                api
                  .post("/api/v1/user", data)
                  .then((response) => {
                    if (response.status === HttpStatusCode.Created) {
                      setProfileUpd(!profileUpd);
                      setSigningUp(false);
                      setLoading(false);
                      navigate("/");
                    } else {
                      console.log("DISPLAY ERROR", response);
                      console.log("DISPLAY ERROR", response.statusText);
                    }
                  })
                  .catch((error) => {
                    deleteUser(usercreds.user).then(() => {
                      deleteObject(imageRef).then(() => {
                        console.error(error);
                        setLoading(false);
                        setError("Could not create user in the database!");
                        return;
                      });
                    });
                  });
              })
              .catch((e) => {
                deleteUser(usercreds.user).then(() => {
                  deleteObject(imageRef).then(() => {
                    setLoading(false);
                    setError("Can't access your profile picture!");
                    return;
                  });
                });
              });
          })
          .catch((e) => {
            deleteUser(usercreds.user).then(() => {
              setLoading(false);
              setError(
                "Your profile picture could not be saved, try a different image!"
              );
              return;
            });
          });
      })
      .catch((e) => {
        if (e.code === "auth/email-already-in-use") {
          setError("This email already exists, try signing in!");
        } else {
          setError("Could not sign up!");
        }
        setLoading(false);
      });
  }

  // Rendering loading state while processing
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

  // Rendering the Sign Up form
  return (
    <div>
      <MyNavbar signingUp={true} />
      <div className="Auth-form-container">
        <form className="Auth-form" onSubmit={handleSignUp}>
          <div className="Auth-form-content">
            <div className="Auth-form-title">
              <h2>Sign Up</h2>
            </div>
            {error && <div className="error_group">{error}</div>}

            {/* Profile Picture input */}
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

            {/* Full Name input */}
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
                required
              />
            </div>

            {/* Bio input */}
            <div className="form-group mt-3">
              <label>Bio</label>
              <input
                type="text"
                className="form-control mt-1"
                placeholder="Write your bio"
                value={bio}
                onChange={(e) => {
                  setBio(e.target.value);
                }}
              />
            </div>

            {/* Email input */}
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
                required
              />
            </div>

            {/* Password input */}
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
                required
              />
            </div>

            {/* Submit button */}
            <div className="button_group">
              <button className="btn btn-primary myButton">Submit</button>
            </div>

            {/* Link to Sign In page */}
            <div className="text-center">
              Already registered? <Link to="/signIn">Sign In</Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
