import React from "react";
import {Container, Row, Col, Button} from '@sberdevices/plasma-ui';
import 'react-toastify/dist/ReactToastify.css';

import {IconChevronRight, IconHouse} from "@sberdevices/plasma-icons";

import "../App.css";
import {
  DASHBOARD_PAGE_NO,
} from '../App';




 const GoToMenuButton = (props) => <Button
  size="s"
  view="clear"
  onClick = {props.onClick}
  pin="circle-circle"
  contentRight={
    <IconHouse size="s" color="inherit"/>
  }
/>

  const GoToScheduleButton = (props) =>  <Button
view="clear"
onClick={props.onClick}
contentRight={
  <IconChevronRight size="s" color="inherit"/>
}
size="s"
pin="circle-circle"
style={{ marginTop: "1em", marginRight: "1em" }}
/>

 class Main extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange         = this.handleChange.bind(this)
        this.convertIdInGroupName = this.convertIdInGroupName.bind(this);
    }

    handleChange(key, e) {
        this.props.setValue(key, e);
      }

      convertIdInGroupName() {
        this.props.convertIdInGroupName();
      }
    

    render(){
        return (
            <Container style={{ padding: 0 }}>
    
            <Row>
              <Col style={{ marginLeft: "auto" }}>
                <GoToMenuButton
                  onClick={() => {
                    this.handleChange("page", DASHBOARD_PAGE_NO)
                  }}
                />
                {
                  !this.props.disabled 
                  ? 
                  <GoToScheduleButton
                  onClick={() => {
                    this.props.convertIdInGroupName();
                    this.handleChange("page", 7)
                  }}
                  />
                  : <Button view="clear" disabled={this.props.disabled}/>
                }
    
              </Col>
            </Row>
            <div
             contentRight={this.props.contentRight}>
            </div>
            <div style={{
                  width:  '100px',
                  height: '100px',
                }}></div>
              </Container>
        )
    }
}

export default Main