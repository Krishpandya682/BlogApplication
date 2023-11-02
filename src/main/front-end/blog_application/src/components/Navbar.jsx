import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./styles/navbar.css";

function MyNavbar() {
  const [authText, setAuthText] = useState("SignOut");
  const { setProfileUpd, profileUpd, currUser, signOutHandler, currDbUser } =
    useAuth();

  const navigate = useNavigate();
  async function handleLogout() {
    if (currUser) {
      await signOutHandler();
      setProfileUpd(!profileUpd);
    }
    navigate("/signIn");
  }

  useEffect(() => {
    if (currUser) {
      setAuthText("Sign Out");
    } else {
      setAuthText("Sign In");
    }
  }, [currUser]);

  return (
    <Navbar
      className="myNav justify-content-between"
      collapseOnSelect
      fixed="top"
      expand="sm"
      variant="dark"
    >
      <Container className="w-100 myNav">
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav>
            <Nav.Link href="/">Home</Nav.Link>{" "}
          </Nav>
        </Navbar.Collapse>
        <Navbar.Collapse className="justify-content-end">
          { currDbUser &&
            <a href="/Profile">
              <img
                className="navbar_profile_pic"
                src={currDbUser.profile_pic}
                alt={currDbUser.name + " Profile Picture"}
              />
            </a>
          }
          <Button className="myButton" onClick={handleLogout}>
            <Navbar.Text>{authText}</Navbar.Text>
          </Button>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default MyNavbar;
