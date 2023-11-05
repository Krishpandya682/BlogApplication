// import { useEffect, useState } from "react";
// import Button from "react-bootstrap/Button";
// import Container from "react-bootstrap/Container";
// import Nav from "react-bootstrap/Nav";
// import Navbar from "react-bootstrap/Navbar";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
// import "./styles/navbar.css";

// function MyNavbar({signingUp}) {
//   const [authText, setAuthText] = useState("SignOut");
//   const { setProfileUpd, profileUpd, currUser, signOutHandler, currDbUser } =
//     useAuth();

//   const navigate = useNavigate();
//   async function handleLogout() {
//     if (currUser) {
//       await signOutHandler();
//       setProfileUpd(!profileUpd);
//     }
//     navigate("/signIn");
//   }

//   useEffect(() => {
//     console.log("Checking Navbar!!!");
//     if (currUser) {
//       setAuthText("Sign Out");
//     } else {
//       setAuthText("Sign In");
//       if(!signingUp){
//       navigate("/signIn");
//       }
//     }
//   }, [currUser, profileUpd, currDbUser]);

//   return (
//     <Navbar
//       className="myNav justify-content-between"
//       collapseOnSelect
//       fixed="top"
//       expand="sm"
//       variant="dark"
//     >
//       <Container className="w-100 myNav">
//         <Navbar.Toggle aria-controls="responsive-navbar-nav" />
//         <Navbar.Collapse id="responsive-navbar-nav">
//           <Nav>
//             <Nav.Link href="/">Home</Nav.Link>{" "}
//           </Nav>
//         </Navbar.Collapse>
//         <Navbar.Collapse className="justify-content-end">
//           { (currUser && currDbUser)  &&
//             <a href="/Profile">
//               <img
//                 className="navbar_profile_pic"
//                 src={currDbUser.profile_pic}
//                 alt={currDbUser.name + " Profile Picture"}
//               />
//             </a>
//           }
//           <Button className="myButton" onClick={handleLogout}>
//             <Navbar.Text>{authText}</Navbar.Text>
//           </Button>
//         </Navbar.Collapse>
//       </Container>
//     </Navbar>
//   );
// }

// export default MyNavbar;


import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./styles/navbar.css";

function MyNavbar({ signingUp }) {
  // State management and authentication context
  const [authText, setAuthText] = useState("SignOut");
  const { setProfileUpd, profileUpd, currUser, signOutHandler, currDbUser } = useAuth();
  const navigate = useNavigate();

  // Logout functionality
  async function handleLogout() {
    if (currUser) {
      await signOutHandler();
      setProfileUpd(!profileUpd);
    }
    navigate("/signIn");
  }

  // Effect for handling user authentication and navigation
  useEffect(() => {
    console.log("Checking Navbar!!!");
    if (currUser) {
      setAuthText("Sign Out");
    } else {
      setAuthText("Sign In");
      if (!signingUp) {
        navigate("/signIn");
      }
    }
  }, [currUser, profileUpd, currDbUser]);

  return (
    // Bootstrap Navbar component for navigation
    <Navbar
      className="myNav justify-content-between"
      collapseOnSelect
      fixed="top"
      expand="sm"
      variant="dark"
    >
      <Container className="w-100 myNav">
        {/* Left side of the Navbar */}
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav>
            {/* Link to the Home page */}
            <Nav.Link href="/">Home</Nav.Link>{" "}
          </Nav>
        </Navbar.Collapse>
        
        {/* Right side of the Navbar */}
        <Navbar.Collapse className="justify-content-end">
          {currUser && currDbUser && (
            <a href="/Profile">
              {/* Display user's profile picture */}
              <img
                className="navbar_profile_pic"
                src={currDbUser.profile_pic}
                alt={currDbUser.name + " Profile Picture"}
              />
            </a>
          )}
          <Button className="myButton" onClick={handleLogout}>
            {/* Sign out button */}
            <Navbar.Text>{authText}</Navbar.Text>
          </Button>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default MyNavbar;
