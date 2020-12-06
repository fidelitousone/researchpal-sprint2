import * as React from 'react';
import Jumbotron from 'react-bootstrap/Jumbotron';
import {
  Col, Container, Row, Image, Button, Card,
} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';
import MainNavBar from './MainNavBar';

export default function Landing() {
  return (
    <div className="Landing">
      <MainNavBar />

      <Jumbotron fluid>
        <Container>
          <Row>
            <Col xs>
              <Image src="ResearchPal.svg" />
            </Col>
            <Col md>
              <h1>ResearchPal</h1>
              <p>
                The simple research organization tool, designed by researchers for researchers.
                Learn more about what set&apos;s us apart
                {' '}
                <Link to="/about">
                  here
                </Link>
                .
              </p>
              <br />
              <br />
              <Card>
                <Card.Body>
                  <Card.Title>Getting Started</Card.Title>
                  <Card.Text>New to ResearchPal?  Sign up or log in below:</Card.Text>
                  <Link to="/login">
                    <Button variant="primary">Sign up / Log in</Button>
                  </Link>
                </Card.Body>
              </Card>
              <br />
              <Card>
                <Card.Body>
                  <Card.Title>Getting Back to Work</Card.Title>
                  <Card.Text>Already logged in?  Go to your dashboard below:</Card.Text>
                  <Link to="/home">
                    <Button variant="primary">Dashboard</Button>
                  </Link>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </Jumbotron>
    </div>
  );
}
