import * as React from 'react';
import {
  Button, Container, Row, ListGroup,
} from 'react-bootstrap';
import { BsFillDashCircleFill } from 'react-icons/bs';
import Socket from './Socket';
import NavigationBar from './NavigationBar';
import UserInfoBar from './UserInfoBar';

export default function Bibliography() {
  const [citationList, setCitationList] = React.useState([]);
  const [mlaCitationList, setmlaCitationList] = React.useState([]);
  const [apaCitationList, setapaCitationList] = React.useState([]);
  const [projectName, setProjectName] = React.useState('');
  const [styleSelection, setStyleSelection] = React.useState('');
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

  GetProject();
  function GetCitations() {
    React.useEffect(() => {
      if (projectName !== null && projectName !== '') {
        Socket.emit('get_all_citations', {
          project_name: projectName,
        });
        Socket.on('all_citations', (data) => {
          setCitationList(data.apa_citation_list);
          setmlaCitationList(data.mla_citation_list);
          setapaCitationList(data.apa_citation_list);
        });
      }
    }, [projectName]);
  }
  GetCitations();

  function getAPA() {
    setCitationList(apaCitationList);
    setStyleSelection('apa');
  }
  function getMLA() {
    setCitationList(mlaCitationList);
    setStyleSelection('mla');
  }

  function download() {
    const element = document.createElement('a');
    let stringData = '';
    if (styleSelection === 'mla') {
      stringData = mlaCitationList.map((item) => `${item}\n`);
    } else {
      stringData = apaCitationList.map((item) => `${item}\n`);
    }
    console.log(stringData);
    const data = `data:text/plain;charset=utf-8,${encodeURIComponent(stringData)}`;
    element.setAttribute('href', data);
    element.setAttribute('download', 'file.txt');
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

  return (
    <div className="Bibliography">
      <UserInfoBar headerInfo="Bibliography" badgeInfo={projectName} profilePicture={image} />
      <Button variant="success" onClick={getAPA}>APA7</Button>
      <Button variant="success" onClick={getMLA}>MLA8</Button>
      <Button variant="success" onClick={download}>Download Bibliography</Button>
      <br />
      <NavigationBar />
      <Container style={{ textAlign: 'center' }}>
        <Row xs={1}>
          <ListGroup style={{ paddingTop: '2%', paddingBottom: '2%', alignItems: 'center' }}>
            {Object.entries(citationList).map(([sourceID, sourceName]) => (
              <ListGroup.Item key={sourceID}>
                {sourceName}
                <Button variant="danger" style={{ float: 'right', marginLeft: '20px' }}><BsFillDashCircleFill /></Button>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Row>
      </Container>
    </div>
  );
}
