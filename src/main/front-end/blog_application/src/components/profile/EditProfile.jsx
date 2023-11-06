
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import React, { useState } from "react";
import ReactLoading from "react-loading";
import { useNavigate } from "react-router-dom";
import { v4 } from "uuid";
import api from "../../api/axiosConfig";
import { useAuth } from "../../context/AuthContext";
import { storage } from "../../firebase";
import MyNavbar from "../Navbar";
import "../styles/EditProfile.scss";

export default function EditProfile(props) {
  const navigate = useNavigate();

  // State variables to manage form fields and loading status
  let [fullName, setFullName] = useState();
  let [bio, setBio] = useState();
  const [imgUpload, setImgUpload] = useState(null);
  const { currDbUser, setProfileUpd, profileUpd } = useAuth();
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("Loading...");
  const [error, setError] = useState();

  // Function to remove error message
  function removeError(e) {
    setError();
  }

  // Function to handle the submission of updated profile details
  async function handleEdit(e) {
    e.preventDefault();
    setLoading(true);

    let imageRef = null;
    let data = {};

    if (fullName && fullName.length === 0) {
      setError("Full Name can't be empty!");
      setLoading(false);
      return;
    }

    if (fullName != null && fullName !== currDbUser.name) {
      data.name = fullName;
    }
    if (bio != null && bio !== currDbUser.bio) {
      data.bio = bio;
    }

    if (imgUpload != null) {
      const oldImageRef = ref(storage, currDbUser.profile_pic);
      const fileName = "profile_pic/" + imgUpload.name + v4();
      imageRef = ref(storage, "images/" + fileName);

      await uploadBytes(imageRef, imgUpload);
      const downloadUrl = await getDownloadURL(imageRef);
      const new_profile_pic = downloadUrl;
      data.profile_pic = new_profile_pic;
      await deleteObject(oldImageRef);
    }

    if (Object.keys(data).length === 0) {
      setLoading(false);
      navigate("/Profile");
      return;
    }

    api
      .put("/api/v1/user/" + currDbUser.id, data)
      .then((response) => {
        if (response.status === 200) {
          setProfileUpd(!profileUpd);
          setLoading(false);
          navigate("/Profile");
        } else {
          setError("Could not edit profile");

          console.log("DISPLAY ERROR", response.statusText);
          setLoading(false);
        }
      })
      .catch((error) => {
        setError("Could not edit profile");
        deleteObject(imageRef).then(() => {});
        console.error(error);
        setLoading(false);
      });
  }

  // Display loading spinner while processing the form
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

  // Render the form for editing profile details
  return (
    <div>
      <MyNavbar />
      <div className="Auth-form-container">
        <form className="Auth-form d-flex" onSubmit={handleEdit}>
          <div className="Auth-form-content">
            <div className="Auth-form-title">
              <h2>Edit Profile</h2>
            </div>

            {error && <div className="error_group w-70">{error}</div>}
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
            <div className="form-group mt-3">
              <label>Full Name</label>
              <input
                type="text"
                className="form-control mt-1"
                defaultValue={currDbUser.name}
                onChange={(e) => {
                  setFullName(e.target.value);
                  removeError();
                }}
              />
            </div>
            <div className="form-group mt-3">
              <label>Bio</label>
              <textarea
                rows="5"
                className="form-control mt-1"
                defaultValue={currDbUser.bio}
                onChange={(e) => {
                  setBio(e.target.value);
                }}
              />
            </div>
            <div className="d-grid gap-2 mt-3">
              <button className="btn btn-primary myButton">
                Update Profile
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
