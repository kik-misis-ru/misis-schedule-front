import {IconNavigationArrow, IconSettings} from "@sberdevices/plasma-icons";
import {Button, Col, Row} from "@sberdevices/plasma-ui";
import React from "react";
import {HOME_PAGE_NO, NAVIGATOR_PAGE_NO} from "../../App";
import {getFullGroupName,getIsCorrectTeacher} from "../../utils";
import StarButtonView from "../StarButtonView";
import HeaderLogo from "./HeaderLogo";
import HeaderSchedule from "./HeaderSchedule";

const TopMenu = ({
                   state,
                   setState,
                   setValue,
                   // label,
                   // subLabel,
                   onHomeCLick,
                   onNavigatorCLick,
                 }: {
  state
  setState
  setValue: (key: string, value: any) => void
  // label?: string
  // subLabel: string
  onHomeCLick: () => void
  onNavigatorCLick: () => void
}) => {

  const groupName = getFullGroupName(state.group, state.subGroup);

  return (
    <Row style={{margin: "1em"}}>

      <HeaderLogo/>

      <HeaderSchedule
        // label={label}
        subLabel={
          getIsCorrectTeacher({ isStudent: state.student, isTeacherCorrect: state.teacher_correct })
          ? state.teacher
          : groupName
        }
      />

      <Col style={{margin: "0 0 0 auto"}}>
        <Button
          size="s"
          view="clear"
          pin="circle-circle"
          onClick={() => onNavigatorCLick()}
          contentRight={
            <IconNavigationArrow size="s" color="inherit"/>
          }
        />
        {
          getIsCorrectTeacher({ isStudent: state.student, isTeacherCorrect: state.teacher_correct })
            ? (
              <StarButtonView
                star={state.star}
                isStudent={state.student}
                userId={state.userId}
                groupId={state.groupId}
                subGroup={state.subGroup}
                engGroup={state.engGroup}
                teacherId={state.teacherId}
                teacher_star={state.teacher_star}
                setValue={setValue}
                onClick={() => setValue("teacher_star", !state.teacher_star)}
              />
            ) : (
              <StarButtonView
                star={state.star}
                isStudent={state.student}
                userId={state.userId}
                groupId={state.groupId}
                subGroup={state.subGroup}
                engGroup={state.engGroup}
                teacherId={state.teacherId}
                teacher_star={state.teacher_star}
                setValue={setValue}
                onClick={() => setValue("star", !state.star)}
              />
            )}
        <Button
          size="s"
          view="clear"
          pin="circle-circle"
          onClick={() => onHomeCLick()}
          contentRight={
            <IconSettings size="s" color="inherit"/>
          }
        />

        {/* <Button size="s" view="clear" pin="circle-circle" onClick={()=>this.setState({ page: 16 })}  contentRight={<IconHouse size="s" color="inherit"/>} /> */}
      </Col>
    </Row>
  )
}

export default TopMenu
