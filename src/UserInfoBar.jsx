import React from 'react';
import {
  Badge, Image, DropdownButton, Container, Col, Row
} from 'react-bootstrap';
import PropTypes from 'prop-types';
import Logout from './LogoutButton';

export default function UserInfoBar(props) {
  const { headerInfo, badgeInfo, profilePicture } = props;
  return (
    <>
      <Container>
        <Row noGutters="true" style={{justifyContent:"center", alignItems:"center", textAlign:"center"}}>
          <Col xs={2.5}>
            <h1>{headerInfo}</h1><Badge variant="primary">{badgeInfo}</Badge>
          </Col>
          <Col xs={2.5}>
            <DropdownButton
              id="dropdown-basic-button"
              title={
                <Image src={profilePicture} width="50px" height="50px" roundedCircle />
              }
            >
            </DropdownButton>
          </Col>
          <Col xs={2.5}>
            <Logout />
          </Col>
        </Row>
      </Container>
    </>
  );
}

UserInfoBar.propTypes = {
  headerInfo: PropTypes.string.isRequired,
  badgeInfo: PropTypes.string.isRequired,
  profilePicture: PropTypes.string.isRequired,
};
