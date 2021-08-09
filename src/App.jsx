import React, { useState, useEffect } from "react";
import logo0 from "../src/unnamed.gif";
import logo from "../src/misis.svg";
import karta from "../src/Karta.png";
import groups from './groups_list.js';
import { Container, Row, Col, Button, Radiobox, Tabs, TabItem, Icon, DeviceThemeProvider, Header, Spinner, HeaderContent} from '@sberdevices/plasma-ui';
import { ToastContainer, toast } from 'react-toastify';
import { useToast, ToastProvider, Toast} from '@sberdevices/plasma-ui'
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
  HeaderLogo,
  HeaderRoot,
  HeaderTitle,
  CarouselGridWrapper,
  Carousel, CarouselCol,
  Note
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
  getScheduleFromDb,
  getUser,
  putScheduleIntoDb,
  updateUser,
} from "./APIHelper.js";
import { m } from "@sberdevices/plasma-core/mixins";
import { isConstructorDeclaration } from "typescript";


const initializeAssistant = (getState) => {
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
    this.tfRef = React.createRef();
    console.log('constructor');
    this.state = {
      notes: [],
      //
      userId: "",
      //
      page: 0,
      logo: logo0, 
      flag: false,
      description: "Привет",
      group: "",
      groupId: "",
      subGroup: "",
      engGroup: "", 
      res: "",
      correct: null,
      labelGroup: "Номер академической группы",
      labelSubgroup: "",
      labelEnggroup: "",
      i: 1,
      day: [['Понедельник', '' ], ['Вторник', ''], ['Среда', ''], ['Четверг', ''], ['Пятница', ''], ['Суббота', '']],
      days: [{
        bell_1: ["", "", ""],
        bell_2: ["", "", ""],
        bell_3: ["", "", ""],
        bell_4: ["", "", ""],
        bell_5: ["", "", ""],
        bell_6: ["", "", ""],
        bell_7: ["", "", ""]
       },
      {
          
        bell_1: ["", "", ""],
        bell_2: ["", "", ""],
        bell_3: ["", "", ""],
        bell_4: ["", "", ""],
        bell_5: ["", "", ""],
        bell_6: ["", "", ""],
        bell_7: ["", "", ""]
      },
      {
        bell_1: ["", "", ""],
        bell_2: ["", "", ""],
        bell_3: ["", "", ""],
        bell_4: ["", "", ""],
        bell_5: ["", "", ""],
        bell_6: ["", "", ""],
        bell_7: ["", "", ""]
      },
      {
        bell_1: ["", "", ""],
        bell_2: ["", "", ""],
        bell_3: ["", "", ""],
        bell_4: ["", "", ""],
        bell_5: ["", "", ""],
        bell_6: ["", "", ""],
        bell_7: ["", "", ""]
      },
      {
        bell_1: ["", "", ""],
        bell_2: ["", "", ""],
        bell_3: ["", "", ""],
        bell_4: ["", "", ""],
        bell_5: ["", "", ""],
        bell_6: ["", "", ""],
        bell_7: ["", "", ""]
      },
      {
        bell_1: ["", "", ""],
        bell_2: ["", "", ""],
        bell_3: ["", "", ""],
        bell_4: ["", "", ""],
        bell_5: ["", "", ""],
        bell_6: ["", "", ""],
        bell_7: ["", "", ""]
      }],
      spinner: false
        
    }
    this.Home = this.Home.bind(this);
    this.Menu = this.Menu.bind(this);
    this.Navigator = this.Navigator.bind(this);
    this.Raspisanie = this.Raspisanie.bind(this);
    this.RaspisanieToday = this.RaspisanieToday.bind(this);
  }
 
  componentDidMount() {   

    console.log('componentDidMount');
    /*
    функцию getUser нужно будет переместить ниже, после условия if (event.sub !== undefined)
    и передавать ей userId
    */
    getUser("101").then((user)=>{
      console.log(user)
      this.setState({groupId: user["group_id"]})
      this.setState({subGroup: user["subgroup_name"]})
      this.setState({engGroup: user["eng_group"]})
      this.convertIdInGroupName()
      getScheduleFromDb(this.state.groupId, this.getFirstDayWeek(new Date(Date.parse("05/12/2021") + 10800000))).then((response)=>{
        this.showWeekSchedule(response)
    });
    })

    this.assistant = initializeAssistant(() => this.getStateForAssistant());
    this.assistant.on("data", (event) => {
      if (event.type === "smart_app_data") {
        console.log("User");
        console.log(event);
        console.log('event.sub', event.sub);
        if (event.sub !== undefined) {
          console.log("Sub", event.sub);
          this.state.userId = event.sub;
          console.log(this.userId)
        }
      console.log(`assistant.on(data)`, event);
      const { action } = event;
      this.dispatchAssistantAction(action);
      }
    });
    this.assistant.on("start", (event) => {
      console.log(`assistant.on(start)`, event);
    });
    
  }

  dispatchAssistantAction (action) {
    console.log('dispatchAssistantAction', action);
    if (action) {
      switch (action.type) {
        case 'to_feed':
          return this.Change_img(1);

        case 'to_play':
          return this.Change_img(2);

        case 'to_sleep':
          return this.Change_img(3);
        
        case 'set_name':
          if (action.note !== undefined){
            this.setState({name : action.note});
          }
          break;
        default:
          //throw new Error();
      }
    }
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

  convertIdInGroupName() {
    console.log("convertIdInGroupName")
    for (let group of groups) {
      if (this.state.groupId === String(group.id)) {
        this.setState({group : group.name})
      }
    }
  }

  convertGroupNameInId(){
    for (let group of groups) {
      if (this.state.group.toLowerCase() === group.name.toLowerCase()) {
        this.state.groupId = group.id
        console.log(`groupId ${this.state.groupId}`)
      }
    }
  }


  // сколько миллисекунд в n днях
  msInDay(n) {
    return n * 24 * 3600000
  }


  // форматирование даты в "YYYY-MM-DD"
  formatearFecha = fecha => {
    const mes = fecha.getMonth() + 1; 
    const dia = fecha.getDate();
    return `${fecha.getFullYear()}-${(mes < 10 ? '0' : '').concat(mes)}-${(dia < 10 ? '0' : '').concat(dia)}`;
  };


  // получить дату первого дня недели
  getFirstDayWeek(date) {
    // номер дня недели
    this.weekDay = date.getDay()
    console.log(this.weekDay)
    if (this.weekDay === 0) return null
    else if (this.weekDay === 1) return this.formatearFecha(date)
    else {
        // число первого дня недели
        this.firstDay = date - this.msInDay(this.weekDay - 1) 
    } return this.formatearFecha(new Date(this.firstDay))
  }
  

  showSchedule(schedule, timeParam) {
    this.schedule = JSON.parse(schedule);
    let date = new Date(Date.parse("05/10/2021") + 10800000)
    let day_num = date.getDay()
    if (timeParam === "tomorrow") {day_num += 1}
    for (let bell in this.schedule["schedule"]) {
      if (this.schedule["schedule"][bell][`day_${day_num}`]["lessons"][0] !== undefined) {
        console.log(this.schedule["schedule"][bell][`day_${day_num}`]["lessons"][0]["subject_name"])
      }
    }
  }

  showWeekSchedule(schedule) {
    this.schedule = JSON.parse(schedule);
    for (let day_num = 1; day_num < 7; day_num++) {
      this.state.day[day_num-1][1]=this.schedule["schedule_header"][`day_${day_num}`]["date"];
      for (let bell in this.schedule["schedule"]) { //проверка 
        if (this.schedule["schedule"][bell]!==undefined)
        if (this.schedule["schedule"][bell][`day_${day_num}`]["lessons"][0] !== undefined) {
           
          this.state.days[day_num-1][bell][0]=this.schedule["schedule"][bell][`day_${day_num}`]["lessons"][0]["subject_name"];
          this.state.days[day_num-1][bell][1]=this.schedule["schedule"][bell][`day_${day_num}`]["lessons"][0]["teachers"][0]["name"];
          this.state.days[day_num-1][bell][2]=this.schedule["schedule"][bell][`day_${day_num}`]["lessons"][0]["rooms"][0]["name"];
          this.state.days[day_num-1][bell][3]=`${this.schedule["schedule"][bell][`header`]["start_lesson"]} - ${this.schedule["schedule"][bell][`header`]["end_lesson"]}`
        } else {
          this.state.days[day_num-1][bell][0]="";
          this.state.days[day_num-1][bell][1]="";
          this.state.days[day_num-1][bell][2]="";
          this.state.days[day_num-1][bell][3]="";
        
        }
      }
      this.state.spinner=true;
      console.log()
    }
  }
  

  Navigator(){
    return (
      <div  >
        <Container style = {{padding: 0}}>
        <Header
            logo={logo}
            title={`Навигатор`}
            style={{backgroundColor: "black"}}
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
          <h5 style={{margin: "1em", color: "#5487a4"}}>Корпус «Б» (главный)</h5>
          <h5 style={{margin: "1em", color: "#5487a4"}}>Ленинский проспект, дом 4</h5>
          <h5 style={{margin: "1em", color: "#72aa9f"}}>Корпус «К» </h5>
          <h5 style={{margin: "1em", color: "#72aa9f"}}>Крымский вал, дом 3</h5>
          <h5 style={{margin: "1em", color: "#906aa3"}}>Корпус «Г» (горный)</h5>
          <h5 style={{margin: "1em", color: "#906aa3"}}>Ленинский проспект, дом 6, строение 1</h5>         
          <h5 style={{margin: "1em", color: "#41588f"}}>Корпус «А» </h5>
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
      <div  >
        <Container style = {{padding: 0}}>
        <Header
            logo={logo}
            title={`Ответы на вопросы уже здесь`}
            style={{backgroundColor: "black"}}
        > <Button class="button" contentLeft={<IconPersone size="s" color="inherit"/>} view='secondary' size="s" pin="circle-circle"  onClick={()=>this.setState({ page: 0 })} style={{margin: "1em"}}/>
        </Header>
        <Row >
        
        <Button
        class = "button"
        style={{margin: '1em', color: "black"}}
        text='Расписание'
        size="l"
        view="secondary"
        pin="square-square"
        onClick={()=>this.setState({ page: 2 })}
        />
        </Row>
        <Row >
        
        <Button
        class = "button"
        style={{margin: '1em', color: "black"}}
        text='Навигатор'
        size="l"
        view="secondary"
        pin="square-square"
        onClick={()=>this.setState({ page: 3 })}
        />
        </Row>
        
        <Row>
        <Button
        class = "button"
        style={{margin: '1em', color: "black"}}
        text=' Контакты '
        size='l'
        view="secondary"
        pin="square-square"
        />
        
        </Row>
        <Row >
        
        <Button
        class = "button"
        style={{margin: '1em', color: "black"}}
        text="  Помощь  "
        size='l'
        view="secondary"
        pin="square-square"
        />
        </Row>
        </Container>
        </div>
    )
  }

  RaspisanieToday(timeParam){
    // this.schedule = JSON.parse(schedule);
    let date = new Date(Date.parse("05/10/2021") + 10800000)
    let day_num = date.getDay()
    let flag = false;
    if (timeParam === "tomorrow") {day_num += 1; flag = true;}
    // for (let bell in this.schedule["schedule"]) {
    //   if (this.schedule["schedule"][bell][`day_${day_num}`]["lessons"][0] !== undefined) {
    //     console.log(this.schedule["schedule"][bell][`day_${day_num}`]["lessons"][0]["subject_name"])
    //   }
    // }
  return(
    <div  >
        
          </div>
  );
  }

  Raspisanie(){
    return (
      <div  >
        <Container style = {{padding: 0}}>
        <Header
            logo={logo}
            title={`Расписание`}
            style={{backgroundColor: "black"}}
        > 
        <Button size="s" pin="circle-circle" onClick={()=>this.setState({ page: 0 })}><IconPersone size="s" color="inherit"/></Button>
        {/* <Button size="s" pin="circle-circle" style={{margin: "1em"}} onClick={()=>this.setState({ state: 1 })}><IconMoreVertical size="s" color="inherit"/></Button> */}
        </Header>

        <div >
          <Tabs view="black" size="m" style={{margin: "0.75em"}}>
            <TabItem isActive={true} onClick={()=>this.setState({ page: 2 })}>Текущая неделя
            </TabItem>
            <TabItem isActive={false} onClick={()=>this.setState({ page: 4 })}>Сегодня</TabItem>
            <TabItem isActive={false} onClick={()=>this.setState({page: 5})}>Завтра</TabItem>
          </Tabs>
        
        </div>

        <div style={{ flexDirection: "column" }}>
        <CarouselGridWrapper>
                    <Carousel
                        as={Row}
                        axis="y"
                        index={this.state.i}
                        scrollSnapType="mandatory"
                        detectActive
                        detectThreshold={0.5}
                        
                        onIndexChange={() => this.state.i++}
                        paddingStart="5%"
                        paddingEnd="50%"
                    >
                        {this.state.days.map(({ bell_1, bell_2, bell_3, bell_4, bell_5, bell_6, bell_7 }, i) => (
                            <CarouselCol key={`item:${i}`}>
                               <Card style={{ width: "90%", margin: "1em", paddingRight: "1em" }}>
            <CardBody>
              <CardContent>
                <TextBox>
                  <TextBoxBigTitle style={{color: "var(--plasma-colors-secondary)"}}>{this.state.day[i][0]} {this.state.day[i][1]}</TextBoxBigTitle>
                  <TextBoxSubTitle style={{ marginTop: "0.75rem" }} lines={8}>
                    {bell_1[3]}
                  </TextBoxSubTitle>
                  <CardParagraph2 >
                  {bell_1[0]}
                  </CardParagraph2>
                  <CardParagraph1> {bell_1[1]} {bell_1[2]}</CardParagraph1>
                  <TextBoxSubTitle style={{ marginTop: "0.75rem" }} lines={8}>
                  {bell_2[3]}
                  </TextBoxSubTitle>
                  <CardParagraph2 >
                  {bell_2[0]}
                  </CardParagraph2>
                  <CardParagraph1> {bell_2[1]} {bell_2[2]}</CardParagraph1>
                  <TextBoxSubTitle style={{ marginTop: "0.75rem" }} lines={8}>
                  {bell_3[3]}
                  </TextBoxSubTitle>
                  <CardParagraph2 >
                  {bell_3[0]}
                  </CardParagraph2>
                  <CardParagraph1> {bell_3[1]} {bell_3[2]}</CardParagraph1>
                  <TextBoxSubTitle style={{ marginTop: "0.75rem" }} lines={8}>
                  {bell_4[3]}
                  </TextBoxSubTitle>
                  <CardParagraph2 >
                  {bell_4[0]}
                  </CardParagraph2>
                  <CardParagraph1> {bell_4[1]} {bell_4[2]}</CardParagraph1>
                  <TextBoxSubTitle style={{ marginTop: "0.75rem" }} lines={8}>
                  {bell_5[3]}
                  </TextBoxSubTitle>
                  <CardParagraph2 >
                  {bell_5[0]}
                  </CardParagraph2>
                  <CardParagraph1> {bell_5[1]} {bell_5[2]}</CardParagraph1>
                 
                  <TextBoxSubTitle style={{ marginTop: "0.75rem" }} lines={8}>
                  {bell_6[3]}
                  </TextBoxSubTitle>
                  <CardParagraph2 >
                  {bell_6[0]}
                  </CardParagraph2>
                  <CardParagraph1> {bell_6[1]} {bell_6[2]}</CardParagraph1>
                  <TextBoxSubTitle style={{ marginTop: "0.75rem" }} lines={8}>
                  {bell_7[3]}
                  </TextBoxSubTitle>
                  <CardParagraph2 >
                  {bell_7[0]}
                  </CardParagraph2>
                  <CardParagraph1> {bell_7[1]} {bell_7[2]}</CardParagraph1>
                  </TextBox>
                
                <br />
                
              </CardContent>
            </CardBody>
          </Card>

                            </CarouselCol>
                        ))}
                    </Carousel>
                </CarouselGridWrapper>
          
          <div style={{
        width:  '150px',
        height: '150px',
        }}></div>
        </div>

        </Container>
      </div>
    )
  }
  
  Home(){
    let disabled=true;
    if (this.state.groupId!==undefined) disabled=false;
    return (
      <div  >
        <Container style = {{padding: 0}}>
        <HeaderRoot
            style={{backgroundColor: "black"}}
        >  <HeaderLogo src={logo} alt="МИСиС" style={{height: "15px", width: "15px", margin:"1em"}}/> 
        <HeaderTitle>Мой МИСиС</HeaderTitle>
        <HeaderContent>
        <Button class="button" view='secondary' disabled={disabled} text='Расписание' contentRight={<IconMoreVertical size="s" color="inherit"/>} size="s" pin="circle-circle"  onClick={()=>this.setState({ page: 6 })} style={{margin: "1em"}}/> 
        </HeaderContent>
        </HeaderRoot>
        
        <div >
          <h3 style={{margin: '2em', textAlign: "center"}}>Привет, студент! </h3>
          <h5 color="var(--plasma-colors-button-white-secondary)" style={{margin: '2em', textAlign: "center"}}>Заполни данные ниже</h5>
          <TextField
          id="tf"
          label={this.state.labelGroup}

          className="editText"
          // placeholder="Напиши номер своей академической группы"
          value={this.state.group}
          style={{margin: "2em"}}
          onChange={(v) =>
            this.setState({
              group: v.target.value,
            })
          }
        />
        
          <TextField
          id="tf"
          className="editText"
          label="Номер подгруппы: 1 или 2"
          value={this.state.subGroup}
          style={{margin: "2em"}}
          onChange={(s) =>
            this.setState({
              subGroup: s.target.value,
            })
          }
        />
        
          <TextField
          id="tf"
          className="editText"
          label="Номер группы по английскому"
          value={this.state.engGroup}
          style={{margin: "2em"}}
          onChange={(e) =>
            this.setState({
              engGroup: e.target.value,
            })
          }
        />
          <Row style={{display: "flex", alignItems: "flex-start", justifyContent:"center", marginTop: "3em"}}>
          <Button text="Сохранить" view="primary"  onClick={()=>this.isCorrect()}/>
        </Row></div>
        </Container>
      </div>
    )
  }

  isCorrect(){
    this.setState({correct: false})
    for (let i of groups) {
      if (this.state.group.toLowerCase() === i.name.toLowerCase()) {
        this.state.correct = true
        console.log(`Correct ${this.state.correct}`)
        this.convertGroupNameInId()
    } 
  }
  if (this.state.correct===true){
    console.log("ok");
    this.state.disabled=false;
    this.state.spinner=false;
    this.state.userId="101";
    createUser("101", "808", String(this.state.groupId), String(this.state.subGroup), String(this.state.engGroup));
      this.setState({label_group: "Группа сохранена"});
      getScheduleFromDb(this.state.groupId, this.getFirstDayWeek(new Date(Date.parse("05/12/2021") + 10800000))).then((response)=>{
      this.showWeekSchedule(response);
  });
    } else this.setState({label_group: "Некорректно"});
    
  }

  Spinner(){
    
    var myinterval =setInterval(() => {
      if (this.state.spinner === true){
    this.setState({page: 2});
    clearInterval(myinterval)}
    }, 100);
    
    return(
      <div  >
        <Container style = {{padding: 0}}>
        {/* <Header
            logo={logo}
            title={`Привет, студент!`}
            style={{backgroundColor: "black"}}
        > <Button class="button" view='secondary' disabled={disabled} text='Меню' contentRight={<IconMoreVertical size="s" color="inherit"/>} size="s" pin="circle-circle"  onClick={()=>this.setState({ page: 1 })} style={{margin: "1em"}}/> 
        </Header> */}
        <Spinner color="var(--plasma-colors-button-accent)" style={{position:" absolute", top: "40%", left:" 45%", marginRight: "-50%"}}/>
        
        </Container>
      </div>
    )
  }

  render() {
    console.log('render');
    switch(this.state.page){
      case 0:
        return this.Home();
      case 1:
        return this.Menu();
      case 2:
        return this.Raspisanie();
      case 3:
        return this.Navigator();
      case 4:
        return  this.RaspisanieToday("today");
      case 5:
        return this.RaspisanieToday("tomorrow");
      case 6:
        return this.Spinner();
      default:
        break;
      }
  }
}

