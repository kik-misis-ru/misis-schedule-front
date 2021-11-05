import React from 'react';
import {DeviceThemeProvider} from '@sberdevices/plasma-ui';
import {DocStyle, getThemeBackgroundByChar} from "../src/themes/tools";
import {
  CHAR_SBER,
  CHAR_EVA,
  CHAR_JOY,
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
        getThemeBackgroundByChar(context.globals.character)
      }
      <Story/>
    </DeviceThemeProvider>
  ),
];


export const globalTypes = {
  character: {
    name: 'Персонаж',
    description: 'Персонаж смартаппа',
    defaultValue: CHAR_SBER,
    toolbar: {
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
};
