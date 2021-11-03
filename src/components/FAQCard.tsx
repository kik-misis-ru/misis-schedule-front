import React from "react";
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
let flag=false;
const Click=()=>{
  console.log(flag)
  //return flag=!flag;
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
style={{padding: "0 0 0 0", paddingLeft: "0.5em"}}



content={
  !flag ? (

<TextBox >
  <Row>
  <Col size={3}>
<TextBoxLabel style={{color:"grey"}}>
{questions}
</TextBoxLabel>
</Col>
<Col>
<Button 
style={{margin: "0 0 0 auto"}}
size="s"
view="clear"
pin="circle-circle"
onClick={() => {Click() }}
contentRight={ flag ? (
  <IconChevronDown  size="s" color="inherit"/>) : (<IconChevronUp  size="s" color="inherit"/>)
}/>
</Col>
</Row>
{answers.map((answer) =>(
              <Body1 style={{color:"white"}}>
              {answer}
              </Body1>
            ))}
</TextBox>) : (<TextBox >
<TextBoxLabel style={{color:"grey"}}>
{questions}
</TextBoxLabel>
</TextBox>)
}
/>
</CardContent>
</CardBody>
</Card>
</Col>
)
}
