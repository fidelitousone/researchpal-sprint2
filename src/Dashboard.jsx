/* eslint-disable no-unused-vars */
/* eslint-disable no-restricted-globals */
import * as React from 'react';
import {
  Button, Col, Container, ListGroup, Row,
} from 'react-bootstrap';
import { BsFillDashCircleFill } from 'react-icons/bs';
import { useHistory } from 'react-router-dom';
import Socket from './Socket';
import CreateProject from './CreateProject';
import NavigationBar from './NavigationBar';
import UserInfoBar from './UserInfoBar';

export default function Dashboard() {
  const history = useHistory();
  const [projects, setProjects] = React.useState(0);
  const [user, setUser] = React.useState(0);
  const [image, setImage] = React.useState(0);

  function deleteProject(key) {
    Socket.emit(
      'delete_project',
      {
        project_name: key,
      },
    );
  }

  function getStatus(key) {
    history.push('/project');
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
        setUser(data);

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
        <ListGroup style={{ paddingTop: '2%', alignItems: 'center' }}>
          {Object.keys(projects).map((key, val) => (
            <ListGroup.Item style={{ width: '50%' }}>
              {projects[key].project_name}
              <Button variant="danger" onClick={() => deleteProject(projects[key].project_name)} style={{ float: 'right' }}>DELETE</Button>
              <Button variant="success" onClick={() => getStatus(projects[key].project_name)} style={{ float: 'right' }}>SELECT</Button>
            </ListGroup.Item>
          ))}

        </ListGroup>
      </Row>
    </Container>
  );
}
