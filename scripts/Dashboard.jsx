import * as React from 'react';
import Socket from './Socket';
import { Button, ButtonGroup, Badge, Image, Nav, DropdownButton } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Logout } from './LogoutButton';
import { ListGroup } from 'react-bootstrap';
import { Container, Row, Col } from 'react-bootstrap';
import { CreateButton } from './CreateProject';
import 'bootstrap/dist/css/bootstrap.css';

export default function Dashboard() {
    const [projects, setProjects] = React.useState(0);
    const [user, setUser] = React.useState(0);
    
    function getUserInfo(){
        React.useEffect(() => {
          Socket.emit('request_user_info');
          Socket.on('user_info', (data) => {
              console.log("Received user info from server: " + data);
              setUser(data);
          });
        },[]);
    }
    getUserInfo();
    
    function getAllProjects() {
        React.useEffect(() => {
            Socket.on('all_projects', (data) => {
                console.log("Received projects from server: " + data);
                setProjects(data);
            });
        });
    }

  getAllProjects();
  return (
    <div className="Dashboard">
     
      <div display="flex" flex="0 0 auto" align="center">
       
        <span className="h1" position="absolute" left="0">Dashboard <Badge className="badge-primary">{user['email']}</Badge></span>
        
        <DropdownButton id="dropdown-basic-button" title={
          <Image src="static/profile-blank.jpg" className="rounded-circle border" width="50px" height="50px"/>
        }>
        </DropdownButton>
       
      </div>
    
      
      <br />
      <div className="d-flex justify-content-center">
        <ButtonGroup aria-label="Basic example">
            <Link to="/">
            <Button className="btn-outline-primary">Landing</Button>
            </Link>
            <Link to="/home">
            <Button className="btn-outline-primary">Dashboard</Button>
            </Link>
            <Link to="/project">
            <Button className="btn-outline-primary">Project</Button>
            </Link>
            <Logout />
          </ButtonGroup>
        </div>
        <br />
        <CreateButton />
        <ul>
        <br />
        {Object.keys(projects).map((key,val) =>
          <div key={key} align="center">
            <Button className="btn-outline-secondary" key={key}>{projects[key]['project_name']}</Button>
            <br />
            <br />
          </div>
        )}
        </ul>
    </div>
  );
}
