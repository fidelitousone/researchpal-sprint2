/* eslint-disable no-unused-vars */
/* eslint-disable no-restricted-globals */
import * as React from 'react';
import { Button } from 'react-bootstrap';
import { Glyphicon } from 'react-bootstrap';
import Socket from './Socket';
import CreateButton from './CreateProject';
import 'bootstrap/dist/css/bootstrap.css';
import NavigationBar from './NavigationBar';
import UserInfoBar from './UserInfoBar';

export default function Dashboard() {
  const [projects, setProjects] = React.useState(0);
  const [user, setUser] = React.useState(0);
  const [image, setImage] = React.useState(0);

  function deleteProject(key){
    console.log("DELETE");
    console.log(key);
    Socket.emit(
      'delete_project',
      {
        project_name: key,
      }
    );
    
    Socket.emit(
      'select_project',
      {
        project_name: '',
      },
    );
  }

  function getStatus(key) {
    console.log(key);
    console.log('Button Clicked');
    Socket.emit(
      'select_project',
      {
        project_name: key,
      },
    );
  }

  function getUserInfo() {
    React.useEffect(() => {
      Socket.emit('request_user_info');
      Socket.on('user_info', (data) => {
        console.log(`Received user info from server: ${data}`);
        setUser(data);
        console.log(data.profile_picture);

        let imagelink = 'static/profile-blank.jpg';
        if (data.profile_picture !== null) {
          imagelink = data.profile_picture;
        }
        setImage(imagelink);
      });
    }, []);
  }
  getUserInfo();

  function getAllProjects() {
    React.useEffect(() => {
      Socket.on('all_projects', (data) => {
        console.log(`Received projects from server: ${data}`);
        setProjects(data);
      });
    });
  }

  getAllProjects();

  return (
    <div className="Dashboard">
      <UserInfoBar headerInfo="Dashboard" badgeInfo={user.email} profilePicture={image} />
      <br />
      <NavigationBar />
      <br />
      <CreateButton projects={projects}/>
      <ul>
        <br />
        {Object.keys(projects).map((key, val) => (
          <div key={key} align="center">
            <Button onClick={() => getStatus(projects[key].project_name)} className="btn-outline-secondary" key={key}>{projects[key].project_name}</Button>
            {' '}
            <Button className="btn-outline-danger" onClick={() => deleteProject(projects[key].project_name)}><Glyphicon glyph="remove">X</Glyphicon></Button>
            <br />
            <br />
          </div>
        ))}
      </ul>
    </div>
  );
} 
