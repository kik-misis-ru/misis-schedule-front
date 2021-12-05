import React, {DetailedHTMLProps, HTMLAttributes} from "react";
import {
  Container, 
  Row, 
  Col, 
  Cell, 
  Header,
  HeaderBack,
  HeaderLogo,
  HeaderTitle,
  HeaderTitleWrapper,
  HeaderContent,
  HeaderRoot,
  HeaderMinimize
} from '@sberdevices/plasma-ui';
import 'react-toastify/dist/ReactToastify.css';

import logo from "../../images/App Icon.png";
import {
  history, IAppState,
} from '../../App';
import {Spacer100,Spacer200,Spacer300} from '../Spacers'



interface MainProps {
  contentRight: DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>
}

const Main = ({
                contentRight,
              }: MainProps) => {

  const TopMenuRow = () => (
  <Row style={{margin: "1em", marginLeft: "5%",
  marginRight: "5%"}}>

    <HeaderRoot>
      <HeaderBack onClick={() => history.push('/dashboard')} />
      <HeaderLogo src={logo} alt="Logo" onClick={() => history.push('/dashboard')}/>
        <HeaderTitleWrapper>
          <HeaderTitle>Другое расписание</HeaderTitle>
        </HeaderTitleWrapper>
    </HeaderRoot>
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
