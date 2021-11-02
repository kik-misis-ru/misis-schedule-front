import React from "react";
import {Container, Row, Col, DeviceThemeProvider} from '@sberdevices/plasma-ui';
import 'react-toastify/dist/ReactToastify.css';
import {
  Headline3,
} from "@sberdevices/plasma-ui";
import faq from '../data/faq.json';




import {DocStyle, getThemeBackgroundByChar} from '../themes/tools';
import {CHAR_TIMEPARAMOY, Character, IBuilding} from "../types/base";
import {SocialList} from '../components/SocialList'
import {FAQCard} from '../components/FAQCard'
import {
  HeaderLogoCol,
  HeaderTitleCol2,
  GoToDashboardButton,
} from '../components/TopMenu';



const Contacts = ({
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
      getThemeBackgroundByChar(character)
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
            {faq.map((faq) =>(
              <FAQCard
                questions={faq.questions}
                text={faq.text}
                answers={faq.answers}
              />
            ))}
            <div style={{
              width: '200px',
              height: '300px',
            }}></div>
          </Container>
  </DeviceThemeProvider>
}

export default Contacts
