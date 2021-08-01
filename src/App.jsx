import React from "react";
import logo0 from "../src/unnamed.gif";
import logo from "../src/logo_new.png";
import karta from "../src/Karta.png";
import { Container, Row, Col, Button, Radiobox, Tabs, TabItem, Icon, DeviceThemeProvider, Header} from '@sberdevices/plasma-ui';
import { ToastContainer, toast } from 'react-toastify';
import { detectDevice } from '@sberdevices/plasma-ui/utils';
import { text, background, gradient } from '@sberdevices/plasma-tokens';
import 'react-toastify/dist/ReactToastify.css';
import {
  MarkedList,
  MarkedItem,
  Card,
  CardBody,
  CardContent,
  TextBoxBigTitle,
  TextBox,
  TextBoxSubTitle,
  CardParagraph1,
  CardParagraph2,
  Spinner,
} from "@sberdevices/plasma-ui";
import {
  createSmartappDebugger,
  createAssistant,
} from "@sberdevices/assistant-client";
import "./App.css";
import { TextField, ActionButton } from "@sberdevices/plasma-ui";
import { IconMessage,  IconMoreVertical, IconMoreHorizontal, IconPersone} from "@sberdevices/plasma-icons";


import {
  createUser,
  getUser,
  updateUser,
} from "./APIHelper.js";
import { m } from "@sberdevices/plasma-core/mixins";

const initializeAssistant = (getState/*: any*/) => {
  if (process.env.NODE_ENV === "development") {
    return createSmartappDebugger({
      token: process.env.REACT_APP_TOKEN ?? "",
      initPhrase: `Запусти ${process.env.REACT_APP_SMARTAPP}`,
      getState,
    });
  }
  return createAssistant({ getState });
};


export class App extends React.Component {
  
  constructor(props) {
    super(props);
    console.log('constructor');
    this.state = {
      notes: [],
      //
      UserId: "",
      //
      state: 0,
      logo: logo0, 
      flag: false,
      description: "Привет",
    }
    this.Home = this.Home.bind(this);
    this.Menu = this.Menu.bind(this);
    this.Navigator = this.Navigator.bind(this);
  }

  componentDidMount() {   
    console.log('componentDidMount');
    this.assistant = initializeAssistant(() => this.getStateForAssistant());
    this.assistant.on("data", (event /*: any*/) => {
      if (event.type == "smart_app_data") {
        console.log("User");
        console.log(event);
        console.log('event.sub', event.sub);
      console.log(`assistant.on(data)`, event);
      const { action } = event;
      
      }
    });
    this.assistant.on("start", (event) => {
      console.log(`assistant.on(start)`, event);
    });

    
  }

 
  
  getStateForAssistant () {
    console.log('getStateForAssistant: this.state:', this.state)
    const state = {
      item_selector: {
        items: this.state.notes.map(
          ({ id, title }, index) => ({
            number: index + 1,
            id,
            title,
          })
        ),
      },
    };
    console.log('getStateForAssistant: state:', state)
    return state;
  }


  assistant_global_event(phrase) {
    this.assistant.sendData({
      action: {
        action_id: phrase
      }
    })
    
  }

  Navigator(){
    return (
      <div class="body">
        <Container style = {{padding: 0}}>
        <Header
            logo={logo}
            title={`Навигатор`}
            style={{backgroundColor: "white"}}
        > 
        <Button size="s" pin="circle-circle" onClick={()=>this.setState({ state: 0 })}><IconPersone size="s" color="inherit"/></Button>
        <Button size="s" pin="circle-circle" style={{margin: "1em"}} onClick={()=>this.setState({ state: 1 })}><IconMoreVertical size="s" color="inherit"/></Button>
        </Header>
        <Row><Col sizeXL={10} offset={1}>
              <div >
            <Tabs
            size='s'
            view= 'secondary'
            
        >
                <TabItem
                isActive = {!this.state.flag}
                onClick={()=>this.setState({ flag: true})}
                >
                    Корпуса
                </TabItem>
                <TabItem
                isActive = {this.state.flag}
                onClick={()=>this.setState({ flag: false})}
                >
                    Столовые 
                </TabItem>
        </Tabs> </div>
              </Col></Row>
        <Row>
          <Col type="calc" size={8}>
          <img src={karta} class="img" />
          </Col>
          <Col size={4}>
          <div class="chatbox">
          <h4 style={{margin: "1em", color: "#5487a4"}}>Корпус «Б» (главный)</h4>
          <h5 style={{margin: "1em", color: "#5487a4"}}>Ленинский проспект, дом 4</h5>
          <h4 style={{margin: "1em", color: "#72aa9f"}}>Корпус «К» </h4>
          <h5 style={{margin: "1em", color: "#72aa9f"}}>Крымский вал, дом 3</h5>
          <h4 style={{margin: "1em", color: "#906aa3"}}>Корпус «Г» (горный)</h4>
          <h5 style={{margin: "1em", color: "#906aa3"}}>Ленинский проспект, дом 6, строение 1</h5>         
          <h4 style={{margin: "1em", color: "#41588f"}}>Корпус «А» </h4>
          <h5 style={{margin: "1em", color: "#41588f"}}>Ленинский проспект, дом 6, строение 2</h5>
        </div>
          
          </Col>
        </Row>
       <Row>
         <div style={{
        width:  '200px',
        height: '200px',
        }}></div>
       </Row>
        </Container>
      </div>
    )
  }

