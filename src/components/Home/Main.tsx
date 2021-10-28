import React, {DetailedHTMLProps, HTMLAttributes} from "react";
import {Container, Row, Col, Cell, Button} from '@sberdevices/plasma-ui';
import 'react-toastify/dist/ReactToastify.css';

import {
  DASHBOARD_PAGE_NO,
  SCHEDULE_PAGE_NO,
  MyDiv100,
} from '../../App';
import {
  GoToDashboardButton,
  GoToScheduleButton,
} from '../TopMenu';


interface MainProps {
  setValue: (key: string, value: any) => void
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
            <GoToDashboardButton
              onClick={() => {
                this.handleChange("page", DASHBOARD_PAGE_NO)
              }}
            />
            <GoToScheduleButton
              onClick={() => {
                this.props.convertIdInGroupName();
                this.handleChange("page", SCHEDULE_PAGE_NO)
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
