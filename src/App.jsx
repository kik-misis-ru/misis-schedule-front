import React, { useState, useEffect } from "react";
import logo0 from "../src/unnamed.gif";
import logo from "../src/logo.png";
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
      page: 7,
      logo: logo0, 
      flag: false,
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
      day: [{ title: 'Пн', date: "" }, { title: 'Вт', date: "" }, { title: 'Ср', date: "" }, { title: 'Чт', date: "" }, { title: 'Пт', date: "" }, { title: 'Сб', date: "" }],
      //day: [['Понедельник', '' ], ['Вторник', ''], ['Среда', ''], ['Четверг', ''], ['Пятница', ''], ['Суббота', '']],
      days: [{
        bell_1: ["1", "", ""],
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
      spinner: false,
      date: Date.parse("05/12/2021"),
      today: null,
    }
    this.Home = this.Home.bind(this);
    this.Menu = this.Menu.bind(this);
    this.Navigator = this.Navigator.bind(this);
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
                this.showWeekSchedule(response)
            });
              // this.setState({page: 6});
              this.setState({description: "Здесь можно изменить данные"});
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

  dispatchAssistantAction (action) {
    console.log('dispatchAssistantAction', action);
    if (action) {
      switch (action.type) {
        case 'for_today':
          return this.setState({page: 4});

        case 'for_tomorrow':
          return this.setState({page: 5});
        
          case 'for_week':
            return this.setState({page: 2});

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

  showWeekSchedule(schedule) {
    this.schedule = JSON.parse(schedule);
    if ((this.state.subGroup==="")||(this.state.subGroup===undefined)){
      console.log("sub",this.state.subGroup);
    for (let day_num = 1; day_num < 7; day_num++) {
          this.state.day[day_num-1]["date"]=this.schedule["schedule_header"][`day_${day_num}`]["date"];
          for (let bell in this.schedule["schedule"]) { //проверка 
              if ((this.schedule["schedule"][bell]!==undefined) &&(this.schedule["schedule"][bell][`day_${day_num}`]["lessons"][0] !== undefined)) {
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
          } 
        this.state.spinner=true;
    } else {for (let day_num = 1; day_num < 7; day_num++) {
      this.state.day[day_num-1]["date"]=this.schedule["schedule_header"][`day_${day_num}`]["date"];
      for (let bell in this.schedule["schedule"]) { //проверка 
        if ((this.schedule["schedule"][bell]!==undefined)&& (this.schedule["schedule"][bell][`day_${day_num}`]["lessons"][0] !== undefined)&&(this.schedule["schedule"][bell][`day_${day_num}`]["lessons"][0]["groups"][0]["subgroup_name"] !== undefined)&&(this.schedule["schedule"][bell][`day_${day_num}`]["lessons"][0]["groups"][0]["subgroup_name"] ===this.state.subGroup) )
        {
           
          this.state.days[day_num-1][bell][0]=this.schedule["schedule"][bell][`day_${day_num}`]["lessons"][0]["subject_name"];
          this.state.days[day_num-1][bell][1]=this.schedule["schedule"][bell][`day_${day_num}`]["lessons"][0]["teachers"][0]["name"];
          this.state.days[day_num-1][bell][2]=this.schedule["schedule"][bell][`day_${day_num}`]["lessons"][0]["rooms"][0]["name"];
          this.state.days[day_num-1][bell][3]=`${this.schedule["schedule"][bell][`header`]["start_lesson"]} - ${this.schedule["schedule"][bell][`header`]["end_lesson"]}`
        } else if((this.schedule["schedule"][bell]!==undefined)&& (this.schedule["schedule"][bell][`day_${day_num}`]["lessons"][0] !== undefined)&&(this.schedule["schedule"][bell][`day_${day_num}`]["lessons"][0]["groups"][0]["subgroup_name"] !== undefined)&&(this.schedule["schedule"][bell][`day_${day_num}`]["lessons"][0]["groups"][0]["subgroup_name"] !==this.state.subGroup) ){
          this.state.days[day_num-1][bell][0]="";
          this.state.days[day_num-1][bell][1]="";
          this.state.days[day_num-1][bell][2]="";
          this.state.days[day_num-1][bell][3]="";
          }else  if ((this.schedule["schedule"][bell]!==undefined) &&(this.schedule["schedule"][bell][`day_${day_num}`]["lessons"][0] !== undefined)) {
          this.state.days[day_num-1][bell][0]=this.schedule["schedule"][bell][`day_${day_num}`]["lessons"][0]["subject_name"];
          this.state.days[day_num-1][bell][1]=this.schedule["schedule"][bell][`day_${day_num}`]["lessons"][0]["teachers"][0]["name"];
          this.state.days[day_num-1][bell][2]=this.schedule["schedule"][bell][`day_${day_num}`]["lessons"][0]["rooms"][0]["name"];
          this.state.days[day_num-1][bell][3]=`${this.schedule["schedule"][bell][`header`]["start_lesson"]} - ${this.schedule["schedule"][bell][`header`]["end_lesson"]}`
        
        }  else {
            this.state.days[day_num-1][bell][0]="";
          this.state.days[day_num-1][bell][1]="";
          this.state.days[day_num-1][bell][2]="";
          this.state.days[day_num-1][bell][3]="";
          }
        }
      } 
      console.log("subgroup",this.state.subGroup);
          this.state.spinner=true;
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
    return(
      <div  >
        <Container style = {{padding: 0}}>
        <Header
            logo={logo}
            title={`Мой МИСиС`}
            style={{backgroundColor: "black"}}
        > <Button class="button" contentLeft={<IconPersone size="s" color="inherit"/>} view='secondary' size="s" pin="circle-circle"  onClick={()=>this.setState({ page: 0 })} style={{margin: "1em"}}/>
        </Header>
        <Row >

          <Row style={{margin: "2em"}}>
            <h2>{this.state.day[0][0]}, {this.state.day[0][1]}</h2>
          </Row>
        
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

  Raspisanie(timeParam){
    this.state.i=0;
    console.log(timeParam)
    let day_num = timeParam-1;
    let index=timeParam;
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
            <TabItem isActive={true} onClick={()=>this.setState({ page: 2 })}>Верхняя неделя
            </TabItem>
            <TabItem isActive={false} onClick={()=>this.setState({ page: 2 })}>Нижняя неделя
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
                          
                            <CarouselCol key={`item:${i}`}><Button style={{marginTop: "0.5em", marginBottom: "0.5em"}} size="s" pin="circle-circle" text={`${title} ${date}`} focused={i+1 === index} onClick={()=>{this.setState({page: i+1}); console.log(i+1, index)}}/></CarouselCol>
                        ))}
                    </Carousel>
                </CarouselGridWrapper>

        <div style={{ flexDirection: "column" }}>
          <Card style={{background: "rgba(0, 0, 0, 0)", width: "40vh", marginLeft: "2em", marginTop: "0.5em", paddingRight: "1em" }}>
            <CardBody>
              <CardContent>
              <TextBox>
                  {/* <TextBoxBigTitle style={{color: "var(--plasma-colors-secondary)"}}>{this.state.day[day_num]["title"]} {this.state.day[day_num]["date"]}</TextBoxBigTitle> */}
                  <TextBoxSubTitle style={{ marginTop: "0.75rem" }} lines={8}>
                    {this.state.days[day_num]["bell_1"][3]}
                  </TextBoxSubTitle>
                  <CardParagraph2 >
                  {this.state.days[day_num]["bell_1"][0]}
                  </CardParagraph2>
                  <CardParagraph1> {this.state.days[day_num]["bell_1"][1]} {this.state.days[day_num]["bell_1"][2]}</CardParagraph1>
                  <TextBoxSubTitle style={{ marginTop: "0.75rem" }} lines={8}>
                  {this.state.days[day_num]["bell_2"][3]}
                  </TextBoxSubTitle>
                  <CardParagraph2 >
                  {this.state.days[day_num]["bell_2"][0]}
                  </CardParagraph2>
                  <CardParagraph1> {this.state.days[day_num]["bell_2"][1]} {this.state.days[day_num]["bell_2"][2]}</CardParagraph1>
                  <TextBoxSubTitle style={{ marginTop: "0.75rem" }} lines={8}>
                  {this.state.days[day_num]["bell_3"][3]}
                  </TextBoxSubTitle>
                  <CardParagraph2 >
                  {this.state.days[day_num]["bell_3"][0]}
                  </CardParagraph2>
                  <CardParagraph1> {this.state.days[day_num]["bell_3"][1]} {this.state.days[day_num]["bell_3"][2]}</CardParagraph1>
                  <TextBoxSubTitle style={{ marginTop: "0.75rem" }} lines={8}>
                  {this.state.days[day_num]["bell_4"][3]}
                  </TextBoxSubTitle>
                  <CardParagraph2 >
                  {this.state.days[day_num]["bell_4"][0]}
                  </CardParagraph2>
                  <CardParagraph1> {this.state.days[day_num]["bell_4"][1]} {this.state.days[day_num]["bell_4"][2]}</CardParagraph1>
                  <TextBoxSubTitle style={{ marginTop: "0.75rem" }} lines={8}>
                  {this.state.days[day_num]["bell_5"][3]}
                  </TextBoxSubTitle>
                  <CardParagraph2 >
                  {this.state.days[day_num]["bell_5"][0]}
                  </CardParagraph2>
                  <CardParagraph1> {this.state.days[day_num]["bell_5"][1]} {this.state.days[day_num]["bell_5"][2]}</CardParagraph1>
                 
                  <TextBoxSubTitle style={{ marginTop: "0.75rem" }} lines={8}>
                  {this.state.days[day_num]["bell_6"][3]}
                  </TextBoxSubTitle>
                  <CardParagraph2 >
                  {this.state.days[day_num]["bell_6"][0]}
                  </CardParagraph2>
                  <CardParagraph1> {this.state.days[day_num]["bell_6"][1]} {this.state.days[day_num]["bell_6"][2]}</CardParagraph1>
                  <TextBoxSubTitle style={{ marginTop: "0.75rem" }} lines={8}>
                  {this.state.days[day_num]["bell_7"][3]}
                  </TextBoxSubTitle>
                  <CardParagraph2 >
                  {this.state.days[day_num]["bell_7"][0]}
                  </CardParagraph2>
                  <CardParagraph1> {this.state.days[day_num]["bell_7"][1]} {this.state.days[day_num]["bell_7"][2]}</CardParagraph1>
                  </TextBox>
                <br />
                
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

  // Raspisanie(timeParam){
  //   this.state.i=0;
  //   return (
  //     <div  >
  //       <Container style = {{padding: 0}}>
  //       <HeaderRoot
  //           style={{backgroundColor: "black"}}
  //       >  <HeaderLogo src={logo} alt="МИСиС" style={{height: "15px", width: "15px", margin:"1em"}}/> 
  //       <HeaderTitle>Мой МИСиС</HeaderTitle>
  //       <HeaderContent><Button size="s" pin="circle-circle" onClick={()=>this.setState({ page: 0 })}><IconPersone size="s" color="inherit"/></Button>
        
  //       </HeaderContent>
  //       </HeaderRoot>
  //       <h4 style={{margin: "1em"}}>Расписание {this.state.group} </h4>
        

  //       <div >
  //         <Tabs view="black" size="m" style={{margin: "0.75em"}}>
  //           <TabItem isActive={true} onClick={()=>this.setState({ page: 2 })}>Верхняя неделя
  //           </TabItem>
  //           <TabItem isActive={false} onClick={()=>this.setState({ page: 2 })}>Нижняя неделя
  //           </TabItem>
  //           {/* <TabItem isActive={false} onClick={()=>this.setState({ page: 4 })}>Сегодня</TabItem>
  //           <TabItem isActive={false} onClick={()=>this.setState({page: 5})}>Завтра</TabItem> */}
  //         </Tabs>
        
  //       </div>
  //       <CarouselGridWrapper>
  //                   <Carousel
  //                       as={Row}
  //                       axis="x"
  //                       index={this.state.i}
  //                       scrollSnapType="mandatory"
  //                       detectActive
  //                       detectThreshold={0.5}
                        
  //                       onIndexChange={() => this.Index()}
  //                       paddingStart="5%"
  //                       paddingEnd="50%"
  //                   >
  //                       {this.state.day.map(({ title }, i) => (
  //                           <CarouselCol key={`item:${i}`}><Button size="s" text={title}/></CarouselCol>
  //                       ))}
  //                   </Carousel>
  //               </CarouselGridWrapper>
  //       <div style={{ flexDirection: "column" }}>
  //       <CarouselGridWrapper>
  //                   <Carousel
  //                       as={Row}
  //                       axis="x"
  //                       index={this.state.i}
  //                       scrollSnapType="mandatory"
  //                       detectActive
  //                       detectThreshold={0.5}
                        
  //                       onIndexChange={() => {this.Index(); console.log("this.state.i", this.state.i)}}
  //                       paddingStart="5%"
  //                       paddingEnd="50%"
  //                   >
  //                       {this.state.days.map(({ bell_1, bell_2, bell_3, bell_4, bell_5, bell_6, bell_7 }, i) => (
  //                           <CarouselCol key={`item:${i}`}>
  //                              <Card style={{ width: "40vh", margin: "0.5em", paddingRight: "1em" }}>
  //           <CardBody>
  //             <CardContent>
  //               <TextBox>
  //                 <TextBoxBigTitle style={{color: "var(--plasma-colors-secondary)"}}>{this.state.day[i]["title"]} {this.state.day[i]["date"]}</TextBoxBigTitle>
  //                 <TextBoxSubTitle style={{ marginTop: "0.75rem" }} lines={8}>
  //                   {bell_1[3]}
  //                 </TextBoxSubTitle>
  //                 <CardParagraph2 >
  //                 {bell_1[0]}
  //                 </CardParagraph2>
  //                 <CardParagraph1> {bell_1[1]} {bell_1[2]}</CardParagraph1>
  //                 <TextBoxSubTitle style={{ marginTop: "0.75rem" }} lines={8}>
  //                 {bell_2[3]}
  //                 </TextBoxSubTitle>
  //                 <CardParagraph2 >
  //                 {bell_2[0]}
  //                 </CardParagraph2>
  //                 <CardParagraph1> {bell_2[1]} {bell_2[2]}</CardParagraph1>
  //                 <TextBoxSubTitle style={{ marginTop: "0.75rem" }} lines={8}>
  //                 {bell_3[3]}
  //                 </TextBoxSubTitle>
  //                 <CardParagraph2 >
  //                 {bell_3[0]}
  //                 </CardParagraph2>
  //                 <CardParagraph1> {bell_3[1]} {bell_3[2]}</CardParagraph1>
  //                 <TextBoxSubTitle style={{ marginTop: "0.75rem" }} lines={8}>
  //                 {bell_4[3]}
  //                 </TextBoxSubTitle>
  //                 <CardParagraph2 >
  //                 {bell_4[0]}
  //                 </CardParagraph2>
  //                 <CardParagraph1> {bell_4[1]} {bell_4[2]}</CardParagraph1>
  //                 <TextBoxSubTitle style={{ marginTop: "0.75rem" }} lines={8}>
  //                 {bell_5[3]}
  //                 </TextBoxSubTitle>
  //                 <CardParagraph2 >
  //                 {bell_5[0]}
  //                 </CardParagraph2>
  //                 <CardParagraph1> {bell_5[1]} {bell_5[2]}</CardParagraph1>
                 
  //                 <TextBoxSubTitle style={{ marginTop: "0.75rem" }} lines={8}>
  //                 {bell_6[3]}
  //                 </TextBoxSubTitle>
  //                 <CardParagraph2 >
  //                 {bell_6[0]}
  //                 </CardParagraph2>
  //                 <CardParagraph1> {bell_6[1]} {bell_6[2]}</CardParagraph1>
  //                 <TextBoxSubTitle style={{ marginTop: "0.75rem" }} lines={8}>
  //                 {bell_7[3]}
  //                 </TextBoxSubTitle>
  //                 <CardParagraph2 >
  //                 {bell_7[0]}
  //                 </CardParagraph2>
  //                 <CardParagraph1> {bell_7[1]} {bell_7[2]}</CardParagraph1>
  //                 </TextBox>
                
  //               <br />
                
  //             </CardContent>
  //           </CardBody>
  //         </Card>

  //                           </CarouselCol>
  //                       ))}
  //                   </Carousel>
  //               </CarouselGridWrapper>
          
  //         <div style={{
  //       width:  '150px',
  //       height: '150px',
  //       }}></div>
  //       </div>

  //       </Container>
  //     </div>
  //   )
  // }
  
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
      this.showWeekSchedule(response);
  });
    } else this.setState({description: "Некорректно"});
    
  }

  Spinner(){
    
    var myinterval =setInterval(() => {
      if (this.state.spinner === true){
    this.setState({page: 1});
    clearInterval(myinterval)}
    console.log("clear");
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
        return this.Raspisanie(1);
      case 2:
        return this.Raspisanie(2);
      case 3:
        return this.Raspisanie(3);
      case 4:
        return this.Raspisanie(4);
      case 5:
        return this.Raspisanie(5);
      case 6:
        return this.Raspisanie(6);
      case 7:
        return this.Spinner();
      default:
        break;
      }
  }
}