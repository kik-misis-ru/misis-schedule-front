import React from "react";
import {Container, Row, Col, DeviceThemeProvider} from '@sberdevices/plasma-ui';
import 'react-toastify/dist/ReactToastify.css';
import {
  Headline3,
} from "@sberdevices/plasma-ui";
import faq from '../data/faq.json';
import lib from '../data/libraries.json';


import {DocStyle, getThemeBackgroundByChar} from '../themes/tools';
import {CHAR_TIMEPARAMOY, Character, IBuilding} from "../types/base";
import {Libraries} from '../components/Libraries'
import {FAQCard} from '../components/FAQCard'
import {
  HeaderLogoCol,
  HeaderTitleCol2,
  GoToDashboardButton,
} from '../components/TopMenu';


const FAQ = ({
               character,
               onDashboardClick,
             }: {
  character: Character
    // todo: что такое 'timeParamoy' ???
    | typeof CHAR_TIMEPARAMOY
  onDashboardClick: () => void
}) => {
  return <DeviceThemeProvider>
    <DocStyle/>
    {
      getThemeBackgroundByChar(character, 'dark')
    }
    <Container style={{padding: 0}}>

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
      <div style={{
        width: '200px',
        height: '300px',
      }}></div>
    </Container>
  </DeviceThemeProvider>
}

export default FAQ
