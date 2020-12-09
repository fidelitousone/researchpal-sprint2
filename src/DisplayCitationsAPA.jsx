/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable array-callback-return */
import React from 'react';
import {
  Container, Card, ListGroup, Button,
} from 'react-bootstrap';
import {
  BsFillDashCircleFill, BsFillPlusCircleFill,
} from 'react-icons/bs';

// eslint-disable-next-line no-unused-vars
export default function DisplayCitations(props) {
  const { citationList, projectName } = props;
  return (
    <Container>
      <Card style={{ height: '600px' }}>
        <Card.Header style={{ textAlign: 'center' }}>
          {projectName}
          {' '}
          Citations
        </Card.Header>
        <ListGroup variant="flush">
          {citationList.map((item) => (
            <ListGroup.Item>
              {item.apa}
              <Button variant="danger" style={{ float: 'right' }}>
                <BsFillDashCircleFill />
              </Button>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Card>
    </Container>
  );
}
