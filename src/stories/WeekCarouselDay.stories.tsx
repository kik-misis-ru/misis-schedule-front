import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import {WeekCarouselDay} from "../components/WeekCarousel";

export default {
  title: 'misis-schedule/WeekCarouselDay',
  component: WeekCarouselDay,
  argTypes: {
    text: {
      type: { name: 'string', required: false },
      defaultValue: 'Пн 31.12',
    },
    isSelected: {
      type: { name: 'boolean', required: false },
      defaultValue: false,
    },
    isMarked: {
      type: { name: 'boolean', required: false },
      defaultValue: false,
    },
  },
} as ComponentMeta<typeof WeekCarouselDay>;

const Template: ComponentStory<typeof WeekCarouselDay> = (args) => <WeekCarouselDay {...args} />;


export const Default = Template.bind({});

Default.args = {
};


// export const NotSelectedNotMarked = Template.bind({});
//
// NotSelectedNotMarked.args = {
//   isSelected: false,
//   isMarked: false,
// };
//
//
// export const NotSelectedMarked = Template.bind({});
//
// NotSelectedMarked.args = {
//   isSelected: false,
//   isMarked: true,
// };
//
//
// export const SelecteNotMarked = Template.bind({});
//
// SelecteNotMarked.args = {
//   isSelected: true,
//   isMarked: false,
// };
//
//
// export const SelecteMarked = Template.bind({});
//
// SelecteMarked.args = {
//   isSelected: true,
//   isMarked: true,
// };

