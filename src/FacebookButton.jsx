import * as React from 'react';
import FacebookLogin from 'react-facebook-login';
import Socket from './Socket';

export default function FacebookAuth() {
  function handleSubmit(response) {
    Socket.emit('new_facebook_user', {
      response,
    });
    console.log('Sent new facebook user to server!');
    console.log(response.email);
    Socket.emit('login_request', {
      email: response.email,
    });
  }

  function responseFacebookSuccess(response) {
    if (response.status === 'unknown') {
      console.log('failure:', response);
    } else {
      handleSubmit(response);
      console.log('success:', response);
    }
  }

  return (
    <FacebookLogin
      appId="257908695617151"
      autoLoad={false}
      fields="name,email,picture"
      callback={responseFacebookSuccess}
      size="small"
    />
  );
}
