import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';

import ScheduleLesson from '../../components/ScheduleLesson';
import {lesson} from "../consts";

export default {
  title: 'components/ScheduleLesson',
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
    startEndTime: {
      // type: {name: 'string', required: false},
      defaultValue: {
        start: '10:00',
        end: '11:00',
      },
    },
    lesson: {
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

