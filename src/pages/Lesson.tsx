import React from "react";
import 'react-toastify/dist/ReactToastify.css';
import {
  Container,
  Row,
  Col,
  HeaderBack,
  HeaderLogo,
  HeaderTitle,
  HeaderTitleWrapper,
  HeaderRoot,
} from "@sberdevices/plasma-ui";
import {
  StartEnd,
} from '../App';

import {Spacer300} from '../components/Spacers'
import logo from "../images/App Icon.png";
import {Bell} from '../types/ScheduleStructure'
import LessonCard from "../components/LessonCard";

import {createBrowserHistory} from 'history';
import ApiModel from "../lib/ApiModel";

export const history = createBrowserHistory();

const Lesson = ({
                  apiModel,
                  currentLesson,
                  isTeacherAndValid,
                  currentLessonStartEnd,
                }: {
  isTeacherAndValid: boolean,
  currentLesson: Bell,
  currentLessonStartEnd: StartEnd,
  pageNo: number
  apiModel: ApiModel
}) => {
  return (
    <Container style={{
      padding: 0,
      // overflow: "hidden",
      // height: '100%',
      // overflow: 'auto',
    }}>

      <Row style={{margin: "1em"}}>
        <HeaderRoot>
          <HeaderBack onClick={() => {
            history.go(-1)
          }}/>
          <HeaderLogo
            src={logo}
            alt="Logo"
            onClick={() => history.push("/dashboard")}
          />
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
              await apiModel.CheckIsCorrectTeacher({initials: currentLesson.teacher}, false)
              let current_date = new Date().toISOString().slice(0, 10)
              history.push('/schedule/' + current_date + '/' + false + '/' + true)
            }}
          />
        </Col>
      </Row>

      <Spacer300/>

    </Container>

  )
}

export default Lesson
