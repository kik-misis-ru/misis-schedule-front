import React, {DetailedHTMLProps, HTMLAttributes} from "react";
import {Container, Row, Col, Cell, Button} from '@sberdevices/plasma-ui';
import 'react-toastify/dist/ReactToastify.css';

import {
  history, IAppState,
} from '../../App';
import {Spacer100,Spacer200,Spacer300} from '../Spacers'

import {
    HeaderLogoCol,
    HeaderTitleCol2,
  GoToDashboardButton,
  GoToScheduleButton,
} from '../TopMenu';


interface MainProps {
  contentRight: DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>
}

const Main = ({
                contentRight,
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
           padding: '0',
          margin: '0 auto',
        }}
      >
      </Cell>

      <Spacer200/>

    </Container>
    
  )
}

export default Main
