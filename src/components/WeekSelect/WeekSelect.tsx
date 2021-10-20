import {Row} from "@sberdevices/plasma-ui";
import React from "react";
import ButtonNextWeek from "./ButtonNextWeek";
import ButtonPrevWeek from "./ButtonPrevWeek";
import ButtonThisWeek from "./ButtonThisWeek";

export const WeekSelect = ({
                                 onPrevWeekClick,
                                 onThisWeekClick,
                                 onNextWeekClick,
                               }: {
  onPrevWeekClick: React.MouseEventHandler<HTMLElement>,
  onThisWeekClick: React.MouseEventHandler<HTMLElement>,
  onNextWeekClick: React.MouseEventHandler<HTMLElement>,
}) => (
  <Row style={{
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  }}>
    <div>
      <ButtonPrevWeek
        onClick={(event) => onPrevWeekClick(event)}
      />
      <ButtonThisWeek
        onClick={(event) => onThisWeekClick(event)}
      />
      <ButtonNextWeek
        onClick={(event) => onNextWeekClick(event)}
      />
    </div>
  </Row>
)

export default WeekSelect

