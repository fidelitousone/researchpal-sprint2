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
                We are a project group for CS 490-001, a software-engineering course at NJIT.
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
                We are a project group for CS 490-001, a software-engineering course at NJIT.
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
              <Card.Header>How did we build it?</Card.Header>
              <Card.Body>
                We are a project group for CS 490-001, a software-engineering course at NJIT.
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
              <Card.Header>How can I access it?</Card.Header>
              <Card.Body>
                We are a project group for CS 490-001, a software-engineering course at NJIT.
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
          </Col>
        </Row>
      </Container>
    </>
  );
}
