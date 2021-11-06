import {background, gradient, text} from "@sberdevices/plasma-tokens";
import React from "react";
import styled, {createGlobalStyle} from "styled-components";
import {darkEva, darkJoy, darkSber, lightEva, lightJoy, lightSber} from "@sberdevices/plasma-tokens/themes";

import {CHAR_EVA, CHAR_JOY, CHAR_SBER, CHAR_TIMEPARAMOY, Character} from "../types/base.d";

const ThemeBackgroundSber = createGlobalStyle(darkSber);
const ThemeBackgroundEva = createGlobalStyle(darkEva);
const ThemeBackgroundJoy = createGlobalStyle(darkJoy);
const ThemeBackgroundSberLight = createGlobalStyle(lightSber);
const ThemeBackgroundEvaLight = createGlobalStyle(lightEva);
const ThemeBackgroundJoyLight = createGlobalStyle(lightJoy);

export const getThemeBackgroundByChar = (character: Character
  // todo: что такое 'timeParamoy' ???
  | typeof CHAR_TIMEPARAMOY | string
) => {
  const themeBackgroundByChar = {
    "sber_dark": <ThemeBackgroundSber/>,
    "eva_dark": <ThemeBackgroundEva/>,
    "joy_dark": <ThemeBackgroundJoy/>,
    "sber_light": <ThemeBackgroundSberLight/>,
    "eva_light": <ThemeBackgroundEvaLight/>,
    "joy_light": <ThemeBackgroundJoyLight/>,
  }
  const themeBackground = themeBackgroundByChar[character];
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

