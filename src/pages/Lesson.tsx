import React from "react";
import {Container, Row, Col, DeviceThemeProvider, Caption, Body1} from '@sberdevices/plasma-ui';
import 'react-toastify/dist/ReactToastify.css';
import {
  Button
} from "@sberdevices/plasma-ui";
import {
  StartEnd,
  LessonStartEnd, Spacer300,
} from '../App';
import {IconChevronLeft} from "@sberdevices/plasma-icons";
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
import {createBrowserHistory} from 'history';

export const history = createBrowserHistory();

const Lesson = (props: {
  character: Character
    // todo: что такое 'timeParamoy' ???
    | typeof CHAR_TIMEPARAMOY
  isTeacherAndValid: boolean,
  currentLesson: Bell,
  spinner: Boolean,
  currentLessonStartEnd: StartEnd,
  theme: string 
  pageNo: number
  onDashboardClick: () => void
  handleTeacherChange: (isSave: boolean) => Promise<boolean>
  onGoToPage: (page: number) => void
}) => {
  const {
    character,
    theme,
    spinner,
    currentLesson,
    isTeacherAndValid,
    currentLessonStartEnd,
    pageNo,
    onDashboardClick,
    handleTeacherChange,
    onGoToPage
  } = props;

  console.log('Lesson:props:', props)
  return <DeviceThemeProvider>
    <DocStyle/>
    {
      getThemeBackgroundByChar(character, theme)
    }
    <Container style={{
      padding: 0,
      // overflow: "hidden",
      height: '100%',
      overflow: 'auto',
    }}>

      <Row style={{margin: "1em"}}>
      {/* <HeaderLogoCol/> */}
      <Button size="s" view="clear" contentLeft={<IconChevronLeft/>} onClick={() => {onGoToPage(pageNo)}} />

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
            onTeacherClick={() => handleTeacherChange(false)}
          />
          : <div></div>
      }
      </Col>
      </Row>

      <Spacer300/>

    </Container>

  </DeviceThemeProvider>
}

export default Lesson
