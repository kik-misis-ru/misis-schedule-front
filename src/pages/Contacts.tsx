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

import vk from "../images/vk.png";
import tg from "../images/tg.png";
import ig from "../images/ig.png";
import ok from "../images/ok.png";
import fb from "../images/fb.png";
import tt from "../images/tt.png";
import yt from "../images/yt.png";
import fl from "../images/fl.png";
import tw from "../images/tw.png";
import yd from "../images/yd.png";

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

const socialMedia = [
    { name: "Вконтакте", logo: vk, link: "https://vk.com/nust_misis"},
    { name: "Telegram", logo: tg, link: "https://t.me/nust_misis"},
    { name: "Instagram", logo: ig, link: "https://www.instagram.com/NUST_MISIS/"},
    { name: "Одноклассники", logo: ok, link: "https://ok.ru/group/56080999448603"},
    { name: "Facebook", logo: fb, link: "https://www.facebook.com/misis.ru/"},
    { name: "TikTok", logo: tt, link: "https://www.tiktok.com/@nust_misis?lang=ru-RU"},
    { name: "YouTube", logo: yt, link: "https://www.youtube.com/nustmisis"},
    { name: "Flickr", logo: fl, link: "https://www.flickr.com/photos/99294142@N08/"},
    { name: "Twitter", logo: tw, link: "https://www.twitter.com/nust_misis"},
    { name: "Яндекс.Дзен", logo: yd, link: "https://www.zen.yandex.ru/id/5cd6e73edc906400b27ff7d7"},

]

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
   <a href={link}><img src={logo}></img></a>
   
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
socialMedia.map((media, i) => //console.log(media, i)
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
            <ContactsCard 
            site="https://misis.ru"
            text="Официальный сайт"
            tel=""
            mail=""
            />
            <ContactsCard 
            site=""
            text="Канцелярия"
            tel="8 495 955-00-32"
            mail="kancela@misis.ru"
            />
            <ContactsCard 
            site=""
            text="Приемная комиссия"
            tel="8 499 649-44-80"
            mail="vopros@misis.ru"
            />
            
            <div style={{margin: "1em"}}>
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
