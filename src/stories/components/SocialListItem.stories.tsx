import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import {SocialListItem} from '../../components/SocialList';
import data from '../../data/social_media.json'

export default {
  title: 'components/SocialListItem',
  component: SocialListItem,
  argTypes: {
    link: {
      type: {name: 'string', required: true},
      defaultValue: data[0].link,
    },
    name: {
        type: {name: 'string', required: true},
        defaultValue: data[0].name,
      },
    logo: {
    type: {name: 'string', required: true},
    defaultValue: data[0].logo
    }
  },
} as ComponentMeta<typeof SocialListItem>;

const Template: ComponentStory<typeof SocialListItem> = (args, context) => (
  <SocialListItem {...args} />
);

export const Default = Template.bind({});


