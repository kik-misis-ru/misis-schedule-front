import React from "react";
import {Carousel, CarouselGridWrapper, Row} from "@sberdevices/plasma-ui";

import DaysCarousel from "./DaysCarousel";
import {IDayHeader} from "../App";

export const ScheduleCarousel = ({
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
  weekParam: number
  today: number
}) => (
  <Row style={{margin: "0.5em", marginRight: "0", overflow: "hidden"}}>
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
            return (
              <DaysCarousel
                ViewType={i + 1 === index}
                text={`${title} ${date[weekParam].slice(0, 5)}`}
                isCurrent={(today === i + 1) && (weekParam === 0)}
                setValue={onSetValue}
                page={i + 1 + page}
                i={i}
              />
            )
          })
        }
      </Carousel>
    </CarouselGridWrapper>
  </Row>
)

export default ScheduleCarousel;
