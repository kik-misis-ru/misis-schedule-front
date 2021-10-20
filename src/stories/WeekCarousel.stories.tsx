import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
// import moment from 'moment';
import moment from 'moment';
import 'moment/locale/ru';

import WeekCarousel from '../components/WeekCarousel';
import {MS_IN_DAY, capitalize} from "../utils";

moment.locale('ru');
console.log('moment.weekdays():', moment.weekdaysShort());

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Мой МИСиС/WeekCarousel',
  component: WeekCarousel,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    // backgroundColor: { control: 'color' },
    carouselIndex: {
      type: {name: 'number', required: false},
      defaultValue: 1,
    },
    selectedWeekDayIndex: {
      type: {name: 'number', required: false},
      defaultValue: 1,
    },
    todayWeekDayIndex: {
      type: {name: 'number', required: false},
      defaultValue: 2,
    },
    // page: {
    //   type: {name: 'number', required: false},
    //   defaultValue: 0,
    // },
    // weekParam: {
    //   type: {name: 'number', required: false},
    //   defaultValue: 0,
    // },
  },
} as ComponentMeta<typeof WeekCarousel>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof WeekCarousel> = (args) => <WeekCarousel {...args} />;

export const Primary = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args

// const startDt = '31.01.2020';

const strToDate = (s: string): Date => {
  const d = parseInt(s.slice(0, 2));
  const m = parseInt(s.slice(3, 5))-1;
  const y = parseInt(s.slice(-4));
  return new Date(y, m, d);
}

const dateToStr = (date: Date): string => moment(date).format('DD.MM.YYYY');

const startDate = '18.10.2021';

const strDatePlus = (date: string, days: number) => dateToStr(
  dateAddDays(date, days)
);

const dateAddDays = (date: string, days: number) => new Date(
  strToDate(date).getTime() + days * MS_IN_DAY
);

const capitalizedWeekDayStrShortRu = (d: Date) => {
  return capitalize(
    moment(d).format('dd')
  );
}

Primary.args = {
  weekDays: new Array(7)
    .fill({})
    .map((a, i) => {
      const d = dateAddDays(startDate, i);
      return {
        title: capitalizedWeekDayStrShortRu(d),
        date: dateToStr(d),
      }
    }),
  onIndexChange: (index) => console.log('onIndexChange: index:', index),
  onDayClick: (weekDayIndex) => console.log(`onDayClick: weekDayIndex:`, weekDayIndex),
};
