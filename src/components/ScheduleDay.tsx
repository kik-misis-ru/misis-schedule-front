import React from "react";
import { Link } from "react-router";
import {Card, CardBody, CardContent, RectSkeleton} from "@sberdevices/plasma-ui";

import {LessonStartEnd} from "../App";
import {IScheduleDays} from "../lib/ApiModel"
import {NO_LESSONS_NAME} from '../lib/ApiHelper'
import {Bell} from "../types/ScheduleStructure";
import {OTHER_WEEK, THIS_OR_OTHER_WEEK} from "../types/base.d";
// import ScheduleDayLessons from "./ScheduleDayLessons";
import ScheduleDayOff from "./ScheduleDayOff";
import ScheduleLesson from "./ScheduleLesson";

const EMPTY_LESSON_NUM = 7;


export const ScheduleDayLessons = ({
                                     
                                     dayLessons,
                                     currentLessonNumber,
                                     isCurrentWeek,
                                     isSave,
                                     Day,
                                     isTeacherAndValid,
                                     isToday,
                                     onTeacherClick,
                                   }: {
  
  dayLessons: Bell[]
  currentLessonNumber: string | undefined,
  isCurrentWeek: boolean
  isSave: boolean
  Day: number
  isTeacherAndValid: boolean,
  isToday: boolean,
  onTeacherClick: (teacherName: string) => void
}) => {
  return (
    <React.Fragment>
      {
        dayLessons && dayLessons.map((lesson, lessonIndex) => {

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
                isCurrentWeek={isCurrentWeek}
                isSave={isSave}
                Day={Day}
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
                              isCurrentWeek,
                              isSave,
                              Day,
                              onTeacherClick,
                            }: {
  isReady: boolean
  dayLessons: Bell[];
  currentLessonNumber: string | undefined,
  isTeacherAndValid: boolean,
  isToday: boolean,
  isDayOff: boolean,
  isCurrentWeek: boolean
  isSave: boolean
  Day: number
  onTeacherClick: (teacherName: string) => void
}) => (
  isReady==true
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
                    
                    dayLessons={dayLessons}
                    currentLessonNumber={currentLessonNumber}
                    isCurrentWeek={isCurrentWeek}
                    isSave={isSave}
                    Day={Day}
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
