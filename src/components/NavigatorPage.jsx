import React from "react";
import {Container, Row, Col, Button, DeviceThemeProvider} from '@sberdevices/plasma-ui';
import {detectDevice} from '@sberdevices/plasma-ui/utils';
import 'react-toastify/dist/ReactToastify.css';
import {
  Card,
  CardBody,
  CardContent,
  CardMedia,
  CardParagraph1,
  TextBox,
  TextBoxSubTitle,
  TextBoxTitle,
  Badge,
  CellListItem,
  Image
} from "@sberdevices/plasma-ui";
import {IconSettings, IconLocation, IconMoreVertical, IconHouse} from "@sberdevices/plasma-icons";

import logo from "../images/logo.png";
import karta from "../images/Karta.png";

import {DocStyle, getThemeBackgroundByChar} from '../themes/tools';
import {DASHBOARD_PAGE_NO,SCHEDULE_PAGE_NO} from '../App';
import {HeaderLogo, HeaderTitle2, GoToDashboardButton} from './TopMenu';


class NavigatorPage extends React.Component {

  constructor(props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange(key, e) {
    this.props.setValue(key, e);
  }

  render() {
    return <DeviceThemeProvider>
      <DocStyle/>
      {
        getThemeBackgroundByChar(this.props.state.character)
      }
      {
        detectDevice() === "mobile"
        ? (
          <Container style={{ padding: 0 }}>

            <Row style={{ margin: "1em" }}>

              <HeaderLogo/>

              <Col style={{ marginLeft: "0.5em", paddingTop: "0.5em" }}>
                <TextBox>
                  <CardParagraph1>Карта университета</CardParagraph1>
                </TextBox>
              </Col>

              <Col style={{ margin: "0 0 0 auto" }}>
                <GoToDashboardButton
                  onClick={() => this.handleChange("page", DASHBOARD_PAGE_NO)}
                />
              </Col>

            </Row>

            <Card style={{ width: "90%", marginLeft: "5%", marginTop: "0.5em" }}>
              <CardBody style={{ padding: "0 0 0 0" }}>
                <CardMedia src={karta}/>
                <CardContent compact style={{ padding: "0.3em 0.3em" }}>
                  {
                    this.props.state.building.map(({ name, address, color }, i) => (
                      <CellListItem
                        key={i}
                        content={
                          <TextBox>
                            <TextBoxTitle>
                              {name}
                            </TextBoxTitle>
                            <TextBoxSubTitle>
                              {address}
                            </TextBoxSubTitle>
                          </TextBox>
                        }
                        contentLeft={
                          <Badge
                            contentLeft={
                              <IconLocation
                                color={color}
                                            size="s"
                              />
                            }
                            style={{ backgroundColor: "rgba(0,0,0, 0)" }}
                          />
                        }
                      />
                    ))}
                </CardContent>
              </CardBody>

            </Card>
            <div style={{
              width:  '200px',
              height: '300px',
            }}></div>
          </Container>
        )
        :
        (
          <Container style={{ padding: 0 }}>

            <Row style={{ margin: "1em" }}>

              <HeaderLogo/>

              <HeaderTitle2
                text='Карта университета'
              />

              <Col style={{ margin: "0 0 0 auto" }}>
                <Button
                  size="s"
                  view="clear"
                  pin="circle-circle"
                  onClick={() => this.handleChange("page", 0)}
                  contentRight={
                    <IconSettings size="s" color="inherit"/>
                  }
                />
                <Button
                  size="s"
                  view="clear"
                  pin="circle-circle"
                  onClick={() => this.handleChange("page", SCHEDULE_PAGE_NO)}
                  contentRight={
                    <IconMoreVertical size="s" color="inherit"/>
                  }
                />
              </Col>

            </Row>

            <Row>
              <div style={{ display: "flex", flexDirection: "row" }}>

                <Card style={{ width: "102vh", height: "60vh", marginLeft: "5%", marginTop: "0.5em" }}>
                  <CardBody>
                    <CardMedia src={karta}/>
                  </CardBody>
                </Card>

                <Card style={{ width: "30%", marginLeft: "3%", marginTop: "0.5em" }}>
                  <CardBody style={{ padding: "0 0 0 0" }}>
                    <CardContent compact style={{ padding: "0.3em 0.3em" }}>
                      {
                        this.props.state.building.map(({ name, address, color }, i) => (
                          <CellListItem
                            key={i}
                            content={
                              <TextBox>
                                <TextBoxTitle>
                                  {name}
                                </TextBoxTitle>
                                <TextBoxSubTitle>
                                  {address}
                                </TextBoxSubTitle>
                              </TextBox>
                            }
                            contentLeft={
                              <Badge
                                contentLeft={
                                  <IconLocation
                                    color={color}
                                    size="s"
                                  />
                                }
                                style={{ backgroundColor: "rgba(0,0,0, 0)" }}
                              />
                            }
                          />
                        ))}
                    </CardContent>
                  </CardBody>
                </Card>

              </div>
            </Row>

            <div style={{
              width:  '200px',
              height: '300px',
            }}></div>

          </Container>
        )
      }
    </DeviceThemeProvider>
  }
}

export default NavigatorPage
