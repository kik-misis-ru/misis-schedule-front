import React from "react";
import {Col} from '@sberdevices/plasma-ui';
import 'react-toastify/dist/ReactToastify.css';
import {
  Card,
  CardBody,
  CardContent,
  TextBox,
  Headline3,
  Body1,
  Caption,
} from "@sberdevices/plasma-ui";

export const ContactsCard = ({
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
              site !== "" ? (
                  <TextBox>
                    <Caption style={{color: "grey"}}>
                      Ссылка
                    </Caption>
                    <Body1 style={{color: "white"}}>
                      <a href={site} style={{color: "white"}}>
                        {site}
                      </a>
                    </Body1>
                  </TextBox>
                ) :
                (<div></div>)
            }

            {
              mail !== "" && tel !== "" ?
              (
                <TextBox>
                  <Caption style={{color: "grey"}}>
                    Телефон
                  </Caption>
                  <Body1 style={{color: "white"}}>
                    <a href={`tel:${tel}`} style={{color: "white"}}>
                      {tel}
                    </a>
                  </Body1>

                  <Caption style={{color: "grey"}}>
                    Почта
                  </Caption>
                  <a href={mail} style={{color: "white"}}>
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
