import React from "react";
import {Container, Row, Col, DeviceThemeProvider} from '@sberdevices/plasma-ui';
import 'react-toastify/dist/ReactToastify.css';
import {
  Headline3,
} from "@sberdevices/plasma-ui";
import {Spacer100,Spacer200,Spacer300} from '../components/Spacers'
import faq from '../data/faq.json';
import lib from '../data/libraries.json';


import {DocStyle, getThemeBackgroundByChar} from '../themes/tools';
import {CharacterId, IBuilding} from "../types/base";
import {Libraries} from '../components/Libraries'
import {FAQCard} from '../components/FAQCard'
import {
  HeaderLogoCol,
  HeaderTitleCol2,
  GoToDashboardButton,
} from '../components/TopMenu';


const FAQ = ({
               character,
               theme,
               onDashboardClick,
             }: {
  theme: string
  character: CharacterId
  onDashboardClick: () => void
}) => {
  return <DeviceThemeProvider>
    <DocStyle/>
    {
      getThemeBackgroundByChar(character, theme)
    }
    <Container style={{
      padding: 0,
      // overflow: "hidden",
      height: '100%',
      overflow: 'auto',
    }}>

      <Row style={{margin: "1em"}}>

        <HeaderLogoCol/>

        <HeaderTitleCol2
          title="Часто задаваемые вопросы"
        />

        <Col style={{margin: "0 0 0 auto"}}>
          <GoToDashboardButton
            onClick={() => onDashboardClick()}
          />
        </Col>

      </Row>
      {
        faq?.map((faq, index) => (
          <FAQCard
            
            key={index}
            questions={faq.questions}
            text={faq.text}
            answers={faq.answers}
          />
        ))
      }
      {
        lib?.map((lib, index) => (
          <Libraries
            key={index}
            questions={lib.questions}
            text={lib.text}
            answers={lib.answers}
            site={lib.site}
          />
        ))
      }

      <Spacer300/>

    </Container>
  </DeviceThemeProvider>
}

export default FAQ
