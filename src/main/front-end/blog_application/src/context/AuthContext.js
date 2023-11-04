import React, { useContext, useEffect, useState } from "react";
import { auth } from "../firebase";
import api from "../api/axiosConfig";
import { useNavigate } from "react-router-dom";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

const signUp = async (email, password) => {
  try{
  return await createUserWithEmailAndPassword(auth, email, password);
  }
  catch(error){
    throw error;
  }
};
const signIn = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

const signOutHandler = () => {
  return signOut(auth).then(() => {
    console.log("Successfully Signed Out!");
  });
};

export function AuthProvider({ children }) {
  const [currUser, setCurrUser] = useState(null);
  const [currDbUser, setCurrDbUser] = useState(null);
  const [signingUp, setSigningUp] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profileUpd, setProfileUpd] = useState(true);
  const navigate = useNavigate();

  const getDbUser = async (uid) => {
    const response = await api.get("/api/v1/user/fbUser/" + uid);
    try {
      console.log(response.data);
      setCurrDbUser(response.data);
      setLoading(false);
    } catch (e) {
      console.log(e);
      alert(e);
    }
  };

  async function setUpUser(user) {
    if (!user) {
      return;
    }
    setCurrUser(user);

    console.log("SETTING UP CURRENT USER FROM AUTH CONTEXT");

    if (!signingUp) {
      console.log("Not Signing Up")
      getDbUser(user.uid)
        .then(() => {
          setLoading(false);
        })
        .catch((e) => {
          console.log("Error in getting the Database User");
          console.log(e);

          navigate("/signin");

          setLoading(false);
        });
    }else{
      setLoading(false);
    }
  }
  useEffect(() => {

    console.log("AUTH CONTEXT USE EFFECT!!");

    setLoading(true);
    const unsubscribe = auth.onAuthStateChanged((user) => {
      console.log("firbase auth change User is", user);
      if (user) {
        setUpUser(user);
        console.log("currUser set in context", currUser);
        console.log("currDbUser set in context", currDbUser);
      } else {
        console.log("Firbase auth user is null");
        setCurrUser(null);
        setLoading(false);
      }
    });
    return unsubscribe;
  }, [profileUpd]);

  const value = {
    currUser,
    currDbUser,
    signUp,
    signIn,
    signOutHandler,
    setSigningUp,
    profileUpd,
    setProfileUpd,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
