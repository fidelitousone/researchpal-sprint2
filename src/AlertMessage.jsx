/* eslint-disable consistent-return */
/* The return is consistent in this file */
import React, { useState } from 'react';
import { Alert } from 'react-bootstrap';

export default function AlertMessage(props) {
  const [show, setShow] = useState(true);
  const { messageText } = props;
  function displayAlert() {
    if (show) {
      return (
        <Alert style={{ width: '40%' }} variant="danger" onClose={() => setShow(false)} dismissible>
          <Alert.Heading>Error!</Alert.Heading>
          <p>
            {messageText}
          </p>
        </Alert>
      );
    }
  }

  return (
    displayAlert()
  );
}
