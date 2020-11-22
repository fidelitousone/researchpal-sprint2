/* eslint-disable no-unused-vars */
/* eslint-disable no-restricted-globals */
import * as React from 'react';
import { Button, Col, Container, ListGroup, Row } from 'react-bootstrap';
import Socket from './Socket';
import CreateProject from './CreateProject';
import NavigationBar from './NavigationBar';
import UserInfoBar from './UserInfoBar';

export default function Dashboard() {
  const [projects, setProjects] = React.useState(0);
  const [user, setUser] = React.useState(0);
  const [image, setImage] = React.useState(0);

  function deleteProject(key){
    console.log("DELETE");
    console.log(key);
    Socket.emit(
      'delete_project',
      {
        project_name: key,
      }
    );
    
    Socket.emit(
      'select_project',
      {
        project_name: '',
      },
    );
  }

  function getStatus(key) {
    console.log(key);
    console.log('Button Clicked');
    Socket.emit(
      'select_project',
      {
        project_name: key,
      },
    );
  }

  function GetUserInfo() {
    React.useEffect(() => {
      Socket.emit('request_user_info');
      Socket.on('user_info', (data) => {
        console.log(`Received user info from server: ${data}`);
        setUser(data);
        console.log(data.profile_picture);

        let imagelink = 'static/profile-blank.jpg';
        if (data.profile_picture !== null) {
          imagelink = data.profile_picture;
        }
        setImage(imagelink);
      });
    }, []);
  }
  GetUserInfo();

  function GetAllProjects() {
    React.useEffect(() => {
      Socket.on('all_projects', (data) => {
        console.log(`Received projects from server: ${data}`);
        setProjects(data);
      });
    });
  }

  GetAllProjects();

  return (
    <Container>
      <Row xs={1}>
        <Col>
          <UserInfoBar headerInfo="Dashboard" badgeInfo={user.email} profilePicture={image} />
        </Col>
        <Col>
          <NavigationBar />
        </Col>
        <Col>
          <CreateProject projects={projects} />
        </Col>
        <ListGroup style={{paddingTop: "2%", alignItems: "center"}}>
          {Object.keys(projects).map((key, val) => 
            <ListGroup.Item action onClick={() => getStatus(projects[key].project_name)} style={{width: "25%"}}>
              {projects[key].project_name}
            </ListGroup.Item>
          )}
        </ListGroup>
      </Row>
    </Container>
  );
} 
