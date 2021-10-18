import React from "react";
import {Col, Image } from "@sberdevices/plasma-ui";

import logo from "../images/logo.png";

export const HeaderLogo = () => {
  return (
    <Col style={{maxWidth: '3rem'}}>
      <Image src={logo} ratio="1 / 1"/>
    </Col>
  )
}

export default HeaderLogo;
