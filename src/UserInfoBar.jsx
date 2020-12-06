import React from 'react';
import {
  Image, DropdownButton, Navbar, Nav, Dropdown,
} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Logout from './LogoutButton';

export default function UserInfoBar(props) {
  const { headerInfo, badgeInfo, profilePicture } = props;
  return (
    <>
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
            <Nav.Link as={Link} to="/home">Dashboard</Nav.Link>
            <Nav.Link as={Link} to="/project">Project</Nav.Link>
            <Nav.Link as={Link} to="/bibliography">Bibliography</Nav.Link>
          </Nav>
          <DropdownButton
            id="dropdown-basic-button"
            variant="secondary"
            title={
              <Image src={profilePicture} width="50px" height="50px" roundedCircle />
            }
            menuAlign={{ lg: 'right' }}
          >
            <Dropdown.Item disabled>
              Signed in as:
              <br />
              <b>
                {badgeInfo}
              </b>
            </Dropdown.Item>
            <Dropdown.Divider />
            <div align="center">
              <Logout />
            </div>
          </DropdownButton>
        </Navbar.Collapse>
      </Navbar>
      <div align="center">
        <h1>
          {headerInfo}
        </h1>
      </div>
    </>
  );
}

UserInfoBar.propTypes = {
  headerInfo: PropTypes.string.isRequired,
  badgeInfo: PropTypes.string.isRequired,
  profilePicture: PropTypes.string.isRequired,
};
