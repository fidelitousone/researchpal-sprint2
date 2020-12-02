import * as React from 'react';
import { Navbar } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';

export default function MainNavBar() {
  return (
    <Navbar bg="dark" variant="dark">
      <Link to="/">
        <Navbar.Brand>
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
    </Navbar>
  );
}
