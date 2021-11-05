import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import {FAQCard} from '../../components/FAQCard';
import faq from '../../data/faq.json';

export default {
  title: 'components/FAQCard',
  component: FAQCard,
  argTypes: {
    questions: {
      type: {name: 'string', required: true},
      defaultValue: faq[0].questions,
    },
    text: {
        type: {name: 'string', required: true},
        defaultValue: faq[0].text,
      },
    answer: {
    type: {name: 'string', required: true},
    defaultValue: faq[0],
    }
  },
} as ComponentMeta<typeof FAQCard>;

const Template: ComponentStory<typeof FAQCard> = (args, context) => (
  <FAQCard {...args} />
);

export const Default = Template.bind({});


