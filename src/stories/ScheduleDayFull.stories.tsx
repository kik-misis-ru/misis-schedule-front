import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';

import ScheduleDayFull from '../components/ScheduleDayFull';
import {getDayLessons} from "./consts";

export default {
  title: 'misis-schedule/ScheduleDayFull',
  component: ScheduleDayFull,
  argTypes: {
    isReady: {
      type: {name: 'boolean', required: false},
      defaultValue: true,
    },
    dayLessons: {
      defaultValue: getDayLessons(5),
    },
    currentLessonNumber: {
      type: {name: 'string', required: false},
      defaultValue: '2',
    },
    isCorrectTeacher: {
      type: {name: 'boolean', required: false},
      defaultValue: false,
    },
    isToday: {
      type: {name: 'boolean', required: false},
      defaultValue: true,
    },
    isSunday: {
      type: {name: 'boolean', required: false},
      defaultValue: false,
    },
  },
} as ComponentMeta<typeof ScheduleDayFull>;

const Template: ComponentStory<typeof ScheduleDayFull> = (args, context) => (
  <ScheduleDayFull {...args} />
);

export const GroupView = Template.bind({});
GroupView.args = {
  isReady: true,
  isCorrectTeacher: false,
};

export const TeacherView = Template.bind({});
TeacherView.args = {
  isReady: true,
  isCorrectTeacher: true,
};

export const NotReady = Template.bind({});
NotReady.args = {
  isReady: false,
};

