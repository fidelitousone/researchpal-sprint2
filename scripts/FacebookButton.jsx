import * as React from 'react';
import FacebookLogin from 'react-facebook-login';
import Socket from './Socket';
import { useHistory  } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';

export default function FacebookAuth() {
  const history = useHistory();
  function handleSubmit(response) {
    Socket.emit('new_facebook_user', {
      response,
    });
    console.log('Sent new facebook user to server!');
    history.push("/home");
  }

  function responseFacebookSuccess(response) {
    if(response['status']=='connected'){
      handleSubmit(response);
      console.log('success:', response);
    }
    else{
      console.log('failure:', response);
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
