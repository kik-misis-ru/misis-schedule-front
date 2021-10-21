import React from "react";
import {Carousel, CarouselGridWrapper, Row} from "@sberdevices/plasma-ui";
import {THIS_OR_OTHER_WEEK, THIS_WEEK, OTHER_WEEK,IDayHeader} from "../../types/base.d";

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
}) => (
  <Row style={{
    margin: "0.5em", marginRight: "0",
    overflow: "hidden"
  }}>
    <CarouselGridWrapper>
      <Carousel
        as={Row}
        axis="x"
        scrollAlign="center"
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
            // const {title, date} = dayHeader;
            // const weekDayShort = title;
            // const dateDdDotMm = date.slice(0, 5);
            // // const selectedWeekDay = index-1;
            // // const todayWeekDay = today-1;

            return (
              <WeekCarouselDay
                key={i}
                text={text}
                // date={new Date(date[weekParam])}
                // isSelected={i + 1 === index}
                isSelected={i === selectedIndex}
                // isToday={(today === i + 1) && (weekParam === 0)}
                isMarked={(i === markedIndex) /*&& (weekParam === THIS_WEEK)*/}
                onClick={() => onSelect(i)}
              />
            )
          })
        }
      </Carousel>
    </CarouselGridWrapper>
  </Row>
)

export default WeekCarousel;
