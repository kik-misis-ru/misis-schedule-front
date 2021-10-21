import React from "react";
import styled from "styled-components";
import {Button, Col, Image, Row, TextBox, TextBoxSubTitle, TextBoxTitle} from "@sberdevices/plasma-ui";
import {IconNavigationArrow, IconSettings, IconStar, IconStarFill} from "@sberdevices/plasma-icons";

import logo from "../images/logo.png";


export const HeaderLogo = () => {
  return (
    <Col style={{maxWidth: '3rem'}}>
      <Image src={logo} ratio="1 / 1"/>
    </Col>
  )
}


const DEFAULT_SCHEDULE_TEXT = 'Расписание занятий';

export function HeaderSchedule({
                                 label = DEFAULT_SCHEDULE_TEXT,
                                 subLabel,
                               }: {
  label?: string
  subLabel: string
}) {
  return (
    <Col style={{marginLeft: "0.5em"}}>
      <TextBox>
        <TextBoxTitle>{label}</TextBoxTitle>
        <TextBoxSubTitle>{subLabel}</TextBoxSubTitle>
      </TextBox>
    </Col>
  )
}


const GoToNavigatorButton = ({
                               onClick,
                             }: {
  onClick: React.MouseEventHandler<HTMLElement>
}) => (
  <Button
    onClick={(event) => onClick(event)}
    contentRight={
      <IconNavigationArrow size="s" color="inherit"/>
    }
  />
)


const StarButtonView = ({
                          starred,
                          onClick,
                        }: {
  starred: boolean
  onClick: React.MouseEventHandler<HTMLElement>
}) => {
  return <Button
    size="s"
    view="clear"
    pin="circle-circle"
    onClick={(event) => onClick(event)}
    contentRight={
      starred
        ? <IconStarFill size="s" color="inherit"/>
        : <IconStar size="s" color="inherit"/>
    }
  />
}


const GoToHomeButton = ({
                          onClick,
                        }: {
  onClick: React.MouseEventHandler<HTMLElement>
}) => (
  <Button
    size="s"
    view="clear"
    pin="circle-circle"
    onClick={(event) => onClick(event)}
    contentRight={
      <IconSettings size="s" color="inherit"/>
    }
  />
)


const TopMenu = ({
                   label,
                   subLabel,
                   starred,
                   onStarClick,
                   onHomeClick,
                   onNavigatorClick,
                 }: {
  label?: string
  subLabel: string
  starred: boolean
  onStarClick: () => void
  onHomeClick: () => void
  onNavigatorClick: () => void
}) => {
  return (
    <Row style={{margin: "1em"}}>

      <HeaderLogo/>

      <HeaderSchedule
        label={label}
        subLabel={subLabel}
      />

      <Col style={{margin: "0 0 0 auto"}}>
        <GoToNavigatorButton
          onClick={() => onNavigatorClick()}
        />
        <StarButtonView
          starred={starred}
          onClick={() => onStarClick()}
        />
        <GoToHomeButton
          onClick={() => onHomeClick()}
        />

        {/* <Button size="s" view="clear" pin="circle-circle" onClick={()=>this.setState({ page: 16 })}  contentRight={<IconHouse size="s" color="inherit"/>} /> */}
      </Col>
    </Row>
  )
}


export default TopMenu
