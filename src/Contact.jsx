import * as React from 'react';
import {
  Container, Row, Col, Card,
} from 'react-bootstrap';
import MainNavBar from './MainNavBar';
import 'bootstrap/dist/css/bootstrap.css';

export default function Contact() {
  return (
    <>
      <MainNavBar />
      <br />
      <div align="center">
        <h1>Contact Us</h1>
      </div>
      <br />
      <Container>
        <Row md={4}>
          <Col>
            <Card>
              <Card.Img variant="top" src="robert.jpg" />
              <Card.Body>
                <Card.Title>Robert Argasinski</Card.Title>
                <Card.Text>
                  Email: ra536@njit.edu
                  <br />
                  <a href="https://github.com/ra536/">GitHub page</a>
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col>
            <Card>
              <Card.Img variant="top" src="eugene.jpg" />
              <Card.Body>
                <Card.Title>Eugene Cha</Card.Title>
                <Card.Text>
                  Email: ec323@njit.edu
                  <br />
                  <a href="https://github.com/nootify">GitHub page</a>
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col>
            <Card>
              <Card.Img variant="top" src="mark.jpg" />
              <Card.Body>
                <Card.Title>Mark Galesi</Card.Title>
                <Card.Text>
                  Email: mjg64@njit.edu
                  <br />
                  <a href="https://github.com/markgalesi">GitHub page</a>
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col>
            <Card>
              <Card.Img variant="top" src="jatinder.jpg" />
              <Card.Body>
                <Card.Title>Jatinder Singh</Card.Title>
                <Card.Text>
                  Email: js843@njit.edu
                  <br />
                  <a href="https://github.com/fidelitousone">GitHub page</a>
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}
