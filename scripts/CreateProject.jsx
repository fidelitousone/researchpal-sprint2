import * as React from 'react';
import { Button } from 'react-bootstrap';
import Socket from './Socket';

function handleSubmit(event) {
  const projectName = document.getElementById('name_input');
  Socket.emit('create_project', {
    project_name: projectName.value,
    socketid: Socket.id,
  });
  console.log(`Sent the project ${projectName.value} to server!`);
  projectName.value = '';

  event.preventDefault();
}

export function CreateButton() {
  return (
    <div align="center">
      <form onSubmit={handleSubmit}>
        <input id="name_input" placeholder="Enter new project name" />
        <Button type="submit" className="btn-primary">Create!</Button>
      </form>
    </div>
  );
}
