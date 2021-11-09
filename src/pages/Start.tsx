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
import {CHAR_TIMEPARAMOY, Character, IBuilding} from "../types/base";
import {COLOR_BLACK} from '../components/consts';
import {
  HeaderLogoCol,
  HeaderTitleCol2,
  GoToDashboardButton,
  GoToHomeButton,
  GoToScheduleButton,
} from '../components/TopMenu';
//import { Button } from "@sberdevices/plasma-ui/node_modules/@sberdevices/plasma-core";
//import { ParagraphText1 } from "@sberdevices/plasma-core";


const Start = ({
                         character,
                         isMobileDevice,
                         onDashboardClick,
                       }: {
  character: Character
    // todo: что такое 'timeParamoy' ???
    | typeof CHAR_TIMEPARAMOY
  isMobileDevice: boolean
  onDashboardClick: () => void
}) => {
  return <DeviceThemeProvider>
    <DocStyle/>
    {
      getThemeBackgroundByChar(character, 'dark')
    }
    {
      isMobileDevice
        ? (
          <Container style={{padding: 0}}>

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
    Мы создали СтудХаб МИСиС,
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
  <Button onClick={()=>{onDashboardClick()}} size="m" style={{marginTop: "2em"}}> Дальше</Button>
  <Image src={star}/>
  </Row>
            
            {/* <div style={{
              width: '200px',
              height: '300px',
            }}></div> */}
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
    Мы создали СтудХаб МИСиС,
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
  <Button onClick={()=>{onDashboardClick()}} size="m" style={{marginTop: "2em"}}> Дальше</Button>
  <Image src={star} style={{width: "40vw"}}/>
  </Row>

          </Container>
        )
    }
  </DeviceThemeProvider>
}

export default Start
