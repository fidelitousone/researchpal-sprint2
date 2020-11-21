/* eslint-disable react/no-array-index-key */
import * as React from 'react';
import { Button, Alert } from 'react-bootstrap';
import * as ReactDOM from 'react-dom';
import validator from 'validator';
import PropTypes from 'prop-types';
import Socket from './Socket';

export default function CreateSource(props) {
  const [sourcesList, setSourcesList] = React.useState([]);
  const [sourcesMapList, setSourcesMapList] = React.useState([]);
  const { usingProject } = props;
  const projectName = usingProject;
  function handleSubmit(event) {
    const sourceLink = document.getElementById('name_input');
    event.preventDefault();
    console.log("SOURCES", sourcesList);
    if (validator.isEmpty(validator.trim(sourceLink.value))) {
      ReactDOM.render(<Alert className="alert-warning">Warning: Source name was empty or only whitespace.  Please try again with a valid project name.</Alert>, document.getElementById('notif_project'));
      event.preventDefault();
    } else if (sourcesList.some(name => sourceLink.value === name)) {
      ReactDOM.render(<Alert className="alert-warning">Warning: Source name is taken.  Please try again with a unique project name.</Alert>, document.getElementById('notif_project'));
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
  
  function deleteSource(index, projectName){
    console.log("DELETE");
    console.log(index);
    Socket.emit(
      'delete_source',
      {
        source_id: index,
        project_name: projectName
      }
    );
  }
  
  function GetSourcesFromServer(){
    React.useEffect(() => {
      Socket.on('all_sources_server', (data) => {
        console.log(`Received projects from server: ${data}`);
        setSourcesList(data.source_list);
        setSourcesMapList(data.source_map);
      });
    });
    console.log(sourcesList)
    console.log(sourcesMapList)
  }
  
  GetSourcesFromServer();

  function GetAllSources() {
    React.useEffect(() => {
      Socket.emit('get_all_sources', {
        project_name: projectName,
      });
    }, []);
    React.useEffect(() => {
      Socket.on('all_sources', (data) => {
        console.log(`Received projects from server: ${data}`);
        setSourcesList(data.source_list);
        setSourcesMapList(data.source_map);
      });
    });
    console.log(sourcesList)
  }

  GetAllSources();

  return (
    <div align="center">
      <br />
      <div className="h3">{projectName}</div>
      <div id="notif_project" />
      
      {Object.entries(sourcesMapList).map(([sourceID, sourceName]) => (
        <div key={sourceID} align="center">
          <Button className="btn-outline-secondary" key={sourceID}>{sourceName}</Button>
          {' '}
          <Button className="btn-outline-danger" onClick={() => deleteSource(sourceID, projectName)}>X</Button>
          <br/>
          <br/>
        </div>
          
        ))}
      <br/>
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