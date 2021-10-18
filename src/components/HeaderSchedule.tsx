import React from "react";
import {Col, TextBox, TextBoxSubTitle, TextBoxTitle} from "@sberdevices/plasma-ui";

const SCHEDULE_TEXT = 'Расписание занятий';

export function HeaderSchedule({ label }: { label: string }) {
  return (
    <Col style={{ marginLeft: "0.5em" }}>
      <TextBox>
        <TextBoxTitle>{ SCHEDULE_TEXT }</TextBoxTitle>
        <TextBoxSubTitle>{ label }</TextBoxSubTitle>
      </TextBox>
    </Col>
  )
}

export default HeaderSchedule;
