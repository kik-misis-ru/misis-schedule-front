import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';

import SpinnerPage from '../components/SpinnerPage';

export default {
  title: 'misis-schedule/SpinnerPage',
  component: SpinnerPage,
  argTypes: {
  },
} as ComponentMeta<typeof SpinnerPage>;

const Template: ComponentStory<typeof SpinnerPage> = (args, context) => (
  <SpinnerPage {...args} />
);

export const Default = Template.bind({});

Default.args = {
};

