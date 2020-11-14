import * as React from 'react';
import { Link } from 'react-router-dom';
import { Button, ButtonGroup } from 'react-bootstrap';
import GoogleAuth from './GoogleButton';
import FacebookAuth from './FacebookButton';
import MicrosoftAuth from './MicrosoftButton';
import 'bootstrap/dist/css/bootstrap.css';

export default function Landing() {
  return (
    <div className="Landing">
      <div className="jumbotron">
        <h1>ResearchPal</h1>
        <p>The simple research organization tool, designed by researchers for researchers</p>
      </div>
      <h2 align="center">Log in below:</h2>
      <div className="d-flex justify-content-center">
        <div className="align-self-center px-2">
          <GoogleAuth />
        </div>
        <div className="align-self-center px-2">
          <MicrosoftAuth />
        </div>
        <div className="align-self-center px-2">
          <Link to="/home">
            <FacebookAuth />
          </Link>
        </div>
      </div>
      <br />
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
