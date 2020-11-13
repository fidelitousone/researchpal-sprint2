import * as React from 'react';
import { Button } from 'react-bootstrap';

export default function CreateSource(props) {
  const [text, setText] = React.useState('name_input');
  const projectName = props.usingProject;
  function handleSubmit(event) {
    const sourceLink = document.getElementById('name_input');
    console.log(`Got source link: ${sourceLink.value}`);
    sourceLink.value = '';
    event.preventDefault();
  }
  return (
    <div align="center">
      <br />
      <p name="h3">{projectName}</p>
      <form onSubmit={handleSubmit}>
        <input id="name_input" placeholder="Enter source name" />
        <Button type="submit" className="btn-primary">Add Source</Button>
      </form>
    </div>
  );
}