  Menu(){
    console.log("Menu");
    return(
      <div class="body">
        <Container style = {{padding: 0}}>
        <Header
            logo={logo}
            title={`Ответы на вопросы уже здесь`}
            style={{backgroundColor: "white"}}
        > <Button class="button" contentLeft={<IconPersone size="s" color="inherit"/>} view='secondary' size="s" pin="circle-circle"  onClick={()=>this.setState({ state: 0 })} style={{margin: "1em"}}/>
        </Header>
        <Row >
        
        <Button
        class = "button"
        style={{margin: '1em', color: "white"}}
        text='Расписание'
        size="m"
        view="secondary"
        pin="square-square"
        onClick={()=>this.setState({ state: 2 })}
        />
        </Row>
        <Row >
        
        <Button
        class = "button"
        style={{margin: '1em', color: "white"}}
        text='Навигатор'
        size="m"
        view="secondary"
        pin="square-square"
        onClick={()=>this.setState({ state: 3 })}
        />
        </Row>
        
        <Row>
        <Button
        class = "button"
        style={{margin: '1em', color: "white"}}
        text=' Контакты '
        size='m'
        view="secondary"
        pin="square-square"
        />
        
        </Row>
        <Row >
        
        <Button
        class = "button"
        style={{margin: '1em', color: "white"}}
        text="  Помощь  "
        size='m'
        view="secondary"
        pin="square-square"
        />
        </Row>
        </Container>
        </div>
    )
  }

