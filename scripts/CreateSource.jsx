/* eslint-disable react/no-array-index-key */
import * as React from 'react';
import { Button, Alert } from 'react-bootstrap';
import * as ReactDOM from 'react-dom';
import validator from 'validator';
import PropTypes from 'prop-types';
import Socket from './Socket';

export default function CreateSource(props) {
  const [sourcesList, setSourcesList] = React.useState([]);
  const { usingProject } = props;
  const projectName = usingProject;
  function handleSubmit(event) {
    const sourceLink = document.getElementById('name_input');
    event.preventDefault();
    if (validator.isEmpty(validator.trim(sourceLink.value))) {
      ReactDOM.render(<Alert className="alert-warning">Warning: Source name was empty or only whitespace.  Please try again with a valid project name.</Alert>, document.getElementById('notif_project'));
      event.preventDefault();
    } else {
      console.log(`Got source link: ${sourceLink.value}`);
      Socket.emit('add_source_to_project', {
        project_name: projectName,
        source_link: sourceLink.value,
      });
      sourceLink.value = '';
    }
    event.preventDefault();
  }

  function getAllSources() {
    React.useEffect(() => {
      Socket.emit('get_all_sources', {
        project_name: projectName,
      });
    }, []);
    React.useEffect(() => {
      Socket.on('all_sources', (data) => {
        console.log(`Received projects from server: ${data}`);
        setSourcesList(data.sources);
      });
    });
  }

  getAllSources();

  return (
    <div align="center">
      <br />
      <p name="h3">{projectName}</p>
      <div id="notif_project" />
      {sourcesList.map((value, index) => <li key={index}>{value}</li>)}
      <form onSubmit={handleSubmit}>
        <input id="name_input" placeholder="Enter source name" />
        <Button type="submit" className="btn-primary">Add Source</Button>
      </form>
    </div>
  );
}

CreateSource.propTypes = {
  usingProject: PropTypes.string.isRequired,
};
