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
  HOME_PAGE_NO, LessonStartEnd,
  NAVIGATOR_PAGE_NO,
  SCHEDULE_PAGE_NO,
} from '../App';
import LinkToOnline from '../components/LinkToOnline';
import {NowOrWill} from "../types/AssistantReceiveAction";
import {CHAR_TIMEPARAMOY, Character, THIS_WEEK, TodayOrTomorrow} from "../types/base.d";
import {lessonTypeAdjToNoun, pairNumberToPairNumText} from '../utils'
import {GoToHomeButton, HeaderLogoCol, HeaderTitleCol} from "../components/TopMenu";
import ScheduleLesson, {
  LessonStartAndFinishTime,
  LessonName,
  GroupNumber,
  TeacherName,
  LessonLeftContent,
  LessonRightContent
} from "../components/ScheduleLesson";
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
                          onGoToPage,
                        }: {
  onGoToPage: (pageNo) => void
}) => {
  return (
    <Row style={{marginLeft: "1em", marginRight: "1em"}}>

      <DashboardCard
        text="Расписание"
        onClick={() => onGoToPage(SCHEDULE_PAGE_NO)}
      />

      <DashboardCard
        text="Карта"
        onClick={() => onGoToPage(NAVIGATOR_PAGE_NO)}
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


const NoLesson = () => (
  < CardBody2 style={{fontSize: "18px"}}>
    Пары нет🎊
  </CardBody2>
)


const NoLessonsNow = () => (
  <CardBody>
    <CardContent>

      <NowTitle/>

      <NoLesson/>

    </CardContent>
  </CardBody>
)


const DashboardPage = ({
                         state,
                         character,
                         onGoToPage,
                         handleTeacherChange,
                         getCurrentLesson,
                         getTimeFirstLesson,
                         getEndLastLesson,
                         whatLesson,
                       }: {
  state: IAppState
  character: Character
    // todo: что такое 'timeParamoy' ???
    | typeof CHAR_TIMEPARAMOY
  onGoToPage: (pageNo: number) => void
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
  const isSunday = (state.today === 0);
  const todayIndex = state.today - 1;

  console.log('Dashboard: day:', state.day[todayIndex]);

  const now = new Date();
  const lessonCountToday = state.day[todayIndex].count[THIS_WEEK];
  const weekDayShortToday = state.day[todayIndex].title;
  const dateToday = state.day[todayIndex].date[THIS_WEEK];

  const lessonNowIdx = whatLesson(now, "now").num;
  const lessonNextIdx = whatLesson(now, "next").num;

  console.log('whatLesson(now, "now"):', whatLesson(now, "now"));
  console.log('todayIndex:', todayIndex);
  console.log('lessonNowIdx:', lessonNowIdx);
  console.log('state.days[todayIndex]:', state.days[todayIndex]);
  console.log('state.days[todayIndex][lessonNowIdx]:', state.days[todayIndex][lessonNowIdx]);

  const lessonNow = state.days[todayIndex]?.[lessonNowIdx]?.[THIS_WEEK];
  const lessonNext = state.days[todayIndex]?.[lessonNextIdx]?.[THIS_WEEK];

  const lessonCurrentIdx = getCurrentLesson(new Date());
  const lessonCurrent = state.days[todayIndex]?.[lessonCurrentIdx]?.[THIS_WEEK];

  // whatLesson(new Date(), "next").num

  const isTeacherAndValid = !state.student && state.teacher_correct;

  const formatLessonsCountFromTo = (count: string, from: string, to: string): string => (
    `Сегодня ${count} с ${from} до ${to}`
  )

  console.log(`isSunday: ${isSunday}, lessonCountToday: ${lessonCountToday}`);

  return (
    <DeviceThemeProvider>
      <DocStyle/>
      {
        getThemeBackgroundByChar(character)
      }
      <Container style={{padding: 0}}>
        <HeaderRow
          onHomeClick={() => onGoToPage(HOME_PAGE_NO)}
        />

        <Row>
          <TextBox
            // @ts-ignore
            style={{marginLeft: "3em", paddingTop: "0.5em"}}
          >
            <CardParagraph2 style={{fontSize: "20px"}}>
              {
                isSunday
                  ? DAY_OFF_TEXT
                  : `${weekDayShortToday}, ${dateToday}`
              }
            </CardParagraph2>
            <CardParagraph1 style={{color: DEFAULT_TEXT_COLOR}}>
              {
                !isSunday &&
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

        <ScheduleSectionTitleRow/>

        <Card style={{width: "90%", marginLeft: "1em", marginTop: "0.5em"}}>

          {
            getCurrentLesson(new Date()) !== undefined
              ? (
                <CardBody style={{padding: "0 0 0 0"}}>
                  <CardContent compact style={{padding: "0.3em 0.3em"}}>

                    <NowTitle/>

                    <ScheduleLesson
                      bell={lessonCurrent}
                      startTime={LessonStartEnd[lessonCurrentIdx].start}
                      endTime={LessonStartEnd[lessonCurrentIdx].end}
                      isTeacherAndValid={isTeacherAndValid}
                      isAccented={true}
                      // todo: задавать имя преподавателя
                      onTeacherClick={(teacherName) => handleTeacherChange()}
                    />

{/*
                    <CellListItem
                      content={
                        <TextBox>

                          <LessonStartAndFinishTime
                            time={lessonCurrent.startAndFinishTime}
                          />

                          <LessonName
                            text={lessonCurrent.lessonName}
                            isAccented={true}
                          />

                          {
                            isTeacherAndValid
                              ? <GroupNumber text={lessonCurrent.groupNumber}/>
                              : <TeacherName
                                text={lessonCurrent.teacher}
                                onClick={() => handleTeacherChange()}
                              />
                          }

                          <LinkToOnline
                            url={lessonCurrent.url}
                          />

                        </TextBox>
                      }

                      contentRight={
                        <LessonRightContent
                          room={lessonCurrent.room}
                          lessonType={
                            // todo: это преобразование должно быть раньше
                            lessonTypeAdjToNoun(lessonCurrent.lessonType)
                          }
                        />
                      }
                      contentLeft={
                        <LessonLeftContent
                          visible={lessonCurrent.lessonName !== ""}
                          // todo: lessonNumber не должен содержать точку
                          text={lessonCurrent.lessonNumber[0]}
                        />
                      }
                    />
*/}
                  </CardContent>
                </CardBody>
              )
              : <NoLessonsNow/>

          }
          {
            lessonNextIdx !== undefined
              ? (
                <CardBody>
                  <CardContent>

                    <TextBox>
                      <CardParagraph1 style={{color: DEFAULT_TEXT_COLOR}}>
                        Дальше
                      </CardParagraph1>
                    </TextBox>


                    <ScheduleLesson
                      bell={lessonCurrent}
                      startTime={LessonStartEnd[lessonNextIdx].start}
                      endTime={LessonStartEnd[lessonNextIdx].end}
                      isTeacherAndValid={isTeacherAndValid}
                      isAccented={true}
                      // todo: задавать имя преподавателя
                      onTeacherClick={(teacherName) => handleTeacherChange()}
                    />

{/*
                    <CellListItem
                      content={
                        <TextBox>
                          <LessonStartAndFinishTime
                            time={lessonNext.startAndFinishTime}
                          />
                          <LessonName
                            text={lessonCurrent.lessonName}
                            isAccented={true}
                          />
                          {
                            isTeacherAndValid
                              ? (
                                <GroupNumber
                                  text={lessonNext.groupNumber}
                                />
                              )
                              : <TeacherName
                                text={lessonNext.teacher}
                                style={{color: "white"}}
                                onClick={() => handleTeacherChange()}
                              />
                          }
                          <LinkToOnline
                            url={lessonNext.url}
                          />

                        </TextBox>
                      }
                      contentRight={
                        <LessonRightContent
                          room={lessonNext.room}
                          lessonType={
                            // todo: это преобразование должно быть раньше
                            lessonTypeAdjToNoun(lessonNext.lessonType)
                          }
                        />
                      }
                      contentLeft={
                        <LessonLeftContent
                          visible={lessonNow.lessonName !== ''}
                          // todo: lessonNumber не должен содержать точку
                          text={lessonNow.lessonNumber[0]}
                        />
                      }
                    />
*/}
                  </CardContent>
                </CardBody>
              )
              : (<div></div>)
          }

        </Card>


        <CatalogueHeader/>

        <CatalogueItems
          onGoToPage={(pageNo) => onGoToPage(pageNo)}
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
