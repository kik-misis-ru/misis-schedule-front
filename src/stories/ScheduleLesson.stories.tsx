import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';

import ScheduleLesson from '../components/ScheduleLesson';
import {lesson} from "./consts";

export default {
  title: 'misis-schedule/ScheduleLesson',
  component: ScheduleLesson,
  argTypes: {
    isCurrentLesson: {
      type: {name: 'boolean', required: false},
      defaultValue: false,
    },
    isTeacherAndValid: {
      type: {name: 'boolean', required: false},
      defaultValue: false,
    },
    startTime: {
      type: {name: 'string', required: false},
      defaultValue: '10:00',
    },
    endTime: {
      type: {name: 'string', required: false},
      defaultValue: '11:30',
    },
    bell: {
      defaultValue: lesson
    }
  },
} as ComponentMeta<typeof ScheduleLesson>;

const Template: ComponentStory<typeof ScheduleLesson> = (args, context) => (
  <ScheduleLesson {...args} />
);

export const Default = Template.bind({});

Default.args = {
};

