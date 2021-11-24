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
} from "@sberdevices/plasma-ui";
import {IconLocation} from "@sberdevices/plasma-icons";
import {Spacer300} from "../App";

import karta from "../images/Karta.png";

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


const BuildingListItem = ({
                            // name,
                            // address,
                            // color,
                            building,
                          }: {
  // name: string,
  // address: string,
  // color: string,
  building: IBuilding,
}) => (
  <CellListItem
    content={
      <TextBox>
        <Body1>
          {building.name}
        </Body1>
        <TextBoxLabel >
          {building.address}
        </TextBoxLabel>
      </TextBox>
    }
    contentLeft={
      <Badge
        contentLeft={
          <IconLocation
            color={building.color}
            size="s"
          />
        }
        style={{backgroundColor: COLOR_BLACK}}
      />
    }
  />
)


const BuildingList = ({
                        buildings,
                      }: {
  buildings: IBuilding[],
}) => (
  <React.Fragment>
    {
      buildings.map((building, i) => (
        <BuildingListItem
          key={i}
          building={building}
        />
      ))
    }
  </React.Fragment>
)


const NavigatorPage = ({
                         character,
                         theme,
                         buildings,
                         isMobileDevice,
                         onDashboardClick,
                         onHomeClick,
                         onScheduleClick,
                       }: {
  character: CharacterId
  theme: string
  buildings: IBuilding[]
  isMobileDevice: boolean
  onDashboardClick: () => void
  onHomeClick: () => void
  onScheduleClick: () => void
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

            <Row style={{margin: "1em"}}>

              <HeaderLogoCol/>

              <HeaderTitleCol2
                title="Карта университета"
              />

              <Col style={{margin: "0 0 0 auto"}}>
                <GoToDashboardButton
                  onClick={() => onDashboardClick()}
                />
              </Col>

            </Row>

            <Card style={{width: "90%", marginLeft: "5%", marginTop: "0.5em"}}>
              <CardBody style={{padding: "0 0 0 0"}}>

                <CardMedia src={karta}/>

                <CardContent compact style={{padding: "0.3em 0.3em"}}>
                  <BuildingList
                    buildings={buildings}
                  />
                </CardContent>

              </CardBody>

            </Card>

            <Spacer300/>

          </Container>
        )
        :
        (
          <Container style={{padding: 0}}>

            <Row style={{margin: "1em"}}>

              <HeaderLogoCol/>

              <HeaderTitleCol2
                title='Карта университета'
              />

              <Col style={{margin: "0 0 0 auto"}}>
                <GoToDashboardButton
                  onClick={() => onDashboardClick()}
                />
              </Col>

            </Row>

            <Row>
              <div style={{display: "flex", flexDirection: "row"}}>

                <Card style={{width: "102vh", height: "60vh", marginLeft: "5%", marginTop: "0.5em"}}>
                  <CardBody>
                    <CardMedia src={karta}/>
                  </CardBody>
                </Card>

                <Card style={{width: "30%", marginLeft: "3%", marginTop: "0.5em"}}>
                  <CardBody style={{padding: "0 0 0 0"}}>
                    <CardContent compact style={{padding: "0.3em 0.3em"}}>
                      <BuildingList
                        buildings={buildings}
                      />
                    </CardContent>
                  </CardBody>
                </Card>

              </div>
            </Row>

            <Spacer300/>

          </Container>
        )
    }
  </DeviceThemeProvider>
}

export default NavigatorPage
