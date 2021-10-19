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
  onPrevWeekClick: (event: React.MouseEventHandler<HTMLElement>) => void,
  onThisWeekClick: (event: React.MouseEventHandler<HTMLElement>) => void,
  onNextWeekClick: (event: React.MouseEventHandler<HTMLElement>) => void,
}) => (
  <Row style={{display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"}}>
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

