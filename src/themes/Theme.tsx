import React, { useState, useEffect } from "react";
import {DeviceThemeProvider} from "@sberdevices/plasma-ui";
import {AssistantWrapper} from "../lib/AssistantWrapper";
import {AssistantCharacter} from "../types/AssistantReceiveAction";
import {CharacterId, ThemeType} from "../types/base";

import {DocStyle, getThemeBackgroundByChar} from "./tools";


export const Theme = ({
                        // assistant,
                        character,
                        theme,
                        children,
                      }: {
  // assistant: AssistantWrapper
  character: CharacterId,
  theme: ThemeType,
  children: JSX.Element[] | JSX.Element,
}) => {

  // const [characterId, setCharacterId] = useState<AssistantCharacter|undefined>(undefined);
  //
  // const handleAssistantCharacter = (character: AssistantCharacter) => {
  //   setCharacterId(character.id);
  // }
  //
  // useEffect(() => {
  //   assistant.on('event-character', handleAssistantCharacter)
  //
  //   return function cleanup() {
  //     assistant.removeListener('event-character', handleAssistantCharacter);
  //   };
  //
  // });

  return (
    <DeviceThemeProvider>
      <DocStyle/>
      {
        getThemeBackgroundByChar(character, theme)
      }
      {
        children
      }
    </DeviceThemeProvider>
  )
}


export default Theme
