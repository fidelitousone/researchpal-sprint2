import * as React from 'react';
import { Spinner } from 'react-bootstrap';
import CreateSource from './CreateSource';
import Socket from './Socket';
import UserInfoBar from './UserInfoBar';

export default function Project() {
  const [projectName, setProjectName] = React.useState('');
  const [user, setUser] = React.useState({ email: '' });
  const [image, setImage] = React.useState('');
  const [spinning, setSpinning] = React.useState(true);

  function GetUserInfo() {
    React.useEffect(() => {
      setSpinning(true);
      Socket.emit('request_user_info');
      Socket.on('user_info', (data) => {
        setUser(data);
        let imagelink = 'static/profile-blank.jpg';
        if (data.profile_picture !== null) {
          imagelink = data.profile_picture;
        }
        setImage(imagelink);
      });
      return () => {
        Socket.off('user_info');
      };
    }, []);
  }
  GetUserInfo();

  function GetProject() {
    React.useEffect(() => {
      setSpinning(true);
      Socket.emit('request_selected_project');
      Socket.on('give_project_name', (data) => {
        setProjectName(data.project_name);
        setSpinning(false);
      });
      return () => {
        Socket.off('give_project_name');
      };
    }, []);
  }

  function SpinnerObject() {
    if (spinning) {
      return (
        <div align="center">
          <br />
          <Spinner animation="border" variant="primary" />
        </div>
      );
    }
    return null;
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
    if (spinning) {
      return null;
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
      <UserInfoBar headerInfo="Project" badgeInfo={user.email} profilePicture={image} />
      <SpinnerObject spinning={spinning} />
      {renderProject()}
    </div>
  );
}
