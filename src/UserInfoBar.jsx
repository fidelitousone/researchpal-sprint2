import React from 'react';
import {
  Badge, Image, DropdownButton, Navbar, Nav,
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
            <h1>
              {headerInfo}
              <Badge variant="primary">{badgeInfo}</Badge>
            </h1>
            <Link to="/future">
              <Nav.Link href="/future">Our Future</Nav.Link>
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
            <div align="center">
              <Logout />
            </div>
          </DropdownButton>
        </Navbar.Collapse>
      </Navbar>
    </>
  );
}

UserInfoBar.propTypes = {
  headerInfo: PropTypes.string.isRequired,
  badgeInfo: PropTypes.string.isRequired,
  profilePicture: PropTypes.string.isRequired,
};
