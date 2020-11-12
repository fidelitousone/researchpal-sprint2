import * as React from 'react';
import MicrosoftLogin from 'react-microsoft-login';
import Socket from './Socket';
import { useHistory  } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';

export default function MicrosoftAuth() {
  const history = useHistory();
  function handleSubmit(response) {
    console.log('here');
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
    history.push("/home");
  }
  function Microsoftresponse(err, response) {
    if(err==undefined){
      console.log('Response:', response);
      handleSubmit(response);
    }
    else{
      console.log(err);
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
