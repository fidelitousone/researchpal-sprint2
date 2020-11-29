import * as React from 'react';
import { useHistory } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import Socket from './Socket';

export default function Logout() {
  const history = useHistory();
  function handleSubmit() {
    Socket.emit('logout');

    history.push('/');
  }

  return (
    <Button variant="secondary" onClick={handleSubmit} type="submit">Logout</Button>
  );
}
