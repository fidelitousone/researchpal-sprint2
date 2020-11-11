import * as React from 'react';
import GoogleAuth from './GoogleButton';
import FacebookAuth from './FacebookButton';
import MicrosoftAuth from './MicrosoftButton';
import 'bootstrap/dist/css/bootstrap.css';

export default function Landing() {
  return (
    <div className="Landing">
      Hello World!
      <br />
      <br />
      <GoogleAuth />
      <br />
      <br />
      <MicrosoftAuth />
      <br />
      <br />
      <FacebookAuth />
    </div>
  );
}
