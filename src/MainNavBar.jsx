import * as React from 'react';
import { Nav, Navbar, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';

export default function MainNavBar() {
  return (
    <Navbar bg="dark" variant="dark">
      <Link to="/">
        <Navbar.Brand href="/">
          <img
            src="ResearchPal.svg"
            width="30"
            height="30"
            className="d-inline-block align-top"
            alt=""
          />
          {' '}
          ResearchPal
        </Navbar.Brand>
      </Link>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Link to="/about">
            <Nav.Link href="/about">About Us</Nav.Link>
          </Link>
          <Link to="/pricing">
            <Nav.Link href="/pricing">Pricing</Nav.Link>
          </Link>
          <Link to="/future">
            <Nav.Link href="/future">Our Future</Nav.Link>
          </Link>
        </Nav>
        <Link to="/contact">
          <Button variant="primary">Contact Us</Button>
        </Link>
      </Navbar.Collapse>
    </Navbar>
  );
}
