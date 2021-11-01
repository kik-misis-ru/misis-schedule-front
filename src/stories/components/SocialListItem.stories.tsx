import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import {SocialListItem} from '../../components/SocialList';
import vk from '../../images/vk.png'

export default {
  title: 'components/SocialListItem',
  component: SocialListItem,
  argTypes: {
    link: {
      type: {name: 'string', required: true},
      defaultValue: 'https://vk.com',
    },
    name: {
        type: {name: 'string', required: true},
        defaultValue: 'ВКонтакте',
      },
    logo: {
    type: {name: 'string', required: true},
    defaultValue: vk
    }
  },
} as ComponentMeta<typeof SocialListItem>;

const Template: ComponentStory<typeof SocialListItem> = (args, context) => (
  <SocialListItem {...args} />
);

export const Default = Template.bind({});


