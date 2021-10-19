import React from "react";
import {Button} from "@sberdevices/plasma-ui";

export const ButtonThisWeek = ({
                                 onClick
                               }: {
  onClick: (event: React.MouseEventHandler<HTMLElement>) => void
}) => (
  <Button
    onClick={(event) => onClick(event)}
    view="primary"
    size="m"
    text="Текущая неделя"
    style={{position: "relative", bottom: "0.5em"}}
  />
)

export default ButtonThisWeek
