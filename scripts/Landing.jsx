import * as React from 'react';
import { Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.css';

export default function Landing() {
    return (
        <div className="Landing">
            Hello World!
            <br />
            <Button variant="outline-primary">Login</Button>{' '}
        </div>
    )
}