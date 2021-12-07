import React from "react";
import 'react-toastify/dist/ReactToastify.css';
import {
  Container,
  Row,
  Col,
  Body1,
  Card,
  CardBody,
  CardContent,
  CardMedia,
  TextBox,
  TextBoxLabel,
  Badge,
  CellListItem,
  HeaderBack,
  HeaderLogo,
  HeaderTitle,
  HeaderTitleWrapper,
  HeaderRoot,
} from "@sberdevices/plasma-ui";
import {IconLocation} from "@sberdevices/plasma-icons";
import {history} from "../App";
import {Spacer300} from '../components/Spacers'
import logo from "../images/App Icon.png";
import karta from "../images/Karta.png";
import buildings from '../data/buldings.json'

import {IBuilding} from "../types/base";
import {COLOR_BLACK} from '../components/consts';
import {
  HeaderLogoCol,
  HeaderTitleCol2,
  GoToDashboardButton,
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
        <TextBoxLabel>
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
                         isMobileDevice,
                       }: {
  isMobileDevice: boolean
}) => {
  return (
    isMobileDevice
      ? (
        <Container style={{
          padding: 0,
          // overflow: "hidden",
          height: '100%',
          overflow: 'auto',
        }}>

          <Row style={{margin: "1em", marginLeft: "5%", marginRight: "5%"}}>

            <HeaderRoot>
              <HeaderBack
                onClick={() => history.push("/dashboard")}
              />
              <HeaderLogo
                src={logo}
                alt="Logo"
                onClick={() => history.push("/dashboard")}
              />
              <HeaderTitleWrapper>
                <HeaderTitle>Карта</HeaderTitle>
              </HeaderTitleWrapper>
            </HeaderRoot>

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
                onClick={() => history.push("/dashboard")}
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
  )
}

export default NavigatorPage
