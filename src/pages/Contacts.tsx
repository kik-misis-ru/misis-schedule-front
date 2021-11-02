import React from "react";
import {Container, Row, Col, DeviceThemeProvider} from '@sberdevices/plasma-ui';
import 'react-toastify/dist/ReactToastify.css';
import {
  Card,
  CardBody,
  CardContent,
  CardMedia,
  TextBox,
  Headline3,
  Body1,
  Caption,
  TextBoxSubTitle,
  TextBoxTitle,
  Badge,
  CellListItem,
} from "@sberdevices/plasma-ui";
import {IconLocation} from "@sberdevices/plasma-icons";
import contacts_data from '../data/contacts.json';
import social_media from '../data/social_media.json';



import {DocStyle, getThemeBackgroundByChar} from '../themes/tools';
import {CHAR_TIMEPARAMOY, Character, IBuilding} from "../types/base";
import {COLOR_BLACK} from '../components/consts';
import {
  HeaderLogoCol,
  HeaderTitleCol2,
  GoToDashboardButton,
  GoToHomeButton,
  GoToScheduleButton,
} from '../components/TopMenu';



const ContactsCard = ({
    site,
    text,
    tel,
    mail
  }: {
site: string
text: string
tel: string,
mail: string,
}) => {
return (
  <Col style={{margin: "0 1em 1em 1em"}}>
<Headline3>
{text}
</Headline3>
<Card
style={{
marginTop: "0.5em",
}}
>
<CardBody>
<CardContent>

{
    site!=="" ? (
<TextBox>
<Caption style={{color:"grey"}}>
Ссылка
</Caption>
<Body1 style={{color:"white"}}>
    <a href={site}  style={{color:"white"}}>
{site}
</a>
</Body1>
</TextBox>
    ) : 
    (<div></div>)
}

    { mail!==""&&tel!=="" ?
(
<TextBox>
<Caption style={{color:"grey"}}>
Телефон
</Caption>
<Body1 style={{color:"white"}}>
    <a href={`tel:${tel}`}  style={{color:"white"}}>
{tel}
</a>
</Body1>

<Caption style={{color:"grey"}}>
Почта
</Caption>
<a href={mail}  style={{color:"white"}}>
{mail}
</a>
</TextBox>
) : (<div></div>)

}
</CardContent>
</CardBody>
</Card>
</Col>
)
}

const SocialListItem = ({
    logo,
    name,
    link,
  }: {
logo: string,
name: string,
link: string,
}) => 
(
<CellListItem
contentLeft={
    <div>
   <a href={link}><img src="fl.png"></img></a>
   
  </div>
}
content={
    <a href={link} style={{color: "white", marginLeft: "1em"}}>{name}</a>
}
/>
)


const SocialList = ({
}: {

}) => (
<React.Fragment >
{
social_media.map((media) => //console.log(media, i)
(
<SocialListItem
logo={media.logo}
name={media.name}
link={media.link}
/>
)
)
}
</React.Fragment>
)

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
                title="Контакты"
              />

              <Col style={{margin: "0 0 0 auto"}}>
                <GoToDashboardButton
                  onClick={() => onDashboardClick()}
                />
              </Col>

            </Row>
            {contacts_data.map((contact) =>(
              <ContactsCard
                site={contact.site}
                text={contact.text}
                tel={contact.tel}
                mail={contact.mail}
              />
            ))}
                   
           <div style={{margin: "1.5em"}}>
            <Headline3>
            Мы в соцсетях
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
