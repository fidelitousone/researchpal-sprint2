import * as React from 'react';
import { Nav, Navbar, Button } from 'react-bootstrap';
import { Link, useHistory } from 'react-router-dom';
import Socket from './Socket';
import 'bootstrap/dist/css/bootstrap.css';

export default function MainNavBar() {
  const history = useHistory();
  React.useEffect(() => {
    Socket.on('login_response', (data) => {
      console.log(data);
      history.push('/home');
    });
    return () => {
      Socket.off('login_response');
    };
  });

  return (
    <Navbar bg="dark" variant="dark">
      <Navbar.Brand as={Link} to="/">
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
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link as={Link} to="/about">About Us</Nav.Link>
          <Nav.Link as={Link} to="/pricing">Pricing</Nav.Link>
          <Nav.Link as={Link} to="/future">Our Future</Nav.Link>
        </Nav>
        <Nav.Link as={Link} to="/contact">
          <Button variant="primary">Contact Us</Button>
        </Nav.Link>
      </Navbar.Collapse>
    </Navbar>
  );
}
