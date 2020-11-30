import * as React from 'react';
import Socket from './Socket';
import NavigationBar from './NavigationBar';
import UserInfoBar from './UserInfoBar';

export default function Bibliography() {
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
        console.log(data.project_name);
        setProjectName(data.project_name);
      });
    }, []);
  }

  function GetCitations() {
    GetProject();
    console.log(projectName);
    Socket.emit('get_all_citations', {
      project_name: projectName,
    });
  }
  GetCitations();

  return (
    <div className="Bibliography">
      <UserInfoBar headerInfo="Bibliography" badgeInfo={projectName} profilePicture={image} />
      <br />
      <NavigationBar />
    </div>
  );
}
