import React, {MouseEventHandler} from "react";
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
  ACCENT_TEXT_COLOR, COLOR_BLACK,
} from '../components/consts';
import {
  DocStyle,
  getThemeBackgroundByChar,
} from '../themes/tools';
import {
  formatTimeHhMm,
} from '../utils';
import {
  HOME_PAGE_NO,
  NAVIGATOR_PAGE_NO,
  SCHEDULE_PAGE_NO,
} from '../App';
import LinkToOnline from '../components/LinkToOnline';
import {NowOrWill} from "../types/AssistantReceiveAction";
import {TodayOrTomorrow} from "../types/base";
import {lessonTypeAdjToNoun, pairNumberToPairNumText} from '../utils'
import {GoToHomeButton, HeaderLogoCol, HeaderTitleCol} from "../components/TopMenu";
import {IAppState} from "../App";


import {DAY_OFF_TEXT} from '../components/ScheduleDayOff'
// const DAY_OFF_TEXT = 'Выходной😋';
const NO_LESSONS_TODAY_TEXT = 'Сегодня пар нет';


const HeaderRow = ({
                     onHomeClick
                   }: {
  onHomeClick: () => void
}) => (
  <Row style={{margin: "1em"}}>

    <HeaderLogoCol/>

    <HeaderTitleCol
      title='Мир МИСиС'
    />

    <Col style={{margin: "0 0 0 auto"}}>
      <GoToHomeButton
        onClick={() => onHomeClick()}
      />
    </Col>
  </Row>
)


const ScheduleSectionTitleRow = () => (
  <Row>
    <Col style={{marginLeft: "2em", paddingTop: "1em"}}>
      <IconStarFill/>
    </Col>
    <Col style={{paddingTop: "1.1em"}}>
      <TextBox>
        <CardHeadline3>
          Мое расписание
        </CardHeadline3>
      </TextBox>
    </Col>
  </Row>
)


const DashboardCard = ({
                         text,
                         onClick,
                       }: {
  text: string
  onClick?: MouseEventHandler<HTMLElement>
}) => {
  return (
    <Col size={2}>
      <Card
        style={{
          height: "20vh",
          marginTop: "0.5em",
          cursor: !!onClick ? 'pointer' : 'default',
        }}
        onClick={(event) => !!onClick ? onClick(event) : undefined}>
        <CardBody>
          <CardContent>
            <TextBox>
              <CardHeadline3>
                {text}
              </CardHeadline3>
            </TextBox>
          </CardContent>
        </CardBody>
      </Card>
    </Col>
  )
}

const CatalogueHeader = () => {
  return (
    <Row>
      <Col style={{marginLeft: "2em", paddingTop: "1em"}}>
        <IconApps/>
      </Col>
      <Col style={{paddingTop: "1.1em"}}>
        <TextBox>
          <CardHeadline3>
            Каталог
          </CardHeadline3>
        </TextBox>
      </Col>
    </Row>
  )
}

const CatalogueItems = ({
                          onSelect,
                        }: {
  onSelect: (pageNo) => void
}) => {
  return (
    <Row style={{marginLeft: "1em", marginRight: "1em"}}>

      <DashboardCard
        text="Расписание"
        onClick={() => onSelect(SCHEDULE_PAGE_NO)}
      />

      <DashboardCard
        text="Карта"
        onClick={() => onSelect(NAVIGATOR_PAGE_NO)}
      />

      <DashboardCard
        text="FAQ"
      />

      <DashboardCard
        text="Контакты"
      />

    </Row>

  )
}


const NowTitle = () => (
  <TextBox
    // @ts-ignore
    style={{color: DEFAULT_TEXT_COLOR}}
  >
    <CardParagraph1>Сейчас</CardParagraph1>
  </TextBox>
)


const NoLessons = () => (
  < CardBody2 style={{fontSize: "18px"}}>
    Пары нет🎊
  </CardBody2>
)


const NoLessonsNow = () => (
  <CardBody>
    <CardContent>

      <NowTitle/>

      <NoLessons/>

    </CardContent>
  </CardBody>
)


