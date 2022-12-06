import React from "react";
import styled from "styled-components";
import {Button, CardHeadline2, Col, Image, Row, TextBox, TextBoxSubTitle, TextBoxTitle,  CardParagraph1, Body2
} from "@sberdevices/plasma-ui";
import {
  IconHouse,
  IconNavigationArrow,
  IconSettings,
  IconChevronRight,
  IconChevronLeft
} from "@sberdevices/plasma-icons";

import logo from "../images/logo.png";



export const HeaderTitleCol = ({
                       title
                     }: {
  title: string
}) => (
  <Col style={{marginLeft: "0.5em", paddingTop: "0.5em"}}>
    <TextBox>
      <CardHeadline2>{title}</CardHeadline2>
    </TextBox>
  </Col>
)



const DEFAULT_SCHEDULE_TEXT = 'Расписание занятий';

export function HeaderScheduleCol({
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


export const GoToNavigatorButton = ({
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



export const GoToDashboardButton = ({
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
      <IconChevronLeft size="s" color="inherit"/>
    }
  />
)

export const GoToHomeButton = ({
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


export const GoToScheduleButton = ({
                                     disabled=false,
                                     style={},
                                     onClick,
                                   }: {
  disabled?: boolean
  style?: Object
  onClick: React.MouseEventHandler<HTMLElement>
}) => (
  disabled
    ? <Button
      view="clear"
      disabled={disabled}
    />
    : <Button
      size="s"
      view="clear"
      pin="circle-circle"
      onClick={(event) => onClick(event)}
      contentRight={
        <IconChevronRight size="s" color="inherit"/>
      }
      style={style}
    />
)

export const TopMenu = ({
                   label,
                   subLabel,
                   onDashboardClick,
                   onHomeClick,
                   Bd,
                   //Load_Schedule
                 }: {
  label?: string 
  subLabel: string
  // onNavigatorClick: () => void
  onDashboardClick: () => void
  onHomeClick: () => void
  Bd: () => Promise<void>
  //Load_Schedule: () => void
}) => {
  return (
    <Row style={{margin: "1.5em 1em 1em 0.5em "}}>

      <GoToDashboardButton
                        onClick={async () => {
                          onDashboardClick();
                        }}
                      />
      <HeaderScheduleCol
        label={label}
        subLabel={subLabel}
      />

      <Col style={{margin: "0 0 0 auto"}}>

       
      </Col>
    </Row>
  )
}


export default TopMenu
