import {Row, TextBox, TextBoxBigTitle} from "@sberdevices/plasma-ui";
import React from "react";

const DAY_OFF_TEXT = 'Выходной 😋';

export const ScheduleDayOff = () => (
  <Row style={{
    display: "flex",
    flexDirection: "row",
    alignSelf: "center",
    justifyContent: "center"
  }}>
    <TextBox>
      <TextBoxBigTitle>{ DAY_OFF_TEXT }</TextBoxBigTitle>
    </TextBox>
  </Row>
)

export default ScheduleDayOff;
