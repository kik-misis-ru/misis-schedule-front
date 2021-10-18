import React from "react";

import {IScheduleDays} from "../App";
import BellView from "./BellView";


export const ScheduleDayLessons = ({
                                     days,
                                     day_num,
                                     current,
                                     weekParam,
                                     timeParam,
                                     student,
                                     teacher_correct,
                                     today,
                                     isCorrectTeacher,
                                     onSetValue,
                             }:{
  days: IScheduleDays,
  day_num: number,
  current: string | undefined,
  weekParam: number,
  timeParam: number,
  student: boolean,
  teacher_correct: boolean,
  today: number,
  isCorrectTeacher: () => Promise<void>,
  onSetValue: (key: string, value: any) => void
}) => (
  <React.Fragment>
    {
      days.map((_, bellNumber) => {
        const curr_day_obj = days[day_num]
        // const bell_id = bellNumber;
        const bell = curr_day_obj[bellNumber][weekParam];

        return bell.lessonName !== ""
          ? (
            <BellView
              bell={bell}
              current={current}
              weekParam={weekParam}
              timeParam={timeParam}
              student={student}
              teacher_correct={teacher_correct}
              today={today}
              isCorrectTeacher={isCorrectTeacher}
              setValue={onSetValue}/>
          )
          : (
            <div></div>
          )
      })
    }
  </React.Fragment>

)

export default ScheduleDayLessons;
