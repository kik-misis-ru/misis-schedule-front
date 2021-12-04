import React, {MouseEventHandler} from "react";
import {
  Container,
  Row,
  Col,
  Button,
  DeviceThemeProvider,
  TextBoxBiggerTitle,
  Body1,
  Card,
  Image,
  CardBody,
  CardBody2,
  //CardBody1,
  CardContent,
  //CardMedia,
  CardParagraph1,
  CardParagraph2,
  TextBox,
  CellListItem,
  CardHeadline3,
  LineSkeleton,
  RectSkeleton,
  CellDisclosure,
  Caption,
  Header
} from '@sberdevices/plasma-ui';
import 'react-toastify/dist/ReactToastify.css';
import {ApiModel, ITeacherSettings} from '../lib/ApiModel'
//import {createGlobalStyle} from "styled-components";
import {
  IconLocation, 
  IconStarFill, 
  IconApps,
  IconEvent, 
  IconHelp, 
  IconCallCircle} 
  from "@sberdevices/plasma-icons";
import Month from "../language-ru/Month";
import {
  DocStyle,
  getThemeBackgroundByChar,
} from '../themes/tools';
import {
  capitalize,
} from '../lib/utils';
import{
  ITeacherValidation
} from '../lib/ApiModel'
import {
  formatTimeHhMm,
} from '../lib/datetimeUtils';
import { StartEnd } from '../App';
import {Spacer100,Spacer200,Spacer300} from '../components/Spacers'
import DayOfWeek from "../language-ru/DayOfWeek";

import phone from "../images/phone.png";
import schedule from "../images/schedule.png";
import faq from "../images/faq.png";
import location from "../images/location.png";
import logo from "../images/App Icon.png";

import {Bell} from '../types/ScheduleStructure'
import {CharacterId} from "../types/base.d";
import {pairNumberToPairNumText} from '../language-ru/utils'
import {GoToHomeButton, HeaderLogoCol, HeaderTitleCol} from "../components/TopMenu";
import ScheduleLesson from "../components/ScheduleLesson";
import {history} from "../App";
import {AssistantWrapper} from "../lib/AssistantWrapper";

import {DAY_OFF_TEXT} from '../components/ScheduleDayOff'
import moment from 'moment';
import 'moment/locale/ru';

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
                <Header
                    back={false}
                    logo={logo}
                    title="Мир МИСиС"
                    minimize 
                    onMinimizeClick={() => alert('Minimize click.')}
                >
                    <GoToHomeButton
        onClick={() => onHomeClick()}
      />
                </Header>

  </Row>
)


