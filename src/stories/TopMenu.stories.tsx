import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';

import TopMenu from '../components/TopMenu';

export default {
  title: 'misis-schedule/TopMenu',
  component: TopMenu,
  argTypes: {
  },
} as ComponentMeta<typeof TopMenu>;

const Template: ComponentStory<typeof TopMenu> = (args, context) => (
    <TopMenu {...args} />
);

export const Default = Template.bind({});

Default.args = {
};

