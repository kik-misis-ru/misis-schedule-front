import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import {WeekCarouselDay} from "../components/WeekCarousel";

export default {
  title: 'Мой МИСиС/WeekCarouselDay',
  component: WeekCarouselDay,
  argTypes: {
    // backgroundColor: { control: 'color' },
    text: {
      type: { name: 'string', required: false },
      defaultValue: 'Пн 31.12',
    },
    isSelected: {
      type: { name: 'boolean', required: false },
      defaultValue: false,
    },
    isToday: {
      type: { name: 'boolean', required: false },
      defaultValue: false,
    },
  },
} as ComponentMeta<typeof WeekCarouselDay>;

const Template: ComponentStory<typeof WeekCarouselDay> = (args) => <WeekCarouselDay {...args} />;

export const Default = Template.bind({});
Default.args = {
  // isSelected: true,
  // isToday: true,
};

// export const SelectedNotToday = Template.bind({});
// SelectedNotToday.args = {
//   isSelected: true,
//   isToday: false,
// };
//
// export const SelectedNotToday = Template.bind({});
// SelectedNotToday.args = {
//   isSelected: true,
//   isToday: false,
// };
