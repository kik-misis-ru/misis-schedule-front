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
  capitalize,
  formatTimeHhMm,
} from '../utils';
import {
  HOME_PAGE_NO,
  StartEnd,
  LessonStartEnd,
  NAVIGATOR_PAGE_NO,
  SCHEDULE_PAGE_NO,
} from '../App';
import LinkToOnline from '../components/LinkToOnline';
import {NowOrWill} from "../types/AssistantReceiveAction";
import {Bell} from '../types/ScheduleStructure'
import {CHAR_TIMEPARAMOY, Character, DAY_TODAY, THIS_WEEK, TodayOrTomorrow} from "../types/base.d";
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
import moment from 'moment';
import 'moment/locale/ru';

// const DAY_OFF_TEXT = 'Выходной😋';
const NO_LESSONS_TODAY_TEXT = 'Сегодня пар нет';

moment.locale('ru');


const HeaderRow = ({
                     onHomeClick
                   }: {
  onHomeClick: () => void
}) => (
  <Row style={{
    margin: "1em"
  }}>

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

    <Col
      style={{
        marginLeft: "2em",
        paddingTop: "1em"
      }}
    >
      <IconStarFill/>
    </Col>

    <Col style={{
      paddingTop: "1.1em"
    }}>
      <TextBox>
        <CardHeadline3>
          Мое расписание
        </CardHeadline3>
      </TextBox>
    </Col>

  </Row>
)


const CatalogueHeaderRow = () => {
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


const TodaySummary = ({
                        date,
                        lessonCount,
                        lessonsStartEnd,
                      }: {
  date: Date
  lessonCount: number
  lessonsStartEnd: StartEnd
}) => {
  const dayOfWeek = date.getDay();
  const isSunday = dayOfWeek === 0;
  const weekDayShortToday = capitalize(
    moment(date).format('dd')
  );
  const dateToday = moment(date).format('DD.MM.YY');

  const formatLessonsCountFromTo = (count: string, from: string, to: string): string => (
    `Сегодня ${count} с ${from} до ${to}`
  )

  return (
    <Row>
      <TextBox
        // @ts-ignore
        style={{
          marginLeft: "3em",
          paddingTop: "0.5em",
        }}
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
            lessonCount !== 0
              ? formatLessonsCountFromTo(
                pairNumberToPairNumText(lessonCount),
                lessonsStartEnd.start,
                lessonsStartEnd.end,
              )
              : NO_LESSONS_TODAY_TEXT
          }
        </CardParagraph1>
      </TextBox>
    </Row>
  )
}


const LessonCardBody = () => {

}

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


const ScheduleLessonTitle = ({text}: { text: string }) => (
  <TextBox
    // @ts-ignore
    style={{color: DEFAULT_TEXT_COLOR}}
  >
    <CardParagraph1>
      {text}
    </CardParagraph1>
  </TextBox>
)


const NoLesson = () => (
  < CardBody2 style={{fontSize: "18px"}}>
    Пары нет🎊
  </CardBody2>
)


// const NoLessonsNow = () => (
//   <CardBody>
//     <CardContent>
//
//       <ScheduleLessonTitle text="Сейчас"/>
//
//       <NoLesson/>
//
//     </CardContent>
//   </CardBody>
// )


const DashboardPage = ({
                         // state,
                         character,
                         isTeacherAndValid,

                         todaySummary,

                         currentLesson,
                         currentLessonStartEnd,

                         nextLesson,
                         nextLessonStartEnd,

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
  isTeacherAndValid: boolean

  todaySummary: {
    date: Date,
    lessonCount: number
    startEnd: StartEnd
  }

  currentLesson: Bell,
  currentLessonStartEnd: StartEnd,

  nextLesson: Bell,
  nextLessonStartEnd: StartEnd,

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
  // // const isSunday = (state.today === 0);
  // const todayIndex = state.today - 1;
  //
  // console.log('Dashboard: day:', state.day[todayIndex]);
  //
  // const now = new Date();
  // const lessonCountToday = state.day[todayIndex].count[THIS_WEEK];
  // // const weekDayShortToday = state.day[todayIndex].title;
  // // const dateToday = state.day[todayIndex].date[THIS_WEEK];
  //
  // // const lessonNowIdx = whatLesson(now, "now").num;
  // const nextLessonIdx = whatLesson(now, "next").num;
  //
  // // console.log('DashboardPage: whatLesson(now, "now"):', whatLesson(now, "now"));
  // // console.log('DashboardPage: todayIndex:', todayIndex);
  // // console.log('DashboardPage: lessonNowIdx:', lessonNowIdx);
  // // console.log('DashboardPage: state.days[todayIndex]:', state.days[todayIndex]);
  // // console.log('DashboardPage: state.days[todayIndex][lessonNowIdx]:', state.days[todayIndex][lessonNowIdx]);
  //
  // // const lessonNow = state.days[todayIndex]?.[lessonNowIdx]?.[THIS_WEEK];
  // // const nextLesson = state.days[todayIndex]?.[nextLessonIdx]?.[THIS_WEEK];
  //
  // const currentLessonIdx = getCurrentLesson(now);
  // // const currentLesson = state.days[todayIndex]?.[currentLessonIdx]?.[THIS_WEEK];
  //
  // console.log('DashboardPage: currentLesson:', currentLesson);
  // console.log('DashboardPage: nextLesson:', nextLesson);
  //
  // // whatLesson(new Date(), "next").num
  //
  // // const isTeacherAndValid = !state.student && state.teacher_correct;
  //
  // const lessonsStartEnd = {
  //   start: getTimeFirstLesson(todayIndex + 1)[0].slice(0, 5),
  //   end: getEndLastLesson(DAY_TODAY),
  // }
  //
  // // console.log(`isSunday: ${isSunday}, lessonCountToday: ${lessonCountToday}`);

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

        <TodaySummary
          date={todaySummary.date}
          lessonCount={todaySummary.lessonCount}
          lessonsStartEnd={todaySummary.startEnd}
        />

        <ScheduleSectionTitleRow/>

        <Card style={{
          width: "90%",
          marginLeft: "1em",
          marginTop: "0.5em",
        }}>

          <CardBody
            // style={{padding: "0 0 0 0"}}
          >
            <CardContent
              // compact
              // style={{padding: "0.3em 0.3em"}}
            >

              <ScheduleLessonTitle text="Сейчас"/>

              {
                !!currentLesson
                  ? (
                    <ScheduleLesson
                      lesson={currentLesson}
                      startEndTime={currentLessonStartEnd}
                      isTeacherAndValid={isTeacherAndValid}
                      isAccented={true}
                      // todo: задавать имя преподавателя
                      onTeacherClick={(teacherName) => handleTeacherChange()}
                    />
                  )
                  : <NoLesson/>
              }

            </CardContent>
            {/*
          </CardBody>
*/}

            {
              !!nextLesson // !!nextLessonIdx
                ? (
                  // <React.Fragment>
                  /*
                <CardBody
                  // style={{padding: "0 0 0 0"}}
                >
*/
                  <CardContent>

                    <ScheduleLessonTitle text="Дальше"/>

                    <ScheduleLesson
                      lesson={nextLesson}
                      startEndTime={nextLessonStartEnd}
                      isTeacherAndValid={isTeacherAndValid}
                      isAccented={true}
                      // todo: задавать имя преподавателя
                      onTeacherClick={(teacherName) => handleTeacherChange()}
                    />
                    {/*</React.Fragment>*/}
                  </CardContent>
                )
                : (<div></div>)
            }
            {/*</CardContent>*/}

          </CardBody>

        </Card>


        <CatalogueHeaderRow/>

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
