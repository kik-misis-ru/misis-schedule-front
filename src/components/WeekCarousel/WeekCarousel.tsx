import React from "react";
import {Carousel, CarouselGridWrapper, Row} from "@sberdevices/plasma-ui";
import {THIS_OR_OTHER_WEEK, THIS_WEEK, OTHER_WEEK} from "../../types/base.d";

import WeekCarouselDay from "./WeekCarouselDay";
import {IDayHeader} from "../../App";

export const WeekCarousel = ({
                               i,
                               index,
                               onIndexChange,
                               onSetValue,
                               day,
                               page,
                               weekParam,
                               today,
                             }: {
  i: number
  index: number
  onIndexChange: () => void
  onSetValue: (key: string, value: any) => void
  day: IDayHeader[]
  page: number
  weekParam: THIS_OR_OTHER_WEEK
  today: number
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
        index={i}
        scrollSnapType="mandatory"
        animatedScrollByIndex={true}
        detectActive={true}
        detectThreshold={0.5}
        onIndexChange={() => onIndexChange()}
        paddingStart="0%"
        paddingEnd="40%"
      >
        {
          day.map((dayHeader, i) => {
            const {title, date} = dayHeader;
            const weekDayShort = title;
            const dateDdDotMm = date[weekParam].slice(0, 5);
            const selectedWeekDayIndex = index-1;
            const todayWeekDayIndex = today-1;
            return (
              <WeekCarouselDay
                key={i}
                text={`${weekDayShort} ${dateDdDotMm}`}
                // date={new Date(date[weekParam])}
                // isSelected={i + 1 === index}
                isSelected={i === selectedWeekDayIndex}
                // isToday={(today === i + 1) && (weekParam === 0)}
                isToday={(i === todayWeekDayIndex) && (weekParam === THIS_WEEK)}
                onClick={() => {onSetValue("page", (i + page + (weekParam==OTHER_WEEK ? 0: 1)))}}
              />
            )
          })
        }
      </Carousel>
    </CarouselGridWrapper>
  </Row>
)

export default WeekCarousel;
