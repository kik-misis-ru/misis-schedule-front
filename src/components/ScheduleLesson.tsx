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
import {Bell} from "../ScheduleStructure";

// import {DEFAULT_TEXT_COLOR} from '../App';
// import {THIS_WEEK, THIS_OR_OTHER_WEEK} from "../types/base.d";
import {lessonTypeAdjToNoun} from '../utils';
import LinkToOnline from './LinkToOnline';


const StartAndFinishTime = (
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

const LessonName = (
  {
    isCurrentLesson,
    text,
  }: {
    isCurrentLesson: boolean
    text: string
  }
) => {
  return (
    isCurrentLesson
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

const GroupNumber = (
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

const TeacherName = (
  {
    text,
    onClick,
  }: {
    text: string
    onClick: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void
  }
) => {
  return (
    <a
      href='#'
      style={{color: "white"}}
      onClick={(event) => onClick(event)}>
      {text}
    </a>
  )
}

const LeftContent = (
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
    isCurrentLesson,
    isCorrectTeacher,
    onTeacherClick,
  }: {
    lessonName: string
    groupNumber: string
    teacher: string
    time: string
    url: string
    isCurrentLesson: boolean
    isCorrectTeacher: boolean
    onTeacherClick: (teacherName: string) => void
  }
) => {
  return (
    <TextBox>
      <StartAndFinishTime
        time={time}
      />
      <LessonName
        isCurrentLesson={isCurrentLesson}
        text={lessonName}
      />
      {
        isCorrectTeacher
          ? <GroupNumber
            text={groupNumber}
          />
          : <TeacherName
            text={teacher}
            onClick={() => onTeacherClick(teacher)}
          />
      }
      <LinkToOnline url={url}/>

    </TextBox>
  )
}

const RightContent = (
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
        contentLeft={<IconLocation size="xs"/>}
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
    bell,
    startTime,
    endTime,
    isCurrentLesson,
    isCorrectTeacher,
    onTeacherClick,
  }: {
    bell: Bell
    startTime: string
    endTime: string
    isCurrentLesson: boolean
    isCorrectTeacher: boolean
    onTeacherClick: (teacherName: string) => void
  }
) => {

  const formatStartEndTime = (startTime: string, endTime: string): string => {
    return `${startTime} - ${endTime}`;
  }

  return <CellListItem
    content={
      <MainContent
        lessonName={bell.lessonName}
        groupNumber={bell.groupNumber}
        teacher={bell.teacher}
        url={bell.url}
        time={
          formatStartEndTime(startTime, endTime)
        }
        isCurrentLesson={isCurrentLesson}
        isCorrectTeacher={isCorrectTeacher}
        onTeacherClick={onTeacherClick}
      />
    }
    contentRight={
      <RightContent
        room={bell.room}
        lessonType={
          // todo: это преобразование должно быть раньше
          lessonTypeAdjToNoun(bell.lessonType)
        }
      />
    }
    contentLeft={
      <LeftContent
        visible={true}
        // todo: lessonNumber не должен содержать точку
        text={bell.lessonNumber[0]}
      />
    }
  />
}

export default ScheduleLesson
