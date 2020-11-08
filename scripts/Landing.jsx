import * as React from 'react';
import * as ReactDOM from 'react-dom'
import { Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.css';

export default function Landing() {
    return (
        <div className="Landing">
            Hello World!
            <br />
            <Button className="btn-outline-primary">Login</Button>{' '}
        </div>
    )
}