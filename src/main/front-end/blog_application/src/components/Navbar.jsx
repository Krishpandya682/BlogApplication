import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

function MyNavbar() {
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
            <Navbar.Text>
              SignIn/SignOut BUTTON
            </Navbar.Text>
          </Navbar.Collapse>
        </Container>
      </Navbar>
  
  );
}

export default MyNavbar;
