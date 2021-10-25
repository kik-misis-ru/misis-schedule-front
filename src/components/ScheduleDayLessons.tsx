import React from "react";

import {IScheduleDays} from "../App";
import {Bell} from "../ScheduleStructure";
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
        dayLessons.map((bell, bellIndex) => {

          const getIsCurrentLesson = () => (
            // todo: убрать второй символ в lessonNumber
            bell.lessonNumber[0] === currentLessonNumber
            && bell.teacher !== ""
            && isToday
            // && today === timeParam
            // && weekParam === THIS_WEEK
          );
          const isCurrentLesson = getIsCurrentLesson();

          return bell.lessonName !== ""
            ? (
              <ScheduleLesson
                key={bellIndex}
                bell={bell}
                startTime={LessonStartEnd[bellIndex].start}
                endTime={LessonStartEnd[bellIndex].end}
                isTeacherAndValid={isTeacherAndValid}
                isAccented={isCurrentLesson}
                onTeacherClick={(teacherName) => onTeacherClick(teacherName)}
              />
            )
            : (
              <div
                key={bellIndex}
              ></div>
            )
        })
      }
    </React.Fragment>
  )
}

export default ScheduleDayLessons;
