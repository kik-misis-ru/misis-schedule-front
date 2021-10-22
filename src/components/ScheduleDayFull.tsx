import {Card, CardBody, CardContent, RectSkeleton} from "@sberdevices/plasma-ui";
import React from "react";
import {IScheduleDays} from "../App";
import {OTHER_WEEK, THIS_OR_OTHER_WEEK} from "../types/base.d";
import ScheduleDayLessons from "./ScheduleDayLessons";
import ScheduleDayOff from "./ScheduleDayOff";

export const ScheduleDayFull = ({
                                  spinner,
                                  days,
                                  day_num,
                                  current,
                                  weekParam,
                                  timeParam,
                                  isCorrectTeacher,
                                  today,
                                  // validateTeacher,
                                  // onSetValue,
                                  onTeacherClick,
                                }:{
  spinner: boolean
  days: IScheduleDays,
  day_num: number,
  current: string | undefined,
  weekParam: THIS_OR_OTHER_WEEK,
  timeParam: number,
  isCorrectTeacher: boolean,
  today: number,
  onTeacherClick: (teacherName: string) => void
}) => (
  !spinner
  ? (
    <RectSkeleton
      width="90%"
      height="25rem"
      roundness={16}
      style={{marginLeft: "5%", marginTop: "0.5em"}}/>
  )
  : (
    <div style={{flexDirection: "column"}}>
      <Card style={{width: "90%", marginLeft: "5%", marginTop: "0.5em"}}>
        <CardBody style={{padding: "0 0 0 0"}}>
          <CardContent compact style={{padding: "0.3em 0.3em"}}>
            {
              timeParam == 7
                ? <ScheduleDayOff/>
                : <ScheduleDayLessons
                  days={days}
                  day_num={day_num}
                  current={current}
                  weekParam={weekParam}
                  timeParam={timeParam}
                  isCorrectTeacher={isCorrectTeacher}
                  today={today}
                  onTeacherClick={(teacherName) => onTeacherClick(teacherName)}
                />
            }
          </CardContent>
        </CardBody>
      </Card>
    </div>)
)

export default ScheduleDayFull;
