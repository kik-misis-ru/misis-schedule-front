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
  StartEnd,
  LessonStartEnd,
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


const Lesson = (props: {
  character: Character
    // todo: что такое 'timeParamoy' ???
    | typeof CHAR_TIMEPARAMOY
  isTeacherAndValid: boolean,
  currentLesson: Bell,
  spinner: Boolean,
  currentLessonStartEnd: StartEnd,
  onDashboardClick: () => void
  handleTeacherChange: () => Promise<void>
  onGoToPage: (page: number) => void
}) => {
  const {
    character,
    spinner,
    currentLesson,
    isTeacherAndValid,
    currentLessonStartEnd,
    onDashboardClick,
    handleTeacherChange,
    onGoToPage
  } = props;

  console.log('Lesson:props:', props)
  return <DeviceThemeProvider>
    <DocStyle/>
    {
      getThemeBackgroundByChar(character, 'dark')
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
      <Row>
        <Col style={{overflow: "hidden"}}>
      {
        spinner === true
          ? <LessonCard
            lesson={currentLesson}
            startEndTime={currentLessonStartEnd}
            isTeacherAndValid={isTeacherAndValid}
            isAccented={true}
            onGoToPage={(page)=> onGoToPage(page)}
            // todo: задавать имя преподавателя
            onTeacherClick={(teacherName) => handleTeacherChange()}
          />
          : <div></div>
      }
      </Col>
      </Row>
      <div style={{
        width: '200px',
        height: '300px',
      }}></div>
    </Container>

  </DeviceThemeProvider>
}

export default Lesson
