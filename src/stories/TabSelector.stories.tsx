import React, {useState} from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';

import TabSelector from '../components/Home/TabSelector';
import {USER_MODES} from '../pages/HomePage';

let selectedIndex = 0;

export default {
  title: 'misis-schedule/TabSelector',
  component: TabSelector,
  argTypes: {
    selectedIndex: {
      options: [0, 1],
      control: {type: 'radio'},
      defaultValue: 0,
    },
  },
} as ComponentMeta<typeof TabSelector>;


const Template: ComponentStory<typeof TabSelector> = (args, context) => (
  <TabSelector {...args} />
);

export const Default = Template.bind({});

Default.args = {
  tabs: USER_MODES,
};

