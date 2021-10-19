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
//import { darkJoy, darkEva, darkSber } from "@sberdevices/plasma-tokens/themes";
//import { createGlobalStyle } from "styled-components";

//import { text, background, gradient } from "@sberdevices/plasma-tokens";
import "../App.css";
import {ACCENT_TEXT_COLOR} from "../App";
import {Bell} from "../ScheduleStructure";

// import {DEFAULT_TEXT_COLOR} from '../App';
import {THIS_WEEK, THIS_OR_OTHER_WEEK} from "../types/base.d";
import {lessonTypeAdjToNoun} from '../utils';
import LinkToOnline from './LinkToOnline';


const StartAndFinishTime = ({
                              time
                            }: {
  time: string
}) => {
  return (
    <TextBoxSubTitle lines={8}>
      {time}
    </TextBoxSubTitle>
  )
}

const LessonName = ({
                      isCurrentLesson,
                      text,
                    }: {
  isCurrentLesson: boolean
  text: string
}) => {
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

const GroupNumber = ({
                       text,
                     }: {
  text: string
}) => {
  return (
    <TextBoxTitle>
      {text}
    </TextBoxTitle>
  )
}

const TeacherName = ({
                       text,
                       onClick,
                     }: {
  text: string
  onClick: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void
}) => {
  return (
    <a
      href='#'
      onClick={(event) => onClick(event)}>
      {text}
    </a>
  )
}

const MainContent = ({
                       bell,
                       isCurrentLesson,
                       isCorrectTeacher,
                       onTeacherClick,
                     }: {
  bell: Bell
  isCurrentLesson: boolean
  isCorrectTeacher: boolean
  onTeacherClick: (teacherName: string) => void
}) => {
  return (
    <TextBox>
      <StartAndFinishTime
        time={bell.startAndFinishTime}
      />
      <LessonName
        isCurrentLesson={isCurrentLesson}
        text={bell.lessonName}
      />
      {
        isCorrectTeacher
          ? <GroupNumber
            text={bell.groupNumber}
          />
          : <TeacherName
            text={bell.teacher}
            onClick={() => onTeacherClick(bell.teacher)}
          />
      }
      <LinkToOnline url={bell.url}/>

    </TextBox>
  )
}

const RightContent = ({
                        bell
                      }: {
  bell: Bell
}) => {
  return (
    <TextBox>
      <Badge
        text={bell.room}
        contentLeft={<IconLocation size="xs"/>}
        style={{backgroundColor: "rgba(0,0,0, 0)"}}
      />
      <TextBoxTitle>
        {lessonTypeAdjToNoun(bell.lessonType)}
      </TextBoxTitle>
    </TextBox>
  )
}

const LeftContent = ({
                       text,
                       visible,
                     }: {
  text: string
  visible: boolean
}) => {
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


interface BellViewProps {
  setValue: (key: string, value: any) => void
  isCorrectTeacher: () => Promise<void>
  student: boolean
  teacher_correct: boolean
  bell: Bell
  current: string | undefined
  today: number
  timeParam: number
  weekParam: THIS_OR_OTHER_WEEK
}

class BellView extends React.Component<BellViewProps> {

  constructor(props: BellViewProps) {
    super(props);
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange(key, e) {
    this.props.setValue(key, e);
  }

  //IsUrlExist(){
  //  return  this.props.bell.url !== "" && this.props.bell.url !== null
  //}

  getIsCurrentLesson() {
    const {bell} = this.props;
    return (
      bell.lessonNumber[0] === this.props.current &&
      bell.teacher !== "" &&
      this.props.today === this.props.timeParam &&
      this.props.weekParam === THIS_WEEK
    )
  }

  getIsCorrectTeacher() {
    return !this.props.student && this.props.teacher_correct
  }

  render() {
    const {bell} = this.props;
    return <CellListItem
      // key={`item:${this.props.timeParam - 1}`}
      key={this.props.timeParam}
      content={
        <MainContent
          bell={bell}
          isCurrentLesson={this.getIsCurrentLesson()}
          isCorrectTeacher={this.getIsCorrectTeacher()}
          onTeacherClick={(teacherName) => {
            this.handleChange("teacher", teacherName);
            this.props.isCorrectTeacher()
          }}
        />
      }
      contentRight={
        <RightContent
          bell={bell}
        />
      }
      contentLeft={
        <LeftContent
          visible={!! bell.teacher}
          text={bell.lessonNumber[0]}
        />
      }
    />
  }
}

export default BellView
