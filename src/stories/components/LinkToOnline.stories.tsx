import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import {lesson} from '../consts';
import LinkToOnline from '../../components/LinkToOnline';

export default {
  title: 'components/LinkToOnline',
  component: LinkToOnline,
  argTypes: {
    url: {
      type: {name: 'string', required: true},
      defaultValue: lesson.url,
    },
    text: {
        type: {name: 'string', required: true},
        defaultValue: 'Ссылка на онлайн конференцию',
      },
  },
} as ComponentMeta<typeof LinkToOnline>;

const Template: ComponentStory<typeof LinkToOnline> = (args, context) => (
  <LinkToOnline {...args} />
);

