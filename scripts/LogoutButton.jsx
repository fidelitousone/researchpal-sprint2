import * as React from 'react';
import Socket from './Socket';
import { useHistory  } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.css';

export function Logout() {
  const history = useHistory();
  function handleSubmit(response) {
    Socket.emit('logout');
    
    history.push("/");
  }

  return (
    <Button onClick={handleSubmit} type="submit" className="btn-secondary">Logout</Button>
  );
}
