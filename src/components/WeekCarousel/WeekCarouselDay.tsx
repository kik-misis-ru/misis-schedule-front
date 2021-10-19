import React from "react";
import {Button} from '@sberdevices/plasma-ui';
import 'react-toastify/dist/ReactToastify.css';
import {
  CarouselCol
} from "@sberdevices/plasma-ui";
// import moment from 'moment';
// import 'moment/locale/ru';

import "../../App.css";

interface WeekCarouselDayProps {
  // date: Date
  text: string
  isSelected: boolean
  isToday: boolean
  // format?: string
  onClick: (event: React.MouseEventHandler<HTMLElement>) => void
}

// const DEFAULT_FMT = 'dd DD.MM';

export const WeekCarouselDay = ({
                                  // date,
                                  text,
                                  isSelected,
                                  isToday,
                                  // format=DEFAULT_FMT,
                                  onClick,
                                }: WeekCarouselDayProps) => {
  // moment.locale('ru');
  return (
    <CarouselCol>
      <Button
        view={isSelected ? "secondary" : "clear"}
        style={{
          margin: "0.5em",
          color: isToday
            ? "var(--plasma-colors-accent)"
            : ""
        }}
        size="s"
        focused={isSelected}
        pin="circle-circle"
        text={ text }
        // text={ text + moment(date).format(format)}
        onClick={(event) => onClick(event)}
      />
    </CarouselCol>
  )
}

export default WeekCarouselDay
