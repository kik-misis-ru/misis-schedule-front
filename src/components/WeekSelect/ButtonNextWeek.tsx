import React from "react";
import {IconChevronRight} from "@sberdevices/plasma-icons";
import {Button} from "@sberdevices/plasma-ui";

export const ButtonNextWeek = ({
                                 onClick
}: {
  onClick: React.MouseEventHandler<HTMLElement>
}) => (
  <Button
    onClick={ (event) => onClick(event) }
    view="clear"
    size="s"
    pin="circle-circle"
    style={{margin: "1em"}}
    contentRight={
      <IconChevronRight
        size="s"
        color="inherit"
        // @ts-ignore
        style={{paddingBottom: "1.5em"}}
      />
    }
  />
)

export default ButtonNextWeek
