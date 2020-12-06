import * as React from 'react';
import MicrosoftLogin from 'react-microsoft-login';
import Socket from './Socket';

export default function MicrosoftAuth() {
  function handleSubmit(response) {
    console.log(response.id);
    const profilePicture = (`https://storage.live.com/Users/0x${response.id}
    /MyProfile/ExpressionProfile/ProfilePhoto:Win8Static,UserTileMedium,UserTileStatic`
    );
    Socket.emit('new_microsoft_user', {
      response,
      profilePicture,
    });
    console.log('Sent new Microsoft user to server!');

    Socket.emit('login_request', {
      email: response.account.userName,
    });
  }

  function Microsoftresponse(err, response) {
    if ((err === undefined) || (err === null)) {
      console.log('Response:', response);
      handleSubmit(response);
    } else {
      console.log('Error:', err);
    }
  }

  return (
    <MicrosoftLogin
      clientId="3a9de6a1-f0fa-480b-bed0-7856d8079de1"
      authCallback={Microsoftresponse}
      buttonTheme="light_short"
      withUserData="true"
      graphScopes={['profile']}
    />
  );
}
