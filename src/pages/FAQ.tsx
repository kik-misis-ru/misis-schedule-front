import React from "react";
import {Container, Row, Col, DeviceThemeProvider} from '@sberdevices/plasma-ui';
import 'react-toastify/dist/ReactToastify.css';
import {
  Card,
  CardBody,
  CardContent,
  CardMedia,
  TextBox,
  TextBoxSubTitle,
  TextBoxTitle,
  Badge,
  CellListItem,
} from "@sberdevices/plasma-ui";
import {IconLocation} from "@sberdevices/plasma-icons";

import karta from "../images/Karta.png";

import {DocStyle, getThemeBackgroundByChar} from '../themes/tools';
import {CHAR_TIMEPARAMOY, Character, IBuilding} from "../types/base";
import {COLOR_BLACK} from '../components/consts';
import {
  HeaderLogoCol,
  HeaderTitleCol2,
  GoToDashboardButton,
} from '../components/TopMenu';



const FAQ = ({
                         character,
                         onDashboardClick,
                       }: {
  character: Character
    // todo: что такое 'timeParamoy' ???
    | typeof CHAR_TIMEPARAMOY
  onDashboardClick: () => void
}) => {
  return <DeviceThemeProvider>
    <DocStyle/>
    {
      getThemeBackgroundByChar(character)
    }
          <Container style={{padding: 0}}>

            <Row style={{margin: "1em"}}>

              <HeaderLogoCol/>

              <HeaderTitleCol2
                title="Часто задаваемые вопросы"
              />

              <Col style={{margin: "0 0 0 auto"}}>
                <GoToDashboardButton
                  onClick={() => onDashboardClick()}
                />
              </Col>

            </Row>

            <Card style={{width: "90%", marginLeft: "5%", marginTop: "0.5em"}}>
              <CardBody style={{padding: "0 0 0 0"}}>

                {/* <CardMedia src={karta}/> */}

                <CardContent compact style={{padding: "0.3em 0.3em"}}>
                  
                </CardContent>

              </CardBody>

            </Card>
            <div style={{
              width: '200px',
              height: '300px',
            }}></div>
          </Container>
  </DeviceThemeProvider>
}

export default FAQ
