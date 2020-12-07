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
  const [projectName, setProjectName] = React.useState('');
  const [styleSelection, setStyleSelection] = React.useState('mla');
  const [user, setUser] = React.useState({ email: '' });
  const [image, setImage] = React.useState('');
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
      return () => {
        Socket.off('user_info');
      };
    }, []);
  }
  GetUserInfo();

  function GetProject() {
    React.useEffect(() => {
      Socket.emit('request_selected_project');
      Socket.on('give_project_name', (data) => {
        setProjectName(data.project_name);
      });
      return () => {
        Socket.off('give_project_name');
      };
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
      return () => {
        Socket.off('all_citations');
      };
    }, [projectName]);
  }
  GetCitations();

  function download() {
    let i;
    const list = [];
    const element = document.createElement('a');
    for (i = 0; i < citationList.length; i += 1) {
      if (citationList[i].is_cited) {
        list.push(citationList[i]);
      }
    }
    let stringData = '';
    if (styleSelection === 'mla') {
      stringData = list.map((item) => `${item.mla}\n`);
    } else {
      stringData = list.map((item) => `${item.apa}\n`);
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

  function add(sourceID) {
    Socket.emit('add_to_bibliography', {
      source_id: sourceID,
    });
  }

  function remove(sourceID) {
    Socket.emit('remove_from_bibliography', {
      source_id: sourceID,
    });
  }

  function setStatus(sourceID) {
    let i;
    const list = citationList;
    for (i = 0; i < list.length; i += 1) {
      if (list[i].source_id === sourceID) {
        if (list[i].is_cited) {
          list[i].is_cited = false;
          remove(sourceID);
        } else {
          list[i].is_cited = true;
          add(sourceID);
        }
      }
    }
    setCitationList([...list]);
  }
  const radios = [
    { name: 'APA7', value: 'APA' },
    { name: 'MLA8', value: 'MLA' },
  ];
  const [radioValue, setRadioValue] = useState('MLA');
  return (
    <div className="Bibliography">
      <UserInfoBar headerInfo="Bibliography" badgeInfo={user.email} profilePicture={image} leftLink="/project" rightLink="" leftLabel="Project" rightLabel="" />
      <br />
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
                {citationList.map((item) => {
                  if (item.is_cited) {
                    return(
                    <ListGroup.Item key={item.source_id}>
                      {item.mla}
                      <Button onClick={
                        (e) => {
                          setStatus(item.source_id);
                        }} variant="danger" style={{ float: 'right', marginLeft: '20px' }}><BsFillDashCircleFill /></Button>
                    </ListGroup.Item>
                    )
                  }
                })}
              </ListGroup>
              <ListGroup style={{ paddingTop: '2%', paddingBottom: '2%', alignItems: 'center' }}>
                {citationList.map((item) => {
                  if (item.is_cited === false) {
                    return(
                    <ListGroup.Item variant='dark' key={item.source_id}>
                      {item.mla}
                      <Button onClick={
                        (e) => {
                          setStatus(item.source_id);
                        }} variant="danger" style={{ float: 'right', marginLeft: '20px' }}><BsFillPlusCircleFill /></Button>
                    </ListGroup.Item>
                    )
                  }
                })}
              </ListGroup>
            </div>
          }
          {
          styleSelection === 'apa'
          && 
            <div>
              <ListGroup style={{ paddingTop: '2%', paddingBottom: '2%', alignItems: 'center' }}>
                {citationList.map((item) => {
                  if (item.is_cited) {
                    return(
                    <ListGroup.Item key={item.source_id}>
                      {item.apa}
                      <Button onClick={
                        (e) => {
                          setStatus(item.source_id);
                        }} variant="danger" style={{ float: 'right', marginLeft: '20px' }}><BsFillDashCircleFill /></Button>
                    </ListGroup.Item>
                    )
                  }
                })}
              </ListGroup>
              <ListGroup style={{ paddingTop: '2%', paddingBottom: '2%', alignItems: 'center' }}>
                {citationList.map((item) => {
                  if (!item.is_cited) {
                    return(
                    <ListGroup.Item variant='dark' key={item.source_id}>
                      {item.apa}
                      <Button onClick={
                        (e) => {
                          setStatus(item.source_id);
                        }} variant="danger" style={{ float: 'right', marginLeft: '20px' }}><BsFillPlusCircleFill /></Button>
                    </ListGroup.Item>
                    )
                  }
                })}
              </ListGroup>
            </div>
/* eslint-enable */}
        </Row>
      </Container>
    </div>
  );
}
