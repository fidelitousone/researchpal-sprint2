import * as React from 'react';
import Socket from './Socket';

function handleSubmit(event) {
    var projectName = document.getElementById("name_input");
    Socket.emit('create_project', {
        'project_name': projectName.value,
        'socketid' : Socket.id,
    });
    console.log('Sent the project ' + projectName.value + ' to server!');
    projectName.value = '';
    
    event.preventDefault();
}

export function CreateButton() {
    return (
        <form onSubmit={handleSubmit}>
            <input id="name_input" placeholder="Enter name.."></input>
            <button>Create!</button>
        </form>
    );
}
