import {background, gradient, text} from "@sberdevices/plasma-tokens";
import React from "react";
import styled, {createGlobalStyle} from "styled-components";
import {darkEva, darkJoy, darkSber, lightEva, lightJoy, lightSber} from "@sberdevices/plasma-tokens/themes";

import {
  CHAR_EVA, CHAR_JOY, CHAR_SBER, CharacterId,
  THEME_DARK,
  THEME_LIGHT,
  ThemeType,
} from "../types/base.d";

const ThemeBackgroundSber = createGlobalStyle(darkSber);
const ThemeBackgroundEva = createGlobalStyle(darkEva);
const ThemeBackgroundJoy = createGlobalStyle(darkJoy);
const ThemeBackgroundSberLight = createGlobalStyle(lightSber);
const ThemeBackgroundEvaLight = createGlobalStyle(lightEva);
const ThemeBackgroundJoyLight = createGlobalStyle(lightJoy);


export interface IThemingProps {
  character: CharacterId
  theme: string
}


export const getThemeBackgroundByChar = (
  character: CharacterId,
  themeType: ThemeType,
) => {
  const themeBackgroundByChar = {
    [CHAR_SBER + '_' + THEME_DARK]: <ThemeBackgroundSber/>,
    [CHAR_EVA + '_' + THEME_DARK]: <ThemeBackgroundEva/>,
    [CHAR_JOY + '_' + THEME_DARK]: <ThemeBackgroundJoy/>,
    [CHAR_SBER + '_' + THEME_LIGHT]: <ThemeBackgroundSberLight/>,
    [CHAR_EVA + '_' + THEME_LIGHT]: <ThemeBackgroundEvaLight/>,
    [CHAR_JOY + '_' + THEME_LIGHT]: <ThemeBackgroundJoyLight/>,
  }
  const themeName = character + '_' + themeType;
  const themeBackground = themeBackgroundByChar[themeName];
  return themeBackground || null;
}


export const DocStyle = createGlobalStyle`
  html:root {
    min-height: 100vh;
    color: ${text};
    background-color: ${background};
    background-image: ${gradient};
  }
`;

