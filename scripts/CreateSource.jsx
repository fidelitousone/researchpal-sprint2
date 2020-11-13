import * as React from 'react';
import { Button } from 'react-bootstrap';

export default function CreateSource() {
  return (
    <div align="center">
      <br />
      <form>
        <input id="name_input" placeholder="Enter source name" />
        <Button type="submit" className="btn-primary">Add Source</Button>
      </form>
    </div>
  );
}
