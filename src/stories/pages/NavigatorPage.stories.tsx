import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';

import NavigatorPage from '../../pages/NavigatorPage';

import buildings from '../../data/buldings.json'

export default {
  title: 'Pages/NavigatorPage',
  component: NavigatorPage,
  argTypes: {
  },
} as ComponentMeta<typeof NavigatorPage>;

const Template: ComponentStory<typeof NavigatorPage> = (args, context) => (
  <NavigatorPage {...args} />
);

export const Default = Template.bind({});

Default.args = {
  buildings,
  // character
};

