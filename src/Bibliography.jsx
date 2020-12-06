import React, { useState } from 'react';
import {
  Button, Container, Row, ListGroup, ButtonGroup, ToggleButton, Spinner,
} from 'react-bootstrap';
import {
  BsFillDashCircleFill, BsFillPlusCircleFill,
} from 'react-icons/bs';
import Socket from './Socket';
import UserInfoBar from './UserInfoBar';

export default function Bibliography() {
  const [citationList, setCitationList] = React.useState([]);
  const [activeList, setActiveList] = React.useState([]);
  const [inactiveList, setInactiveList] = React.useState([]);
  const [projectName, setProjectName] = React.useState('');
  const [styleSelection, setStyleSelection] = React.useState('mla');
  const [user, setUser] = React.useState(0);
  const [image, setImage] = React.useState(0);
  const [spinning, setSpinning] = useState(true);

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

  function SpinnerObject() {
    if (spinning) {
      return (
        <div align="center">
          <Spinner animation="border" variant="primary" />
        </div>
      );
    }
    return null;
  }

  function setActive() {
    let i;
    const active = [];
    const inactive = [];
    for (i = 0; i < citationList.length; i += 1) {
      if (citationList[i].active === true) {
        active.push(citationList[i]);
      } else {
        inactive.push(citationList[i]);
      }
    }
    React.useEffect(() => {
      setActiveList(active);
      setInactiveList(inactive);
    }, [citationList]);
  }

  function GetCitations() {
    React.useEffect(() => {
      setSpinning(true);
      if (projectName !== null && projectName !== '') {
        Socket.emit('get_all_citations', {
          project_name: projectName,
        });
        Socket.on('all_citations', (data) => {
          setCitationList(data.citation_list);
        });
        setSpinning(false);
      }
    }, [projectName]);
  }
  GetCitations();

  function download() {
    const element = document.createElement('a');
    let stringData = '';
    if (styleSelection === 'mla') {
      stringData = citationList.map((item) => `${item.mla}\n`);
    } else {
      stringData = citationList.map((item) => `${item.apa}\n`);
    }
    const data = `data:text/plain;charset=utf-8,${encodeURIComponent(stringData)}`;
    element.setAttribute('href', data);
    element.setAttribute('download', 'Bibliography.txt');
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

  function getCitation(style) {
    if (style === 'APA') {
      setStyleSelection('apa');
    } else {
      setStyleSelection('mla');
    }
  }

  function setStatus(sourceID) {
    let i;
    for (i = 0; i < citationList.length; i += 1) {
      if (citationList[i].source_id === sourceID) {
        if (citationList[i].active === true) {
          citationList[i].active = false;
        } else {
          citationList[i].active = true;
        }
      }
    }
    setActive();
  }
  setActive();
  const radios = [
    { name: 'APA7', value: 'APA' },
    { name: 'MLA8', value: 'MLA' },
  ];
  const [radioValue, setRadioValue] = useState('MLA');
  return (
    <div className="Bibliography">
      <UserInfoBar headerInfo="Bibliography" badgeInfo={user.email} profilePicture={image} />
      <div align="center">
        <Button onClick={download} style={{ float: 'center' }}>Download</Button>
        {' '}
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
      <SpinnerObject spinning={spinning} />
      <Container style={{ textAlign: 'center' }}>
        <Row xs={1}>
          {/* eslint-disable */
          styleSelection === 'mla'
          && 
            <div>
              <ListGroup style={{ paddingTop: '2%', paddingBottom: '2%', alignItems: 'center' }}>
                {activeList.map((item) => (
                      <ListGroup.Item key={item.active}>
                        {item.mla}
                        <Button onClick={() => setStatus(item.source_id)} variant="danger" style={{ float: 'right', marginLeft: '20px' }}><BsFillDashCircleFill /></Button>
                      </ListGroup.Item>
                ))}
              </ListGroup>
              <ListGroup style={{ paddingTop: '2%', paddingBottom: '2%', alignItems: 'center' }}>
                {inactiveList.map((item) => (
                      <ListGroup.Item key={item.active}>
                        {item.mla}
                        <Button onClick={() => setStatus(item.source_id)} variant="danger" style={{ float: 'right', marginLeft: '20px' }}><BsFillPlusCircleFill /></Button>
                      </ListGroup.Item>
                ))}
              </ListGroup>
            </div>
          }
          {
          styleSelection === 'apa'
          && 
            <div>
              <ListGroup style={{ paddingTop: '2%', paddingBottom: '2%', alignItems: 'center' }}>
                {activeList.map((item) => (
                      <ListGroup.Item key={item.active}>
                        {item.apa}
                        <Button onClick={() => setStatus(item.source_id)} variant="danger" style={{ float: 'right', marginLeft: '20px' }}><BsFillDashCircleFill /></Button>
                      </ListGroup.Item>
                ))}
              </ListGroup>
              <ListGroup style={{ paddingTop: '2%', paddingBottom: '2%', alignItems: 'center' }}>
                {inactiveList.map((item) => (
                      <ListGroup.Item key={item.active}>
                        {item.apa}
                        <Button onClick={() => setStatus(item.source_id)} variant="danger" style={{ float: 'right', marginLeft: '20px' }}><BsFillPlusCircleFill /></Button>
                      </ListGroup.Item>
                ))}
              </ListGroup>
            </div>
/* eslint-enable */}
        </Row>
      </Container>
    </div>
  );
}
