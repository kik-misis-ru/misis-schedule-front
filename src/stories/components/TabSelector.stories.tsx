import React, {useState} from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';

import TabSelectorRow from '../../components/Home/TabSelectorRow';
import {USER_MODES} from '../../pages/HomePage';

let selectedIndex = 0;

export default {
  title: 'components/TabSelector',
  component: TabSelectorRow,
  argTypes: {
    selectedIndex: {
      options: [0, 1],
      control: {type: 'radio'},
      defaultValue: 0,
    },
  },
} as ComponentMeta<typeof TabSelectorRow>;


const Template: ComponentStory<typeof TabSelectorRow> = (args, context) => (
  <TabSelectorRow {...args} />
);

export const Default = Template.bind({});

Default.args = {
  tabs: USER_MODES,
};

