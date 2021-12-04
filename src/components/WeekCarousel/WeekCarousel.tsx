import React from "react";
import {Carousel, CarouselGridWrapper, Row} from "@sberdevices/plasma-ui";

import WeekCarouselDay from "./WeekCarouselDay";

export const WeekCarousel = ({
                               selectedIndex,
                               markedIndex,
                               cols,
                               onSelect,
                             }: {
  selectedIndex: number
  markedIndex: number
  cols: string[]
  onSelect: (weekDayIndex: number) => void
}) => {
  const [index, setIndex] = React.useState(selectedIndex);
  return (
    <Row style={{
      marginRight: "0",
      overflow: "hidden"
    }}>
      <CarouselGridWrapper style={{
      marginRight: "0",
      overflow: "hidden"
    }}>
        <Carousel
          as={Row}
          axis="x"
          scrollSnapType="mandatory"
          index={index}
          detectActive
          detectThreshold={0.5}
          onIndexChange={(i) => setIndex(i)}
          paddingStart="5%"
          paddingEnd="5%"
        >
          {
            cols.map((text, i) => {
              return (
                <WeekCarouselDay
                  key={i}
                  text={text}
                  isSelected={i === selectedIndex}
                  isMarked={(i === markedIndex)}
                  onClick={() => onSelect(i)}
                />
              )
            })
          }
        </Carousel>
      </CarouselGridWrapper>
    </Row>
  )
}

export default WeekCarousel;
