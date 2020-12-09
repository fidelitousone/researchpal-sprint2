import * as React from 'react';
import {
  Container, Col, Row, Card,
} from 'react-bootstrap';
import MainNavBar from './MainNavBar';
import 'bootstrap/dist/css/bootstrap.css';

export default function Pricing() {
  return (
    <>
      <MainNavBar />
      <br />
      <div align="center">
        <h1>Pricing</h1>
      </div>
      <br />
      <Container>
        <Row xs={1}>
          <Col>
            <Card className="text-center">
              <Card.Header>How much does it cost?</Card.Header>
              <Card.Body>
                <i>Nothing, it&apos;s FREE!</i>
              </Card.Body>
            </Card>
            <br />
            <Card className="text-center">
              <Card.Header>What else sets us apart from EasyBib?</Card.Header>
              <Card.Body>
                No ads of any kind.  Just a clean UI.
                <hr />
                Our service includes APA citations for free, whereas it takes a subscription
                to get the same with EasyBib.
                <hr />
                Fast and responsive UI makes it easy to switch between citation styles with
                a click of a button.
              </Card.Body>
            </Card>
            <br />
          </Col>
        </Row>
      </Container>
    </>
  );
}
