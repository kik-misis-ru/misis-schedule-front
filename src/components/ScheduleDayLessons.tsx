import React from "react";

import {IScheduleDays} from "../App";
import {Bell} from "../types/ScheduleStructure";
import {dayLessons} from "../stories/consts";
import {THIS_OR_OTHER_WEEK, THIS_WEEK} from "../types/base.d";
import ScheduleLesson from "./ScheduleLesson";
import {LessonStartEnd} from "../App";


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
                startEndTime={LessonStartEnd[lessonIndex]}
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

export default ScheduleDayLessons;
