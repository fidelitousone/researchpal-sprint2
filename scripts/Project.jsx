import * as React from 'react';
import { Button, ButtonGroup, Badge, Nav, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';

export default function Project() {
  return (
    <div className="Project">
      <Nav>
        <h1 align="center">Project Page <Badge className="badge-primary">Name</Badge></h1>
        <Image src="static/profile-blank.jpg" className="rounded-circle border" width="50px" height="50px"/>
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
