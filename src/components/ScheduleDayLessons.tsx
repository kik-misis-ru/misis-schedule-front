import React from "react";

import {IScheduleDays} from "../App";
import {THIS_OR_OTHER_WEEK} from "../types/base";
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
                                     validateTeacher,
                                     onSetValue,
                             }:{
  days: IScheduleDays,
  day_num: number,
  current: string | undefined,
  weekParam: THIS_OR_OTHER_WEEK,
  timeParam: number,
  student: boolean,
  teacher_correct: boolean,
  today: number,
  validateTeacher: () => Promise<void>,
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
              key={bellNumber}
              bell={bell}
              current={current}
              weekParam={weekParam}
              timeParam={timeParam}
              student={student}
              teacher_correct={teacher_correct}
              today={today}
              validateTeacher={validateTeacher}
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
