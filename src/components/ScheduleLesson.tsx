import React from "react";
import {
  Link
} from "react-router-dom";
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
import {LessonStartEnd, NO_LESSONS_NAME, StartEnd} from "../App";
//import { darkJoy, darkEva, darkSber } from "@sberdevices/plasma-tokens/themes";
//import { createGlobalStyle } from "styled-components";

//import { text, background, gradient } from "@sberdevices/plasma-tokens";
// import "../themes/App.css";
import {ACCENT_TEXT_COLOR, COLOR_BLACK, COLOR_PRIMARY, COLOR_BUTTON_PRIMARY} from "./consts";
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
    lessonNumber,
  }: {
    isAccented: boolean
    text: string
    lessonNumber: string
  }
) => {
  console.log(text);
  return (
    <Link
      to={`/lesson/${lessonNumber}`}
      style={{
        color: isAccented
          ? ACCENT_TEXT_COLOR
          : COLOR_BUTTON_PRIMARY
        , textDecoration: 'none',

      }}
    >
        
          <CardHeadline3
            style={ isAccented ? {color: ACCENT_TEXT_COLOR} : {color: COLOR_BUTTON_PRIMARY}}
          >
            {text}
          </CardHeadline3>
          
    </Link>
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
    style = {},
    onClick,
  }: {
    text: string
    style?: React.CSSProperties
    onClick: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void
  }
) => {
  console.log(text);
  return (
    text != "" || text != null ? (
    <a
      href='#'
      // style={{color: "white"}}
      style={style}
      onClick={(event) => onClick(event)}
    >
      {text}
    </a>) : (<div style={{margin: "0"}}></div>)
    
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
    lessonNumber,
    groupNumber,
    teacher,
    time,
    url,
    isAccented,
    isTeacherAndValid,
    onTeacherClick,
  }: {
    lessonName: string
    lessonNumber: string
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
        lessonNumber={lessonNumber}
        isAccented={isAccented}
      />
      {
        isTeacherAndValid && groupNumber!=""
          ? <GroupNumber
            text={groupNumber}
          /> : <div></div>
       }  
       { !isTeacherAndValid && teacher!=""
          ? <TeacherName
            text={teacher}
            style={{color: COLOR_BUTTON_PRIMARY}}
            onClick={() => onTeacherClick(teacher)}
          /> : <div></div>
       }
      &nbsp;
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
    <TextBox >
      { room ? (
      <Badge
        text={room}
        contentLeft={
          <IconLocation size="xs"/>
        }
        style={{
          backgroundColor: COLOR_BLACK,
          color: COLOR_BUTTON_PRIMARY,
        }}
      />) : (<div></div>)
}
      <TextBoxTitle style={{paddingRight: "0.3em"}}>
        {lessonType}
      </TextBoxTitle>
    </TextBox>
  )
}


const ScheduleLesson = (
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
  console.log(lesson, "lesson")

  return (
    <CellListItem style={{padding: "0", margin: "0"}} 
      content={
        lesson.lessonName != "Пар нет 🎉" ?
        <MainContent
          lessonName={lesson.lessonName}
          lessonNumber={lesson.lessonNumber}
          groupNumber={lesson.groupNumber}
          teacher={lesson.teacher}
          url={lesson.url}
          time={
            formatStartEndTime(startEndTime.start, startEndTime.end)
          }
          isAccented={isAccented}
          isTeacherAndValid={isTeacherAndValid}
          onTeacherClick={onTeacherClick}
        /> : <CardHeadline3 style={{marginLeft: "1em"}}>
        {lesson.lessonName}
      </CardHeadline3>
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
          visible={!(lesson.lessonName == NO_LESSONS_NAME)}
          text={lesson.lessonNumber}
        />
      }
    />
  )
}

export default ScheduleLesson
