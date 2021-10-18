import {IconChevronLeft} from "@sberdevices/plasma-icons";
import {Button} from "@sberdevices/plasma-ui";
import React from "react";

export const ButtonPrevWeek = ({
                                 onClick
}: {
  onClick: (event: React.MouseEventHandler<HTMLElement>) => void
}) => (
  <Button
    onClick={ (event) => onClick(event) }
    view="clear"
    size="s"
    pin="circle-circle"
    style={{margin: "1em"}}
    contentRight={
      <IconChevronLeft
        size="s"
        color="inherit"
        // @ts-ignore
        style={{paddingBottom: "1.5em"}}
      />
    }
  />
)

export default ButtonPrevWeek
