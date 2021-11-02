import React, { useState } from "react";
import {Col, Row} from '@sberdevices/plasma-ui';
import 'react-toastify/dist/ReactToastify.css';
import {
  Card,
  CardBody,
  CardContent,
  TextBox,
  Headline3,
  Body1,
  TextBoxLabel,
  Caption,
  Button,
  CellListItem
} from "@sberdevices/plasma-ui";
//import {  } from "@sberdevices/plasma-ui/node_modules/@sberdevices/plasma-core";
import {
  IconChevronDown, IconChevronUp 
} from "@sberdevices/plasma-icons";


export const FAQCard = ({
    questions,
    text,
    answers
  }: {
questions: string
text: string
answers: string[],
}) => {
const [flag, setFlag] = useState(false);
const Click=()=>{
  
  setFlag(!flag);
}
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
<CardBody style={{padding: "0 0 0 0"}}>
<CardContent style={{padding: "0 0 0 0"}}>
<CellListItem 
style={{display:"flex", flexDirection: "row", alignItems: "flex-start", padding: "0 0 0 0", paddingLeft: "0.5em"}}

contentRight={
  <Button 
  style={{display:"flex", flexDirection: "row", alignItems: "flex-start", margin: "0 0 auto 0"}}
size="s"
view="clear"
pin="circle-circle"
onClick={() => {Click() }}
contentRight={ !flag ? (
  <IconChevronDown  size="s" color="inherit"/>) : (<IconChevronUp  size="s" color="inherit"/>)
}/>
}

content={
  flag ? (

<TextBox >
  <Row>
  <Col style={{margin: "0 0 0 auto"}}>
<TextBoxLabel style={{color:"grey"}}>
{questions}
</TextBoxLabel>
</Col>
</Row>
{answers.map((answer) =>(
              <Body1 style={{color:"white"}}>
              {answer}
              </Body1>
            ))}
</TextBox>) : (
<TextBox >
  <Row style={{display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
  <Col >
<TextBoxLabel style={{color:"grey"}}>
{questions}
</TextBoxLabel>
</Col>
</Row>
</TextBox>)
}
/>
</CardContent>
</CardBody>
</Card>
</Col>
)
}
