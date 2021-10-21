import React from "react";
import {Container, Row, Col, Button, DeviceThemeProvider} from '@sberdevices/plasma-ui';
import 'react-toastify/dist/ReactToastify.css';
import {
  Card,
  CardBody,
  CardBody2,
  //CardBody1,
  CardContent,
  //CardMedia,
  CardParagraph1,
  CardParagraph2,
  //TextBoxBigTitle,
  TextBox,
  TextBoxSubTitle,
  TextBoxTitle,
  Badge,
  CellListItem,
  CardHeadline3,
  CardHeadline2,
  Image,
} from "@sberdevices/plasma-ui";
//import {createGlobalStyle} from "styled-components";
import {IconLocation, IconStarFill, IconSettings, IconApps} from "@sberdevices/plasma-icons";
//import {text, background, gradient} from "@sberdevices/plasma-tokens";
import logo from "../images/logo.png";
//import "../themes/App.css";
import {
  DEFAULT_TEXT_COLOR,
  ACCENT_TEXT_COLOR,
} from './consts';
import {
  DocStyle,
  getThemeBackgroundByChar,
} from '../themes/tools';
import {
  HOME_PAGE_NO,
  NAVIGATOR_PAGE_NO
} from '../App';
import LinkToOnline from './LinkToOnline';
import ScheduleDayLessons from "./ScheduleDayLessons";
import ScheduleDayOff from "./ScheduleDayOff";
import {pairNumberToPairNumText} from '../utils'


