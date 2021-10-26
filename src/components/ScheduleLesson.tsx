import React from "react";
import 'react-toastify/dist/ReactToastify.css';
import {
  CardHeadline3,
  TextBox,
  TextBoxSubTitle,
  TextBoxTitle,
  Badge,
  CellListItem,
} from "@sberdevices/plasma-ui";
import {
  //IconSettings,
  IconLocation,
  //IconMoreVertical
} from "@sberdevices/plasma-icons";
import {LessonStartEnd} from "../App";
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


export const LessonStartAndFinishTime = (
  {
    time
  }: {
    time: string
  }
) => {
  return (
    <TextBoxSubTitle lines={8}>
      {time}
    </TextBoxSubTitle>
  )
}

export const LessonName = (
  {
    isAccented,
    text,
  }: {
    isAccented: boolean
    text: string
  }
) => {
  return (
    isAccented
      ? <CardHeadline3 style={{
        color: ACCENT_TEXT_COLOR,
      }}>
        {text}
      </CardHeadline3>
      : <CardHeadline3>
        {text}
      </CardHeadline3>
  )
}

export const GroupNumber = (
  {
    text,
  }: {
    text: string
  }
) => {
  return (
    <TextBoxTitle>
      {text}
    </TextBoxTitle>
  )
}

export const TeacherName = (
  {
    text,
    style={},
    onClick,
  }: {
    text: string
    style?: React.CSSProperties
    onClick: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void
  }
) => {
  return (
    <a
      href='#'
      // style={{color: "white"}}
      style={style}
      onClick={(event) => onClick(event)}
    >
      {text}
    </a>
  )
}

export const LessonLeftContent = (
  {
    text,
    visible,
  }: {
    text: string
    visible: boolean
  }
) => {
  return (
    visible
      ? <Badge
        text={text}
        view="primary"
        style={{marginRight: "0.5em"}}
        size="l"
      />
      : <div></div>
  )
}

const MainContent = (
  {
    lessonName,
    groupNumber,
    teacher,
    time,
    url,
    isAccented,
    isTeacherAndValid,
    onTeacherClick,
  }: {
    lessonName: string
    groupNumber: string
    teacher: string
    time: string
    url: string
    isAccented: boolean
    isTeacherAndValid: boolean
    onTeacherClick: (teacherName: string) => void
  }
) => {
  return (
    <TextBox>
      <LessonStartAndFinishTime
        time={time}
      />
      <LessonName
        text={lessonName}
        isAccented={isAccented}
      />
      {
        isTeacherAndValid
          ? <GroupNumber
            text={groupNumber}
          />
          : <TeacherName
            text={teacher}
            style={{color: "white"}}
            onClick={() => onTeacherClick(teacher)}
          />
      }
      <LinkToOnline url={url}/>

    </TextBox>
  )
}

export const LessonRightContent = (
  {
    room,
    lessonType,
  }: {
    room: string
    lessonType: string
  }
) => {
  return (
    <TextBox>
      <Badge
        text={room}
        contentLeft={
          <IconLocation size="xs"/>
        }
        style={{backgroundColor: COLOR_BLACK}}
      />
      <TextBoxTitle>
        {lessonType}
      </TextBoxTitle>
    </TextBox>
  )
}


const ScheduleLesson = (
  {
    lesson,
    startTime,
    endTime,
    isAccented,
    isTeacherAndValid,
    onTeacherClick,
  }: {
    lesson: Bell
    startTime: string
    endTime: string
    isAccented: boolean
    isTeacherAndValid: boolean
    onTeacherClick: (teacherName: string) => void
  }
) => {

  const formatStartEndTime = (startTime: string, endTime: string): string => {
    return `${startTime} - ${endTime}`;
  }

  return <CellListItem
    content={
      <MainContent
        lessonName={lesson.lessonName}
        groupNumber={lesson.groupNumber}
        teacher={lesson.teacher}
        url={lesson.url}
        time={
          formatStartEndTime(startTime, endTime)
        }
        isAccented={isAccented}
        isTeacherAndValid={isTeacherAndValid}
        onTeacherClick={onTeacherClick}
      />
    }
    contentRight={
      <LessonRightContent
        room={lesson.room}
        lessonType={
          // todo: это преобразование должно быть раньше
          lessonTypeAdjToNoun(lesson.lessonType)
        }
      />
    }
    contentLeft={
      <LessonLeftContent
        visible={true}
        text={lesson.lessonNumber}
      />
    }
  />
}

export default ScheduleLesson
