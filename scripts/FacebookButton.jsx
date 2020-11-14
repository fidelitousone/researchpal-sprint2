import * as React from 'react';
import FacebookLogin from 'react-facebook-login';
import { useHistory } from 'react-router-dom';
import Socket from './Socket';
import 'bootstrap/dist/css/bootstrap.css';

export default function FacebookAuth() {
  const history = useHistory();
  function handleSubmit(response) {
    Socket.emit('new_facebook_user', {
      response,
    });
    console.log('Sent new facebook user to server!');
    console.log(response.email);
    Socket.emit('login_request', {
      email: response.email,
    });

    Socket.on('login_response', (data) => {
      console.log(data);
    });

    history.push('/home');
  }

  function responseFacebookSuccess(response) {
    if (response.status == 'unknown') {
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
    />
  );
}
