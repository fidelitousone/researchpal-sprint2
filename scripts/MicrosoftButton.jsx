import * as React from 'react';
import { Socket } from './Socket';
import MicrosoftLogin from "react-microsoft-login";

function handleSubmit(response) {
    Socket.emit('new_microsoft_user', {
        'response': response,
    });
    
    console.log('Sent new Microsoft user to server!');
}
function responseMicrosoftSuccess(err, response){
    console.log(err);
  console.log("Response:", response);
  handleSubmit(response);
}

export function MicrosoftAuth() {
    return (
            <MicrosoftLogin 
            clientId="3a9de6a1-f0fa-480b-bed0-7856d8079de1" 
            authCallback={responseMicrosoftSuccess}
            buttonTheme="light_short"
            withUserData="true" 
            graphScopes={["profile"]}
            />
    );
}
