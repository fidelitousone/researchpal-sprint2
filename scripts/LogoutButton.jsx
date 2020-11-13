import * as React from 'react';
import Socket from './Socket';
import { useHistory  } from 'react-router-dom';

export function Logout() {
  const history = useHistory();
  function handleSubmit(response) {
    Socket.emit('logout');
    
    history.push("/");
  }

  return (
        <form onSubmit={handleSubmit}>
            <button>Logout</button>
        </form>
  );
}
