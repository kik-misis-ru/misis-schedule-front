import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import moment from 'moment';
import 'moment/locale/ru';

import WeekCarousel from '../components/WeekCarousel';
import {MS_IN_DAY, capitalize, strToDate} from "../utils";

moment.locale('ru');

const dateToStr = (date: Date): string => moment(date).format('DD.MM');

const START_DATE = '18.10.2021';

const strDatePlus = (date: string, days: number): string => dateToStr(
  dateAddDays(date, days)
);

const dateAddDays = (date: string, days: number): Date => new Date(
  strToDate(date).getTime() + days * MS_IN_DAY
);

const capitalizedWeekDayStrShortRu = (d: Date): string => {
  return capitalize(
    moment(d).format('dd')
  );
}

const fakeWeekDays = (startDate: string): string[] => new Array(7)
  .fill({})
  .map((a, i) => {
    const d = dateAddDays(startDate, i);
    return `${capitalizedWeekDayStrShortRu(d)} ${dateToStr(d)}`
  });

export default {
  title: 'misis-schedule/WeekCarousel',
  component: WeekCarousel,
  argTypes: {
    carouselIndex: {
      type: {name: 'number', required: false},
      defaultValue: 1,
    },
    selectedIndex: {
      type: {name: 'number', required: false},
      defaultValue: 1,
    },
    markedIndex: {
      type: {name: 'number', required: false},
      defaultValue: 2,
    },
  },
} as ComponentMeta<typeof WeekCarousel>;

const Template: ComponentStory<typeof WeekCarousel> = (args) => <WeekCarousel {...args} />;

export const Default = Template.bind({});

Default.args = {
  cols: fakeWeekDays(START_DATE),
};
