import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';

import ScheduleDayLessons from '../../components/ScheduleDayLessons';
import {getDayLessons} from "../consts";

console.log('getDayLessons(5):', getDayLessons(5))

export default {
  title: 'components/ScheduleDayLessons',
  component: ScheduleDayLessons,
  argTypes: {
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
  },
} as ComponentMeta<typeof ScheduleDayLessons>;

const Template: ComponentStory<typeof ScheduleDayLessons> = (args, context) => (
  <ScheduleDayLessons {...args} />
);

export const Default = Template.bind({});

Default.args = {
};

