import React, { useState, useEffect } from "react";
import "./styles/AuthPage.scss";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../api/axiosConfig";
import { useAuth } from "../context/AuthContext";
import ReactLoading from "react-loading";
import MyNavbar from "./Navbar";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { storage } from "../firebase";
import { v4 } from "uuid";

export default function (props) {
  const navigate = useNavigate();
  let [fullName, setFullName] = useState();
  let [bio, setBio] = useState();
  const [imgUpload, setImgUpload] = useState(null);
  const { currDbUser, setProfileUpd, profileUpd } = useAuth();

  const [loading, setLoading] = useState(false);

  async function handleSignUp(e) {
    e.preventDefault();
    setLoading(true);
    console.log(imgUpload);
    console.log(fullName);
    console.log("Method called");
    let imageRef = null;
    let data = {};
    if (fullName != null && fullName != currDbUser.name) {
      console.log("Name changed");
      data.name = fullName;
      console.log("Name upd in data", data);
    }
    if (bio != null && bio != currDbUser.bio) {
      console.log("Bio changed");
      data.bio = bio;
      console.log("bio upd in data", data);
    }

    if (imgUpload != null) {
      console.log("Image changed");
      const oldImageRef = ref(storage, currDbUser.profile_pic);

      const fileName = imgUpload.name + v4();
      imageRef = ref(storage, "images/" + fileName);

      await uploadBytes(imageRef, imgUpload);
      console.log("Upload promise returned");
      const downloadUrl = await getDownloadURL(imageRef);
      console.log("Got the Image URL:-", downloadUrl);
      const new_profile_pic = downloadUrl;
      data.profile_pic = new_profile_pic;
      await deleteObject(oldImageRef);
    }

    if (Object.keys(data).length == 0) {
      console.log("No Change");
      setLoading(false);
      navigate("/Profile")
      return;
    }
    console.log("New Data", data);

    api
      .put("/api/v1/user/" + currDbUser.id, data)
      .then((response) => {
        if (response.status === 200) {
          console.log("UPDATED IN  Database", response);
          setProfileUpd(!profileUpd);
          setLoading(false);
          navigate("/Profile");
        } else {
          console.log("DISPLAY ERROR", response.statusText);
        }
      })
      .catch((error) => {
        deleteObject(imageRef).then(() => {});
        console.error(error);
      });
  }

  if (loading) {
    return (
      <ReactLoading type={"balls"} color={"blue"} height={667} width={375} />
    );
  }

  return (
    <div>
      <MyNavbar />
      <div className="Auth-form-container">
        <form className="Auth-form" onSubmit={handleSignUp}>
          <div className="Auth-form-content">
            <div className="Auth-form-title">
              <h2>Edit Profile</h2>
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
            <div className="form-group mt-3">
              <label>Full Name</label>
              <input
                type="text"
                className="form-control mt-1"
                defaultValue={currDbUser.name}
                onChange={(e) => {
                  setFullName(e.target.value);
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
              <button className="btn btn-primary">Update Profile</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
