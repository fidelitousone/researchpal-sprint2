import React, { useState } from 'react';
import {
  Button, Container, Row, ListGroup, ButtonGroup, ToggleButton,
} from 'react-bootstrap';
import { BsFillDashCircleFill } from 'react-icons/bs';
import Socket from './Socket';
import UserInfoBar from './UserInfoBar';

export default function Bibliography() {
  const [citationList, setCitationList] = React.useState([]);
  const [mlaCitationList, setmlaCitationList] = React.useState([]);
  const [apaCitationList, setapaCitationList] = React.useState([]);
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

  function getCitation(style) {
    if (style === 'APA') {
      setCitationList(apaCitationList);
    } else {
      setCitationList(mlaCitationList);
    }
  }

  const radios = [
    { name: 'APA7', value: 'APA' },
    { name: 'MLA8', value: 'MLA' },
  ];
  const [radioValue, setRadioValue] = useState('APA');

  return (
    <div className="Bibliography">
      <UserInfoBar headerInfo="Bibliography" badgeInfo={projectName} profilePicture={image} />
      <div align="center">
        <ButtonGroup toggle>
          {radios.map((radio) => (
            <ToggleButton
              key={radio.name}
              type="radio"
              variant="primary"
              name="radio"
              value={radio.value}
              checked={radioValue === radio.value}
              onChange={
                (e) => {
                  setRadioValue(e.currentTarget.value);
                  getCitation(e.currentTarget.value);
                }
              }
            >
              {radio.name}
            </ToggleButton>
          ))}
        </ButtonGroup>
      </div>
      <br />
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
