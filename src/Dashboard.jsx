/* eslint-disable no-unused-vars */
/* eslint-disable no-restricted-globals */
import React, { useState } from 'react';
import {
  Button, Col, Container, ListGroup, Row, Modal, Spinner,
} from 'react-bootstrap';
import { BsFillDashCircleFill } from 'react-icons/bs';
import { useHistory } from 'react-router-dom';
import Socket from './Socket';
import CreateProject from './CreateProject';
import UserInfoBar from './UserInfoBar';

export default function Dashboard() {
  const history = useHistory();
  const [projects, setProjects] = React.useState(0);
  const [user, setUser] = React.useState(0);
  const [image, setImage] = React.useState(0);

  const [confirm, setConfirm] = useState(false);
  const [delProject, setDelProject] = useState('');

  const handleShow = () => setConfirm(true);
  const handleClose = () => setConfirm(false);

  const [spinning, setSpinning] = useState(true);

  function SpinnerObject() {
    if (spinning) {
      return <Spinner animation="border" variant="primary" />;
    }
    return null;
  }

  function deleteProject() {
    handleClose();
    Socket.emit(
      'delete_project',
      {
        project_name: delProject,
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
      setSpinning(true);
      Socket.emit('request_user_info');
      Socket.on('user_info', (data) => {
        setUser(data);
        // eslint-disable-next-line
        console.log(data);

        let imagelink = 'static/profile-blank.jpg';
        if (data.profile_picture !== null) {
          imagelink = data.profile_picture;
        }
        setImage(imagelink);
        setSpinning(false);
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

  function ConfirmDelete() {
    return (
      <Modal show={confirm} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Warning</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete project
          {' '}
          <b>
            {delProject}
          </b>
          ?
          <br />
          <br />
          This will delete all of its associated source and citation information.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="danger" onClick={deleteProject}>
            Delete Project
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }

  return (
    <>
      <UserInfoBar headerInfo="Dashboard" badgeInfo={user.email} profilePicture={image} />
      <Container>
        <Row xs={1}>
          <Col>
            <CreateProject projects={projects} />
          </Col>

          <ConfirmDelete />

          <ListGroup style={{ paddingTop: '2%', alignItems: 'center' }}>
            {Object.keys(projects).map((id) => (
              <ListGroup.Item key={id} style={{ width: '50%' }}>
                {projects[id].project_name}
                <Button
                  variant="danger"
                  onClick={
                    () => {
                      setDelProject(projects[id].project_name);
                      handleShow();
                    }
                  }
                  style={{ float: 'right' }}
                >
                  DELETE
                </Button>
                <Button variant="success" onClick={() => getStatus(projects[id].project_name)} style={{ float: 'right' }}>SELECT</Button>
              </ListGroup.Item>
            ))}

          </ListGroup>
        </Row>
      </Container>
      <br />
      <div align="center">
        <SpinnerObject spinning={spinning} />
      </div>
    </>
  );
}
