import React from "react";

import {IScheduleDays} from "../App";
import {THIS_OR_OTHER_WEEK, THIS_WEEK} from "../types/base.d";
import ScheduleLesson from "./ScheduleLesson";
import {LessonStartEnd} from "../App";


export const ScheduleDayLessons = ({
                                     days,
                                     day_num,
                                     today,
                                     current,
                                     weekParam,
                                     timeParam,
                                     isCorrectTeacher,
                                     onTeacherClick,
                                   }: {
  days: IScheduleDays,
  day_num: number,
  today: number,
  current: string | undefined,
  weekParam: THIS_OR_OTHER_WEEK,
  timeParam: number,
  isCorrectTeacher: boolean,
  onTeacherClick: (teacherName: string) => void
}) => (
  <React.Fragment>
    {
      days.map((dayBells_, lessonIndex) => {
        const dayBells = days[day_num]
        const bell = dayBells[lessonIndex][weekParam];

        const getIsCurrentLesson = () => (
          bell.lessonNumber[0] === current &&
          bell.teacher !== "" &&
          today === timeParam &&
          weekParam === THIS_WEEK
        );
        const isCurrentLesson = getIsCurrentLesson();

        return bell.lessonName !== ""
          ? (
            <ScheduleLesson
              key={lessonIndex}
              bell={bell}
              startTime={LessonStartEnd[lessonIndex].start}
              endTime={LessonStartEnd[lessonIndex].end}
              isCorrectTeacher={isCorrectTeacher}
              isCurrentLesson={isCurrentLesson}
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

export default ScheduleDayLessons;
