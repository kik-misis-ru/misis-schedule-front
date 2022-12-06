import React from "react";
import 'react-toastify/dist/ReactToastify.css';
import {
  Container,
  Row,
  Headline3,
  HeaderBack,
  HeaderLogo,
  HeaderTitle,
  HeaderTitleWrapper,
  HeaderRoot,
} from "@sberdevices/plasma-ui";
import {history} from "../App";
import {Spacer300} from '../components/Spacers'
import contacts_data from '../data/contacts.json';
import logo from "../images/App Icon.png";
import {SocialList} from '../components/SocialList'
import {ContactsCard} from '../components/ContactsCard'


const Contacts = ({
                  }: {
}) => {
  return (
    <Container style={{
      padding: 0,
      // overflow: "hidden",
      height: '100%',
      overflow: 'auto',
    }}>

      <Row style={{
        margin: "1em",
        marginLeft: "5%",
        marginRight: "5%"
      }}>
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
            <HeaderTitle>Контакты</HeaderTitle>
          </HeaderTitleWrapper>
        </HeaderRoot>
        {/* <Header
            back={true}
            title="Контакты"
            onBackClick={() => onDashboardClick()}
          >
          </Header> */}

      </Row>
      {
        contacts_data.map((contact, index) => (
          <ContactsCard
            key={index}
            site={contact.site}
            text={contact.text}
            tel={contact.tel}
            mail={contact.mail}
          />
        ))
      }

      <div style={{margin: "0 1.3em 1.3em 1.3em"}}>
        <Headline3 style={{marginBottom: "0.5em"}}>
          Мы в социальных сетях
        </Headline3>
        <SocialList/>
      </div>

      <Spacer300/>

    </Container>
  )
}

export default Contacts
