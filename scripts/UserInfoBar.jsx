import React from 'react';
import {
  Badge, Image, DropdownButton,
} from 'react-bootstrap';
import PropTypes from 'prop-types';
import Logout from './LogoutButton';

export default function UserInfoBar(props) {
  const { headerInfo, badgeInfo, profilePicture } = props;
  return (
    <div display="flex" flex="0 0 auto" align="center">

      <span className="h1" position="absolute" left="0">
        {headerInfo}
        <Badge className="badge-primary">{badgeInfo}</Badge>
      </span>
      <DropdownButton
        id="dropdown-basic-button"
        title={
          <Image src={profilePicture} className="rounded-circle border" width="50px" height="50px" />
        }
      />
      <Logout />
    </div>
  );
}

UserInfoBar.propTypes = {
  headerInfo: PropTypes.string.isRequired,
  badgeInfo: PropTypes.string.isRequired,
  profilePicture: PropTypes.string.isRequired,
};
