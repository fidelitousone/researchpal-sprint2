import * as React from 'react';
import { Button, ButtonGroup, Badge, Image, Nav, DropdownButton, Dropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';

export default function Dashboard() {
  return (
    <div className="Dashboard">
      <Nav>
        <h1 align="center">Dashboard <Badge className="badge-primary">User</Badge></h1>
        <DropdownButton id="dropdown-basic-button" title={
          <Image src="static/profile-blank.jpg" className="rounded-circle border" width="50px" height="50px"/>
        }>
          <p>Hello</p>
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
    </div>
  );
}
