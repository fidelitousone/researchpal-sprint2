import * as React from 'react';
import { Button } from 'react-bootstrap';

export default function CreateSource(props) {
  return (
    <div align="center">
      <br />
      <p name="h3">{props.usingProject}</p>
      <form>
        <input id="name_input" placeholder="Enter source name" />
        <Button type="submit" className="btn-primary">Add Source</Button>
      </form>
    </div>
  );
}
