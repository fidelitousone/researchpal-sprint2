import * as React from 'react';
import { Link } from 'react-router-dom';
import Jumbotron from 'react-bootstrap/Jumbotron';
import { Col, Container, Row } from 'react-bootstrap';
import GoogleAuth from './GoogleButton';
import FacebookAuth from './FacebookButton';
import MicrosoftAuth from './MicrosoftButton';
import 'bootstrap/dist/css/bootstrap.css';
import NavigationBar from './NavigationBar';

export default function Landing() {
  return (
    <div className="Landing">
      <Jumbotron fluid>
        <Container>
          <h1>ResearchPal</h1>
          <p>The simple research organization tool, designed by researchers for researchers</p>
        </Container>
      </Jumbotron>

      <h2 style={{ textAlign: 'center' }}>
        Log in below:
      </h2>
      <Container>
        <Row noGutters="true" style={{ justifyContent: 'center', alignItems: 'center' }}>
          <Col lg="2">
            <GoogleAuth />
          </Col>
          <Col lg="2">
            <MicrosoftAuth />
          </Col>
          <Col lg="2">
            <Link to="/home">
              <FacebookAuth />
            </Link>
          </Col>
        </Row>
      </Container>
      <NavigationBar />
    </div>
  );
}
