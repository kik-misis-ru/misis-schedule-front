import React, {DetailedHTMLProps, HTMLAttributes} from "react";
import {Container, Row, Col, Cell, Button} from '@sberdevices/plasma-ui';
import 'react-toastify/dist/ReactToastify.css';

import {
  history,
  Spacer100,
  Spacer200,
} from '../../App';
import {
    HeaderLogoCol,
    HeaderTitleCol2,
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
    <Row style={{margin: "1em"}}>

              <HeaderLogoCol/>

              <HeaderTitleCol2
                title="Другое расписание"
              />

              <Col style={{margin: "0 0 0 auto"}}>
              <GoToDashboardButton
          onClick={() => {
            history.push('/dashboard')
          }}
        />
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

      <Spacer200/>

    </Container>
    
  )
}

export default Main
