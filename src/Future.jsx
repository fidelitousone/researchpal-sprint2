import * as React from 'react';
import {
  Container, Col, Row, Card,
} from 'react-bootstrap';
import MainNavBar from './MainNavBar';
import 'bootstrap/dist/css/bootstrap.css';

export default function Future() {
  return (
    <>
      <MainNavBar />
      <br />
      <div align="center">
        <h1>Our Future</h1>
      </div>
      <br />
      <Container>
        <Row xs={1}>
          <Col>
            <Card className="text-center">
              <Card.Header>Extended Citation Styles</Card.Header>
              <Card.Body>
                At this point, our project only supports MLA and APA styling.
                <br />
                In future revisions, we could add the Chicago citation style, alongside
                any other styles that our userbase would benefit from.
              </Card.Body>
            </Card>
            <br />
            <Card className="text-center">
              <Card.Header>Editing Citations</Card.Header>
              <Card.Body>
                To make implementation simpler, we chose to auto-generate citations.
                <br />
                However, we could find a way to allow users to edit these citations,
                if they wish to correct any errors or clarify when they accessed a resource.
              </Card.Body>
            </Card>
            <br />
            <Card className="text-center">
              <Card.Header>Real-Time Text Editing</Card.Header>
              <Card.Body>
                One stretch goal we had was to allow the user to write their paper
                in the app and have the app add sources and citations as the user is typing.
                <br />
                A follow-up would be to also track plagiarism and suggest a source
                to attribute a detected passage to.
              </Card.Body>
            </Card>
            <br />
            <Card className="text-center">
              <Card.Header>Companion Browser Extension</Card.Header>
              <Card.Body>
                Finally, our current implementation requires that the user be logged in
                for source input.
                <br />
                A simple browser extension could allow users to add sources they
                find with a click of a button.
                <br />
                This would make it simple and painless to manage
                evolving research projects without losing track of any sources.
              </Card.Body>
            </Card>
            <br />
          </Col>
        </Row>
      </Container>
    </>
  );
}
