import React, { useContext, useEffect, useState } from "react";
import { auth } from "../firebase";
import api from "../api/axiosConfig";
import { useNavigate } from "react-router-dom";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

const signUp = (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password);
};
const signIn = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export function AuthProvider({ children }) {
  const [currUser, setCurrUser] = useState(null);
  const [currDbUser, setCurrDbUser] = useState(null);
  const [loading, setLoading] = useState(true);
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
    getDbUser(user.uid).then(() => {
      setLoading(false);
    }).catch((e) =>{
      console.log("Error in getting the Database User")
      console.log(e);
      navigate("/signin");
      setLoading(false)
    } );
  }
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      console.log("firbase auth change User is", user);
      if (user) {
        setUpUser(user);
        console.log("currUser set in context", currUser);
        console.log("currDbUser set in context", currDbUser);
      } else {
        console.log("Firbase auth user is null");
        setLoading(false);
      }
    });
    return unsubscribe;
  }, []);

  const value = {
    currUser,
    currDbUser,
    signUp,
    signIn,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
