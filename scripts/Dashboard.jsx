import * as React from 'react';
import Socket from './Socket';
import { Button, ButtonGroup, Badge, Image, Nav, DropdownButton } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { CreateButton } from './CreateProject';
import 'bootstrap/dist/css/bootstrap.css';

export default function Dashboard() {
    const [projects, setProjects] = React.useState(0);
    
    function getAllProjects() {
        React.useEffect(() => {
            Socket.on('all_projects', (data) => {
                console.log("Received messages from server: " + data);
                setProjects(data);
            });
        });
    }
  getAllProjects();
  return (
    <div className="Dashboard">
      <Nav>
        <h1 align="center">Dashboard <Badge className="badge-primary">User</Badge></h1>
        <DropdownButton id="dropdown-basic-button" title={
          <Image src="static/profile-blank.jpg" className="rounded-circle border" width="50px" height="50px"/>
        }>
        </DropdownButton>
      </Nav>
      
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
          </ButtonGroup>
        </div>
        <CreateButton />
        <ul>
        {Object.keys(projects).map((key,val) =>
          <li key={key}>{projects[key]['project_name']}</li>
        )}
        </ul>
    </div>
  );
}