  Raspisanie(){
    return (
      <div class="body">
        <Container style = {{padding: 0}}>
        <Header
            logo={logo}
            title={`Расписание`}
            style={{backgroundColor: "white"}}
        > 
        <Button size="s" pin="circle-circle" onClick={()=>this.setState({ state: 0 })}><IconPersone size="s" color="inherit"/></Button>
        <Button size="s" pin="circle-circle" style={{margin: "1em"}} onClick={()=>this.setState({ state: 1 })}><IconMoreVertical size="s" color="inherit"/></Button>
        </Header>

        <div style={{ flexDirection: "column" }}>
          <Card style={{ width: "20rem", margin: "2em" }}>
            <CardBody>
              <CardContent>
                <TextBox>
                  <TextBoxBigTitle style={{color: "var(--plasma-colors-secondary)"}}>Понедельник</TextBoxBigTitle>
                  <CardParagraph1 style={{ marginTop: "0.75rem" }} lines={8}>
                    9:00-10:35
                  </CardParagraph1>
                  <CardParagraph2 >
                    Матанализ
                  </CardParagraph2>
                  <TextBoxSubTitle> Б-908, Левшина</TextBoxSubTitle>
                  <CardParagraph1 style={{ marginTop: "0.75rem" }} lines={8}>
                    10:50-12:25
                  </CardParagraph1>
                  <CardParagraph2 >
                    Технология программирования
                  </CardParagraph2>
                  <TextBoxSubTitle> К-312, Широков</TextBoxSubTitle>
                </TextBox>
                <br />
                
              </CardContent>
            </CardBody>
          </Card>
          <Card style={{ width: "20rem", margin: "2em" }}>
            <CardBody>
              <CardContent>
                <TextBox>
                  <TextBoxBigTitle style={{color: "var(--plasma-colors-secondary)"}}>Вторник</TextBoxBigTitle>
                  <CardParagraph1 style={{ marginTop: "0.75rem" }} lines={8}>
                    12:40-14:15
                  </CardParagraph1>
                  <CardParagraph2 >
                    Физкультура
                  </CardParagraph2>
                  <TextBoxSubTitle>Спорткомплекс</TextBoxSubTitle>
                </TextBox>
                <br />
                
              </CardContent>
            </CardBody>
          </Card>
          <Card style={{ width: "20rem", margin: "2em" }}>
            <CardBody>
              <CardContent>
                <TextBox>
                  <TextBoxBigTitle style={{color: "var(--plasma-colors-secondary)"}}>Среда</TextBoxBigTitle>
                  <CardParagraph1 style={{ marginTop: "0.75rem" }} lines={8}>
                    16:40-18:05
                  </CardParagraph1>
                  <TextBoxSubTitle>Сетевые технологии, Л-521, Крынецкая</TextBoxSubTitle>
                </TextBox>
                <br />
                
              </CardContent>
            </CardBody>
          </Card>
          <Card style={{ width: "20rem", margin: "2em" }}>
            <CardBody>
              <CardContent>
                <TextBox>
                  <TextBoxBigTitle style={{color: "var(--plasma-colors-secondary)"}}>Четверг</TextBoxBigTitle>
                  <CardParagraph1 style={{ marginTop: "0.75rem" }} lines={8}>
                    16:40-18:05
                  </CardParagraph1>
                  <TextBoxSubTitle>Сетевые технологии, Л-521, Крынецкая</TextBoxSubTitle>
                </TextBox>
                <br />
                
              </CardContent>
            </CardBody>
          </Card>
          <Card style={{ width: "20rem", margin: "2em" }}>
            <CardBody>
              <CardContent>
                <TextBox>
                  <TextBoxBigTitle style={{color: "var(--plasma-colors-secondary)"}}>Пятница</TextBoxBigTitle>
                  <CardParagraph1 style={{ marginTop: "0.75rem" }} lines={8}>
                    16:40-18:05
                  </CardParagraph1>
                  <TextBoxSubTitle>Сетевые технологии, Л-521, Крынецкая</TextBoxSubTitle>
                </TextBox>
                <br />
                
              </CardContent>
            </CardBody>
          </Card>
          <Card style={{ width: "20rem", margin: "2em" }}>
            <CardBody>
              <CardContent>
                <TextBox>
                  <TextBoxBigTitle style={{color: "var(--plasma-colors-secondary)"}}>Суббота</TextBoxBigTitle>
                  <CardParagraph1 style={{ marginTop: "0.75rem" }} lines={8}>
                    
                  </CardParagraph1>
                  <TextBoxSubTitle></TextBoxSubTitle>
                </TextBox>
                <br />
                
              </CardContent>
            </CardBody>
          </Card>
          <div style={{
        width:  '200px',
        height: '200px',
        }}></div>
        </div>

        </Container>
      </div>
    )
  }
  
  Home(){
    const group = '';
    const eng='';
    return (
      <div class="body">
        <Container style = {{padding: 0}}>
        <Header
            logo={logo}
            title={`Привет, студент!`}
            style={{backgroundColor: "white"}}
        > <Button class="button" view='secondary' text='Меню' contentRight={<IconMoreVertical size="s" color="inherit"/>} size="s" pin="circle-circle"  onClick={()=>this.setState({ state: 1 })} style={{margin: "1em"}}/> 
        </Header>
        
        <div class="chat">
          <h3 style={{margin: '1em'}}>Моя академическая группа</h3>
          <TextField
          id="tf"
          className="editText"
          placeholder="Напиши номер своей академической группы"
          color="var(--plasma-colors-voice-phrase-gradient)"
          value={this.state.group}
        />
        <h3 style={{margin: '1em'}}>Номер подгруппы</h3>
          <TextField
          id="tf"
          className="editText"
          placeholder="1 или 2"
          color="var(--plasma-colors-voice-phrase-gradient)"
          value={this.state.group}
        />
        <h3 style={{margin: '1em'}}>Группа по английскому</h3>
          <TextField
          id="tf"
          className="editText"
          placeholder="Напиши номер своей группы по английскому"
          color="var(--plasma-colors-voice-phrase-gradient)"
          value={this.state.group}
        />
          
          <Button text="Сохранить" view="primary" style={{alignSelf: "center", marginTop: "auto"}} onClick={()=>console.log("Button")}/>
        </div>
        </Container>
      </div>
    )
  }
  render() {
    console.log('render');
    switch(this.state.state){
      case 0:
        return this.Home();
      case 1:
        return this.Menu();
      case 2:
        return this.Raspisanie();
      case 3:
        return this.Navigator();
      default:
        break;
      }
  }
}