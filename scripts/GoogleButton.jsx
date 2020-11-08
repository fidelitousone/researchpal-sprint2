import * as React from 'react';
import { Socket } from './Socket';
import GoogleLogin from 'react-google-login';

function handleSubmit(response) {
    Socket.emit('new_google_user', {
        'response': response,
    });
    
    console.log('Sent new google user to server!');
}
function responseGoogleSuccess(response){
  handleSubmit(response);
}

function responseGoogleFailure(response){
  console.log("FAIL:" + response);
}

export function GoogleAuth() {
    return (
            <GoogleLogin
            clientId="392545713863-91sppbihnj638rth8gg7upfvjoug9s98.apps.googleusercontent.com"
            buttonText="Login"
            onSuccess={responseGoogleSuccess}
            onFailure={responseGoogleFailure}
            cookiePolicy={'single_host_origin'}
            />
    );
}
