import * as React from 'react';
import Jumbotron from 'react-bootstrap/Jumbotron';
import {
  Col, Container, Row, Image,
} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import NavigationBar from './NavigationBar';
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
              <p>The simple research organization tool, designed by researchers for researchers</p>
            </Col>
          </Row>
        </Container>
      </Jumbotron>

      <NavigationBar />
    </div>
  );
}
