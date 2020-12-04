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
            <Link to="/home">
              <Nav.Link href="/home">Dashboard</Nav.Link>
            </Link>
            <Link to="/project">
              <Nav.Link href="/project">Project</Nav.Link>
            </Link>
            <Link to="/bibliography">
              <Nav.Link href="/bibliography">Bibliography</Nav.Link>
            </Link>
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
