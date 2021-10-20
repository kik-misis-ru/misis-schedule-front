import React from "react";
import {Col, TextBox, TextBoxSubTitle, TextBoxTitle} from "@sberdevices/plasma-ui";

const DEFAULT_SCHEDULE_TEXT = 'Расписание занятий';

export function HeaderSchedule({
                                 label=DEFAULT_SCHEDULE_TEXT,
                                 subLabel,
                               }: {
  label?: string
  subLabel: string
}) {
  return (
    <Col style={{ marginLeft: "0.5em" }}>
      <TextBox>
        <TextBoxTitle>{ label }</TextBoxTitle>
        <TextBoxSubTitle>{ subLabel }</TextBoxSubTitle>
      </TextBox>
    </Col>
  )
}

export default HeaderSchedule;
