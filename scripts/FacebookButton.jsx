import * as React from 'react';
import FacebookLogin from 'react-facebook-login';
import Socket from './Socket';

export default function FacebookAuth() {
  function handleSubmit(response) {
    Socket.emit('new_facebook_user', {
      response,
    });
    console.log('Sent new facebook user to server!');
  }

  function responseFacebookSuccess(response) {
    console.log('Success:', response);
    handleSubmit(response);
  }

  return (
    <FacebookLogin
      appId="257908695617151"
      autoLoad={false}
      fields="name,email,picture"
      callback={responseFacebookSuccess}
    />
  );
}
