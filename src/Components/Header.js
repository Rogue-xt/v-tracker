import React from "react";
import { useAuth } from "../Context/AuthContext";
import logo from "../images/logo.png";

import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";

const Header = () => {
  const { currentUser, logout } = useAuth();
  const handleLogout = () => {
    logout();
  };

  return (
    <Navbar collapseOnSelect expand="lg" className="header bg-body-tertiary">
      <Container>
        <Navbar.Brand href="/">
          {" "}
          <img src={logo} alt="" />
          V-Tracker
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="#features">Features</Nav.Link>
            <Nav.Link href="#pricing">Pricing</Nav.Link>
            {currentUser ? (
              <NavDropdown
                title={`Hello, ${currentUser.name}`}
                id="collapsible-nav-dropdown"
              >
                <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                {/* <NavDropdown.Item href="#action/3.2">
                  Another action
                </NavDropdown.Item>
                <NavDropdown.Item href="#action/3.3">
                  Something
                </NavDropdown.Item> */}
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout}>
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <p></p>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
