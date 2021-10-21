import React from "react";
import {Button} from '@sberdevices/plasma-ui';
import 'react-toastify/dist/ReactToastify.css';
import {
  CarouselCol
} from "@sberdevices/plasma-ui";


export const WeekCarouselDay = ({
                                  text,
                                  isSelected,
                                  isMarked,
                                  onClick,
                                }: {
  // date: Date
  text: string
  isSelected: boolean
  isMarked: boolean
  // format?: string
  onClick: (event: React.MouseEventHandler<HTMLElement>) => void
}) => {
  return (
    <CarouselCol>
      <Button
        view={isSelected ? "secondary" : "clear"}
        style={{
          margin: "0.5em",
          color: isMarked
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
