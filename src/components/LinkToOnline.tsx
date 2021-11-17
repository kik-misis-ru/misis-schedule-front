import React from "react";
import {DEFAULT_TEXT_COLOR} from "./consts";

const LINK_TEXT = 'Ссылка на онлайн-конференцию';

export const LinkToOnline = ({
                               url,
                               text,
}: {
  url: string,
  text?: string,
}) => (
  url
    ? (
    <a href={url}
       style={{ color: DEFAULT_TEXT_COLOR }}
    >{ text || LINK_TEXT }</a>
    )
    : (
      <div style={{margin: "0"}}></div>
    )
)

export default LinkToOnline;
