import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';

import Contacts from '../../pages/Contacts';

export default {
  title: 'Pages/Contacts',
  component: Contacts,
  argTypes: {
    character: {
        type: {name: 'string', required: true},
        defaultValue: "сбер",
    }
}
} as ComponentMeta<typeof Contacts>;

const Template: ComponentStory<typeof Contacts> = (args, context) => (
  <Contacts {...args} />
);

export const Default = Template.bind({});
Default.args = {
  // buildings,
  // character
};

