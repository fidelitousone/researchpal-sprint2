import React from 'react';
import { Button, ButtonGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function NavigationBar() {
  return (
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

  );
}
