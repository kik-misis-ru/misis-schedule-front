import React, {MouseEventHandler} from "react";
import {
  Container,
  Row,
  Col,
  Button,
  DeviceThemeProvider,
  TextBoxBiggerTitle,
  Body1,
  Caption
} from '@sberdevices/plasma-ui';
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
  TextBoxBigTitle,
  TextBox,
  TextBoxLabel,
  TextBoxSubTitle,
  TextBoxTitle,
  Badge,
  CellListItem,
  CardHeadline3,
  CardHeadline2,
  Image,
  LineSkeleton,
  RectSkeleton,
  CellDisclosure,
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
  // NAVIGATOR_PAGE_NO,
  SCHEDULE_PAGE_NO,
  // CONTACTS_PAGE_NO,
  // SETTING_PAGE_NO,
  // FAQ_PAGE_NO,
} from '../App';
import LinkToOnline from '../components/LinkToOnline';
import {NowOrWill} from "../types/AssistantReceiveAction";
import {Bell} from '../types/ScheduleStructure'
import {CHAR_TIMEPARAMOY, Character, DAY_TODAY, THIS_WEEK, TodayOrTomorrow} from "../types/base.d";
import {lessonTypeAdjToNoun, pairNumberToPairNumText} from '../utils'
import {GoToHomeButton, HeaderLogoCol, HeaderTitleCol} from "../components/TopMenu";
import ScheduleLesson from "../components/ScheduleLesson";
import {history, IAppState} from "../App";


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
        paddingTop: "0.5em"
      }}
    >
      <IconStarFill color="grey"/>
    </Col>

    <Col style={{
      paddingTop: "0.6em"
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
        <IconApps color="grey"/>
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
                        lessonsStart,
                        lessonsEnd
                      }: {
  date: Date
  lessonCount: number
  lessonsStart: string
  lessonsEnd: string
}) => {
  const dayOfWeek = date.getDay();
  const isSunday = dayOfWeek === 0;
  const weekDayShortToday = capitalize(
    moment(date).format('dd')
  );
  const day = {
    "Пн": "Понедельник",
    "Вт": "Вторник",
    "Ср": "Средa",
    "Чт": "Четверг",
    "Пт": "Пятница",
    "Сб": "Суббота",
  }
  const month = {
    "01": "января",
    "02": "февраля",
    "03": "марта",
    "04": "апреля",
    "05": "мая",
    "06": "июня",
    "07": "июля",
    "08": "августа",
    "09": "сентября",
    "10": "октября",
    "11": "ноября",
    "12": "декабря",
  }
  const dateToday = moment(date).format('DD.MM.YY');
  let dateDay = ""
  dateToday.slice(0, 1) === "0" ? dateDay = dateToday.slice(1, 2) : dateDay = dateToday.slice(0, 2)


  const formatLessonsCountFromTo = (count: string, from: string, to: string): string => (
    `Сегодня ${count} с ${from} до ${to}`
  )
  console.log(lessonsStart, "lessoncount")

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
              : `${day[weekDayShortToday]}, ${dateDay} ${month[dateToday.slice(3, 5)]}`
          }
        </CardParagraph2>
        <CardParagraph1 style={{color: "grey"}}>
          {
            !isSunday &&
            lessonCount !== 0
              ? formatLessonsCountFromTo(
                pairNumberToPairNumText(lessonCount),
                lessonsStart,
                lessonsEnd,
              )
              : NO_LESSONS_TODAY_TEXT
          }
        </CardParagraph1>
      </TextBox>
    </Row>
  )
}


