import logo from "./logo.svg";
import "./App.css";
import api from "./api/axiosConfig";
import { useState, useEffect } from "react";
import Auth from "./components/auth/AuthPage";

function App() {
  const [users, setUsers] = useState();
  const postUser = async (formData) => {
    const response = await api.post("/api/v1/user", formData);
  };

  async function handleSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    console.log("Form Data");
    console.log(formData);
    // Or you can work with it as a plain object:
    const formJson = Object.fromEntries(formData.entries());
    console.log(formJson);
    await postUser(formJson);
    window.location.reload(false);
  }
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

  return (
    <div className="App">
      {users?.map((user) => {
        return <p>{user.name}</p>;
      })}

      <form method="post" onSubmit={handleSubmit}>
        <label>
          User name: <input name="name" placeholder="Enter Username" required />
        </label>
        <label>
          Email: <input name="email" placeholder="Enter Email" required />
        </label>
        <input type="submit"></input>
      </form>
      <div className="flex-box w-25 align-self-center">
        <Auth />
      </div>
    </div>
  );
}

export default App;
