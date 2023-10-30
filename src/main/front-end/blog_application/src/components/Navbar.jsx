import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function MyNavbar() {
  const [authText, setAuthText] = useState("SignOut")
  const { setProfileUpd, profileUpd, currUser, signOutHandler } = useAuth();

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
      
    setAuthText("Sign Out")
    }else{
    setAuthText("Sign In")}
  }, [currUser])
  
  return (
    <Navbar
      className="justify-content-between"
      collapseOnSelect
      fixed="top"
      expand="sm"
      bg="dark"
      variant="dark"
    >
      <Container>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav>
            <Nav.Link href="/">Home</Nav.Link>{" "}
          </Nav>
        </Navbar.Collapse>
        <Navbar.Collapse className="justify-content-end">
          <Button onClick={handleLogout}>
            <Navbar.Text>{authText}</Navbar.Text>
          </Button>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default MyNavbar;
