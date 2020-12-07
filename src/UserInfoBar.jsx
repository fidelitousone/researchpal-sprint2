import React from 'react';
import {
  Image, DropdownButton, Navbar, Nav, Dropdown, Container, Row, Col, Button,
} from 'react-bootstrap';
import { Link, useHistory } from 'react-router-dom';
import { BsFillCaretLeftFill, BsFillCaretRightFill } from 'react-icons/bs';
import PropTypes from 'prop-types';
import Logout from './LogoutButton';
import Socket from './Socket';

export default function UserInfoBar(props) {
  const {
    headerInfo, badgeInfo, profilePicture, leftLink, leftLabel, rightLink, rightLabel,
  } = props;
  const history = useHistory();

  React.useEffect(() => {
    Socket.on('redirect_to_login', () => {
      history.push('/login');
    });
    return () => {
      Socket.off('redirect_to_login');
    };
  });

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
      <div style={{ backgroundColor: 'rgb(233, 236, 239)', paddingBottom: '10px' }}>
        <div align="center">
          <h1>
            {headerInfo}
          </h1>
        </div>
        <Container>
          <Row>
            <Col>
              <div align="center">
                <Link to={leftLink}>
                  <Button variant="primary">
                    <BsFillCaretLeftFill />
                    {leftLabel}
                  </Button>
                </Link>
                {' '}
                <Link to={rightLink}>
                  <Button variant="primary">
                    {rightLabel}
                    <BsFillCaretRightFill />
                  </Button>
                </Link>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
}

UserInfoBar.propTypes = {
  headerInfo: PropTypes.string.isRequired,
  badgeInfo: PropTypes.string.isRequired,
  profilePicture: PropTypes.string.isRequired,
  leftLink: PropTypes.string.isRequired,
  rightLink: PropTypes.string.isRequired,
  leftLabel: PropTypes.string.isRequired,
  rightLabel: PropTypes.string.isRequired,
};
