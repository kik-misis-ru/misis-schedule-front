import React from "react";
import styled from "styled-components";
import {Button, CardHeadline2, Col, Image, Row, TextBox, TextBoxSubTitle, TextBoxTitle,  CardParagraph1, Body2
} from "@sberdevices/plasma-ui";
import {
  IconHouse,
  IconNavigationArrow,
  IconSettings,
  IconStar,
  IconStarFill,
  IconMoreVertical,
  IconChevronRight
} from "@sberdevices/plasma-icons";

import logo from "../images/logo.png";


export const HeaderLogoCol = () => {
  return (
    <Col
      style={{maxWidth: '2.3rem', padding: "0 0 0 0"}}
    >
      <Image
        src={logo}
        
      />
    </Col>
  )
}

export const HeaderTitleCol = ({
                       title
                     }: {
  title: string
}) => (
  <Col style={{marginLeft: "0.5em", paddingTop: "0.6em"}}>
    <TextBox>
      <CardHeadline2>{title}</CardHeadline2>
    </TextBox>
  </Col>
)


export const HeaderTitleCol2 = ({
                       title
                     }: {
  title: string
}) => (
  <Col style={{marginLeft: "0.5em", paddingTop: "0.7em"}}>
    <TextBox>
      <Body2>{title}</Body2>
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

// export const GoToScheduleButton = ({
//                           onClick,
//                         }: {
//   onClick: React.MouseEventHandler<HTMLElement>
// }) => (
//   <Button
//     size="s"
//     view="clear"
//     pin="circle-circle"
//     onClick={(event) => onClick(event)}
//     contentRight={
//       <IconMoreVertical size="s" color="inherit"/>
//     }
//   />
// )

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
                   starred,
                   // onNavigatorClick,
                   onStarClick,
                   onDashboardClick,
                   onHomeClick,
                   Bd,
                   //Load_Schedule
                 }: {
  label?: string
  subLabel: string
  starred: boolean
  // onNavigatorClick: () => void
  onStarClick: () => void
  onDashboardClick: () => void
  onHomeClick: () => void
  Bd: () => void
  //Load_Schedule: () => void
}) => {
  return (
    <Row style={{margin: "1em"}}>

      <HeaderLogoCol />

      <HeaderScheduleCol
        label={label}
        subLabel={subLabel}
      />

      <Col style={{margin: "0 0 0 auto"}}>
        {/*
        <GoToNavigatorButton
          onClick={() => onNavigatorClick()}
        />
*/}
        {/* <StarButtonView
          starred={starred}
          onClick={() => onStarClick()}
        /> */}
        
        {/* <GoToHomeButton
          onClick={() => onHomeClick()}
        /> */}
        <GoToDashboardButton
                  onClick={() => {Bd();   onDashboardClick(); }}
                />
        {/* <Button size="s" view="clear" pin="circle-circle" onClick={()=>this.setState({ page: 16 })}  contentRight={<IconHouse size="s" color="inherit"/>} /> */}
      </Col>
    </Row>
  )
}


export default TopMenu
