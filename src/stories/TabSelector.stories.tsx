import React, {useState} from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';

import TabSelector from '../components/Home/TabSelector';
import {USER_MODES} from '../components/HomeView';

let selectedIndex = 0;

export default {
  title: 'misis-schedule/TabSelector',
  component: TabSelector,
  argTypes: {
/*
    selectedIndex: {
      type: {name: 'number', required: false},
      defaultValue: 1,
    },
*/
  },
} as ComponentMeta<typeof TabSelector>;


const Template: ComponentStory<typeof TabSelector> = (args, context) => {
  const {onSelect, selectedIndex: selectedIndex_, ...rest} = args;
  const [selectedIndex,setSelectedIndex] = useState(0);
  return (
    <TabSelector
      onSelect={(idx) => {
        setSelectedIndex(idx);
      }}
      selectedIndex={selectedIndex}
      {...rest}
    />
  )
};

export const Default = Template.bind({});

Default.args = {
  tabs: USER_MODES,
};

