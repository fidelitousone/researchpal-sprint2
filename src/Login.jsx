import * as React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import GoogleAuth from './GoogleButton';
import FacebookAuth from './FacebookButton';
import MicrosoftAuth from './MicrosoftButton';
import 'bootstrap/dist/css/bootstrap.css';

export default function Login() {
  return (
    <>
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
    </>
  );
}