const DashboardPage = ({
                         state,
                         setValue,
                         handleTeacherChange,
                         getCurrentLesson,
                         getTimeFirstLesson,
                         getEndLastLesson,
                         whatLesson,


                       }: {
  state: IAppState
  setValue: (key: string, value: any) => void
  handleTeacherChange: () => Promise<void>
  getCurrentLesson // : (date: Date) => string | undefined
  getTimeFirstLesson: (daynum: number) => [string, string]
  getEndLastLesson//: (todayOrTomorrow: TodayOrTomorrow) => string | undefined
  whatLesson
  // whatLesson: (
  //   date: Date,
  //   when: NowOrWill,
  // ) => {
  //   lesson: string | undefined,
  //   type: NowOrWill | 'next',
  //   num: number | undefined,
  // }

}) => {
  const todayIndex = state.today - 1;

  console.log('Dashboard: day:', state.day[todayIndex]);

  const lessonCountToday = state.day[todayIndex].count[0];

  const formatLessonsCountFromTo = (count: string, from: string, to: string): string => (
    `Сегодня ${count} с ${from} до ${to}`
  )

  return (
    <DeviceThemeProvider>
      <DocStyle/>
      {
        getThemeBackgroundByChar(state.character)
      }
      <Container style={{padding: 0}}>
        <HeaderRow
          onHomeClick={() => setValue('page', HOME_PAGE_NO)}
        />

        <Row>
          <TextBox
            // @ts-ignore
            style={{marginLeft: "3em", paddingTop: "0.5em"}}
          >
            <CardParagraph2 style={{fontSize: "20px"}}>
              {
                state.today === 0
                  ? DAY_OFF_TEXT
                  : state.day[todayIndex].title + ", " + state.day[todayIndex].date[0]
              }
            </CardParagraph2>
            <CardParagraph1 style={{color: DEFAULT_TEXT_COLOR}}>
              {
                state.today !== 0 &&
                lessonCountToday !== 0
                  ? formatLessonsCountFromTo(
                    pairNumberToPairNumText(lessonCountToday),
                    getTimeFirstLesson(todayIndex + 1)[0].slice(0, 5),
                    getEndLastLesson(todayIndex)
                  )
                  : NO_LESSONS_TODAY_TEXT
              }
            </CardParagraph1>
          </TextBox>
        </Row>

        <ScheduleSectionTitleRow />

        <Card style={{width: "90%", marginLeft: "1em", marginTop: "0.5em"}}>

          {
            getCurrentLesson(new Date(Date.now())) !== undefined
              ? (
                <CardBody style={{padding: "0 0 0 0"}}>
                  <CardContent compact style={{padding: "0.3em 0.3em"}}>

                    <NowTitle/>

                    <CellListItem
                      content={
                        <TextBox>

                          <TextBoxSubTitle lines={8}>
                            {
                              // todo: (new Date(Date.now()))(new Date(Date.now())
                              state.days[todayIndex][getCurrentLesson(new Date(Date.now()))(new Date(Date.now()))][0][3]
                            }
                          </TextBoxSubTitle>
                          < CardBody2 style={{color: ACCENT_TEXT_COLOR, fontSize: "18px"}}>
                            {
                              // todo: (new Date(Date.now()))(new Date(Date.now())
                              state.days[todayIndex][getCurrentLesson(new Date(Date.now()))(new Date(Date.now()))][0].lessonName
                            }
                          </ CardBody2>

                          {
                            !state.student && state.teacher_correct
                              ? (
                                <TextBoxTitle>
                                  {
                                    // todo: (new Date(Date.now()))(new Date(Date.now())
                                    state.days[todayIndex][getCurrentLesson(new Date(Date.now()))(new Date(Date.now()))][0][7]
                                  }
                                </TextBoxTitle>
                              )
                              : (
                                <a
                                  onClick={() => handleTeacherChange()}
                                >
                                  {
                                    // todo: (new Date(Date.now()))(new Date(Date.now())
                                    state.days[todayIndex][getCurrentLesson(new Date(Date.now()))(new Date(Date.now()))][0][1]
                                  }
                                </a>
                              )
                          }

                          <LinkToOnline
                            // todo: (new Date(Date.now()))(new Date(Date.now())
                            url={state.days[todayIndex][getCurrentLesson(new Date(Date.now()))(new Date(Date.now()))][0][6]}
                          />

                        </TextBox>
                      }

                      contentRight={
                        <TextBox>
                          <Badge
                            text={
                              // todo: (new Date(Date.now()))(new Date(Date.now())
                              state.days[todayIndex][getCurrentLesson(new Date(Date.now()))(new Date(Date.now()))][0][2]}
                            contentLeft={<IconLocation size="xs"/>}
                            style={{backgroundColor: COLOR_BLACK}}
                          />
                          <TextBoxTitle>
                            {
                              // todo: (new Date(Date.now()))(new Date(Date.now())
                              lessonTypeAdjToNoun(state.days[todayIndex][getCurrentLesson(new Date(Date.now()))(new Date(Date.now()))][0][4])
                            }
                          </TextBoxTitle>

                        </TextBox>
                      }
                      contentLeft={
                        // todo: (new Date(Date.now()))(new Date(Date.now())
                        state.days[todayIndex][getCurrentLesson(new Date(Date.now()))(new Date(Date.now()))][0][1] !== ""
                          ? (
                            <Badge
                              text={
                                // todo: (new Date(Date.now()))(new Date(Date.now())
                                state.days[todayIndex][getCurrentLesson(new Date(Date.now()))(new Date(Date.now()))][0][5][0]
                              }
                              view="primary" style={{marginRight: "0.5em"}} size="l"
                            />
                          )
                          : (<div></div>)
                      }
                    />
                  </CardContent>
                </CardBody>
              )
              : <NoLessonsNow/>

          }
          {
            whatLesson(new Date(Date.now()), "next").num !== undefined
              ? (
                <CardBody>
                  <CardContent>
                    <TextBox>
                      <CardParagraph1 style={{color: DEFAULT_TEXT_COLOR}}>
                        Дальше
                      </CardParagraph1>
                    </TextBox>

                    <CellListItem
                      content={
                        <TextBox>
                          <TextBoxSubTitle lines={8}>
                            {
                              state.days[todayIndex][whatLesson(new Date(Date.now()), "next").num][0][3]
                            }
                          </TextBoxSubTitle>
                          < CardBody2 style={{fontSize: "18px"}}>
                            {
                              state.days[todayIndex][whatLesson(new Date(Date.now()), "next").num][0].lessonName
                            }
                          </ CardBody2>
                          {
                            state.student === false && state.teacher_correct === true
                              ? (
                                <TextBoxTitle>
                                  {state.days[todayIndex][whatLesson(new Date(Date.now()), "next").num][0][7]}
                                </TextBoxTitle>
                              )
                              : (
                                <a
                                  onClick={() => {
                                    handleTeacherChange()
                                  }}
                                >
                                  {state.days[todayIndex][whatLesson(new Date(Date.now()), "next").num][0][1]}
                                </a>
                              )
                          }

                          <LinkToOnline
                            url={state.days[todayIndex][whatLesson(new Date(Date.now()), "next").num][0][6]}
                          />

                        </TextBox>
                      }

                      contentRight={
                        <TextBox>
                          <Badge
                            text={state.days[todayIndex][whatLesson(new Date(Date.now()), "next").num][0][2]}
                            contentLeft={
                              <IconLocation size="xs"/>
                            }
                            style={{backgroundColor: COLOR_BLACK}}/>
                          <TextBoxTitle>
                            {state.days[todayIndex][whatLesson(new Date(Date.now()), "next").num][0][4]}
                          </TextBoxTitle>

                        </TextBox>
                      }
                      contentLeft={
                        state.days[todayIndex][whatLesson(new Date(Date.now()), "now").num][0][1] !== ""
                          ? (
                            <Badge
                              text={state.days[todayIndex][whatLesson(new Date(Date.now()), "now").num][0][5]}
                              view="primary"
                              style={{marginRight: "0.5em"}}
                              size="l"
                            />
                          )
                          : (<div></div>)
                      }
                    />
                  </CardContent>
                </CardBody>
              )
              : (<div></div>)
          }

        </Card>


        <CatalogueHeader/>

        <CatalogueItems
          onSelect={(pageNo) => setValue('page', pageNo)}
        />


        <div style={{
          width: '200px',
          height: '300px',
        }}></div>

      </Container>
    </DeviceThemeProvider>
  )
}

export default DashboardPage