class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange       = this.handleChange.bind(this)
    this.getTimeFirstLesson = this.getTimeFirstLesson.bind(this);
    this.getCurrentLesson   = this.getCurrentLesson.bind(this);
    this.getEndLastLesson   = this.getEndLastLesson.bind(this);
    this.getTime            = this.getTime.bind(this);
    // this.handleChange("description", props.character === "joy"
    //                           ? DESC_JOY
    //                           : DESC_OTHERS)
  }

  handleChange(key, e) {
    this.props.setValue(key, e);
  }

  getCurrentLesson() {
    this.props.getCurrentLesson();
  }

  getTime() {
    this.props.getTime();
  }

  getTimeFirstLesson() {
    this.props.getTimeFirstLesson();
  }

  getEndLastLesson() {
    this.props.getEndLastLesson();
  }

  render() {
    console.log('Dashboard: day:', this.props.state.day[ this.props.state.today - 1 ]);
    return <DeviceThemeProvider>
      <DocStyle/>
      {
        getThemeBackgroundByChar(this.props.character)
      }
      <Container style={{ padding: 0 }}>
        <Row style={{ margin: "1em" }}>
          <Col style={{ maxWidth: '3rem' }}>
            <Image src={logo} ratio="1 / 1"/>
          </Col>
          <Col style={{ marginLeft: "0.5em", paddingTop: "0.5em" }}>
            <TextBox
            >
              <CardHeadline2>Мир МИСиС</CardHeadline2>
            </TextBox>
          </Col>
          <Col style={{ margin: "0 0 0 auto" }}>
            <Button size="s" view="clear" pin="circle-circle" onClick={() => this.handleChange('page', HOME_PAGE_NO)}
                    contentRight={<IconSettings size="s" color="inherit"/>}/>
          </Col>
        </Row>

        <Row>
          <TextBox style={{ marginLeft: "3em", paddingTop: "0.5em" }}>
            {
              this.props.state.today === 0
              ? (
                <CardParagraph2 style={{ fontSize: "20px" }}>
                  Выходной😋
                </CardParagraph2>
              ) : (
                <CardParagraph2 style={{ fontSize: "20px" }}>
                  {this.props.state.day[ this.props.state.today - 1 ].title}, {this.props.state.day[ this.props.state.today - 1 ].date[ 0 ]}
                </CardParagraph2>
              )
            }
            {
              this.props.state.today !== 0 &&
              this.props.state.day[ this.props.state.today - 1 ].count[ 0 ] !== 0
              ? (
                <CardParagraph1 style={{ color: DEFAULT_TEXT_COLOR }}>
                  Сегодня {pairNumberToPairNumText(this.props.state.day[ this.props.state.today - 1 ].count[ 0 ])} с {this.getTimeFirstLesson(this.props.state.today - 1 + 1)[ 0 ].slice(0, 5)} до {this.getEndLastLesson("this.props.state.today-1")}
                </CardParagraph1>
              )
              : (
                <CardParagraph1 style={{ color: DEFAULT_TEXT_COLOR }}>
                  Сегодня пар нет
                </CardParagraph1>
              )
            }
          </TextBox>
        </Row>

        <Row>
          <Col style={{ marginLeft: "2em", paddingTop: "1em" }}>
            <IconStarFill/>
          </Col>
          <Col style={{ paddingTop: "1.1em" }}>
            <TextBox>
              <CardHeadline3>
                Мое расписание
              </CardHeadline3>
            </TextBox>
          </Col>
        </Row>

        <Card style={{ width: "90%", marginLeft: "1em", marginTop: "0.5em" }}>

          {
            this.props.getCurrentLesson(new Date(Date.now())) !== undefined
            ? (
              <CardBody style={{ padding: "0 0 0 0" }}>
                <CardContent compact style={{ padding: "0.3em 0.3em" }}>
                  <TextBox style={{ color: DEFAULT_TEXT_COLOR }}>
                    <CardParagraph1>Сейчас</CardParagraph1>
                  </TextBox>

                  <CellListItem
                    content={
                      <TextBox>

                        <TextBoxSubTitle lines={8}>
                          {this.props.state.days[ this.props.state.today -1 ][ this.props.getCurrentLesson(new Date(Date.now()))(new Date(Date.now())) ][ 0 ][ 3 ]}
                        </TextBoxSubTitle>
                        < CardBody2 style={{ color: ACCENT_TEXT_COLOR, fontSize: "18px" }}>
                          {this.props.state.days[ this.props.state.today -1 ][this.props.getCurrentLesson(new Date(Date.now()))(new Date(Date.now())) ][ 0 ].lessonName}
                        </ CardBody2>

                        {
                          !this.props.state.student && this.props.state.teacher_correct
                          ? (
                            <TextBoxTitle>
                              {this.props.state.days[ this.props.state.today -1 ][this.props.getCurrentLesson(new Date(Date.now()))(new Date(Date.now())) ][ 0 ][ 7 ]}
                            </TextBoxTitle>
                          )
                          : (
                            <a onClick={() => {
                              // todo: нет метода
                              this.isCorrectTeacher()
                            }}
                            >
                              {this.props.state.days[ this.props.state.today -1 ][ this.props.getCurrentLesson(new Date(Date.now()))(new Date(Date.now())) ][ 0 ][ 1 ]}
                            </a>
                          )
                        }

                        <LinkToOnline
                          url={this.props.state.days[ this.props.state.today -1 ][ this.props.getCurrentLesson(new Date(Date.now()))(new Date(Date.now())) ][ 0 ][ 6 ]}
                        />

                      </TextBox>
                    }

                    contentRight={
                      <TextBox>
                        <Badge
                          text={
                            this.props.state.days[ this.props.state.today -1 ][ this.props.getCurrentLesson(new Date(Date.now()))(new Date(Date.now())) ][ 0 ][ 2 ]}
                          contentLeft={<IconLocation size="xs"/>}
                          style={{ backgroundColor: "rgba(0,0,0, 0)" }}
                        />
                        <TextBoxTitle>
                          {this.Type(this.props.state.days[ this.props.state.today -1 ][ this.props.getCurrentLesson(new Date(Date.now()))(new Date(Date.now())) ][ 0 ][ 4 ])}
                        </TextBoxTitle>

                      </TextBox>
                    }
                    contentLeft={
                      this.props.state.days[ this.props.state.today -1 ][ this.props.getCurrentLesson(new Date(Date.now()))(new Date(Date.now())) ][ 0 ][ 1 ] !== ""
                      ? (
                        <Badge
                          text={this.props.state.days[ this.props.state.today -1 ][ this.props.getCurrentLesson(new Date(Date.now()))(new Date(Date.now())) ][ 0 ][ 5 ][ 0 ]}
                          view="primary" style={{ marginRight: "0.5em" }} size="l"
                        />
                      )
                      : (<div></div>)
                    }
                  ></CellListItem>
                </CardContent>
              </CardBody>
            )
            : (
              <CardBody>
                <CardContent>

                  <TextBox>
                    <CardParagraph1
                      style={{ color: DEFAULT_TEXT_COLOR }}
                    >
                      Сейчас
                    </CardParagraph1>
                  </TextBox>

                  < CardBody2 style={{ fontSize: "18px" }}>
                    Пары нет🎊
                  </CardBody2>
                </CardContent>
              </CardBody>
            )

          }
          {
            this.props.whatLesson(new Date(Date.now()), "next").num !== undefined
            ? (
              <CardBody>
                <CardContent>
                  <TextBox>
                    <CardParagraph1 style={{ color: DEFAULT_TEXT_COLOR }}>
                      Дальше
                    </CardParagraph1>
                  </TextBox>
                  
                  <CellListItem
                    content={
                      <TextBox>
                        <TextBoxSubTitle lines={8}>
                          {this.props.state.days[ this.props.state.today -1 ][ this.props.whatLesson(new Date(Date.now()), "next").num ][ 0 ][ 3 ]}
                        </TextBoxSubTitle>
                        < CardBody2 style={{ fontSize: "18px" }}>
                          {this.props.state.days[ this.props.state.today -1 ][ this.props.whatLesson(new Date(Date.now()), "next").num ][ 0 ].lessonName}
                        </ CardBody2>
                        {
                          this.props.state.student === false && this.props.state.teacher_correct === true
                          ? (
                            <TextBoxTitle>
                              {this.props.state.days[ this.props.state.today -1 ][ this.props.whatLesson(new Date(Date.now()), "next").num ][ 0 ][ 7 ]}
                            </TextBoxTitle>
                          )
                          : (
                            <a
                              onClick={() => {
                                // todo: нет метода
                                this.isCorrectTeacher()
                              }}
                            >
                              {this.props.state.days[ this.props.state.today -1 ][ this.props.whatLesson(new Date(Date.now()), "next").num ][ 0 ][ 1 ]}
                            </a>
                          )
                        }

                        <LinkToOnline
                          url={this.props.state.days[ this.props.state.today -1 ][ this.props.whatLesson(new Date(Date.now()), "next").num ][ 0 ][ 6 ]}
                        />

                      </TextBox>
                    }

                    contentRight={
                      <TextBox>
                        <Badge
                          text={this.props.state.days[ this.props.state.today -1 ][ this.props.whatLesson(new Date(Date.now()), "next").num ][ 0 ][ 2 ]}
                          contentLeft={
                            <IconLocation size="xs"/>
                          }
                          style={{ backgroundColor: "rgba(0,0,0, 0)" }}/>
                        <TextBoxTitle>
                          {this.props.state.days[ this.props.state.today -1 ][ this.props.whatLesson(new Date(Date.now()), "next").num ][ 0 ][ 4 ]}
                        </TextBoxTitle>

                      </TextBox>
                    }
                    contentLeft={
                      this.props.state.days[ this.props.state.today -1 ][ this.props.whatLesson(new Date(Date.now()), "now").num ][ 0 ][ 1 ] !== ""
                      ? (
                        <Badge
                          text={this.props.state.days[ this.props.state.today -1 ][ this.props.whatLesson(new Date(Date.now()), "now").num ][ 0 ][ 5 ]}
                          view="primary"
                          style={{ marginRight: "0.5em" }}
                          size="l"
                        />
                      )
                      : (<div></div>)
                    }
                  ></CellListItem>
                </CardContent>
              </CardBody>
            )
            : (<div></div>)
          }

        </Card>

        <Row>
          <Col style={{ marginLeft: "2em", paddingTop: "1em" }}>
            <IconApps/>
          </Col>
          <Col style={{ paddingTop: "1.1em" }}>
            <TextBox>
              <CardHeadline3>
                Каталог
              </CardHeadline3>
            </TextBox>
          </Col>
        </Row>

        <Row style={{ marginLeft: "1em", marginRight: "1em" }}>

          <Col size={2}>
            <Card style={{ height: "20vh", marginTop: "0.5em" }}
             onClick={() => this.handleChange('page', 17)}>
              <CardBody>
                <CardContent>
                  <TextBox>
                    <CardHeadline3>
                      Расписание
                    </CardHeadline3>
                  </TextBox>
                </CardContent>
              </CardBody>
            </Card>
          </Col>

          <Col size={2}>
            <Card
              style={{ height: "20vh", marginTop: "0.5em" }}
              onClick={() => this.handleChange('page', NAVIGATOR_PAGE_NO)}
            >
              <CardBody>
                <CardContent>
                  <TextBox>
                    <CardHeadline3>
                      Карта
                    </CardHeadline3>
                  </TextBox>
                </CardContent>
              </CardBody>
            </Card>
          </Col>

          <Col size={2}>
            <Card style={{ height: "20vh", marginTop: "0.5em" }}>
              <CardBody>
                <CardContent>
                  <TextBox>
                    <CardHeadline3>
                      FAQ
                    </CardHeadline3>
                  </TextBox>
                </CardContent>
              </CardBody>
            </Card>
          </Col>

          <Col size={2}>
            <Card style={{ height: "20vh", marginTop: "0.5em" }}>
              <CardBody>
                <CardContent>
                  <TextBox>
                    <CardHeadline3>
                      Контакты
                    </CardHeadline3>
                  </TextBox>
                </CardContent>
              </CardBody>
            </Card>
          </Col>

        </Row>

        <div style={{
          width:  '200px',
          height: '300px',
        }}></div>

      </Container>
    </DeviceThemeProvider>
  }
}

export default Dashboard
