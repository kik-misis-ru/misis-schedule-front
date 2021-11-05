import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';

import HomePage from '../../pages/HomePage';

import {lesson} from "../consts";
import { type } from 'os';

export default {
  title: 'Pages/HomePage',
  component: HomePage,
  argTypes: {
    groupId: {
      type: {name: 'string', required: true},
      defaultValue: "БПМ-19-2",
    },
    character: {
        type: {name: 'string', required: true},
        defaultValue: "сбер",
    },
    checked: {
        type: {name: 'boolean', required: true},
        defaultValue: true,
      },
    description: {
        type: {name: 'string', required: true},
        defaultValue: 'Чтобы посмотреть расписание, укажите данные учебной группы',
      }
    }

} as ComponentMeta<typeof HomePage>;

const Template: ComponentStory<typeof HomePage> = (args, context) => (
  <HomePage {...args} />
);

export const Default = Template.bind({});
Default.args = {
  // buildings,
  // character
};
