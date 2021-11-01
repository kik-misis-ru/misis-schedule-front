import React from "react";
import 'react-toastify/dist/ReactToastify.css';
import {
  CellListItem,
} from "@sberdevices/plasma-ui";
import social_media from '../data/social_media.json';


export const SocialListItem = ({
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


export const SocialList = ({
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