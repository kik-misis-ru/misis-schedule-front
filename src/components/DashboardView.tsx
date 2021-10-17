import React, {useState, useEffect, useRef} from "react";
import {IconLocation, IconSettings} from "@sberdevices/plasma-icons";
import {
  Badge, Button,
  Card,
  CardBody,
  CardBody2,
  CardContent, CardHeadline3, CellListItem,
  Col,
  Container,
  DeviceThemeProvider, Image,
  Row,
  TextBox, TextBoxSubTitle, TextBoxTitle
} from "@sberdevices/plasma-ui";
import {DEFAULT_TEXT_COLOR, getThemeBackgroundByChar, DocStyle} from "../App";
import logo from "../images/logo.png";


const LinkToOnlineLesson = ({url}: { url: string }) => (
  url !== "" && url !== null
    ? (
      <a
        href={url}
        style={{color: DEFAULT_TEXT_COLOR}}
      >
        Ссылка на онлайн-конференцию
      </a>
    )
    : (
      <div></div>
    )
)

const DashboardTopRow = (props: { onHomeClick }) => (
  <Row style={{margin: "1em"}}>
    <Col style={{maxWidth: '3rem'}}>
      <Image src={logo} ratio="1 / 1"/>
    </Col>
    <Col style={{marginLeft: "0.5em", paddingTop: "0.5em"}}>
      <TextBox>
        <CardHeadline3>Мир МИСиС</CardHeadline3>
      </TextBox>
    </Col>
    <Col style={{margin: "0 0 0 auto"}}>
      <Button
        size="s"
        view="clear"
        pin="circle-circle"
        onClick={() => props.onHomeClick()}
        contentRight={<IconSettings size="s" color="inherit"/>}/>
    </Col>
  </Row>
)


const DashboardView = (props) => {
  let current = props.getCurrentLesson(new Date(Date.now()));
  const bell = props.state.days[props.state.today - 1][current - 1][0];
  console.log(current + 1);
  return (
    <DeviceThemeProvider>
      <DocStyle/>
      {/*
        { (() => {
          switch (this.state.character) {
            case CHAR_SBER:
              return <ThemeBackgroundSber/>;
            case CHAR_EVA:
              return <ThemeBackgroundEva/>;
            case CHAR_JOY:
              return <ThemeBackgroundJoy/>;
            default:
              return;
          }
        })()}
*/}
      {
        getThemeBackgroundByChar(props.state.character)
      }
      <Container style={{padding: 0}}>
        <DashboardTopRow
          onHomeClick={() => props.setState({page: 0})}
        />
        {
          current !== undefined
            ? (
              <Row style={{marginLeft: "1em"}}>
                <Col style={{marginLeft: "1em"}}>
                  <TextBox>
                    <CardBody2>Сейчас</CardBody2>
                  </TextBox>
                </Col>
                <Card style={{width: "90%", marginLeft: "5%", marginTop: "0.5em"}}>
                  <CardBody style={{padding: "0 0 0 0"}}>
                    <CardContent compact style={{padding: "0.3em 0.3em"}}>
                      <CellListItem
                        content={
                          <TextBox>

                            <TextBoxSubTitle lines={8}>
                              {bell.startAndfinishTime}
                            </TextBoxSubTitle>

                            < CardHeadline3
                              style={{color: "var(--plasma-colors-button-accent)"}}
                            >
                              {bell.lessonName}
                            </ CardHeadline3>

                            {
                              props.state.student === false && props.state.teacher_correct === true
                                ? (
                                  <TextBoxTitle>{bell.groupNumber}</TextBoxTitle>
                                )
                                : (
                                  <a
                                    onClick={() => props.isCorrectTeacher()}
                                  >
                                    {bell[1]}
                                  </a>
                                )
                            }
                            <LinkToOnlineLesson
                              url={bell.url}
                            />
                          </TextBox>
                        }
                        contentRight={
                          <TextBox>
                            <Badge
                              text={bell.room}
                              contentLeft={<IconLocation size="xs"/>}
                              style={{backgroundColor: "rgba(0,0,0, 0)"}}
                            />
                            <TextBoxTitle>{props.Type(bell.lessonType)}</TextBoxTitle>
                          </TextBox>
                        }
                        contentLeft={
                          bell.teacher !== ""
                            ? (
                              <Badge
                                text={bell.lessonNumber[0]}
                                view="primary"
                                style={{marginRight: "0.5em"}}
                                size="l"/>)
                            : (
                              <div></div>
                            )
                        }
                      ></CellListItem>
                    </CardContent>
                  </CardBody>
                </Card>
              </Row>
            )
            : (<div></div>)
        }


        <div style={{
          width: '200px',
          height: '300px',
        }}></div>
      </Container>
    </DeviceThemeProvider>

  )

}

export default DashboardView;
