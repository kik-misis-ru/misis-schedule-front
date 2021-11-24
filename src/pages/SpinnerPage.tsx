import {Container, DeviceThemeProvider, Spinner} from "@sberdevices/plasma-ui";
import React from "react";
import {DocStyle, getThemeBackgroundByChar} from "../themes/tools";
import {CharacterId} from "../types/base";
import {ACCENT_TEXT_COLOR} from "../components/consts";

export const SpinnerPage = (
  {
    theme,
    character
  }: {
    theme: string
    character: CharacterId
  }) => {
  return (
    <DeviceThemeProvider>
      <DocStyle/>
      {
        getThemeBackgroundByChar(character, theme)
      }
      <div>
        <Container style={{
          padding: 0,
          // overflow: "hidden",
          height: '100%',
          overflow: 'auto',
        }}>
          <Spinner
            color={ACCENT_TEXT_COLOR}
            style={{
              position: " absolute",
              top: "40%",
              left: " 43%",
              marginRight: "-50%",
            }}/>
        </Container>
      </div>
    </DeviceThemeProvider>
  )
}


export default SpinnerPage;