const ScheduleSectionTitleRow = () => (
  <Row>

    <Col
      style={{
        marginLeft: "1em",
        paddingTop: "1.2em"
      }}
    >
      <IconEvent/>
    </Col>

    <Col style={{
      paddingTop: "1.3em"
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
      <Col style={{marginLeft: "1em", paddingTop: "1.6em"}}>
        <IconApps />
      </Col>
      <Col style={{paddingTop: "1.7em"}}>
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
  const month = date.getMonth();
  const isSunday = dayOfWeek === 0;
  const weekDayShortToday = capitalize(
    moment(date).format('dd')
  );
  const dateToday = moment(date).format('DD.MM.YY');
  const dateDay = dateToday.slice(0, 1) === "0"
    ? dateToday.slice(1, 2)
    : dateToday.slice(0, 2)


  const formatLessonsCountFromTo = (
    count: string,
    from: string,
    to: string,
  ): string => (
    `Сегодня ${count} с ${from} до ${to}`
  )

  return (
    <Row style={{
          marginLeft: "1.3em",
          paddingTop: "0.5em",
        }}>
      <TextBox
        // @ts-ignore
        
      >
        <CardParagraph2 style={{fontSize: "1.4em"}}>
          {
            isSunday
              ? DAY_OFF_TEXT
              : `${DayOfWeek.long.nominative[dayOfWeek]}, ${dateDay} ${Month.long.genitive[month]}`
          }
        </CardParagraph2>
        <CardParagraph1 style={{color: "grey", paddingTop: "0.5em",}}>
          {
            !isSunday && typeof lessonCount !== 'undefined' && lessonCount !== 0
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
          display: "flex", flexDirection: "column"
        }}
        onClick={(event) => !!onClick ? onClick(event) : undefined}>
        <CardBody >
          <CardContent style={{height: "20vh"}}>
            <TextBox>
              <Caption style={{color: "grey"}}>
                {sub}
              </Caption>
              <CardHeadline3>
                {text}
              </CardHeadline3>
            </TextBox>
            {text=="Другое расписание" ? 
            <Col style={{margin: "auto 0 0 0", maxWidth: '2.3rem', padding: "0 0 0 0"}}>
            <Image src={schedule} />
            </Col> : <div></div>
            }
            {text=="Карта" ? 
            <Col style={{margin: "auto 0 0 0", maxWidth: '2.3rem', padding: "0 0 0 0"}}>
            <Image src={location} />
            </Col> : <div></div>
            }
            {text=="FAQ" ? 
            <Col style={{margin: "auto 0 0 0", maxWidth: '2.3rem', padding: "0 0 0 0"}}>
            <Image src={faq} />
            </Col> : <div></div>
            }
            {text=="Контакты" ? 
            <Col style={{margin: "auto 0 0 0", maxWidth: '2.3rem', padding: "0 0 0 0"}}>
            <Image src={phone} />
            </Col> : <div></div>
            }
          </CardContent>
        </CardBody>
      </Card>
    </Col>
  )
}

const GetCloser = ({
}: {
}) => {
return (
<Row style={{marginLeft: "0.7em", marginRight: "1em", marginTop: "0.5em", paddingTop: "0"}}>

<Card onClick={() => history.push('/settings')} style={{padding: "0 0 0 0", width: "100%", height: "8.5vh"}}>

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

const CatalogueItems = ({IsStudent}: {
IsStudent: boolean
}) => {

  return (
    <Row style={{marginLeft: "0.5em", marginRight: "0.5em"}}>

     

      <DashboardCard
        text="Карта"
        sub="Как добраться"
        onClick={() => history.push('/navigation')}
      />
      
      <DashboardCard
              text="Другое расписание"
              sub=""
              onClick={() => 
                IsStudent ? history.push('/home/true') : history.push('/home/false')
              }
            />

      <DashboardCard
        text="FAQ"
        sub="Часто задаваемые вопросы"
        onClick={() => history.push('/faq')}
      />

      <DashboardCard
        text="Контакты"
        sub="Как связаться"
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
  < CardBody2 style={{fontSize: "1.1em"}}>
    Пары нет🎊
  </CardBody2>
)

const DashboardPage = ({
                         character,
                         isTeacherAndValid,
                         start,
                         end,
                         count,
                         currentLesson,
                         currentLessonStartEnd,
                         nextLesson,
                         nextLessonStartEnd,
                         theme,
                         apiModel
                       }: {
  character: CharacterId
  isTeacherAndValid: boolean
  count: number,
  start: string,
  end: string,
  theme: string
  currentLesson: Bell,
  currentLessonStartEnd: StartEnd,
  nextLesson: Bell,
  nextLessonStartEnd: StartEnd,
  apiModel: ApiModel
}) => {

  console.log('DashboardPage:', nextLesson)
  // console.log('DashboardPage:', {count})
  let current_date = new Date().toISOString().slice(0,10)
  return (
    <DeviceThemeProvider>
      <DocStyle/>
      {
        getThemeBackgroundByChar(character, theme)
      }
      <Container style={{
        padding: 0,
        overflow: "hidden",
        // height: '100%',
        // overflow: 'auto',
      }}>
        <HeaderRow
          // onHomeClick={() => onGoToPage(SETTING_PAGE_NO)}
          onHomeClick={() => history.push('/settings')}
        />
        {

          apiModel.isSchedule
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
                        marginLeft: "0.7em",
                        marginTop: "0.5em",
                        marginRight: "0.7em"
                      }}
                            onClick={ () => {
                              history.push('/schedule/'+current_date+'/'+true+'/'+true)
                            }}
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
                              !!currentLesson&&count!=0
                                ? (
                                  <ScheduleLesson
                                    isCurrentWeek={true}
                                    isSave={true}
                                    Day={new Date().getDay()}
                                    lesson={currentLesson}
                                    startEndTime={currentLessonStartEnd}
                                    isTeacherAndValid={isTeacherAndValid}
                                    isAccented={true}
                                    // todo: задавать имя преподавателя
                                    onTeacherClick={(teacherName) => apiModel.CheckIsCorrectTeacher({initials: currentLesson.teacher}, false)}
                                  />
                                )
                                : <NoLesson/>
                            }

                          </CardContent>
                          {/*
          </CardBody>
*/}

                          {
                            !!nextLesson&&count!=0 // !!nextLessonIdx
                              ? (
                                // <React.Fragment>
                                /*
                              <CardBody
                                // style={{padding: "0 0 0 0"}}
                              >
              */
                                <CardContent style={{padding: "0 0.2em 0.2em 0.8em"}}>

                                  <ScheduleLessonTitle text="Дальше"/>

                                  <ScheduleLesson
                                    isCurrentWeek={true}
                                    isSave={true}
                                    Day={new Date().getDay()}
                                    lesson={nextLesson}
                                    startEndTime={nextLessonStartEnd}
                                    isTeacherAndValid={isTeacherAndValid}
                                    isAccented={false}
                                    // todo: задавать имя преподавателя
                                    onTeacherClick={() => apiModel.CheckIsCorrectTeacher({initials: nextLesson.teacher}, false)}
                                  />
                                  {/*</React.Fragment>*/}
                                </CardContent>
                              )
                              : (<div></div>)
                          }
                          {/*</CardContent>*/}
                          <Button size="s"  >Посмотреть всё</Button>
                        </CardBody>

                      </Card>
                    </Col>
                  
                   
                  
                
              </Row>
            )
            : (<div ></div>)}

             
               {!apiModel.isSchedule &&apiModel.isSavedUser&&(apiModel.user?.group_id != "" || apiModel.user?.teacher_id != "")||!apiModel.isSavedUser  ?      (
              <Col >
                <LineSkeleton size="headline2" roundness={8} style={{marginLeft: "0.7em", marginRight: "0.7em", width:"95%"}}/>
                <LineSkeleton size="headline3" roundness={8} style={{marginLeft: "0.7em", marginRight: "0.7em", width:"95%"}}/>
                <ScheduleSectionTitleRow/>
                <RectSkeleton width="95%" height="10rem" style={{marginTop: "0.5em", marginLeft: "0.7em", marginRight: "0.7em"}} roundness={16}/>
              </Col>): (<div ></div>)

             
                    
        }
        {apiModel.isSavedUser&&(apiModel.user?.group_id == "" && apiModel.user?.teacher_id == "") ? 
        (<GetCloser/>) : (<div ></div>)}
        <CatalogueHeaderRow/>

        <CatalogueItems
         IsStudent={apiModel.isStudent}
        />

        <Spacer300/>

      </Container>
    </DeviceThemeProvider>
  )
}

export default DashboardPage
