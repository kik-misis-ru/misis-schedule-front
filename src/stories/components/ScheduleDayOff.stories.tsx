import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';

import ScheduleDayOff from '../../components/ScheduleDayOff';

export default {
  title: 'components/ScheduleDayOff',
  component: ScheduleDayOff,
  argTypes: {
  },
} as ComponentMeta<typeof ScheduleDayOff>;

const Template: ComponentStory<typeof ScheduleDayOff> = (args, context) => (
  <ScheduleDayOff/>
);

export const Default = Template.bind({});

