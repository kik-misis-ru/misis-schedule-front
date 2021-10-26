import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';

import ScheduleDayFull from '../../components/ScheduleDayFull';
import {getDayLessons} from "../consts";

export default {
  title: 'components/ScheduleDayFull',
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
    isTeacherAndValid: {
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
  isTeacherAndValid: false,
};

export const TeacherView = Template.bind({});
TeacherView.args = {
  isReady: true,
  isTeacherAndValid: true,
};

export const Sunday = Template.bind({});
Sunday.args = {
  isReady: true,
  isSunday: true,
};

export const NotReady = Template.bind({});
NotReady.args = {
  isReady: false,
};

