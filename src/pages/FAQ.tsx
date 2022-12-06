import React from "react";
import 'react-toastify/dist/ReactToastify.css';
import {
  Container,
  Row,
  HeaderBack,
  HeaderLogo,
  HeaderTitle,
  HeaderTitleWrapper,
  HeaderRoot,
} from "@sberdevices/plasma-ui";
import {history} from "../App";
import {Spacer300} from '../components/Spacers'
import faq from '../data/faq.json';
import lib from '../data/libraries.json';
import logo from "../images/App Icon.png";

import {Libraries} from '../components/Libraries'
import {FAQCard} from '../components/FAQCard'
import {
  GoToDashboardButton,
} from '../components/TopMenu';


const FAQ = ({}: {}) => {
  
  return (
    <Container style={{
      padding: 0,
      // overflow: "hidden",
      height: '100%',
      overflow: 'auto',
    }}>

      <Row style={{margin: "1em", marginLeft: "5%", marginRight: "5%"}}>
        <HeaderRoot>
          <HeaderBack
            onClick={() => history.push("/dashboard")}
          />
          <HeaderLogo
            src={logo}
            alt="Logo"
            onClick={() => history.push("/dashboard")}
          />
          <HeaderTitleWrapper>
            <HeaderTitle>Часто задаваемые вопросы</HeaderTitle>
          </HeaderTitleWrapper>
        </HeaderRoot>
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
  )
}

export default FAQ
