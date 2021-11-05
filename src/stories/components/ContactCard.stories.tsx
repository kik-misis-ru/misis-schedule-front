import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import {lesson} from '../consts';
import {ContactsCard} from '../../components/ContactsCard';

export default {
  title: 'components/ContactsCard',
  component: ContactsCard,
  argTypes: {
    url: {
      type: {name: 'string', required: true},
      defaultValue: 'https://misis.ru',
    },
    text: {
        type: {name: 'string', required: true},
        defaultValue: 'Официальный сайт',
      },
    tel: {
    type: {name: 'string', required: true},
    defaultValue: '7-(999)-123-45-67',
    },
    mail: {
    type: {name: 'string', required: true},
    defaultValue: 'misis@edu.misis.ru',
    }
  },
} as ComponentMeta<typeof ContactsCard>;

const Template: ComponentStory<typeof ContactsCard> = (args, context) => (
  <ContactsCard {...args} />
);

export const Default = Template.bind({});


