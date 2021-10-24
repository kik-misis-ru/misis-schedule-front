import React from "react";
import styled from "styled-components";
import {Button, CardHeadline2, Col, Image, Row, TextBox, TextBoxSubTitle, TextBoxTitle,  CardParagraph1,
} from "@sberdevices/plasma-ui";
import {IconHouse, IconNavigationArrow, IconSettings, IconStar, IconStarFill} from "@sberdevices/plasma-icons";

import logo from "../images/logo.png";


export const HeaderLogo = () => {
  return (
    <Col style={{maxWidth: '3rem'}}>
      <Image src={logo} ratio="1 / 1"/>
    </Col>
  )
}

export const HeaderTitle = ({
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


export const HeaderTitle2 = ({
                       title
                     }: {
  title: string
}) => (
  <Col style={{marginLeft: "0.5em", paddingTop: "0.5em"}}>
    <TextBox>
      <CardParagraph1>{title}</CardParagraph1>
    </TextBox>
  </Col>
)


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


export const StarButtonView = ({
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
      <IconHouse size="s" color="inherit"/>
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


export const TopMenu = ({
                   label,
                   subLabel,
                   starred,
                   // onNavigatorClick,
                   onStarClick,
                   onDashboardClick,
                   onHomeClick,
                 }: {
  label?: string
  subLabel: string
  starred: boolean
  // onNavigatorClick: () => void
  onStarClick: () => void
  onDashboardClick: () => void
  onHomeClick: () => void
}) => {
  return (
    <Row style={{margin: "1em"}}>

      <HeaderLogo/>

      <HeaderSchedule
        label={label}
        subLabel={subLabel}
      />

      <Col style={{margin: "0 0 0 auto"}}>
        {/*
        <GoToNavigatorButton
          onClick={() => onNavigatorClick()}
        />
*/}
        <StarButtonView
          starred={starred}
          onClick={() => onStarClick()}
        />
        <GoToDashboardButton
          onClick={() => onDashboardClick()}
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
