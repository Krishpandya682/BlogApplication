import logo from "./logo.svg";
import "./App.css";
import api from "./api/axiosConfig";
import { useState, useEffect } from "react";

function App() {
  const [users, setUsers] = useState();

  const getUsers = async () => {
    const response = await api.get("/api/v1/user");
    try {
      console.log(response.data);
      setUsers(response.data);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);
  return <div className="App">{
    users?.map((user)=>{
      return <p>{user.name}</p>

    })

  }</div>;
}

export default App;
