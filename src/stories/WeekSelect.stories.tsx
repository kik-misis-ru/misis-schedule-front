import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';

// import {DocStyle, getThemeBackgroundByChar} from "../themes/tools";

import WeekSelect from '../components/WeekSelect';

export default {
  title: 'Мой МИСиС/WeekSelect',
  component: WeekSelect,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  // argTypes: {
  //   character: {
  //     control: {
  //       type: "select",
  //       options: [CHAR_SBER, CHAR_EVA, CHAR_JOY],
  //     },
  //     table: {
  //       category: ['Theme']
  //     }
  //   }
  // },
} as ComponentMeta<typeof WeekSelect>;

const Template: ComponentStory<typeof WeekSelect> = (args, context) => (
  <React.Fragment>
    {
      // getThemeBackgroundByChar(context.globals.character)
    }
    <WeekSelect {...args} />
  </React.Fragment>
);

export const Primary = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Primary.args = {
  onPrevWeekClick: () => console.log('onPrevWeekClick'),
  onThisWeekClick: () => console.log('onThisWeekClick'),
  onNextWeekClick: () => console.log('onNextWeekClick'),
};

