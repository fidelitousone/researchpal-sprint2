import * as React from 'react';
import {
  Container, Row, Col, Card,
} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import MainNavBar from './MainNavBar';
import 'bootstrap/dist/css/bootstrap.css';

export default function About() {
  return (
    <>
      <MainNavBar />
      <br />
      <div align="center">
        <h1>About Us</h1>
      </div>
      <br />
      <Container>
        <Row xs={1}>
          <Col>
            <Card className="text-center">
              <Card.Header>Who are we?</Card.Header>
              <Card.Body>
                We are a project group for CS 490-001, a software engineering course at NJIT.
                <br />
                Our names are Robert Argasinski, Eugene Cha, Mark Galesi, and Jatinder Singh.
                <br />
                If you would like to reach out to us, click
                {' '}
                <Link to="/contact">
                  here
                </Link>
                .
              </Card.Body>
            </Card>
            <br />
            <Card className="text-center">
              <Card.Header>What did we build?</Card.Header>
              <Card.Body>
                For our project, we chose to build ResearchPal,
                a tool designed to help students and researchers
                organize their sources and generate citations.
              </Card.Body>
            </Card>
            <br />
            <Card className="text-center">
              <Card.Header>How does it work?</Card.Header>
              <Card.Body>
                Once on our homepage, users can log in with either their Google,
                Facebook, or Microsoft accounts.
                <br />
                On successful login, users will be presented with a list of their
                available projects.
                <hr />
                From there, users can choose an existing project or create a new one.
                <br />
                After clicking into the desired project, users can input individual source URLs
                or upload a file with URLs separated by newlines.
                <br />
                A list of sources can also be downloaded to assist with migrating sources between
                project or sharing data between applications.
                <hr />
                Finally, the user can access a bibliography page and choose the corresponding format
                for citations (MLA and APA are currently supported).
                <br />
                Just like with sources, a list of citations can be downloaded from the
                bibliography page.
                <br />
                The user can choose which citations should be included in the
                exported bibliography and which should be ignored.
              </Card.Body>
            </Card>
            <br />
            <Card className="text-center">
              <Card.Header>How did we build it?</Card.Header>
              <Card.Body>
                We built this app over the course of two main milestones: the MVP and Sprint 2.
                <br />
                This would break down into weekly sprints that were monitored by an
                Industry Mentor (in our case, Sailesh Kumar).
                <br />
                We used the Kanban board feature of GitHub projects to keep track of progress.
                <br />
                <br />
                Below is a summary of the technologies we used:
                <hr />
                <u>FRONT-END</u>
                <br />
                React, React-Bootstrap, Validator, Google/Facebook/Microsoft OAuth, React-Icons,
                ReactRouter
                <hr />
                <u>BACK-END</u>
                <br />
                Python, Flask, Flask-Session, SQLAlchemy, PostgreSQL, MicroLink API, requests
                <hr />
                <u>MIDDLE</u>
                <br />
                SocketIO
                <hr />
                <u>DEPLOYMENT/TESTING</u>
                <br />
                GitHub, Heroku, CircleCI, Webpack, pytest, eslint, pylint, gunicorn, eventlet,
                coverage, black, pip-upgrader
              </Card.Body>
            </Card>
            <br />
            <Card className="text-center">
              <Card.Header>Why does it matter?</Card.Header>
              <Card.Body>
                As students, we know the difficulty of staying organized when
                conducting research.
                <br />
                Because of this, we chose to create a simple, intuitive, FREE tool
                to help manage the research process.
                <br />
                To learn more about what sets us apart, click
                {' '}
                <Link to="/pricing">
                  here
                </Link>
                .
              </Card.Body>
            </Card>
            <br />
            <Card className="text-center">
              <Card.Header>How can I access it?</Card.Header>
              <Card.Body>
                Our live deployment is available at
                {' '}
                <a href="https://rocky-sea-29898.herokuapp.com/">https://rocky-sea-29898.herokuapp.com/</a>
                .
              </Card.Body>
            </Card>
            <br />
            <Card className="text-center">
              <Card.Header>What lies ahead for ResearchPal?</Card.Header>
              <Card.Body>
                At the time of submission, our project has met the
                goals we set out in our proposal for the class.
                <br />
                However, we believe there is still plenty of ways
                to improve our app experience and deliver more
                functionality to our end users.
                <br />
                To learn more about what lies ahead, click
                {' '}
                <Link to="/future">
                  here
                </Link>
                .
              </Card.Body>
            </Card>
            <br />
          </Col>
        </Row>
      </Container>
    </>
  );
}
