import React from 'react';
import { Button, ButtonGroup, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function NavigationBar() {
  return (
    <div>
      <Container style={{ textAlign: 'center' }}>
        <ButtonGroup style={{ justifyContent: 'center', alignItems: 'center' }} aria-label="Navigation bar">
          <Link to="/">
            <Button variant="primary">Landing</Button>
          </Link>
          <Link to="/home">
            <Button variant="primary">Dashboard</Button>
          </Link>
          <Link to="/project">
            <Button variant="primary">Project</Button>
          </Link>
        </ButtonGroup>
      </Container>
    </div>
  );
}
