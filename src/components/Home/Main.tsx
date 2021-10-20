import React, {DetailedHTMLProps, HTMLAttributes} from "react";
import {Container, Row, Col, Cell, Button} from '@sberdevices/plasma-ui';
import 'react-toastify/dist/ReactToastify.css';

import {IconChevronRight, IconHouse} from "@sberdevices/plasma-icons";

// import "../../themes/App.css";
import {
  DASHBOARD_PAGE_NO,
  MyDiv100,
} from '../../App';
import {
  GoToMenuButton,
  GoToScheduleButton,
} from '../HomeView';


// const GoToMenuButton = (props) => <Button
//   size="s"
//   view="clear"
//   onClick={props.onClick}
//   pin="circle-circle"
//   contentRight={
//     <IconHouse size="s" color="inherit"/>
//   }
// />

// const GoToScheduleButton = (props) => <Button
//   view="clear"
//   onClick={props.onClick}
//   contentRight={
//     <IconChevronRight size="s" color="inherit"/>
//   }
//   size="s"
//   pin="circle-circle"
//   style={{marginTop: "1em", marginRight: "1em"}}
// />

interface MainProps {
  setValue
  convertIdInGroupName: () => void
  disabled: boolean
  contentRight: DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>
}

class Main extends React.Component<MainProps> {
  constructor(props: MainProps) {
    super(props);
    this.handleChange = this.handleChange.bind(this)
    this.convertIdInGroupName = this.convertIdInGroupName.bind(this);
  }

  handleChange(key, e) {
    this.props.setValue(key, e);
  }

  convertIdInGroupName() {
    this.props.convertIdInGroupName();
  }


  render() {
    return (
      <Container style={{padding: 0}}>

        <Row>
          <Col style={{marginLeft: "auto"}}>
            <GoToMenuButton
              onClick={() => {
                this.handleChange("page", DASHBOARD_PAGE_NO)
              }}
            />
            <GoToScheduleButton
              onClick={() => {
                this.props.convertIdInGroupName();
                this.handleChange("page", 17)
              }}
              disabled={this.props.disabled}
            />
          </Col>
        </Row>
        <Cell
          content={this.props.contentRight}>
          style={{padding: 0}}
        </Cell>
        <MyDiv100/>
      </Container>
    )
  }
}

export default Main
