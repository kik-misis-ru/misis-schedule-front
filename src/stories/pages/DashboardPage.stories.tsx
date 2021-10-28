import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';

import DashboardPage from '../../pages/DashboardPage';

import {lesson} from "../consts";

export default {
  title: 'Pages/DashboardPage',
  component: DashboardPage,
  argTypes: {
    isTeacherAndValid: {
      type: {name: 'boolean', required: false},
      defaultValue: false,
    },
    todaySummary: {
      defaultValue: {
        date: new Date(),
        lessonCount: 5,
        startEnd: {
          start: '10:00',
          end: '11:00',
        },
      }
    },
    currentLesson: {
      defaultValue: lesson,
    },
    currentLessonStartEnd: {
      defaultValue: {
        start: '10:00',
        end: '11:00',
      }
    },
    nextLesson: {
      defaultValue: lesson,
    },
    nextLessonStartEnd: {
      defaultValue: {
        start: '11:00',
        end: '12:00',
      }
    },
  },
} as ComponentMeta<typeof DashboardPage>;

const Template: ComponentStory<typeof DashboardPage> = (args, context) => (
  <DashboardPage {...args} />
);

export const Default = Template.bind({});
Default.args = {
  // buildings,
  // character
};

export const NoCurrentLesson = Template.bind({});
NoCurrentLesson.args = {
  currentLesson: undefined,
  currentLessonStartEnd: undefined,
};

export const NoNextLesson = Template.bind({});
NoNextLesson.args = {
  nextLesson: undefined,
  nextLessonStartEnd: undefined,
};

export const NoBothLessons = Template.bind({});
NoBothLessons.args = {
  currentLesson: undefined,
  currentLessonStartEnd: undefined,
  nextLesson: undefined,
  nextLessonStartEnd: undefined,
};

