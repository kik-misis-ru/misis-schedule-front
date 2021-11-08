import React from 'react';
import {DeviceThemeProvider} from '@sberdevices/plasma-ui';
import {DocStyle, getThemeBackgroundByChar} from "../src/themes/tools";
import {
  CHAR_SBER,
  CHAR_EVA,
  CHAR_JOY,
  THEME_DARK,
  THEME_LIGHT,
} from '../src/types/base.d'

import '../src/themes/App.css'


export const parameters = {
  actions:  {
    argTypesRegex: "^on[A-Z].*",
  },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date:  /Date$/,
    },
  },
}


export const decorators = [
  (Story, context) => (
    <DeviceThemeProvider>
      <DocStyle/>
      {
        getThemeBackgroundByChar(context.globals.character, context.globals.themeType)
      }
      <Story/>
    </DeviceThemeProvider>
  ),
];


export const globalTypes = {
  character: {
    name:         'Персонаж',
    description:  'Персонаж смартаппа',
    defaultValue: CHAR_SBER,
    toolbar:      {
      icon: 'facehappy',
      // Array of plain string values or MenuItem shape (see below)
      items: [
        CHAR_SBER,
        CHAR_EVA,
        CHAR_JOY,
      ],
      // Property that specifies if the name of the item will be displayed
      showName: true,
    },
  },
  themeType: {
    name:         'Тип темы',
    description:  'Тип темы (светлая/темная)',
    defaultValue: 'dark',
    toolbar:      {
      icon: 'mirror',
      // Array of plain string values or MenuItem shape (see below)
      items: [
        'dark',
        'light',
      ],
      // Property that specifies if the name of the item will be displayed
      showName: true,
    },
  },
};
