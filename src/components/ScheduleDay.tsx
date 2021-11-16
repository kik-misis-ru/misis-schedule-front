import React from "react";
import { Link } from "react-router";
import {Card, CardBody, CardContent, RectSkeleton} from "@sberdevices/plasma-ui";

import {IScheduleDays, LessonStartEnd, NO_LESSONS_NAME} from "../App";
import {Bell} from "../types/ScheduleStructure";
import {OTHER_WEEK, THIS_OR_OTHER_WEEK} from "../types/base.d";
// import ScheduleDayLessons from "./ScheduleDayLessons";
import ScheduleDayOff from "./ScheduleDayOff";
import ScheduleLesson from "./ScheduleLesson";

const EMPTY_LESSON_NUM = 7;


export const ScheduleDayLessons = ({
                                     // days,
                                     // day_num,
                                     dayLessons,
                                     currentLessonNumber,
                                     // today,
                                     // weekParam,
                                     // timeParam,
                                     isTeacherAndValid,
                                     isToday,
                                     onTeacherClick,
                                   }: {
  // days: IScheduleDays,
  // day_num: number,
  dayLessons: Bell[]
  // today: number,
  currentLessonNumber: string | undefined,
  // weekParam: THIS_OR_OTHER_WEEK,
  // timeParam: number,
  isTeacherAndValid: boolean,
  isToday: boolean,
  onTeacherClick: (teacherName: string) => void
}) => {
  return (
    <React.Fragment>
      {
        dayLessons.map((lesson, lessonIndex) => {

          const getIsCurrentLesson = () => (
            lesson.lessonNumber === currentLessonNumber
            && lesson.teacher !== ""
            && isToday
            // && today === timeParam
            // && weekParam === THIS_WEEK
          );
          const isCurrentLesson = getIsCurrentLesson();

          return lesson.lessonName !== ""
            ? (
              <ScheduleLesson
                key={lessonIndex}
                lesson={lesson}
                startEndTime={
                  lesson.lessonName == NO_LESSONS_NAME
                    ? LessonStartEnd[EMPTY_LESSON_NUM]
                    : LessonStartEnd[lessonIndex]
                }
                isTeacherAndValid={isTeacherAndValid}
                isAccented={isCurrentLesson}
                onTeacherClick={(teacherName) => onTeacherClick(teacherName)}
              />
            )
            : (
              <div
                key={lessonIndex}
              ></div>
            )
        })
      }
    </React.Fragment>
  )
}


export const ScheduleDay = ({
                              isReady,
                              // days,
                              // day_num,
                              dayLessons,
                              currentLessonNumber,
                              // weekParam,
                              // timeParam,
                              isTeacherAndValid,
                              isToday,
                              isDayOff,
                              // today,
                              // validateTeacher,
                              // onSetValue,
                              onTeacherClick,
                            }: {
  isReady: boolean
  // days: IScheduleDays,
  // day_num: number,
  dayLessons: Bell[];
  currentLessonNumber: string | undefined,
  // weekParam: THIS_OR_OTHER_WEEK,
  // timeParam: number,
  isTeacherAndValid: boolean,
  isToday: boolean,
  isDayOff: boolean,
  // today: number,
  onTeacherClick: (teacherName: string) => void
}) => (
  isReady
    ? (
      <div style={{flexDirection: "column"}}>
        <Card style={isDayOff
          ? {background: "rgba(0, 0, 0, 0)",  marginTop: "5%"}
          : {width: "90%", marginLeft: "5%", marginTop: "0.5em"}
        }>
          <CardBody style={{padding: "0 0 0 0"}}>
            <CardContent compact style={{padding: "0 0.1em 0 0.1em"}}>
              {
                isDayOff
                  ? <ScheduleDayOff/>
                  : <ScheduleDayLessons
                    // days={days}
                    // day_num={day_num}
                    dayLessons={dayLessons}
                    currentLessonNumber={currentLessonNumber}
                    // weekParam={weekParam}
                    // timeParam={timeParam}
                    isTeacherAndValid={isTeacherAndValid}
                    isToday={isToday}
                    // today={today}
                    onTeacherClick={(teacherName) => onTeacherClick(teacherName)}
                  />
              }
            </CardContent>
          </CardBody>
        </Card>
      </div>)
    : (
      <RectSkeleton
        width="90%"
        height="25rem"
        roundness={16}
        style={{marginLeft: "5%", marginTop: "0.5em"}}
      />
    )
)


export default ScheduleDay;
