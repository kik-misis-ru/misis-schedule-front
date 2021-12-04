import React from "react";
import 'react-toastify/dist/ReactToastify.css';
import {
  Container, 
  Row, Col, 
  DeviceThemeProvider, 
  Header,
  Headline3,
  HeaderBack,
  HeaderLogo,
  HeaderTitle,
  HeaderTitleWrapper,
  HeaderContent,
  HeaderRoot,
  HeaderMinimize
} from "@sberdevices/plasma-ui";
import {Spacer100,Spacer200,Spacer300} from '../components/Spacers'
import contacts_data from '../data/contacts.json';
import social_media from '../data/social_media.json';
import logo from "../images/App Icon.png";
import {DocStyle, getThemeBackgroundByChar} from '../themes/tools';
import {CharacterId, IBuilding} from "../types/base";
import {SocialList} from '../components/SocialList'
import {ContactsCard} from '../components/ContactsCard'



const Contacts = ({
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
            <HeaderRoot>
              <HeaderBack onClick={() => onDashboardClick()} />
            <HeaderLogo src={logo} alt="Logo" onClick={() => onDashboardClick()}/>
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
              contacts_data.map((contact, index) =>(
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
  </DeviceThemeProvider>
}

export default Contacts
