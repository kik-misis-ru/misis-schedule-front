import React from "react";
import 'react-toastify/dist/ReactToastify.css';
import {
  CardHeadline3,
  TextBox,
  Card,
  TextBoxLabel,
  TextBoxSubTitle,
  TextBoxTitle,
  Badge,
  CellListItem,
  Footnote1,
  CardContent,
  Body1,
  Cell,
  TextField,
  CellDisclosure
} from "@sberdevices/plasma-ui";
import {
  //IconSettings,
  IconLocation,
  //IconMoreVertical
} from "@sberdevices/plasma-icons";
import {LessonStartEnd, NO_LESSONS_NAME, StartEnd} from "../App";
//import { darkJoy, darkEva, darkSber } from "@sberdevices/plasma-tokens/themes";
//import { createGlobalStyle } from "styled-components";

//import { text, background, gradient } from "@sberdevices/plasma-tokens";
// import "../themes/App.css";
import {ACCENT_TEXT_COLOR, COLOR_BLACK} from "./consts";
import {Bell} from "../types/ScheduleStructure";

// import {DEFAULT_TEXT_COLOR} from '../App';
// import {THIS_WEEK, THIS_OR_OTHER_WEEK} from "../types/base.d";
import {lessonTypeAdjToNoun} from '../utils';
import LinkToOnline from './LinkToOnline';
import {
  LessonStartAndFinishTime,
  LessonName,
  GroupNumber,
  TeacherName,
  LessonLeftContent,
  LessonRightContent
} from "../components/ScheduleLesson";


const MainContent = (
  {
    lessonName,
    lessonNumber,
    groupNumber,
    teacher,
    time,
    url,
    isAccented,
    lessonType,
    room,
    isTeacherAndValid,
    onTeacherClick,
  }: {
    lessonName: string
    lessonNumber: string
    groupNumber: string
    teacher: string
    room: string
    time: string
    lessonType: string
    url: string
    isAccented: boolean
    isTeacherAndValid: boolean
    onTeacherClick: (teacherName: string) => void
  }
) => {

  const sanitizeRoom = (room: string): number =>
    parseInt(room?.replace(/[^\d]/g, ''));

  return (
    <TextBox>
      <LessonName
        text={lessonName}
        lessonNumber={lessonNumber}
        isAccented={false}
      />
      <TextBoxLabel>
        {lessonType}
      </TextBoxLabel>
      <Footnote1 style={{color: "grey", marginTop: "1em"}}>
        Дата и время пары
      </Footnote1>

      <TextBoxTitle>
        {time}
      </TextBoxTitle>
      <LinkToOnline url={url}/>
      <Card
        onClick={() => onTeacherClick(teacher)}
        style={{marginTop: "1em"}}
      >
        <CardContent>
          <Footnote1 style={{color: "grey"}}>
            Преподаватель
          </Footnote1>
          {
            isTeacherAndValid
              ? <GroupNumber
                text={groupNumber}
              />
              : <Body1>{teacher}</Body1>

          }
        </CardContent>
      </Card>
      <Card style={{marginTop: "1em"}}>
        <CardContent compact>
          <Cell
            contentLeft={
              <IconLocation/>
            }
            content={
              <TextBox>
                <Body1 style={{marginLeft: "0.5em"}}>
                  Корпус {room?.[0]}
                </Body1>
                <TextBoxLabel style={{color: "grey", marginLeft: "0.5em"}}>
                  Кабинет {sanitizeRoom(room)}
                </TextBoxLabel>
              </TextBox>
            }
            contentRight={
              <CellDisclosure/>
            }
          />
        </CardContent>
      </Card>

      <TextField
        // id="tf"
        label="Заметка "
        className="editText"
        // placeholder="Напиши номер своей академической группы"
        style={{margin: "1em 0 0 0"}}
        //   onChange={(event) => {
        //     onChange(event.target.value)
        //   }}
      />

    </TextBox>
  )
}


const LessonCard = (
  {
    lesson,
    startEndTime,
    isAccented,
    isTeacherAndValid,

    onTeacherClick,

  }: {
    lesson: Bell
    startEndTime: StartEnd
    isAccented: boolean
    isTeacherAndValid: boolean

    onTeacherClick: (teacherName: string) => void

  }
) => {

  const formatStartEndTime = (startTime: string, endTime: string): string => {
    return startTime ? `${startTime} - ${endTime}` : "";
  }

  return <Cell
    style={{margin: "0 1em 1em 1em"}}
    content={
      <MainContent
        lessonName={lesson?.lessonName}
        lessonNumber={lesson?.lessonNumber}
        groupNumber={lesson?.groupNumber}
        teacher={lesson?.teacher}
        url={lesson?.url}
        lessonType={
          // todo: это преобразование должно быть раньше
          lessonTypeAdjToNoun(lesson?.lessonType)
        }
        time={
          formatStartEndTime(startEndTime.start, startEndTime.end)
        }
        room={lesson?.room}
        isAccented={isAccented}
        isTeacherAndValid={isTeacherAndValid}
        onTeacherClick={onTeacherClick}
      />
    }

  />
}

export default LessonCard