const DashboardCard = ({
                         text,
                         sub,
                         onClick,
                       }: {
  text: string
  sub: string
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
              <Caption style={{color: "grey"}}>
                {sub}
              </Caption>
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

const GetCloser = ({
  onGoToPage,
}: {
onGoToPage: (pageNo) => void
}) => {
return (
<Row style={{marginLeft: "1.3em", marginRight: "1em", marginTop: "0.5em", paddingTop: "0"}}>

<Card onClick={() => onGoToPage(HOME_PAGE_NO)} style={{padding: "0 0 0 0", width: "95%", height: "8.5vh"}}>

<CardBody
style={{padding: "0 0 0 0"}}
>
<CardContent style={{padding: "0 0 0 0"}}>
<CellListItem
style={{padding: "0 0 0 0"}}
contentLeft={
<TextBox>
<TextBoxBiggerTitle style={{marginRight: "0.3em", marginLeft: "0.3em", padding: "0 0 0 0"}}>
 🥺
</TextBoxBiggerTitle>
</TextBox>}
content={
<TextBox >
<Body1 style={{padding: "0 0 0 0"}}>
 Станем ближе?
</Body1>
<Body1 style={{padding: "0 0 0 0", color: "grey"}}>
 Сохрани свои данные
</Body1>
</TextBox>

}
contentRight={
<CellDisclosure style={{marginRight: "1em", marginLeft: "0.3em", padding: "0 0 0 0"}}/>
}
>
</CellListItem>
</CardContent>

</CardBody>

</Card>

</Row>

)
}

const CatalogueItems = ({
                          onGoToPage,
                        }: {
  onGoToPage: (pageNo) => void
}) => {

  // let history = useHistory();
  // use history.push('/some/path') here

  return (
    <Row style={{marginLeft: "1em", marginRight: "1em"}}>

      <DashboardCard
        text="Расписание"
        sub="Другое"
        onClick={() => onGoToPage(HOME_PAGE_NO)}
      />

      <DashboardCard
        text="Карта"
        sub="Как добраться"
        // onClick={() => onGoToPage(NAVIGATOR_PAGE_NO)}
        onClick={() => history.push('/navigation')}
      />

      <DashboardCard
        text="FAQ"
        sub="Часто задаваемые вопросы"
        // onClick={() => onGoToPage(FAQ_PAGE_NO)}
        onClick={() => history.push('/faq')}
      />

      <DashboardCard
        text="Контакты"
        sub="Помощь"
        // onClick={() => onGoToPage(CONTACTS_PAGE_NO)}
        onClick={() => history.push('/contacts')}
      />

    </Row>

  )
}


const ScheduleLessonTitle = ({text}: { text: string }) => (
  <TextBox
    // @ts-ignore

  >
    <CardParagraph1 style={{color: "grey", marginTop: "0.5em"}}>
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
                         start,
                         end,
                         count,
                         filialId,
                         userId,
                         currentLesson,
                         currentLessonStartEnd,
                         groupId,
                         teacherId,
                         nextLesson,
                         nextLessonStartEnd,
                         spinner,
                         onGoToPage,
                         handleTeacherChange,
                         getCurrentLesson,
                         getTimeFirstLesson,
                         getEndLastLesson,
                         whatLesson,
                       }: {
  // state: IAppState
  character: Character
    // todo: что такое 'timeParamoy' ???
    | typeof CHAR_TIMEPARAMOY
  isTeacherAndValid: boolean
  groupId: String
  teacherId: String
  spinner: Boolean
  count: number,
  start: string,
  end: string,
  currentLesson: Bell,
  currentLessonStartEnd: StartEnd,
  filialId: String,
  userId: String,
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
  console.log(groupId, teacherId, userId, "DASHBOARD")
  return (
    <DeviceThemeProvider>
      <DocStyle/>
      {
        getThemeBackgroundByChar(character, 'dark')
      }
      <Container style={{padding: 0, overflow: "hidden"}}>
        <HeaderRow
          // onHomeClick={() => onGoToPage(SETTING_PAGE_NO)}
          onHomeClick={() => history.push('/settings')}
        />
        {
          spinner === true
            ? (
              <Row>
                <TodaySummary
                  date={new Date()}
                  lessonCount={count}
                  lessonsStart={start}
                  lessonsEnd={end}
                />


                    <Col size={12}>
                      <ScheduleSectionTitleRow/>
                      <Card style={{
                        width: "90%",
                        marginLeft: "1.5em",
                        marginTop: "0.5em",
                        marginRight: "1.5em"
                      }}
                            onClick={() => onGoToPage(SCHEDULE_PAGE_NO)}
                      >

                        <CardBody
                          // style={{padding: "0 0 0 0"}}
                        >
                          <CardContent
                            // compact
                            style={{padding: "0 0.2em 0.5em 0.8em"}}
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
                                <CardContent style={{padding: "0 0.2em 0.5em 0.8em"}}>

                                  <ScheduleLessonTitle text="Дальше"/>

                                  <ScheduleLesson
                                    lesson={nextLesson}
                                    startEndTime={nextLessonStartEnd}
                                    isTeacherAndValid={isTeacherAndValid}
                                    isAccented={false}
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
                    </Col>
                  
                    
                  
                
              </Row>
            )
            : (<div ></div>)}

              {groupId == "" && teacherId == "" && filialId!=""|| userId=="0" ? (<GetCloser
                      onGoToPage={(pageNo) => onGoToPage(pageNo)}
                    />) : (<div ></div>)}
               {!spinner &&(groupId != "" ||  teacherId != "")||  userId=="" ?      (
              <Col >
                <LineSkeleton size="headline1" roundness={8} style={{marginLeft: "1em", width:"90%"}}/>
                <LineSkeleton size="headline3" roundness={8} style={{marginLeft: "1em", width:"90%"}}/>
                <ScheduleSectionTitleRow/>
                <RectSkeleton width="100%" height="10rem" style={{marginTop: "0.5em", marginLeft: "1em", width:"90%"}} roundness={16}/>
              </Col>): (<div ></div>)
            
                    
        }
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
