import React from "react";
import {Container, Row, Col, DeviceThemeProvider} from '@sberdevices/plasma-ui';
import 'react-toastify/dist/ReactToastify.css';
import {
  Headline3,
} from "@sberdevices/plasma-ui";
import contacts_data from '../data/contacts.json';
import social_media from '../data/social_media.json';




import {DocStyle, getThemeBackgroundByChar} from '../themes/tools';
import {CHAR_TIMEPARAMOY, Character, IBuilding} from "../types/base";
import {SocialList} from '../components/SocialList'
import {ContactsCard} from '../components/ContactsCard'
import {
  HeaderLogoCol,
  HeaderTitleCol2,
  GoToDashboardButton,
} from '../components/TopMenu';



const Contacts = ({
                         character,
                         theme,
                         onDashboardClick,
                       }: {
  theme: string
  character: Character
    // todo: что такое 'timeParamoy' ???
    | typeof CHAR_TIMEPARAMOY
  onDashboardClick: () => void
}) => {
  return <DeviceThemeProvider>
    <DocStyle/>
    {
      getThemeBackgroundByChar(character, theme)
    }
          <Container style={{padding: 0, overflow: "hidden"}}>

            <Row style={{margin: "1em"}}>

              <HeaderLogoCol/>

              <HeaderTitleCol2
                title="Контакты"
              />

              <Col style={{margin: "0 0 0 auto"}}>
                <GoToDashboardButton
                  onClick={() => onDashboardClick()}
                />
              </Col>

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
            <div style={{
              width: '200px',
              height: '300px',
            }}></div>
          </Container>
  </DeviceThemeProvider>
}

export default Contacts
