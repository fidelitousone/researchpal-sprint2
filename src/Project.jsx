import * as React from 'react';
import CreateSource from './CreateSource';
import Socket from './Socket';
import NavigationBar from './NavigationBar';
import UserInfoBar from './UserInfoBar';

export default function Project() {
  const [projectName, setProjectName] = React.useState('');
  const [image, setImage] = React.useState(0);
  function GetUserInfo() {
    React.useEffect(() => {
      Socket.emit('request_user_info');
      Socket.on('user_info', (data) => {
        let imagelink = 'static/profile-blank.jpg';
        if (data.profile_picture !== null) {
          imagelink = data.profile_picture;
        }
        setImage(imagelink);
      });
    }, []);
  }
  GetUserInfo();

  function GetProject() {
    React.useEffect(() => {
      Socket.emit('request_selected_project');
      Socket.on('give_project_name', (data) => {
        setProjectName(data.project_name);
      });
    }, []);
  }

  function projectSelected() {
    if (projectName === '' || projectName === null) {
      return false;
    }
    return true;
  }

  function renderProject() {
    if (projectSelected()) {
      return (<CreateSource usingProject={projectName} />);
    }
    return (
      <div>
        <span className="d-flex justify-content-center">
          A project is not selected, please select a project from the Dashboard.
        </span>
      </div>
    );
  }

  GetProject();

  return (
    <div className="Project">
      <UserInfoBar headerInfo="Project" badgeInfo={projectName} profilePicture={image} />
      <br />
      <NavigationBar />
      {renderProject()}
    </div>
  );
}
