import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';

import TopMenu from '../../components/TopMenu';

export default {
  title: 'components/TopMenu',
  component: TopMenu,
  argTypes: {
    label: {
      type: {name: 'string', required: false},
      defaultValue: undefined,
    },
    subLabel: {
      type: {name: 'string', required: false},
      defaultValue: 'БПМ-19-2 (1)',
    },
    starred: {
      type: {name: 'boolean', required: false},
      defaultValue: false,
    },
  },
} as ComponentMeta<typeof TopMenu>;

const Template: ComponentStory<typeof TopMenu> = (args, context) => (
    <TopMenu {...args} />
);

export const Default = Template.bind({});

Default.args = {
};

