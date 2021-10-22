import {Card, CardBody, CardContent, RectSkeleton} from "@sberdevices/plasma-ui";
import React from "react";
import {IScheduleDays} from "../App";
import {Bell} from "../ScheduleStructure";
import {OTHER_WEEK, THIS_OR_OTHER_WEEK} from "../types/base.d";
import ScheduleDayLessons from "./ScheduleDayLessons";
import ScheduleDayOff from "./ScheduleDayOff";

export const ScheduleDayFull = ({
                                  isReady,
                                  // days,
                                  // day_num,
                                  dayLessons,
                                  currentLessonNumber,
                                  // weekParam,
                                  // timeParam,
                                  isCorrectTeacher,
                                  isToday,
                                  isSunday,
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
  isCorrectTeacher: boolean,
  isToday: boolean,
  isSunday: boolean,
  // today: number,
  onTeacherClick: (teacherName: string) => void
}) => (
  isReady
    ? (
      <div style={{flexDirection: "column"}}>
        <Card style={{width: "90%", marginLeft: "5%", marginTop: "0.5em"}}>
          <CardBody style={{padding: "0 0 0 0"}}>
            <CardContent compact style={{padding: "0.3em 0.3em"}}>
              {
                isSunday
                  ? <ScheduleDayOff/>
                  : <ScheduleDayLessons
                    // days={days}
                    // day_num={day_num}
                    dayLessons={dayLessons}
                    currentLessonNumber={currentLessonNumber}
                    // weekParam={weekParam}
                    // timeParam={timeParam}
                    isCorrectTeacher={isCorrectTeacher}
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
        style={{marginLeft: "5%", marginTop: "0.5em"}}/>
    )
)


export default ScheduleDayFull;
