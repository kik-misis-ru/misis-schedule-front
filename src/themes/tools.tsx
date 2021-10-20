import {background, gradient, text} from "@sberdevices/plasma-tokens";
import React from "react";
import styled, {createGlobalStyle} from "styled-components";
import {darkEva, darkJoy, darkSber} from "@sberdevices/plasma-tokens/themes";

import {CHAR_EVA, CHAR_JOY, CHAR_SBER, CHAR_TIMEPARAMOY, Character} from "../types/base.d";

const ThemeBackgroundSber = createGlobalStyle(darkSber);
const ThemeBackgroundEva = createGlobalStyle(darkEva);
const ThemeBackgroundJoy = createGlobalStyle(darkJoy);

export const getThemeBackgroundByChar = (character: Character
  // todo: что такое 'timeParamoy' ???
  | typeof CHAR_TIMEPARAMOY
) => {
  const themeBackgroundByChar = {
    [CHAR_SBER]: <ThemeBackgroundSber/>,
    [CHAR_EVA]: <ThemeBackgroundEva/>,
    [CHAR_JOY]: <ThemeBackgroundJoy/>,
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

