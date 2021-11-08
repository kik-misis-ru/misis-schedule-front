import React, {DetailedHTMLProps, HTMLAttributes} from "react";
import {Container, Row, Col, Cell, Button} from '@sberdevices/plasma-ui';
import 'react-toastify/dist/ReactToastify.css';

import {
  DASHBOARD_PAGE_NO,
  SCHEDULE_PAGE_NO,
  Spacer100,
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

const Main = ({
                disabled,
                contentRight,
                setValue,
                convertIdInGroupName,
              }: MainProps) => {

  const TopMenuRow = () => (
    <Row
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-end',
      }}
    >
      <Col
         style={{margin: "1em"}}
      >
        <GoToDashboardButton
          onClick={() => {
            // rewrite to gotoPage() or to history.push()
            setValue("page", DASHBOARD_PAGE_NO)
          }}
        />
        {/* <GoToScheduleButton
          onClick={() => {
            convertIdInGroupName();
            setValue("page", SCHEDULE_PAGE_NO)
          }}
          disabled={disabled}
        /> */}
      </Col>
    </Row>

  )

  return (
    <Container
      style={{padding: 0, overflow: "hidden"}}
    >
      <TopMenuRow/>
      <Cell
        content={
          contentRight
        }
        style={{
          // padding: 0,
          margin: '0 auto',
        }}
      >
      </Cell>

      <Spacer100/>
    <div
    style={{height: "100px", width: "100px"}}></div>
    </Container>
    
  )
}

export default Main
