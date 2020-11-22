import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Button } from 'react-bootstrap';
import validator from 'validator';
import AlertMessage from './AlertMessage';
import Socket from './Socket';

export default function CreateButton({projects}) {

  function handleSubmit(event) {
    const projectName = document.getElementById('name_input');
    console.log('PROJECT: ');
    console.log(projectName.value);
    console.log('PROJECTS: ');
    console.log(projects);
    let projectList = Object.values(projects).map(obj => obj.project_name);
    console.log(projectList);
  
    if (validator.isEmpty(validator.trim(projectName.value))) {
      ReactDOM.render(<AlertMessage messageText="Project name was empty or only whitespace.  Please try again with a valid project name." />, document.getElementById('notif_project'));
    } else if (projectList.some(name => projectName.value === name)){
      ReactDOM.render(<AlertMessage messageText="Project name is taken.  Please try again with a unique project name." />, document.getElementById('notif_project'));
    } else {
      ReactDOM.render(<span />, document.getElementById('notif_project'));
      Socket.emit('create_project', {
        project_name: projectName.value,
        socketid: Socket.id,
      });
      console.log(`Sent the project ${projectName.value} to server!`);
    }
  
    projectName.value = '';
  
    event.preventDefault();
  }
  
  console.log(projects);
  
  return (
    <div align="center">
      <form onSubmit={handleSubmit}>
        <div id="notif_project" />
        <input id="name_input" placeholder="Enter new project name" />
        <Button type="submit" className="btn-primary">Create!</Button>
      </form>
    </div>
  );
}
