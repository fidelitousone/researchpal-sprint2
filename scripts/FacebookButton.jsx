import * as React from 'react';
import { Socket } from './Socket';
import FacebookLogin from 'react-facebook-login';

function handleSubmit(response) {
    Socket.emit('new_facebook_user', {
        'response': response,
    });
    
    console.log('Sent new facebook user to server!');
}

function responseFacebookSuccess(response){
  console.log("Success:", response);
  handleSubmit(response);
}
 
export function FacebookAuth() {
    return (
        <FacebookLogin
        appId="257908695617151"
        autoLoad="false"
        fields="name,email,picture"
        callback={responseFacebookSuccess} />
    );
}
