import React, { useState, useEffect } from "react";
import logo0 from "../src/unnamed.gif";
import logo from "../src/logo.png";
import karta from "../src/Karta.png";
import groups from './groups_list.js';
import { Container, Row, Col, Button, Radiobox, Tabs, TabItem, Icon, DeviceThemeProvider, Header, Spinner, HeaderContent, Cell} from '@sberdevices/plasma-ui';
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
  TextBoxTitle,
  HeaderLogo,
  HeaderRoot,
  HeaderTitle,
  CarouselGridWrapper,
  Carousel, CarouselCol,
  Note,
  Badge
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
      page: 7,
      logo: logo0, 
      flag: true,
      description: "Заполни данные, чтобы открывать расписание одной фразой",
      group: "",
      groupId: "",
      subGroup: "",
      engGroup: "", 
      res: "",
      correct: null,
      labelGroup: "Номер академической группы",
      labelSubgroup: "",
      labelEnggroup: "",
      i: 0,
      j: 0,
      day: [{ title: 'Пн', date: ["",""], count: [0, 0] }, { title: 'Вт', date: ["",""], count: [0, 0] }, { title: 'Ср', date: ["",""], count: [0, 0] }, { title: 'Чт', date: ["",""], count: [0, 0] }, { title: 'Пт', date: ["",""], count: [0, 0] }, { title: 'Сб', date: ["",""], count: [0, 0] }],
      days: [{
        bell_1: [["", "", "", "", "rgba(0, 0, 0, 0)"], ["", "", "", "", "rgba(0, 0, 0, 0)"]],
        bell_2: [["", "", "", "", "rgba(0, 0, 0, 0)"], ["", "", "", "", "rgba(0, 0, 0, 0)"]],
        bell_3: [["", "", "", "", "rgba(0, 0, 0, 0)"], ["", "", "", "", "rgba(0, 0, 0, 0)"]],
        bell_4: [["", "", "", "", "rgba(0, 0, 0, 0)"], ["", "", "", "", "rgba(0, 0, 0, 0)"]],
        bell_5: [["", "", "", "", "rgba(0, 0, 0, 0)"], ["", "", "", "", "rgba(0, 0, 0, 0)"]],
        bell_6: [["", "", "", "", "rgba(0, 0, 0, 0)"], ["", "", "", "", "rgba(0, 0, 0, 0)"]],
        bell_7: [["", "", "", "", "rgba(0, 0, 0, 0)"], ["", "", "", "", "rgba(0, 0, 0, 0)"]],
       },
      {
        bell_1: [["", "", "", "", "rgba(0, 0, 0, 0)"], ["", "", "", "", "rgba(0, 0, 0, 0)"]],
        bell_2: [["", "", "", "", "rgba(0, 0, 0, 0)"], ["", "", "", "", "rgba(0, 0, 0, 0)"]],
        bell_3: [["", "", "", "", "rgba(0, 0, 0, 0)"], ["", "", "", "", "rgba(0, 0, 0, 0)"]],
        bell_4: [["", "", "", "", "rgba(0, 0, 0, 0)"], ["", "", "", "", "rgba(0, 0, 0, 0)"]],
        bell_5: [["", "", "", "", "rgba(0, 0, 0, 0)"], ["", "", "", "", "rgba(0, 0, 0, 0)"]],
        bell_6: [["", "", "", "", "rgba(0, 0, 0, 0)"], ["", "", "", "", "rgba(0, 0, 0, 0)"]],
        bell_7: [["", "", "", "", "rgba(0, 0, 0, 0)"], ["", "", "", "", "rgba(0, 0, 0, 0)"]],
      },
      {
        bell_1: [["", "", "", "", "rgba(0, 0, 0, 0)"], ["", "", "", "", "rgba(0, 0, 0, 0)"]],
        bell_2: [["", "", "", "", "rgba(0, 0, 0, 0)"], ["", "", "", "", "rgba(0, 0, 0, 0)"]],
        bell_3: [["", "", "", "", "rgba(0, 0, 0, 0)"], ["", "", "", "", "rgba(0, 0, 0, 0)"]],
        bell_4: [["", "", "", "", "rgba(0, 0, 0, 0)"], ["", "", "", "", "rgba(0, 0, 0, 0)"]],
        bell_5: [["", "", "", "", "rgba(0, 0, 0, 0)"], ["", "", "", "", "rgba(0, 0, 0, 0)"]],
        bell_6: [["", "", "", "", "rgba(0, 0, 0, 0)"], ["", "", "", "", "rgba(0, 0, 0, 0)"]],
        bell_7: [["", "", "", "", "rgba(0, 0, 0, 0)"], ["", "", "", "", "rgba(0, 0, 0, 0)"]],
      },
      {
        bell_1: [["", "", "", "", "rgba(0, 0, 0, 0)"], ["", "", "", "", "rgba(0, 0, 0, 0)"]],
        bell_2: [["", "", "", "", "rgba(0, 0, 0, 0)"], ["", "", "", "", "rgba(0, 0, 0, 0)"]],
        bell_3: [["", "", "", "", "rgba(0, 0, 0, 0)"], ["", "", "", "", "rgba(0, 0, 0, 0)"]],
        bell_4: [["", "", "", "", "rgba(0, 0, 0, 0)"], ["", "", "", "", "rgba(0, 0, 0, 0)"]],
        bell_5: [["", "", "", "", "rgba(0, 0, 0, 0)"], ["", "", "", "", "rgba(0, 0, 0, 0)"]],
        bell_6: [["", "", "", "", "rgba(0, 0, 0, 0)"], ["", "", "", "", "rgba(0, 0, 0, 0)"]],
        bell_7: [["", "", "", "", "rgba(0, 0, 0, 0)"], ["", "", "", "", "rgba(0, 0, 0, 0)"]],
      },
      {
        bell_1: [["", "", "", "", "rgba(0, 0, 0, 0)"], ["", "", "", "", "rgba(0, 0, 0, 0)"]],
        bell_2: [["", "", "", "", "rgba(0, 0, 0, 0)"], ["", "", "", "", "rgba(0, 0, 0, 0)"]],
        bell_3: [["", "", "", "", "rgba(0, 0, 0, 0)"], ["", "", "", "", "rgba(0, 0, 0, 0)"]],
        bell_4: [["", "", "", "", "rgba(0, 0, 0, 0)"], ["", "", "", "", "rgba(0, 0, 0, 0)"]],
        bell_5: [["", "", "", "", "rgba(0, 0, 0, 0)"], ["", "", "", "", "rgba(0, 0, 0, 0)"]],
        bell_6: [["", "", "", "", "rgba(0, 0, 0, 0)"], ["", "", "", "", "rgba(0, 0, 0, 0)"]],
        bell_7: [["", "", "", "", "rgba(0, 0, 0, 0)"], ["", "", "", "", "rgba(0, 0, 0, 0)"]],
      },
      {
        bell_1: [["", "", "", "", "rgba(0, 0, 0, 0)"], ["", "", "", "", "rgba(0, 0, 0, 0)"]],
        bell_2: [["", "", "", "", "rgba(0, 0, 0, 0)"], ["", "", "", "", "rgba(0, 0, 0, 0)"]],
        bell_3: [["", "", "", "", "rgba(0, 0, 0, 0)"], ["", "", "", "", "rgba(0, 0, 0, 0)"]],
        bell_4: [["", "", "", "", "rgba(0, 0, 0, 0)"], ["", "", "", "", "rgba(0, 0, 0, 0)"]],
        bell_5: [["", "", "", "", "rgba(0, 0, 0, 0)"], ["", "", "", "", "rgba(0, 0, 0, 0)"]],
        bell_6: [["", "", "", "", "rgba(0, 0, 0, 0)"], ["", "", "", "", "rgba(0, 0, 0, 0)"]],
        bell_7: [["", "", "", "", "rgba(0, 0, 0, 0)"], ["", "", "", "", "rgba(0, 0, 0, 0)"]],
      }],
      spinner: false,
      date: Date.parse("05/12/2021"),
      today: 0,
    }
    this.Home = this.Home.bind(this);
    // this.Navigator = this.Navigator.bind(this);
    this.Raspisanie = this.Raspisanie.bind(this);
    
  }
 
  componentDidMount() {   
    console.log('componentDidMount');
    
    this.assistant = initializeAssistant(() => this.getStateForAssistant());
    this.assistant.on("data", (event) => {
      if (event.type === "smart_app_data") {
        console.log("User");
        console.log(event);
        if (event.sub !== undefined) {
          console.log("Sub", event.sub);
          this.state.userId = event.sub;
          getUser(this.state.userId).then((user)=>{
            if (user !== "0") {
              console.log('user', user)
              this.setState({groupId: user["group_id"]})
              this.setState({subGroup: user["subgroup_name"]})
              this.setState({engGroup: user["eng_group"]})
              this.convertIdInGroupName()
              getScheduleFromDb(this.state.groupId, this.getFirstDayWeek(new Date(Date.parse("05/12/2021") + 10800000))).then((response)=>{
                this.showWeekSchedule(response, 0)
            });
            getScheduleFromDb(this.state.groupId, this.getFirstDayWeek(new Date(Date.parse("05/12/2021") + 604800000))).then((response)=>{
              this.showWeekSchedule(response, 1)
          });
              // this.setState({page: 6});
              this.setState({description: "Здесь можно изменить данные", page: 7});
            } else {
          this.setState({page: 0});
        }
          })
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


  // определяет когда начинаются пары сегодня или завтра
  getStartFirstLesson(day) {
    let dict = {"today": 1, "tomorrow": 0}
    day = dict[day]
    for (let bell in this.state.days[this.state.today - day]) {
      if (this.state.days[this.state.today - day][bell][0][3] !== "") {
        return this.state.days[this.state.today - day][bell][0][3].slice(0,6)
      }
    }
  }

  // определяет когда кончаются пары сегодня или завтра
  getEndLastLesson(day) {
    let dict = {"today": 1, "tomorrow": 0}
    day = dict[day]
    for (let bell = 7; bell > 0; bell--) {
      if (this.state.days[this.state.today - day][`bell_${bell}`][0][2] !== "") {
        return this.state.days[this.state.today - day][`bell_${bell}`][0][3].slice(8)
      }
    }
  }

  // определяет начало или конец энной пары сегодня или завтра
  getBordersRequestLesson(type, day, lessonNum) {
    let dict = {"today": 1, "tomorrow": 0}
    day = dict[day]
    if (this.state.days[this.state.today - day][`bell_${lessonNum}`][0][3] !== "") {
      if (type === "start") {
        return this.state.days[this.state.today - day][`bell_${lessonNum}`][0][3].slice(0, 6)
      } else {
        return this.state.days[this.state.today - day][`bell_${lessonNum}`][0][3].slice(8)
      }
    }
  }

  getStartEndLesson(type, day, lessonNum) {
    if (type === "start") {
      if (day === "today") {
        if (lessonNum === "0") {
          return [type, day, this.getStartFirstLesson(day)]
        } else {
          return this.getBordersRequestLesson(type, day, lessonNum)
        }
      } else {
        if (lessonNum === "0") {
          return this.getStartFirstLesson(day)
        } else {
          return this.getBordersRequestLesson(type, day, lessonNum)
        }
      }
    } else if (type === "end") {
      if (day === "today") {
        if (lessonNum === "0") {
          return this.getEndLastLesson(day)
        } else {
          return this.getBordersRequestLesson(type, day, lessonNum)
        }
      } else {
        if (lessonNum === "0") {
          return this.getEndLastLesson(day)
        } else {
          return this.getBordersRequestLesson(type, day, lessonNum)
        }
      }
    }
  }

  dispatchAssistantAction (action) {
    console.log('dispatchAssistantAction', action);
    if (action) {
      switch (action.type) {
        case 'for_today':
          return this.setState({page: this.state.today});

        case 'for_tomorrow':
          return this.setState({page: this.state.today+1});
        
        case 'for_week':
          return this.setState({page: 1});

        case 'when_lesson':
          let answer = this.getStartEndLesson(action.note[0], action.note[1], action.note[2])  
          console.log("answer", answer) 
          ///
          this.assistant.sendData({
            action: {
              action_id: "say",
              parameters: {
                type: answer[0],
                day: answer[1],
                time: answer[2]
              },
            },
          })
          if (answer[1]==='today') this.setState({page: this.state.today});
          else this.setState({page: this.state.today+1});

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
  //new Date(this.state.date + msInDay(7) + 10800000)


  // форматирование даты в "YYYY-MM-DD"
  formatearFecha = fecha => {
    const mes = fecha.getMonth() + 1; 
    const dia = fecha.getDate();
    return `${fecha.getFullYear()}-${(mes < 10 ? '0' : '').concat(mes)}-${(dia < 10 ? '0' : '').concat(dia)}`;
  };


  // получить дату первого дня недели
  getFirstDayWeek(date) {
    // номер дня недели
    var now= new Date();
    this.setState({today: now.getDay()});
    this.weekDay = date.getDay()
    console.log(this.weekDay)
    if (this.weekDay === 0) return null
    else if (this.weekDay === 1) return this.formatearFecha(date)
    else {
        // число первого дня недели
        this.firstDay = date - this.msInDay(this.weekDay - 1) 
    } return this.formatearFecha(new Date(this.firstDay))
  }

  showWeekSchedule(schedule, i) { //заполнение данными расписания из бд
    this.state.spinner=false;
    this.schedule = JSON.parse(schedule);
      for (let day_num = 1; day_num < 7; day_num++) {
      if (this.schedule["schedule"]!==null)
      {this.state.day[day_num-1]["date"][i]=this.schedule["schedule_header"][`day_${day_num}`]["date"];
      for (let bell in this.schedule["schedule"]) { //проверка 
        
        if ((this.schedule["schedule"][bell]!==undefined)&& (this.schedule["schedule"][bell][`day_${day_num}`]["lessons"][0] !== undefined)&&(this.schedule["schedule"][bell][`day_${day_num}`]["lessons"][0]["groups"][0]["subgroup_name"] !== undefined)&&(this.schedule["schedule"][bell][`day_${day_num}`]["lessons"][0]["groups"][0]["subgroup_name"] ===this.state.subGroup) &&(this.state.subGroup!==""))
        {
          this.state.days[day_num-1][bell][i][0]=this.schedule["schedule"][bell][`day_${day_num}`]["lessons"][0]["subject_name"];
          this.state.days[day_num-1][bell][i][1]=this.schedule["schedule"][bell][`day_${day_num}`]["lessons"][0]["teachers"][0]["name"];
          this.state.days[day_num-1][bell][i][2]=this.schedule["schedule"][bell][`day_${day_num}`]["lessons"][0]["rooms"][0]["name"];
          this.state.days[day_num-1][bell][i][3]=`${this.schedule["schedule"][bell][`header`]["start_lesson"]} - ${this.schedule["schedule"][bell][`header`]["end_lesson"]}`;
          this.state.days[day_num-1][bell][i][4]="var(--plasma-colors-button-accent)          ";
          this.state.day[day_num-1]["count"][i]++;
        } else if((this.schedule["schedule"][bell]!==undefined)&& (this.schedule["schedule"][bell][`day_${day_num}`]["lessons"][0] !== undefined)&&(this.schedule["schedule"][bell][`day_${day_num}`]["lessons"][0]["groups"][0]["subgroup_name"] !== undefined)&&(this.schedule["schedule"][bell][`day_${day_num}`]["lessons"][0]["groups"][0]["subgroup_name"] !==this.state.subGroup)&&(this.schedule["schedule"][bell][`day_${day_num}`]["lessons"][0]["groups"][0]["subgroup_name"] !== undefined)&&(this.state.subGroup!=="") ){
          
          this.state.days[day_num-1][bell][i][0]="";
          this.state.days[day_num-1][bell][i][1]="";
          this.state.days[day_num-1][bell][i][2]="";
          this.state.days[day_num-1][bell][i][3]="";
          this.state.days[day_num-1][bell][i][4]="rgba(0, 0, 0, 0)";
          }else  if ((this.schedule["schedule"][bell]!==undefined) &&(this.schedule["schedule"][bell][`day_${day_num}`]["lessons"][0] !== undefined)) {
          
            this.state.days[day_num-1][bell][i][0]=this.schedule["schedule"][bell][`day_${day_num}`]["lessons"][0]["subject_name"];
          this.state.days[day_num-1][bell][i][1]=this.schedule["schedule"][bell][`day_${day_num}`]["lessons"][0]["teachers"][0]["name"];
          this.state.days[day_num-1][bell][i][2]=this.schedule["schedule"][bell][`day_${day_num}`]["lessons"][0]["rooms"][0]["name"];
          this.state.days[day_num-1][bell][i][3]=`${this.schedule["schedule"][bell][`header`]["start_lesson"]} - ${this.schedule["schedule"][bell][`header`]["end_lesson"]}`;
          this.state.days[day_num-1][bell][i][4]="var(--plasma-colors-button-accent)          ";
          this.state.day[day_num-1]["count"][i]++;
        }  else {
            this.state.days[day_num-1][bell][i][0]="";
          this.state.days[day_num-1][bell][i][1]="";
          this.state.days[day_num-1][bell][i][2]="";
          this.state.days[day_num-1][bell][i][3]="";
          this.state.days[day_num-1][bell][i][4]="rgba(0, 0, 0, 0)";
          }
        }
       if (this.state.day[day_num-1]["count"][i]===0)
        this.state.days[day_num-1]["bell_1"][i][0]="Пар нет 🎉";
          this.state.spinner=true;
      } else {this.state.spinner=true;
        this.state.days[day_num-1]["bell_1"][i][0]="Пар нет 🎉";}
      }
  }


  Sunday(){
    this.state.i=0;
    return(
      <div  >
          <Container style = {{padding: 0}}>
          <HeaderRoot
              style={{backgroundColor: "black"}}
          >  <HeaderLogo src={logo} alt="МИСиС" /> 
          <HeaderTitle>Мой МИСиС</HeaderTitle>
          <HeaderContent><Button size="s" view="clear" pin="circle-circle" onClick={()=>this.setState({ page: 0 })}><IconPersone size="s" color="inherit"/></Button>
          
          </HeaderContent>
          </HeaderRoot>
          <h4 style={{margin: "1em"}}>Расписание {this.state.group}</h4>
  
          
          <div >
            <Tabs view="black" size="m" style={{margin: "0.75em"}}>
              <TabItem isActive={this.state.flag} onClick={()=>this.setState({ page: 2 })}>Верхняя неделя
              </TabItem>
              <TabItem isActive={!this.state.flag} onClick={()=>this.setState({ page: 2 })}>Нижняя неделя
              </TabItem>
              {/* <TabItem isActive={false} onClick={()=>this.setState({ page: 4 })}>Сегодня</TabItem>
              <TabItem isActive={false} onClick={()=>this.setState({page: 5})}>Завтра</TabItem> */}
            </Tabs>
          
          </div>
          <CarouselGridWrapper >
                      <Carousel
                          as={Row}
                          axis="x"
                          index={this.state.i}
                          scrollSnapType="mandatory"
                          animatedScrollByIndex="true"
                          detectActive= "true"
                          detectThreshold={0.5}
                          
                          onIndexChange={() => this.Index()}
                          paddingStart="5%"
                          paddingEnd="50%"
                      >
                          {this.state.day.map(({ title, date }, i) => (
                            
                              <CarouselCol key={`item:${i}`}><Button style={{marginTop: "0.5em", marginBottom: "0.5em"}} size="s" pin="circle-circle" text={`${title} ${date}`} onClick={()=>{this.setState({page: i+1}) }}/></CarouselCol>
                          ))}
                      </Carousel>
                  </CarouselGridWrapper>
            
            <div style={{
          width:  '200px',
          height: '200px',
          }}></div>
            </Container>
            </div>
    );
    
  }

  Raspisanie(timeParam, weekParam){
    this.state.i=0;
    let day_num = timeParam-1;
    let index=timeParam;
    if (weekParam===1){
      this.state.j = 8;
    } else this.state.j=0;
  return(
    <div  >
        <Container style = {{padding: 0}}>
        <HeaderRoot
            style={{backgroundColor: "black"}}
        >  <HeaderLogo src={logo} alt="МИСиС" /> 
        <HeaderTitle>Мой МИСиС</HeaderTitle>
        <HeaderContent><Button size="s" view="clear" pin="circle-circle" onClick={()=>this.setState({ page: 0 })}><IconPersone size="s" color="inherit"/></Button>
        
        </HeaderContent>
        </HeaderRoot>
        <h3 style={{margin: "1em"}}>Расписание {this.state.group}</h3>

        
        <div >
          <Tabs view="black" size="m" style={{margin: "0.75em"}}>
            <TabItem isActive={this.state.flag} onClick={()=>this.setState({ page: 7,  flag: true  })}>Верхняя неделя
            </TabItem>
            <TabItem isActive={!this.state.flag} onClick={()=>this.setState({ page: 7, flag: false })}>Нижняя неделя
            </TabItem>
            {/* <TabItem isActive={false} onClick={()=>this.setState({ page: 4 })}>Сегодня</TabItem>
            <TabItem isActive={false} onClick={()=>this.setState({page: 5})}>Завтра</TabItem> */}
          </Tabs>
        
        </div>
        <CarouselGridWrapper >
                    <Carousel
                        as={Row}
                        axis="x"
                        index={this.state.i}
                        scrollSnapType="mandatory"
                        animatedScrollByIndex="true"
                        detectActive= "true"
                        detectThreshold={0.5}
                        
                        onIndexChange={() => this.Index()}
                        paddingStart="1%"
                        paddingEnd="50%"
                    >
                        {this.state.day.map(({ title, date }, i) => (
                          
                            <CarouselCol key={`item:${i}`}><Button style={{marginTop: "0.5em", marginBottom: "0.5em"}} size="s" pin="circle-circle" text={`${title} ${date[weekParam]}`} focused={i+1 === index} onClick={()=>{this.setState({page: i+1 + this.state.j}) }}/></CarouselCol>
                        ))}
                    </Carousel>
                </CarouselGridWrapper>

        <div style={{ flexDirection: "column" }}>
          <Card style={{background: "rgba(0, 0, 0, 0)", width: "auto", marginLeft: "2em", marginTop: "0.5em", paddingRight: "1em" }}>
            <CardBody>
              <CardContent compact >
              <Cell content={
              <TextBox>
                  {/* <TextBoxBigTitle style={{color: "var(--plasma-colors-secondary)"}}>{this.state.day[day_num]["title"]} {this.state.day[day_num]["date"]}</TextBoxBigTitle> */}
                  <TextBoxSubTitle style={{ marginTop: "0.75rem" }} lines={8}>
                    {this.state.days[day_num]["bell_1"][weekParam][3]}
                  </TextBoxSubTitle>
                  <TextBoxBigTitle >
                  {this.state.days[day_num]["bell_1"][weekParam][0]}
                  </TextBoxBigTitle>
                  <TextBoxTitle> {this.state.days[day_num]["bell_1"][weekParam][1]} </TextBoxTitle>
                  </TextBox>
                }
                contentRight={<Badge text={this.state.days[day_num]["bell_1"][weekParam][2]} style={{background: `${this.state.days[day_num]["bell_1"][weekParam][4]}`}}/>}
                
                />
                  <Cell content={
              <TextBox> <TextBoxSubTitle style={{ marginTop: "0.75rem" }} lines={8}>
                  {this.state.days[day_num]["bell_2"][weekParam][3]}
                  </TextBoxSubTitle>
                  <TextBoxBigTitle >
                  {this.state.days[day_num]["bell_2"][weekParam][0]}
                  </TextBoxBigTitle>
                  <TextBoxTitle> {this.state.days[day_num]["bell_2"][weekParam][1]} </TextBoxTitle>
                  </TextBox>
                }
                contentRight={<Badge text={this.state.days[day_num]["bell_2"][weekParam][2]} style={{background: `${this.state.days[day_num]["bell_2"][weekParam][4]}`}}/>}
                
                />
                  
                  <Cell content={
              <TextBox><TextBoxSubTitle style={{ marginTop: "0.75rem" }} lines={8}>
                  {this.state.days[day_num]["bell_3"][weekParam][3]}
                  </TextBoxSubTitle>
                  <TextBoxBigTitle >
                  {this.state.days[day_num]["bell_3"][weekParam][0]}
                  </TextBoxBigTitle>
                  <TextBoxTitle> {this.state.days[day_num]["bell_3"][weekParam][1]} </TextBoxTitle>
                  </TextBox>
                }
                contentRight={<Badge text={this.state.days[day_num]["bell_3"][weekParam][2]} style={{background: `${this.state.days[day_num]["bell_3"][weekParam][4]}`}}/>}
                
                />
                  <Cell content={
              <TextBox><TextBoxSubTitle style={{ marginTop: "0.75rem" }} lines={8}>
                  {this.state.days[day_num]["bell_4"][weekParam][3]}
                  </TextBoxSubTitle>
                  <TextBoxBigTitle >
                  {this.state.days[day_num]["bell_4"][weekParam][0]}
                  </TextBoxBigTitle>
                  <TextBoxTitle> {this.state.days[day_num]["bell_4"][weekParam][1]} </TextBoxTitle>
                  </TextBox>
                }
                contentRight={<Badge text={this.state.days[day_num]["bell_4"][weekParam][2]} style={{background: `${this.state.days[day_num]["bell_4"][weekParam][4]}`}}/>}
                
                />
                  <Cell content={
              <TextBox><TextBoxSubTitle style={{ marginTop: "0.75rem" }} lines={8}>
                  {this.state.days[day_num]["bell_5"][weekParam][3]}
                  </TextBoxSubTitle>
                  <TextBoxBigTitle >
                  {this.state.days[day_num]["bell_5"][weekParam][0]}
                  </TextBoxBigTitle>
                  <TextBoxTitle> {this.state.days[day_num]["bell_5"][weekParam][1]} </TextBoxTitle>
                  </TextBox>
                }
                contentRight={<Badge text={this.state.days[day_num]["bell_5"][weekParam][2]} style={{background: `${this.state.days[day_num]["bell_5"][weekParam][4]}`}}/>}
                
                />
                  
                  <Cell content={
              <TextBox><TextBoxSubTitle style={{ marginTop: "0.75rem" }} lines={8}>
                  {this.state.days[day_num]["bell_6"][weekParam][3]}
                  </TextBoxSubTitle>
                  <TextBoxBigTitle >
                  {this.state.days[day_num]["bell_6"][weekParam][0]}
                  </TextBoxBigTitle>
                  <TextBoxTitle> {this.state.days[day_num]["bell_6"][weekParam][1]} </TextBoxTitle>
                  </TextBox>
                }
                contentRight={<Badge text={this.state.days[day_num]["bell_6"][weekParam][2]} style={{background: `${this.state.days[day_num]["bell_6"][weekParam][4]}`}}/>}
                
                />
                  <Cell content={
              <TextBox>
                <TextBoxSubTitle style={{ marginTop: "0.75rem" }} lines={8}>
                  {this.state.days[day_num]["bell_7"][weekParam][3]}
                  </TextBoxSubTitle>
                  <TextBoxBigTitle >
                  {this.state.days[day_num]["bell_7"][weekParam][0]}
                  </TextBoxBigTitle>
                  <TextBoxTitle> {this.state.days[day_num]["bell_7"][weekParam][1]} </TextBoxTitle>
                  </TextBox>
                } 
                contentRight={<Badge text={this.state.days[day_num]["bell_7"][weekParam][2]} style={{background: `${this.state.days[day_num]["bell_7"][weekParam][4]}`}}/>}
                />
              </CardContent>
            </CardBody>
          </Card>
          </div>
          <div style={{
        width:  '200px',
        height: '200px',
        }}></div>
          </Container>
          </div>
  );
  }

  Index(){
    if (this.state.i<7){
      this.state.i++;
    } else if (this.state.i>0)
    this.state.i--;
  }

  
  Home(){
    let disabled=true;
    if (this.state.groupId!=="") disabled=false;
    console.log(this.state.groupId);
    return (
      <div  >
        <Container style = {{padding: 0}}>
        <HeaderRoot
            style={{backgroundColor: "black"}}
        >  <HeaderLogo src={logo} alt="МИСиС" /> 
        <HeaderTitle>Мой МИСиС</HeaderTitle>
        <HeaderContent>
        <Button class="button" view='secondary' disabled={disabled} text='Расписание' contentRight={<IconMoreVertical size="s" color="inherit"/>} size="s" pin="circle-circle"  onClick={()=>this.setState({ page: 7 })} style={{margin: "1em"}}/> 
        </HeaderContent>
        </HeaderRoot>
        
        <div >
          <h2 style={{margin: '2em', textAlign: "center"}}>Привет, студент! </h2>
          <h4 color="var(--plasma-colors-button-white-secondary)" style={{margin: '2em', textAlign: "center"}}>{this.state.description}</h4>
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
        
          {/* <TextField
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
        /> */}
          <Row style={{display: "flex", alignItems: "flex-start", justifyContent:"center", marginTop: "3em"}}>
          <Button text="Сохранить" view="primary"  onClick={()=>this.isCorrect()} style={{margin: "0.5em"}}/>
          {/* <Button text="Потом" view="secondary"  onClick={()=>this.isCorrect()} style={{margin: "0.5em"}}/> */}
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
    createUser(this.state.userId, "808", String(this.state.groupId), String(this.state.subGroup), String(this.state.engGroup));
      this.setState({description: "Данные сохранены. Их можно будет изменить в любой момент в разделе профиля"});
      getScheduleFromDb(this.state.groupId, this.getFirstDayWeek(new Date(this.state.date +10800000))).then((response)=>{
      this.showWeekSchedule(response, 0);
  });
  getScheduleFromDb(this.state.groupId, this.getFirstDayWeek(new Date(this.state.date +604800000))).then((response)=>{
    this.showWeekSchedule(response, 1);
});
    } else this.setState({description: "Некорректно"});
    
  }

  Spinner(){
    
    var myinterval =setInterval(() => {
      if (this.state.spinner === true){
        if(this.state.today===0) {this.setState({page: 8})}
     else if (this.state.flag===true) this.setState({page: this.state.today});
     else this.setState({page: 9});
    clearInterval(myinterval)}
    }, 100);
    
    return(
      <div  >
        <Container style = {{padding: 0}}>
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
        return this.Raspisanie(1, 0);
      case 2:
        return this.Raspisanie(2, 0);
      case 3:
        return this.Raspisanie(3, 0);
      case 4:
        return this.Raspisanie(4, 0);
      case 5:
        return this.Raspisanie(5, 0);
      case 6:
        return this.Raspisanie(6, 0);
      case 7:
        return this.Spinner();
      case 8:
        return this.Sunday();
      case 9:
        return this.Raspisanie(1, 1);
      case 10:
          return this.Raspisanie(2, 1);
      case 11:
          return this.Raspisanie(3, 1);
      case 12:
          return this.Raspisanie(4, 1);
      case 13:
          return this.Raspisanie(5, 1);
      case 14:
          return this.Raspisanie(6, 1);
      default:
        break;
      }
  }
}