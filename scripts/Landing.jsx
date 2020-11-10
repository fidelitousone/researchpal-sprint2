import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Button } from 'react-bootstrap';
import { GoogleAuth } from './GoogleButton';
import { MicrosoftAuth } from './MicrosoftButton';
import { FacebookAuth } from './FacebookButton';
import 'bootstrap/dist/css/bootstrap.css';

export default function Landing() {
    return (
        <div className="Landing">
            Hello World!
            <br /><br />
            <GoogleAuth />
            <br /><br />
            <MicrosoftAuth />
            <br /><br />
            <FacebookAuth />
        </div>
    )
}