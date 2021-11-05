import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';

import FAQ from '../../pages/FAQ';

export default {
  title: 'Pages/FAQ',
  component: FAQ,
  argTypes: {
    character: {
        type: {name: 'string', required: true},
        defaultValue: "сбер",
    }
}
} as ComponentMeta<typeof FAQ>;

const Template: ComponentStory<typeof FAQ> = (args, context) => (
  <FAQ {...args} />
);

export const Default = Template.bind({});
Default.args = {
  // buildings,
  // character
};

