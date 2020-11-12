import * as React from 'react';
import MicrosoftLogin from 'react-microsoft-login';
import Socket from './Socket';

export default function MicrosoftAuth() {
  function handleSubmit(response) {
    Socket.emit('new_microsoft_user', {
      response,
    });
    console.log('Sent new Microsoft user to server!');
    
    Socket.emit('login_request', {
        'email': response["account"]["userName"],
    });
    
    Socket.on('login_response', (data) => {
      console.log(data);
    });
  }
  function responseMicrosoftSuccess(err, response) {
    if (response !== undefined) {
      console.log(err);
      console.log('Response:', response);
      handleSubmit(response);
    }
    console.log('Microsoft auth failure.');
  }

  return (
    <MicrosoftLogin
      clientId="3a9de6a1-f0fa-480b-bed0-7856d8079de1"
      authCallback={responseMicrosoftSuccess}
      buttonTheme="light_short"
      withUserData="true"
      graphScopes={['profile']}
    />
  );
}
