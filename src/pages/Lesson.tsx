import React from "react";
import 'react-toastify/dist/ReactToastify.css';
import {
  Container, 
  Row, 
  Col, 
  DeviceThemeProvider, 
  HeaderBack,
  HeaderLogo,
  HeaderTitle,
  HeaderTitleWrapper,
  HeaderContent,
  HeaderRoot,
  HeaderMinimize
} from "@sberdevices/plasma-ui";
import {
  StartEnd,
  LessonStartEnd,
} from '../App';
import {AssistantWrapper} from '../lib/AssistantWrapper'

import {Spacer100,Spacer200,Spacer300} from '../components/Spacers'
import logo from "../images/App Icon.png";
import {IconChevronLeft} from "@sberdevices/plasma-icons";
import {Bell} from '../types/ScheduleStructure'
import LessonCard from "../components/LessonCard";
import {DocStyle, getThemeBackgroundByChar} from '../themes/tools';
import {CharacterId} from "../types/base";

import {createBrowserHistory} from 'history';
import ApiModel from "../lib/ApiModel";

export const history = createBrowserHistory();

const Lesson = (props: {
  character: CharacterId
  isTeacherAndValid: boolean,
  currentLesson: Bell,
  currentLessonStartEnd: StartEnd,
  theme: string 
  pageNo: number
  onDashboardClick: () => void
  apiModel: ApiModel
}) => {
  const {
    character,
    theme,
    apiModel,
    currentLesson,
    isTeacherAndValid,
    currentLessonStartEnd,
    onDashboardClick,
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
      // height: '100%',
      // overflow: 'auto',
    }}>

      <Row style={{margin: "1em"}}>
      <HeaderRoot>
              <HeaderBack onClick={() => {history.go(-1)}} />
            <HeaderLogo src={logo} alt="Logo" onClick={() => onDashboardClick()}/>
            <HeaderTitleWrapper>
              <HeaderTitle>Карточка пары</HeaderTitle>
            </HeaderTitleWrapper>
            </HeaderRoot>

      </Row>
      <Row>
        <Col style={{overflow: "hidden"}}>
      
       
          <LessonCard
            lesson={currentLesson}
            startEndTime={currentLessonStartEnd}
            isTeacherAndValid={isTeacherAndValid}
            isAccented={true}
            // todo: задавать имя преподавателя
            onTeacherClick={async () => { 
              await apiModel.CheckIsCorrectTeacher({initials: currentLesson.teacher},false)
              let current_date = new Date().toISOString().slice(0,10)
              history.push('/schedule/'+current_date+'/'+false+'/'+true)
            }}
          />
     
      </Col>
      </Row>

      <Spacer300/>

    </Container>

  </DeviceThemeProvider>
}

export default Lesson
