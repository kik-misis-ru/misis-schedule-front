import React from "react";
import {Container, Row, Col, DeviceThemeProvider, Caption, Body1} from '@sberdevices/plasma-ui';
import 'react-toastify/dist/ReactToastify.css';
import {
  Card,
  CardBody,
  CardContent,
  CardMedia,
  TextBox,
  TextBoxSubTitle,
  TextBoxTitle,
  TextBoxLabel,
  Badge,
  CellListItem,
  TextBoxBigTitle,
  Headline1,
  Button,
  Image,
  ParagraphText1
} from "@sberdevices/plasma-ui";
import {IconLocation} from "@sberdevices/plasma-icons";

import star from "../images/Star-1.png";
import {DocStyle, getThemeBackgroundByChar} from '../themes/tools';
import {CharacterId, IBuilding} from "../types/base";
import {COLOR_BLACK} from '../components/consts';
import {
  HeaderLogoCol,
  HeaderTitleCol2,
  GoToDashboardButton,
  GoToHomeButton,
  GoToScheduleButton,
} from '../components/TopMenu';

import {
  history
} from '../App'
//import { Button } from "@sberdevices/plasma-ui/node_modules/@sberdevices/plasma-core";
//import { ParagraphText1 } from "@sberdevices/plasma-core";


const Start = ({
                         character,
                         isMobileDevice,
                         theme,
                       }: {
  theme: string 
  character: CharacterId
  isMobileDevice: boolean
}) => {
  return <DeviceThemeProvider>
    <DocStyle/>
    {
      getThemeBackgroundByChar(character, theme)
    }
    {
      isMobileDevice
        ? (
          <Container style={{
            padding: 0,
            // overflow: "hidden",
            height: '100%',
            overflow: 'auto',
          }}>

<Row style={{
    margin: "1em"
  }}>

    <HeaderLogoCol/>

    <HeaderTitleCol2
      title='Мир МИСиС'
    />


  </Row>
  <Row style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
  <TextBox> 
    <Headline1
      style={{
        margin: '15% 1.5% 1.5% 0',
        //textAlign: "center",
      }}
    >
      Салют!
    </Headline1>
    <ParagraphText1 >
    Мы создали Мир МИСиС,
    </ParagraphText1>
    <ParagraphText1>
    чтобы помочь студентам и преподавателям 
    </ParagraphText1>
    <ParagraphText1>
    каждый день эффективно перформить,
    </ParagraphText1>
    <ParagraphText1>
    не отвлекаясь на рутину
    </ParagraphText1>
  </TextBox>
  <Button onClick={()=>{ history.push("/dashboard")}} size="m" style={{marginTop: "2em"}}> Дальше</Button>
  
  </Row>
  <Image src={star} style={{margin:"0 0 auto 0", overflow: "hidden"}}/>

            {/*<Spacer300/>*/}

          </Container>
        )
        :
        (
          <Container style={{padding: 0}}>

<Row style={{
    margin: "1em"
  }}>

    <HeaderLogoCol/>

    <HeaderTitleCol2
      title='Мир МИСиС'
    />


  </Row>
  <Row style={{display: "flex", flexDirection: "row"}}>
  <Col>
  <Image src={star} style={{width: "40vw", overflow: "hidden"}}/>
  </Col>
  <Col>
  <TextBox> 
    <Headline1
      style={{
        margin: '15% 1.5% 1.5% 0',
        //textAlign: "center",
      }}
    >
      Салют!
    </Headline1>
    <ParagraphText1 >
    Мы создали Мир МИСиС,
    </ParagraphText1>
    <ParagraphText1>
    чтобы помочь студентам и преподавателям 
    </ParagraphText1>
    <ParagraphText1>
    каждый день эффективно перформить,
    </ParagraphText1>
    <ParagraphText1>
    не отвлекаясь на рутину
    </ParagraphText1>
  </TextBox>
  <Button onClick={()=>{ history.push("/dashboard")}} size="m" style={{marginTop: "2em"}}> Дальше</Button>
  </Col>
  </Row>

          </Container>
        )
    }
  </DeviceThemeProvider>
}

export default Start
