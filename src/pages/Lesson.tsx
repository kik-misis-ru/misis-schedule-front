import React from "react";
import {Container, Row, Col, DeviceThemeProvider, Caption, Body1} from '@sberdevices/plasma-ui';
import 'react-toastify/dist/ReactToastify.css';
import {
  Card,
  CardBody,
  CardContent,
  CardMedia,
  TextBox,
  TextBoxSubTitle,
  TextBoxTitle,
  TextBoxLabel,
  Badge,
  CellListItem,
} from "@sberdevices/plasma-ui";
import {
    HOME_PAGE_NO,
    StartEnd,
    LessonStartEnd,
    NAVIGATOR_PAGE_NO,
    SCHEDULE_PAGE_NO,
    CONTACTS_PAGE_NO,
    FAQ_PAGE_NO,
  } from '../App';
import {IconLocation} from "@sberdevices/plasma-icons";
import {Bell} from '../types/ScheduleStructure'
import karta from "../images/Karta.png";
import LessonCard from "../components/LessonCard";
import {DocStyle, getThemeBackgroundByChar} from '../themes/tools';
import {CHAR_TIMEPARAMOY, Character, IBuilding} from "../types/base";
import {COLOR_BLACK} from '../components/consts';
import {
  HeaderLogoCol,
  HeaderTitleCol2,
  GoToDashboardButton,
  GoToHomeButton,
  GoToScheduleButton,
} from '../components/TopMenu';



const Lesson = ({
                         character,
                         page,
                         spinner,
                         currentLesson,
                         isTeacherAndValid,
                         currentLessonStartEnd,
                         onGoToPage,
                         onDashboardClick,
                         handleTeacherChange,
                       }: {
  character: Character
    // todo: что такое 'timeParamoy' ???
    | typeof CHAR_TIMEPARAMOY
  page: number,
  isTeacherAndValid: boolean,
  currentLesson: Bell,
  spinner: Boolean,
  currentLessonStartEnd: StartEnd,
  onDashboardClick: () => void
  onGoToPage: (pageNo: number) => void
  handleTeacherChange: () => Promise<void>
}) => {
  return <DeviceThemeProvider>
    <DocStyle/>
    {
      getThemeBackgroundByChar(`${character}_dark`)
    }
          <Container style={{padding: 0}}>

            <Row style={{margin: "1em"}}>

              <HeaderLogoCol/>

              <HeaderTitleCol2
                title="Карточка пары"
              />

              <Col style={{margin: "0 0 0 auto"}}>
                <GoToDashboardButton
                  onClick={() => onDashboardClick()}
                />
              </Col>

            </Row>
            { spinner===true ?
        (
            <LessonCard
                      lesson={currentLesson}
                      startEndTime={currentLessonStartEnd}
                      isTeacherAndValid={isTeacherAndValid}
                      isAccented={true}
                      // todo: задавать имя преподавателя
                      onTeacherClick={(teacherName) => handleTeacherChange()}
                    />) : (<div></div>)
        }
            <div style={{
              width: '200px',
              height: '300px',
            }}></div>
          </Container>
        
  </DeviceThemeProvider>
}

export default Lesson
