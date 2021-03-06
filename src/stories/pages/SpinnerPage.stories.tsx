import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';

import SpinnerPage from '../../pages/SpinnerPage';

export default {
  title: 'Pages/SpinnerPage',
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

