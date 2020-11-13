import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Socket from './Socket';
import { Button } from 'react-bootstrap';
import { Alert } from 'react-bootstrap';

function handleSubmit(event) {
    var projectName = document.getElementById("name_input");
    console.log("PROJECT: ");
    console.log(projectName.value);
    
    function checkProjectName(projectName){
        var exists;
        
        Socket.emit('check_project_exists', {
            'project_name': projectName,
            'socketid': Socket.id
        });
        
        Socket.on('get_project_exists', (data) => {
          exists = data['exists'];
          console.log("CHECK");
          console.log(exists);
        });
        
        return exists === "true";
    }
        
    if(/\s/g.test(projectName.value) || projectName.value === ''){
        ReactDOM.render(<Alert className="alert-warning">Warning: Project name was empty or only whitespace.  Please try again with a valid project name.</Alert>, document.getElementById("notif_project"));
    } 
    //else if(exists){
        //ReactDOM.render(<Alert className="alert-warning">Warning: Project name already exists.  Please try again with a unique project name.</Alert>, document.getElementById("notif_project"));
    else {
        
        var exists = checkProjectName(projectName.value);
        console.log("FINAL CHECK");
        console.log(exists);
        
        if(exists !== false){
            ReactDOM.render(<Alert className="alert-warning">Warning: Project name already exists.  Please try again with a unique project name.</Alert>, document.getElementById("notif_project"));
        } else {
            ReactDOM.render(<span></span>, document.getElementById("notif_project"))
            Socket.emit('create_project', {
            'project_name': projectName.value,
            'socketid' : Socket.id,
            });
            console.log('Sent the project ' + projectName.value + ' to server!');
        }
        
    }
    
    projectName.value = '';
    
    event.preventDefault();
}

export function CreateButton() {
    return (
        <div align="center">
            <form onSubmit={handleSubmit}>
                <div id="notif_project"></div>
                <input id="name_input" placeholder="Enter new project name"></input>
                <Button type="submit" className="btn-primary">Create!</Button>
            </form>
        </div>
    );
}
