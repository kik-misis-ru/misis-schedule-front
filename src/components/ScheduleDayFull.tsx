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
                                  student,
                                  teacher_correct,
                                  today,
                                  isCorrectTeacher,
                                  onSetValue,
                                }:{
  spinner: boolean
  days: IScheduleDays,
  day_num: number,
  current: string | undefined,
  weekParam: THIS_OR_OTHER_WEEK,
  timeParam: number,
  student: boolean,
  teacher_correct: boolean,
  today: number,
  isCorrectTeacher: () => Promise<void>,
  onSetValue: (key: string, value: any) => void
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
            {/* <TextBoxBigTitle style={{color: "var(--plasma-colors-secondary)"}}> {this.state.day[day_num]["title"]} {this.state.day[day_num]["date"][weekParam].slice(0, 5)},  {this.Para(this.state.day[day_num]["count"][weekParam])} </TextBoxBigTitle> */}
            {
              timeParam == 7
                ? <ScheduleDayOff/>
                : <ScheduleDayLessons
                  days={days}
                  day_num={day_num}
                  current={current}
                  weekParam={weekParam}
                  timeParam={timeParam}
                  student={student}
                  teacher_correct={teacher_correct}
                  today={today}
                  isCorrectTeacher={isCorrectTeacher}
                  onSetValue={onSetValue}
                />
            }
          </CardContent>
        </CardBody>
      </Card>
    </div>)
)

export default ScheduleDayFull;
