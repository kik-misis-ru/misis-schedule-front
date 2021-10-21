import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';

import WeekSelect from '../components/WeekSelect';

export default {
  title: 'misis-schedule/WeekSelect',
  component: WeekSelect,
  argTypes: {
  },
} as ComponentMeta<typeof WeekSelect>;

const Template: ComponentStory<typeof WeekSelect> = (args, context) => (
    <WeekSelect {...args} />
);

export const Default = Template.bind({});

Default.args = {
};

