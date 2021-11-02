import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import {lesson} from '../consts';
import {SocialList} from '../../components/SocialList';
import vk from '../../images/vk.png'

export default {
  title: 'components/SocialList',
  component: SocialList,

} as ComponentMeta<typeof SocialList>;

const Template: ComponentStory<typeof SocialList> = (args, context) => (
  <SocialList {...args} />
);

export const Default = Template.bind({});


