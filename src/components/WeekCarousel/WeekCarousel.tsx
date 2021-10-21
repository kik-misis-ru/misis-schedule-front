import React from "react";
import {Carousel, CarouselGridWrapper, Row} from "@sberdevices/plasma-ui";

import WeekCarouselDay from "./WeekCarouselDay";

export const WeekCarousel = ({
                               carouselIndex,
                               selectedIndex,
                               markedIndex,
                               cols,
                               onIndexChange,
                               onSelect,
                             }: {
  carouselIndex: number
  selectedIndex: number
  markedIndex: number
  cols: string[]
  onIndexChange: (index: number) => void
  onSelect: (weekDayIndex: number) => void
}) => {
  return (
    <Row style={{
      margin: "0.5em", marginRight: "0",
      overflow: "hidden"
    }}>
      <CarouselGridWrapper>
        <Carousel
          as={Row}
          axis="x"
          index={carouselIndex}
          scrollSnapType="mandatory"
          animatedScrollByIndex={true}
          detectActive={true}
          detectThreshold={0.5}
          onIndexChange={(index: number) => onIndexChange(index)}
          paddingStart="0%"
          paddingEnd="40%"
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
