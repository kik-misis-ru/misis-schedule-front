import React, { useState, useEffect } from "react";
import logo from "../src/logo.png";
import image from "../src/frame.png"
import karta from "../src/Karta.png";
import groups from './groups_list.js';
import { Container, Row, Col, Button, Radiobox, Tabs, TabItem, Icon, DeviceThemeProvider, Header, Spinner, HeaderContent, Cell, HeaderSubtitle} from '@sberdevices/plasma-ui';
import { ToastContainer, toast } from 'react-toastify';
import { useToast, ToastProvider, Toast} from '@sberdevices/plasma-ui'
import { detectDevice } from '@sberdevices/plasma-ui/utils';
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
  Badge,
  TextBoxLabel,
  Showcase, 
  Checkbox,
  CellListItem,
  CardHeadline3,
  ButtonSkeleton,
  RectSkeleton,
  HeaderTitleWrapper,
  Image
} from "@sberdevices/plasma-ui";
import {
  createSmartappDebugger,
  createAssistant,
} from "@sberdevices/assistant-client";
import "./App.css";
import { createGlobalStyle } from "styled-components";
import { darkJoy, darkEva, darkSber } from "@sberdevices/plasma-tokens/themes";
import { text, background, gradient } from "@sberdevices/plasma-tokens";
import { TextField, ActionButton } from "@sberdevices/plasma-ui";
import { IconMessage,  IconMoreVertical, IconMoreHorizontal, IconSettings, IconDisclosureRight, IconChevronRight, IconLocation, IconStar, IconStarFill} from "@sberdevices/plasma-icons";
import {
  createUser,
  getScheduleFromDb,
  getUser,
  putScheduleIntoDb,
  updateUser,
} from "./APIHelper.js";
import { m } from "@sberdevices/plasma-core/mixins";
import { isConstructorDeclaration } from "typescript";
//import { Console } from "console";


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

const ThemeBackgroundEva = createGlobalStyle(darkEva);
const ThemeBackgroundSber = createGlobalStyle(darkSber);
const ThemeBackgroundJoy = createGlobalStyle(darkJoy);

const DocStyle = createGlobalStyle`
    html:root {
        min-height: 100vh;
        color: ${text};
        background-color: ${background};
        background-image: ${gradient};
    }
`;

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
      logo: null, 
      flag: true,
      checked: true,
      description: "Поле с номером группы является обязательным для ввода",
      group: "",
      groupId: "",
      subGroup: "",
      engGroup: "", 
      correct: null,
      labelGroup: "Номер академической группы",
      labelSubgroup: "Номер подгруппы: 1 или 2",
      labelEnggroup: "",
      i: 0,
      timeParam: 0,
      day: [{ title: 'Пн', date: ["",""], count: [0, 0] }, { title: 'Вт', date: ["",""], count: [0, 0] }, { title: 'Ср', date: ["",""], count: [0, 0] }, { title: 'Чт', date: ["",""], count: [0, 0] }, { title: 'Пт', date: ["",""], count: [0, 0] }, { title: 'Сб', date: ["",""], count: [0, 0] }],
      days: [{
        bell_1: [[ //текущая неделя
          "", //название пары
          "", //фамилия преподавателя
          "", //кабинет
          "", //время начала и конца через дефис
          "", //тип пары
          "",//порядковый номер с точкой
          "" //ссылка
        ], 
          [ //следующая неделя
            "", "", "", "", "", ""]],
        bell_2: [["", "", "", "", "", "", ""], ["", "", "", "", "", "", ""]],
        bell_3: [["", "", "", "", "", "", ""], ["", "", "", "", "", "", ""]],
        bell_4: [["", "", "", "", "", "", ""], ["", "", "", "", "", "", ""]],
        bell_5: [["", "", "", "", "", "", ""], ["", "", "", "", "", "", ""]],
        bell_6: [["", "", "", "", "", "", ""], ["", "", "", "", "", "", ""]],
        bell_7: [["", "", "", "", "", "", ""], ["", "", "", "", "", "", ""]],
       },
      {
        bell_1: [["", "", "", "", "", "", ""], ["", "", "", "", "", "", ""]],
        bell_2: [["", "", "", "", "", "", ""], ["", "", "", "", "", "", ""]],
        bell_3: [["", "", "", "", "", "", ""], ["", "", "", "", "", "", ""]],
        bell_4: [["", "", "", "", "", "", ""], ["", "", "", "", "", "", ""]],
        bell_5: [["", "", "", "", "", "", ""], ["", "", "", "", "", "", ""]],
        bell_6: [["", "", "", "", "", "", ""], ["", "", "", "", "", "", ""]],
        bell_7: [["", "", "", "", "", "", ""], ["", "", "", "", "", "", ""]],
      },
      {
        bell_1: [["", "", "", "", "", "", ""], ["", "", "", "", "", "", ""]],
        bell_2: [["", "", "", "", "", "", ""], ["", "", "", "", "", "", ""]],
        bell_3: [["", "", "", "", "", "", ""], ["", "", "", "", "", "", ""]],
        bell_4: [["", "", "", "", "", "", ""], ["", "", "", "", "", "", ""]],
        bell_5: [["", "", "", "", "", "", ""], ["", "", "", "", "", "", ""]],
        bell_6: [["", "", "", "", "", "", ""], ["", "", "", "", "", "", ""]],
        bell_7: [["", "", "", "", "", "", ""], ["", "", "", "", "", "", ""]],
      },
      {
        bell_1: [["", "", "", "", "", "", ""], ["", "", "", "", "", "", ""]],
        bell_2: [["", "", "", "", "", "", ""], ["", "", "", "", "", "", ""]],
        bell_3: [["", "", "", "", "", "", ""], ["", "", "", "", "", "", ""]],
        bell_4: [["", "", "", "", "", "", ""], ["", "", "", "", "", "", ""]],
        bell_5: [["", "", "", "", "", "", ""], ["", "", "", "", "", "", ""]],
        bell_6: [["", "", "", "", "", "", ""], ["", "", "", "", "", "", ""]],
        bell_7: [["", "", "", "", "", "", ""], ["", "", "", "", "", "", ""]],
      },
      {
        bell_1: [["", "", "", "", "", "", ""], ["", "", "", "", "", "", ""]],
        bell_2: [["", "", "", "", "", "", ""], ["", "", "", "", "", "", ""]],
        bell_3: [["", "", "", "", "", "", ""], ["", "", "", "", "", "", ""]],
        bell_4: [["", "", "", "", "", "", ""], ["", "", "", "", "", "", ""]],
        bell_5: [["", "", "", "", "", "", ""], ["", "", "", "", "", "", ""]],
        bell_6: [["", "", "", "", "", "", ""], ["", "", "", "", "", "", ""]],
        bell_7: [["", "", "", "", "", "", ""], ["", "", "", "", "", "", ""]],
      },
      {
        bell_1: [["", "", "", "", "", "", ""], ["", "", "", "", "", "", ""]],
        bell_2: [["", "", "", "", "", "", ""], ["", "", "", "", "", "", ""]],
        bell_3: [["", "", "", "", "", "", ""], ["", "", "", "", "", "", ""]],
        bell_4: [["", "", "", "", "", "", ""], ["", "", "", "", "", "", ""]],
        bell_5: [["", "", "", "", "", "", ""], ["", "", "", "", "", "", ""]],
        bell_6: [["", "", "", "", "", "", ""], ["", "", "", "", "", "", ""]],
        bell_7: [["", "", "", "", "", "", ""], ["", "", "", "", "", "", ""]],
      }],
      spinner: false,
      // date: Date.parse("05/12/2021"),
      date: Date.now(),
      today: 0,
      color_group: "var(--plasma-colors-white-secondary)",
      color_sub: "var(--plasma-colors-white-secondary)",
      character: "sber",
      star: false,
      bd: "",
    }
    this.Home = this.Home.bind(this);
    // this.Navigator = this.Navigator.bind(this);
    this.Raspisanie = this.Raspisanie.bind(this);
    
  }
 
  componentDidMount() {   
    console.log('componentDidMount');
    
    this.assistant = initializeAssistant(() => this.getStateForAssistant());
    this.assistant.on("data", (event) => {
      switch (event.type) {
        case "character":
        console.log(event.character.id);
        this.state.character=event.character.id;
          if (event.character.id === "timeParamoy") {
            
            this.state.description="Заполни данные, чтобы открывать расписание одной фразой"
          } else this.state.description="Чтобы посмотреть расписание, укажите данные учебной группы"
          break;
        
        case "smart_app_data": 
          console.log("User");
          console.log(event);
          if (event.sub !== undefined) {
            console.log("Sub", event.sub);
            this.state.userId = event.sub;
            getUser(this.state.userId).then((user)=> {
              if (user !== "0") {
                console.log('user', user)
                this.setState({groupId: user["group_id"], subGroup: user["subgroup_name"], engGroup: user["eng_group"]})
                this.convertIdInGroupName()
                if (this.state.groupId!==""){
                getScheduleFromDb(this.state.groupId, this.getFirstDayWeek(new Date(this.state.date  ))).then((response)=>{
                  this.showWeekSchedule(response, 0)
                });
                
                getScheduleFromDb(this.state.groupId, this.getFirstDayWeek(new Date(this.state.date + 604800000  ))).then((response)=>{
                  this.showWeekSchedule(response, 1)
                });
                console.log(this.state.spinner);
                this.setState({ page: 7, checked: true, star: true, bd: this.state.groupId});}
                else this.setState({page: 0});
              } else {
                this.setState({page: 0});
                }
              })
            } 
          console.log(`assistant.on(data)`, event);
          const { action } = event;
          this.dispatchAssistantAction(action);
          break

      default:
        break
      }
    });
    this.assistant.on("start", (event) => {
      console.log(`assistant.on(start)`, event);
    }); 
    this.assistant.on("ANSWER_TO_USER", (event) => {
      console.log(`assistant.on(raw)`, event);
    }); 
  }


  // определяет когда начинаются пары сегодня или завтра
  getStartFirstLesson(day) {
    let dict = {"today": 1, "tomorrow": 0}
    day = dict[day]
    console.log("getStartFirstLesson")
    for (let bell in this.state.days[this.state.today - day]) {
      if (this.state.days[this.state.today - day][bell][0][3] !== "") {
        return this.state.days[this.state.today - day][bell][0][3].slice(0,5)
      }
    }
  }

  // определяет когда кончаются пары сегодня или завтра
  getEndLastLesson(day) {
    let dict = {"today": 1, "tomorrow": 0}
    day = dict[day]
    for (let bell = 7; bell > 0; bell--) {
      if (this.state.days[this.state.today - day][`bell_${bell}`][0][3] !== "") {
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
        return this.state.days[this.state.today - day][`bell_${lessonNum}`][0][3].slice(0, 5)
      } else {
        return this.state.days[this.state.today - day][`bell_${lessonNum}`][0][3].slice(8)
      }
    }
  }

  getStartEndLesson(type, day, lessonNum) {
    if (day === "today" && this.state.today === 0) {return [day, "sunday"]}
    if (day === "tomorrow" && this.state.today === 6) {return [day, "sunday"]}
    if (type === "start") {
      if (day === "today") {
        if (lessonNum === "0") {
          return this.getStartFirstLesson(day)
        } else {
          return  this.getBordersRequestLesson(type, day, lessonNum)
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

  // форматировние даты в вид "DD.MM.YY"
  getDateWithDots(date) {
    const month = date.getMonth() + 1; 
    const day = date.getDate();
    const year = String(date.getFullYear()).slice(2,4)
    return `${(day < 10 ? '0' : '').concat(day)}.${(month < 10 ? '0' : '').concat(month)}.${year}`;
  }

  // подсчет количества пар в указанную дату
  // возвращает массив с днем недели и количеством пар в этот день
  getAmountOfLessons(date) {
    for (let day of this.state.day) {
      for (let week = 0; week < 2; week++) {
        console.log("this.getDateWithDots(date)",this.getDateWithDots(date))
        console.log("day.date[week]", day.date[week])
        if (this.getDateWithDots(date) === day.date[week]) {
          return [day.title, day.count[week]]
        }
      }
    }
    // if (res !== undefined) {return res}
    // else {return null}
  }

  // получить текущее время в формате "HH:MM"
  getTime(date) {
    const hours = date.getHours()
    const minutes = date.getMinutes()
    return `${(hours < 10 ? '0' : '').concat(hours)}:${(minutes < 10 ? '0' : '').concat(minutes)}`
  }

  // получить текущую пару
  getCurrentLesson(date) {
    if (this.state.today !== 0) {
      for (let bell in this.state.days[this.state.today - 1]) {
        if ((this.getTime(date) > this.state.days[this.state.today - 1][bell][0][3].slice(0, 6)) && 
        (this.getTime(date) < this.state.days[this.state.today - 1][bell][0][3].slice(8)) &&
        (this.state.days[this.state.today - 1][bell][0][3].slice(0, 6) !== "")) {
          console.log(this.state.days[this.state.today - 1][bell][0][5][0]);
          return this.state.days[this.state.today - 1][bell][0][5][0]
        } 
      }
    }
  }

  // возвращает количество оставшихся на сегодня пар
  getAmountOfRemainingLessons(date) {
    let countRemainingLessons = 0
    if ((this.state.today!==0)&&(this.state.today+1!==7 ))
    for (let bell in this.state.days[this.state.today - 1]) {
      if (this.getTime(date) < this.state.days[this.state.today - 1][bell][0][3].slice(0, 6) && 
      this.state.days[this.state.today - 1][bell][0][3].slice(0, 6) !== "") {
        countRemainingLessons += 1
      }
    }
    return countRemainingLessons
  }

  getTimeFirstLesson(daynum){ 
    let first;
    let num;
    let week = 0;
    if (daynum<this.state.today) week=1;
    for (let bell in this.state.days[daynum - 1]) {
      if (this.state.days[daynum - 1][bell][week][5] !== "") {
        first = this.state.days[daynum - 1][bell][week][3];
        num = this.state.days[daynum-1][bell][week][5][0];
        break
      }
    }
    return [first, num];
  }

  whatLesson(date, when){ //определяет название пары, которая идет или будет 
    // ключ - номер пары, значение - перерыв до этой пары
    if (this.state.day[this.state.today- 1]["count"][0] == 0) return {lesson:undefined, type: when}
    else {
      console.log(this.state.day[this.state.today-1]["count"][0], "count");
    if (this.getTime(date) < this.getTimeFirstLesson(this.state.today)[0].slice(0,5)) console.log(true)
    let breaks = {'1':'09:00', '2':'10:35-10:50', '3':'12:25-12:40', '4':'14:15-14:30', '5':'16:05-16:20', '6':'17:55-18:10', '7':'19:45'}
    console.log(" что за пара", this.getTime(date), when, this.getTimeFirstLesson(this.state.today)[0].slice(0,5))
    if (this.state.today!==0)  {
      
        if ((this.getCurrentLesson(date)!==undefined)&&(when==="now"))
        for (let bell in this.state.days[this.state.today - 1]) {
          if ((this.state.days[this.state.today - 1][bell][0][5][0] === this.getCurrentLesson(date))&&(this.state.days[this.state.today - 1][bell][0][5][0]!=="")) {
            return {lesson:this.state.days[this.state.today - 1][bell][0][0], type:"now"};
          }
        } 
      else
        if ((when==="will")&&(this.getCurrentLesson(date)!==undefined)&&(parseInt(this.getCurrentLesson(date))+1<8)){
        console.log("будет")
          for (let bell in this.state.days[this.state.today - 1]) {
            console.log(parseInt(this.getCurrentLesson(date))+1);
          if ((this.state.days[this.state.today - 1][bell][0][5][0] == parseInt(this.getCurrentLesson(date))+1)&&(this.state.days[this.state.today - 1][bell][0][5][0]!=="")) {
            return {lesson:this.state.days[this.state.today - 1][bell][0][0], type:"next"};
          }
        } 
      }
        else if ((this.getTimeFirstLesson(this.state.today)[0].slice(0,5)!==undefined)&&(this.getTime(date) <= this.getTimeFirstLesson(this.state.today)[0].slice(0,5))){console.log(this.state.days[this.state.today - 1][`bell_${parseInt(this.getTimeFirstLesson(this.state.today)[1])}`][0][0]); return {lesson:this.state.days[this.state.today - 1][`bell_${parseInt(this.getTimeFirstLesson(this.state.today)[1])}`][0][0], type:"will"} }
          else for (let i in breaks) {
            if ((this.getTime(date) > breaks[i].slice(0, 5) && this.getTime(date) < breaks[i].slice(6))&&(this.state.days[this.state.today - 1][`bell_${i}`][0][5][0]!=="")) return {lesson:this.state.days[this.state.today - 1][`bell_${i}`][0][0], type:"will"};
          else return {lesson:undefined, type: when};}
          }
    } 
  }

  // определяет ближайшую пару, если сейчас идет какая то пара, то сообщает об этом
  whereWillLesson(date, will) {
    let nextLessonRoom
    console.log('текущее время', this.getTime(date))
    console.log("will", will)
    // ключ - номер пары, значение - перерыв до этой пары
    let breaks = {'1':'09:00', '2':'10:35-10:50', '3':'12:25-12:40', '4':'14:15-14:30', '5':'16:05-16:20', '6':'17:55-18:10', '7':'19:45'}
    let numberNearestLesson
    // проверяем, что сегодня не воскресенье
    if (this.state.today !== 0) { 
      // определяем номер ближайшей пары
      for (let i in breaks) {
        if (this.getTime(date) < breaks['1']) {numberNearestLesson = '1'; break}
        else if (this.getTime(date) > breaks[i].slice(0, 5) && this.getTime(date) < breaks[i].slice(6)) {numberNearestLesson = i; break}
        else if (this.getTime(date) > breaks['7']) {numberNearestLesson = null}
        else {console.log(this.getTime(date))}
      }
      console.log(this.getAmountOfLessons(date))
      if (this.getAmountOfLessons(date)[1] === 0) {
        return {exist: "empty"}
      }
      console.log("numberNearestLesson", numberNearestLesson)
      if (numberNearestLesson !== undefined) {
        console.log(this.state.days)
        for (let bell in this.state.days[this.state.today - 1]) {
          // если пара с таким номером есть в расписании
          if (this.state.days[this.state.today - 1][bell][0][5][0] === numberNearestLesson) {
            // выводим эту пару
            console.log(this.state.days[this.state.today - 1][bell][0])
            return {audience:this.state.days[this.state.today - 1][bell][0][2], type:"nearest", exist:"inSchedule"}
          } else {
            // сообщаем, что такой пары нет
            console.log(`Сейчас перерыв. Ближайшей будет ${numberNearestLesson} пара`)
            for (let bell in this.state.days[this.state.today - 1]) {
              if (this.state.days[this.state.today - 1][bell][0][5][0] !== numberNearestLesson) {
                console.log(this.state.days[this.state.today - 1][bell][0][0])
                return {audience:this.state.days[this.state.today - 1][bell][0][2], type:"nearest", exist:"notInSchedule"}
              }
            }
          }
        }
      } 
      if (numberNearestLesson === undefined && will === "now") {
        // вернуть номер текущей пары
        let whereCurrentLesson
        console.log('сейчас идет пара номер', this.getCurrentLesson(date))
        for (let bell in this.state.days[this.state.today - 1]) {
          if (this.state.days[this.state.today - 1][bell][0][5][0] === this.getCurrentLesson(date)) {
            console.log(this.state.days[this.state.today - 1][bell][0][0])
            whereCurrentLesson = this.state.days[this.state.today - 1][bell][0][2]
            //console.log('whereCurrentLesson', whereCurrentLesson)
            // return {audience:this.state.days[this.state.today - 1][bell][0][2], type:"current"}
          }
        }
        if (whereCurrentLesson === "") {console.log("here yoo"); return {exist: "notInSchedule"}}
        else {return {audience:whereCurrentLesson, type:"current"}}
      }
      if (numberNearestLesson === undefined && will === "will") {
        console.log("here")
        for (let bell in this.state.days[this.state.today - 1]) {
          // не работает, если сейчас пары нет, а следующая есть
          console.log('номер следующей пары', Number(this.getCurrentLesson(date)) + 1)
          if (this.state.days[this.state.today - 1][bell][0][5][0] === String(Number(this.getCurrentLesson(date)) + 1)) {
            console.log('следующей будет пара номер', String(Number(this.getCurrentLesson(date)) + 1))
            console.log(this.state.days[this.state.today - 1][bell][0][0])
            nextLessonRoom = this.state.days[this.state.today - 1][bell][0][2]
          }
        }
        if (nextLessonRoom !== "") { return {audience:nextLessonRoom, type:"next"}}
        else {
          console.log('пар больше нет')
          return {exist: "endLessons"}
        }
      }
    }
    else {
      return {exist: "sunday"}
    }
  }

  dispatchAssistantAction (action) {
    console.log('dispatchAssistantAction', action);
    const numPron = {0: "ноль", 1:"одна", 2:"две", 3:"три", 4:"четыре", 5:"пять", 6:"шесть", 7:"семь"}
    if (action) {
      switch (action.type) {
        case 'profile': 
        return this.setState({page: 0});
        case 'for_today':
          if (this.state.group!=="")
          if (this.state.today === 0) {
              this.assistant.sendData({
                action: {
                  action_id: "todaySchedule",
                  parameters: {day: "sunday"},
                },
              })
            return this.setState({page: 8});
          }
          else {
            this.assistant.sendData({
              action: {
                action_id: "todaySchedule",
                parameters: {day: "notSunday"},
              },
            })
            return this.setState({page: this.state.today});
          } 

        case 'for_tomorrow':
          if (this.state.group!=="")
          if (this.state.today + 1 === 7) {
            this.assistant.sendData({
              action: {
                action_id: "tomorrowSchedule",
                parameters: {day: "sunday"},
              },
            })
            return this.setState({page: 8});
          }
          else {
            this.assistant.sendData({
              action: {
                action_id: "tomorrowSchedule",
                parameters: {day: "notSunday"},
              },
            })
            return this.setState({page: this.state.today+1});
          }

        case 'for_next_week':
          if (this.state.group!==""){
            this.state.flag=false;
          return this.setState({page: 7});}
        
        case 'for_this_week':
          if (this.state.group!==""){
          this.state.flag=true;
          return this.setState({page: 1});}

        case 'when_lesson':
          if (this.state.group!==""){
          let params
          let answer = this.getStartEndLesson(action.note[0], action.note[1], action.note[2])  
          console.log("answer", answer) 
          let toOrdinal = {
            "1": "первая",
            "2": "вторая",
            "3": "третья",
            "4": "четвертая",
            "5": "пятая",
            "6": "шестая",
            "7": "седьмая"
          }
          if (answer !== undefined && answer[1] === "sunday") {
            params = {type: answer[0], day: answer[1]}
          }
          else {
            params = {
              type: action.note[0],
              day: action.note[1],
              ordinal: toOrdinal[action.note[2]],
              time: answer
            }
          }
          console.log("params", params)
          console.log("today", this.state.today)
          this.assistant.sendData({
            action: {
              action_id: "say",
              parameters: params,
            },
          })
          
          if (params.day === "sunday") {return this.setState({page: 8})}
          else if ((params.day === 'today')&&(this.state.today !== 0)) return this.setState({page: this.state.today});
          else if (this.state.today+1 === 7) return this.setState({page: 8});
          else this.setState({page: this.state.today+1});}
          break

          case 'how_many':
            let response
            let day
            let lesson
            let page = 0;
            if (action.note !== undefined) {
              console.log(action.note)
              response = this.getAmountOfLessons(new Date(action.note.timestamp  ))
              if (String(this.state.today + 1) === action.note.dayOfWeek) { day = "today"; page=0}
              else if (String(this.state.today + 2) === action.note.dayOfWeek) {day = "tomorrow"; page = 0}
            } else {
              response = this.getAmountOfLessons(new Date(Date.now()  ))
              day = "today"
            }
            const dayNameDict = {"Пн":["В понедельник", 1], "Вт":["Во вторник", 2], "Ср":["В среду", 3], "Чт":["В четверг", 4], "Пт":["В пятницу", 5], "Сб":["В субботу", 6]}
            console.log("response", response[1])
            let howManyParams
            if (this.state.group!=="")
            if (response === undefined) {
              howManyParams = {day: "sunday"}
              this.setState({page: 8})
            }
            else {
              if (response[1] === 1) {lesson = "пара"} else if (response[1] === 2 || response[1] === 3 || response[1] === 4) {lesson = "пары"} else {lesson = "пар"}
              howManyParams = {
                lesson: lesson,
                day: day,
                dayName: dayNameDict[response[0]][0],
                amount: numPron[response[1]] 
              }
              if (dayNameDict[response[0]][1]<this.state.today) page=8;
              this.setState({page: dayNameDict[response[0]][1]+page})
            }
            this.assistant.sendData({
              action: {
                action_id: "say1",
                parameters: howManyParams,
              },
            })
            break

        case 'how_many_left':
          let howManyLeftParams
          let amountOfRemainingLessons = this.getAmountOfRemainingLessons(new Date(Date.now()))
          if (this.state.today === 0) {
            howManyLeftParams = {day: "sunday"}
          } else {
            howManyLeftParams = {
              amount: amountOfRemainingLessons,
              pron: numPron[amountOfRemainingLessons]
            }
          }
          this.assistant.sendData({
            action: {
              action_id: "say2",
              parameters: howManyLeftParams,
            },
          })
          if (this.state.group!=="")
          if (this.state.today === 0) {
            this.setState({page: 8})
          } else {
            this.setState({page: this.state.today})
          }
          break

        case 'where':
          // console.log("getCurrentLesson")
          // console.log(this.getCurrentLesson(new Date(Date.now() + 36000000 + 7200000)))
          console.log('ok')
          if (action.note === undefined) {
            action.note = {"when": "now"}
          }
          let whereLessonParams
          whereLessonParams = this.whereWillLesson(new Date(this.state.date   ), action.note.when)
          this.assistant.sendData({
            action: {
              action_id: "say3",
              parameters: whereLessonParams,
            },
          })
          if (this.state.group!=="")
          if (whereLessonParams.exist === "sunday") {
            this.setState({page: 8})
          } else {
            this.setState({page: this.state.today});
          }
      
          break

          case 'what_lesson':
          console.log("какая пара")
          if (this.state.group!=="")
          if (action.note === undefined) {
            action.note = {"when": "now"}
          }
          let whatlesson 
          whatlesson = this.whatLesson(new Date(Date.now()   ), action.note.when);
          console.log(this.whatLesson(new Date(Date.now()   ), action.note.when))
          this.assistant.sendData({
            action: {
              action_id: "say4",
              parameters: whatlesson,
            },
          })
          if (this.state.today===0) {
            this.setState({page: 8})
          } else {
            this.setState({page: this.state.today});
          }
      
          break
        
          case 'first_lesson':
            const num = {1:"первой", 2:"второй", 3:"третьей", 4:"четвертой", 5:"пятой", 6:"шестой", 7:"седьмой"}
            let number
            let day1 
            let page1 = 0;
            if (action.note !== undefined) {
              console.log(action.note)
              console.log(parseInt(action.note.dayOfWeek)-1);
              number = this.getTimeFirstLesson(parseInt(action.note.dayOfWeek)-1)[1]
              if (String(this.state.today + 1) === action.note.dayOfWeek) { day1 = "today"; page1=0}
              else if (String(this.state.today + 2) === action.note.dayOfWeek) {day1 = "tomorrow"; page1 = 0}
            } else {
              console.log(this.getTimeFirstLesson(parseInt(action.note.dayOfWeek)-1)[1]);
              number = this.getTimeFirstLesson(parseInt(action.note.dayOfWeek)-1)[1];
              day = "today"
            }
            const dayNameDict1 = {1:["В понедельник", 1], 2:["Во вторник", 2], 3:["В среду", 3], 4:["В четверг", 4], 5:["В пятницу", 5], 6:["В субботу", 6]}
            console.log("response", number, parseInt(action.note.dayOfWeek)-1)
            let whichFirst
            if (this.state.group!=="")
            if (number === undefined) {
              whichFirst = {day1: "sunday"}
              this.setState({page: 8})
            }
            else {
              whichFirst = { 
                num: num[number[0]],
                day: day1,
                dayName: dayNameDict1[parseInt(action.note.dayOfWeek)-1][0]
              }
              if (dayNameDict1[parseInt(action.note.dayOfWeek)-1][1]<this.state.today) page1=8;
              this.setState({page: dayNameDict1[parseInt(action.note.dayOfWeek)-1][1]+page1})
            }
            this.assistant.sendData({
              action: {
                action_id: "say5",
                parameters: whichFirst,
              },
            })
            break
            case 'day_schedule':
              let page2 = 0;
              if ((action.note[1] === null)&&(action.note[2] === null)) {
                if (this.state.flag===false) {
                  console.log(this.state.flag);
                  page2=8;} 
                else page2=0; 
              }
              else {
                console.log(action.note)
                console.log(parseInt(action.note[0].dayOfWeek)-1);
                if (action.note[1] !== null) {
                  console.log(action.note[1]);
                  page2=0; 
                }
                else if (action.note[2] !== null) {
                  console.log(action.note[2]);
                  page2=8; 
                }
              } 
              const dayNameDict2 = {1:["понедельник", 1], 2:["вторник", 2], 3:["среду", 3], 4:["четверг", 4], 5:["пятницу", 5], 6:["субботу", 6], 0: ["воскресенье", 8]}
              let daySchedule
              if (this.state.group!==""){
                daySchedule = { 
                  dayName: dayNameDict2[parseInt(action.note[0].dayOfWeek)-1][0]
                }
                
                this.setState({page: dayNameDict2[parseInt(action.note[0].dayOfWeek)-1][1]+page2})
              }
              this.assistant.sendData({
                action: {
                  action_id: "say6",
                  parameters: daySchedule,
                },
              })
              break
          case 'group': 
            if (action.note[0] === 0) { 
            console.log(action.note[1].data.groupName[0]);
            this.setState({group: action.note[1].data.groupName[0].toUpperCase(), page: 0});
            } 
            else { 
            console.log(action.note[1].data.groupName[1])
            this.setState({group: action.note[1].data.groupName[1].toUpperCase(), page: 0}) 
            } 
            break
          case 'show_schedule':
            console.log("показать расписание");
            if (this.state.page===0)
            return this.isCorrect();
          case 'subgroup': 
            console.log('subgroup', action) 
            this.setState({subGroup: action.note, page: 0}); 
            break
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
    for (let day in this.state.days)
      for (let bell in this.state.days[day])
    {
        this.state.days[day][bell][i][0]="";
        this.state.days[day][bell][i][1]="";
        this.state.days[day][bell][i][2]="";
        this.state.days[day][bell][i][3]="";
        this.state.days[day][bell][i][4]="";
        this.state.days[day][bell][i][5]="";
        this.state.days[day][bell][i][6]="";
      }
    
    for (let day_num = 1; day_num < 7; day_num++) {
      this.state.day[day_num-1]["count"][i]=0;
      if (this.schedule["schedule"]!==null)
      
      {this.state.day[day_num-1]["date"][i]=this.schedule["schedule_header"][`day_${day_num}`]["date"];
      for (let bell in this.schedule["schedule"]) { //проверка 
        
        if ((this.schedule["schedule"][bell]!==undefined)&& (this.schedule["schedule"][bell][`day_${day_num}`]["lessons"][0] !== undefined)&&(this.schedule["schedule"][bell][`day_${day_num}`]["lessons"][0]["groups"][0]["subgroup_name"] !== undefined)&&(this.schedule["schedule"][bell][`day_${day_num}`]["lessons"][0]["groups"][0]["subgroup_name"] ===this.state.subGroup) &&(this.state.subGroup!==""))
        {
          this.state.days[day_num-1][bell][i][0]=this.schedule["schedule"][bell][`day_${day_num}`]["lessons"][0]["subject_name"];
          this.state.days[day_num-1][bell][i][1]=this.schedule["schedule"][bell][`day_${day_num}`]["lessons"][0]["teachers"][0]["name"];
          this.state.days[day_num-1][bell][i][2]=this.schedule["schedule"][bell][`day_${day_num}`]["lessons"][0]["rooms"][0]["name"];
          this.state.days[day_num-1][bell][i][3]=`${this.schedule["schedule"][bell][`header`]["start_lesson"]} - ${this.schedule["schedule"][bell][`header`]["end_lesson"]}`;
          this.state.days[day_num-1][bell][i][4]=this.schedule["schedule"][bell][`day_${day_num}`]["lessons"][0]["type"];
          this.state.days[day_num-1][bell][i][5]=`${bell.slice(5, 6)}. `;
          this.state.days[day_num-1][bell][i][6]=this.schedule["schedule"][bell][`day_${day_num}`]["lessons"][0]["other"];
          this.state.day[day_num-1]["count"][i]++;
        } else if((this.schedule["schedule"][bell]!==undefined)&& (this.schedule["schedule"][bell][`day_${day_num}`]["lessons"][0] !== undefined)&&(this.schedule["schedule"][bell][`day_${day_num}`]["lessons"][0]["groups"][0]["subgroup_name"] !== undefined)&&(this.schedule["schedule"][bell][`day_${day_num}`]["lessons"][0]["groups"][0]["subgroup_name"] !==this.state.subGroup)&&(this.schedule["schedule"][bell][`day_${day_num}`]["lessons"][0]["groups"][0]["subgroup_name"] !== undefined)&&(this.state.subGroup!=="") ){
          
          this.state.days[day_num-1][bell][i][0]="";
          this.state.days[day_num-1][bell][i][1]="";
          this.state.days[day_num-1][bell][i][2]="";
          this.state.days[day_num-1][bell][i][3]="";
          this.state.days[day_num-1][bell][i][4]="";
          this.state.days[day_num-1][bell][i][5]="";
          this.state.days[day_num-1][bell][i][6]="";
          
          }else  if ((this.schedule["schedule"][bell]!==undefined) &&(this.schedule["schedule"][bell][`day_${day_num}`]["lessons"][0] !== undefined)) {
            this.state.days[day_num-1][bell][i][0]=this.schedule["schedule"][bell][`day_${day_num}`]["lessons"][0]["subject_name"];
            this.state.days[day_num-1][bell][i][1]=this.schedule["schedule"][bell][`day_${day_num}`]["lessons"][0]["teachers"][0]["name"];
            this.state.days[day_num-1][bell][i][2]=this.schedule["schedule"][bell][`day_${day_num}`]["lessons"][0]["rooms"][0]["name"];
            this.state.days[day_num-1][bell][i][3]=`${this.schedule["schedule"][bell][`header`]["start_lesson"]} - ${this.schedule["schedule"][bell][`header`]["end_lesson"]}`;
            this.state.days[day_num-1][bell][i][4]=this.schedule["schedule"][bell][`day_${day_num}`]["lessons"][0]["type"];
            this.state.days[day_num-1][bell][i][5]=`${bell.slice(5, 6)}. `;
            this.state.days[day_num-1][bell][i][6]=this.schedule["schedule"][bell][`day_${day_num}`]["lessons"][0]["other"];
          this.state.day[day_num-1]["count"][i]++;
        }  else {
          this.state.days[day_num-1][bell][i][0]="";
          this.state.days[day_num-1][bell][i][1]="";
          this.state.days[day_num-1][bell][i][2]="";
          this.state.days[day_num-1][bell][i][3]="";
          this.state.days[day_num-1][bell][i][4]="";
          this.state.days[day_num-1][bell][i][5]="";
          this.state.days[day_num-1][bell][i][6]="";
          }
        }
       if (this.state.day[day_num-1]["count"][i]===0)
        this.state.days[day_num-1]["bell_1"][i][0]="Пар нет 🎉";
     
      } else {
        this.state.days[day_num-1]["bell_1"][i][0]="Пар нет 🎉";}
      } 
      this.setState({spinner: true});
  }


  Sunday(){
    this.state.i=0;
    let index=0;
    this.state.timeParam=0;
    if (this.state.checked===true) { this.state.star=true} 
    else {
      if (this.state.groupId==this.state.bd) {this.state.star=true;}
    else this.state.star=false;
  }
    return(
      <DeviceThemeProvider>
        <DocStyle />
        {(() => {
          switch (this.state.character) {
            case "sber":
              return <ThemeBackgroundSber />;
            case "eva":
              return <ThemeBackgroundEva />;
            case "joy":
              return <ThemeBackgroundJoy />;
            default:
              return;
          }
        })()}
      <div  >
          <Container style = {{padding: 0}}>
          <Row style={{margin: "1em"}}>
          <Col style={{ maxWidth: '3rem' }}>
          <Image src={logo} ratio="1 / 1"/>
          </Col>
          <Col style={{marginLeft: "0.5em"}}>
          <TextBox 
          subTitle={this.state.subGroup!="" ? `${this.state.group} (${this.state.subGroup})` : `${this.state.group} `}
          title="Расписание занятий"
          />
          </Col>
          <Col style={{margin: "0 0 0 auto"}}>
            <Button size="s" view="clear"  pin="circle-circle" onClick={()=>{this.setState({star: !this.state.star});this.Star()}}  contentRight={this.state.star === true ? <IconStarFill size="s" color="inherit"/> : <IconStar size="s" color="inherit"/>} />
            <Button size="s" view="clear" pin="circle-circle" onClick={()=>this.setState({ page: 0 })}><IconSettings size="s" color="inherit"/></Button>
          </Col>
        </Row>
        <Row style={{display: "flex", alignItems: "flex-start", justifyContent:"center"}}>
        <div>
          <Tabs view="black" size="m" >
            <TabItem isActive={this.state.flag} onClick={()=>this.setState({ page: 7,  flag: true  })}>Текущая неделя
            </TabItem>
            <TabItem isActive={!this.state.flag} onClick={()=>this.setState({ page: 7, flag: false })}>Следующая неделя
            </TabItem>
          </Tabs>
        </div>
        </Row>
        <Row style={{margin: "0.5em"}}>
        <CarouselGridWrapper >
                    <Carousel
                        as={Row}
                        axis="x"
                        scrollAlign="center"
                        index={this.state.i}
                        scrollSnapType="mandatory"
                        animatedScrollByIndex="true"
                        detectActive= "true"
                        detectThreshold={0.5}
                        onIndexChange={() => this.Index()}
                        paddingStart="0%"
                        paddingEnd="50%"
                        
                    >
                        {this.state.day.map(({ title, date }, i) =>  
                        this.state.today === i+1
                         ? ( 
                            <CarouselCol key={`item:${i}`} ><Button view = "secondary" style={{marginTop: "0.5em", marginBottom: "0.5em"}} size="s" pin="circle-circle" text={`${title} ${date[0].slice(0, 5)}`} focused={i+1 === index} onClick={()=>{this.setState({page: i+1 + this.state.timeParam}) }}/></CarouselCol> 
                        ): (<CarouselCol key={`item:${i}`} ><Button view = "clear" style={{marginTop: "0.5em", marginBottom: "0.5em"}} size="s" pin="circle-circle" text={`${title} ${date[0].slice(0, 5)}`} focused={i+1 === index} onClick={()=>{this.setState({page: i+1 + this.state.timeParam}) }}/></CarouselCol> )
                        ) }
                    </Carousel>
                </CarouselGridWrapper>
        </Row>
        <Row style={{position:" absolute", top: "50%", left:" 40%", marginRight: "-50%"}}>
          <TextBox>
            <TextBoxBigTitle>Выходной 😋</TextBoxBigTitle>
          </TextBox>
        </Row>
          <div style={{
        width:  '200px',
        height: '200px',
        }}></div>
          </Container>
            </div>
            </DeviceThemeProvider>
    );
    
  }

  Star(){
    
    if (this.state.star === false){
      createUser(this.state.userId, "808", String(this.state.groupId), String(this.state.subGroup), String(this.state.engGroup));
      this.setState({checked:true, bd: this.state.groupId});
    } else {
      createUser(this.state.userId, "", "", "", "");
      this.setState({checked:false, bd: ""});
    }
    
  }


  Raspisanie(timeParam, weekParam){
    this.state.i=0;
    this.state.star=false;
    let current = this.getCurrentLesson(new Date(Date.now()   ));
    let day_num = timeParam-1;
    let index=timeParam;
    if (weekParam===1){
      this.state.timeParam = 8;
      this.state.flag=false;
    } else {this.state.timeParam=0;
      this.state.flag=true;
    }
    if (this.state.checked===true) { this.state.star=true} 
    else {
      if (this.state.groupId==this.state.bd) {this.state.star=true;}
      else this.state.star=false;
  }
    
  return(
    <DeviceThemeProvider>
        <DocStyle />
        {(() => {
          switch (this.state.character) {
            case "sber":
              return <ThemeBackgroundSber />;
            case "eva":
              return <ThemeBackgroundEva />;
            case "joy":
              return <ThemeBackgroundJoy />;
            default:
              return;
          }
        })()}
    <div  >
        <Container style = {{padding: 0}}>

        <Row style={{margin: "1em"}}>
          <Col style={{ maxWidth: '3rem' }}>
          <Image src={logo} ratio="1 / 1"/>
          </Col>
          <Col style={{marginLeft: "0.5em"}}>
          <TextBox 
          subTitle={this.state.subGroup!="" ? `${this.state.group} (${this.state.subGroup})` : `${this.state.group} `}
          title="Расписание занятий"
          />
          </Col>
          <Col style={{margin: "0 0 0 auto"}}>
            <Button size="s" view="clear"  pin="circle-circle" onClick={()=>{this.setState({star: !this.state.star});this.Star()}}  contentRight={this.state.star === true ? <IconStarFill size="s" color="inherit"/> : <IconStar size="s" color="inherit"/>} />
            <Button size="s" view="clear" pin="circle-circle" onClick={()=>this.setState({ page: 0 })}  contentRight={<IconSettings size="s" color="inherit"/>} />
          </Col>
        </Row>
        <Row style={{display: "flex", alignItems: "flex-start", justifyContent:"center"}}>
        <div>
          <Tabs view="black" size="m" >
            <TabItem isActive={this.state.flag} onClick={()=>this.setState({ page: 7,  flag: true  })}>Текущая неделя
            </TabItem>
            <TabItem isActive={!this.state.flag} onClick={()=>this.setState({ page: 7, flag: false })}>Следующая неделя
            </TabItem>
          </Tabs>
        </div>
        </Row>
        <Row style={{margin: "0.5em", marginRight: "0"}} >
        <CarouselGridWrapper >
                    <Carousel
                        as={Row}
                        axis="x"
                        scrollAlign="center"
                        index={this.state.i}
                        scrollSnapType="mandatory"
                        animatedScrollByIndex="true"
                        detectActive= "true"
                        detectThreshold={0.5}
                        onIndexChange={() => this.Index()}
                        paddingStart="0%"
                        paddingEnd="40%"
                        
                    >
                        {this.state.day.map(({ title, date }, i) =>  
                         this.state.today === i+1&&weekParam===0?   
                         ( 
                            <CarouselCol key={`item:${i}`} ><Button view = {i+1===index ? "secondary" : "clear"} style={{margin: "0.5em", color: "var(--plasma-colors-accent)"}} size="s" pin="circle-circle" text={`${title} ${date[weekParam].slice(0, 5)}`}  onClick={()=>{this.setState({page: i+1 + this.state.timeParam}) }}/></CarouselCol> 
                        ): (<CarouselCol key={`item:${i}`} ><Button view = {i+1===index ? "secondary" : "clear"}  style={{margin: "0.5em"}} size="s" pin="circle-circle" text={`${title} ${date[weekParam].slice(0, 5)}`} onClick={()=>{this.setState({page: i+1 + this.state.timeParam}) }}/></CarouselCol> )
                        ) }
                    </Carousel>
                </CarouselGridWrapper>
        </Row>
        { this.state.day[0]["date"][weekParam]==="" ? (<RectSkeleton width="90%" height="25rem" roundness={16} style={{ marginLeft: "5%", marginTop: "5%" }}/>) : (
        <div style={{ flexDirection: "column" }}>
          <Card style={{ width: "90%", marginLeft: "5%", marginTop: "0.5em" }}>
            <CardBody>
              <CardContent compact >
              <CardContent compact >
                {/* <TextBoxBigTitle style={{color: "var(--plasma-colors-secondary)"}}> {this.state.day[day_num]["title"]} {this.state.day[day_num]["date"][weekParam].slice(0, 5)},  {this.Para(this.state.day[day_num]["count"][weekParam])} </TextBoxBigTitle> */}
              { 
              this.state.days.map((bell_$, i) =>  this.state.days[day_num][`bell_${i+1}`][weekParam][0]!=="" ? (                
              <CellListItem key={`item:${i}`} content={
              <TextBox>                
                  <TextBoxSubTitle  lines={8}> 
                    {this.state.days[day_num][`bell_${i+1}`][weekParam][3]}
                  </TextBoxSubTitle>
                  {this.state.days[day_num][`bell_${i+1}`][weekParam][5][0] === current && this.state.days[day_num][`bell_${i+1}`][weekParam][1] !=="" && this.state.today === timeParam &&weekParam===0 ? (
                    < CardHeadline3 style={{color: "var(--plasma-colors-button-accent)"}}>
                    {this.state.days[day_num][`bell_${i+1}`][weekParam][0]}
                    </ CardHeadline3>
                  ) : (
                  < CardHeadline3 >
                  {this.state.days[day_num][`bell_${i+1}`][weekParam][0]}
                  </ CardHeadline3>)
              }
                  <TextBoxTitle> {this.state.days[day_num][`bell_${i+1}`][weekParam][1]} </TextBoxTitle>
                  { this.state.days[day_num][`bell_${i+1}`][weekParam][6] !== ""&&this.state.days[day_num][`bell_${i+1}`][weekParam][6] !== null ? (
                  <a href={this.state.days[day_num][`bell_${i+1}`][weekParam][6]} style={{color:"var(--plasma-colors-white-secondary)"}}>Ссылка на онлайн-конференцию</a>):(<div></div>)
              }
                  </TextBox>
                }   
                            
                contentRight={
                  <TextBox>
                <Badge text={this.state.days[day_num][`bell_${i+1}`][weekParam][2]} contentLeft={<IconLocation size="xs"/>} style={{backgroundColor: "rgba(0,0,0, 0)" }}/>
                 <TextBoxLabel> {this.Type(this.state.days[day_num][`bell_${i+1}`][weekParam][4])}</TextBoxLabel>
              </TextBox>} 
              contentLeft={this.state.days[day_num][`bell_${i+1}`][weekParam][1]!=="" ? (
              <Badge text={this.state.days[day_num][`bell_${i+1}`][weekParam][5][0]}  view="primary" style={{ marginRight:"1em" }} size="l"/>) : (<div></div>)
               }                
                />
              
                ) : (<div></div>))}</CardContent>
              </CardContent>
            </CardBody>
          </Card>
          </div>)
  }
          <div style={{
        width:  '200px',
        height: '200px',
        }}></div>
          </Container>
          </div>
         </DeviceThemeProvider>
  );
  }

  Index(){
    if (this.state.i<7){
      this.state.i++;
    } else if (this.state.i>0)
    this.state.i--;
  }

  
  Home(){
    let disabled = true;
    if (this.state.groupId!=="") disabled=false;
    if (this.state.character === "joy") {
            
      this.state.description="Заполни данные, чтобы открывать расписание одной фразой"
    } else this.state.description="Чтобы посмотреть расписание, укажите данные учебной группы"
    return (
      <DeviceThemeProvider>
        <DocStyle />
        {(() => {
          switch (this.state.character) {
            case "sber":
              return <ThemeBackgroundSber />;
            case "eva":
              return <ThemeBackgroundEva />;
            case "joy":
              return <ThemeBackgroundJoy />;
            default:
              return;
          }
        })()}
      <div  >
        <Container style = {{padding: 0}}>
        <Row >
          <Col style={{marginLeft: "auto"}}>
            {disabled===false ?(
            <Button  view="clear" disabled={disabled} contentRight={<IconChevronRight size="s" color="inherit"/>} size="s" pin="circle-circle"  onClick={()=>this.setState({ page: 7 })} style={{margin: "1em"}}/> ) 
            : (<Button view = "clear" disabled={disabled}/>)
            }
          </Col>
        </Row>
        <div >
          <TextBox>
          <TextBoxBigTitle style={{margin: '3%', textAlign: "center"}}>Салют, студент! </TextBoxBigTitle>
          <TextBoxSubTitle  style={{margin: '1.5em', textAlign: "center", color: "white"}}>{this.state.description}</TextBoxSubTitle>
          </TextBox>
          <TextField
          id="tf"
          label={this.state.labelGroup}
          
          className="editText"
          // placeholder="Напиши номер своей академической группы"
          value={this.state.group}
          style={{margin: "1em", color: `${this.state.color_group}`}}
          onChange={(v) =>
            this.setState({
              group: v.target.value,
            })
          }
        />
        
          <TextField
          id="tf"
          className="editText"
          label={this.state.labelSubgroup}
          value={this.state.subGroup}
          style={{margin: "1em", color: `${this.state.color_sub}`}}
          onChange={(s) =>
            this.setState({
              subGroup: s.target.value,
            })
          }
        />
        <Row style={{display: "flex", alignItems: "flex-start", justifyContent:"center",margin: "1.1em"}}><Checkbox  label="Запомнить эту группу " checked={this.state.checked} onChange={(event) => {
                        this.setState({checked: event.target.checked });
                        console.log(this.state.checked);
                        }
            }/>
          </Row>
          <Row style={{display: "flex", alignItems: "flex-start", justifyContent:"center"}}>
            <TextBox>
            <TextBoxSubTitle color="var(--plasma-colors-secondary)" style={{ textAlign: "center"}}>Тогда не придётся вводить данные каждый раз</TextBoxSubTitle>
            </TextBox>
          </Row>
          <Row style={{display: "flex", alignItems: "flex-start", justifyContent:"center",margin: "1em"}}>
          <Button text="Посмотреть расписание" view="primary"  onClick={()=>this.isCorrect()} style={{margin: "3%"}}/>
        </Row>
        {/* <Row style={{display: "flex", alignItems: "flex-start", justifyContent:"center", marginTop: "1em"}}>
          <Image src={image} style={{width: "250px"}}/>
        </Row> */}
        </div>
        <div style={{
        width:  '100px',
        height: '100px',
        }}></div>
        </Container>
      </div>
      </DeviceThemeProvider>
    )
  }

  isCorrect(){
    this.setState({correct: false})
    let correct_sub = false;
    for (let i of groups) {
      if (this.state.group.toLowerCase() === i.name.toLowerCase()) {
        this.state.correct = true
        console.log(`Correct ${this.state.correct}`)
        this.convertGroupNameInId()
    } 
  }
  if ((this.state.subGroup==="")||(this.state.subGroup==="1")||(this.state.subGroup==="2")) correct_sub=true;
  if ((this.state.correct===true)&&(correct_sub===true)) {
   
    if (this.state.checked===true) createUser(this.state.userId, "808", String(this.state.groupId), String(this.state.subGroup), String(this.state.engGroup));

    getScheduleFromDb(this.state.groupId, this.getFirstDayWeek(new Date(this.state.date  ))).then((response)=>{
    this.showWeekSchedule(response, 0);
    }); 
    getScheduleFromDb(this.state.groupId, this.getFirstDayWeek(new Date(this.state.date + 604800000  ))).then((response)=>{
      this.showWeekSchedule(response, 1);
    });
    this.state.flag=true;
    this.setState({page: 7, labelGroup: "Номер академической группы", color_group: "var(--plasma-colors-white-secondary)"});
  } else if (this.state.correct===true) {this.setState({labelGroup: "Номер академической группы", color_group: "var(--plasma-colors-white-secondary)"});}
  else if (this.state.group==="") {this.setState({labelGroup: "Поле с номером группы является обязательным для ввода", color_group: "var(--plasma-colors-critical)  "})}
  else {this.setState({labelGroup: "Некорректно введен номер группы", color_group: "var(--plasma-colors-critical)  "})}
    if (correct_sub===false) {this.setState({ color_sub: "var(--plasma-colors-critical)  "})}
    else this.setState({ color_sub: "var(--plasma-colors-white-secondary)", star: false});
  }

  Para(count){
    switch(count){
      case 1:
        return "одна пара";
      case 2:
        return "две пары";
      case 3:
        return "три пары";
      case 4:
        return "четыре пары";
      default:
        return `${count} пар`;
    }
  }

  Type(type){
    switch(type){
      case "Лекционные":
        return "Лекция";
      case "Практические":
        return "Практика";
      case "Лабораторные":
        return "Лаба";
      default:
        break;
    }
  }

  Spinner(){
    var myinterval =setInterval(() => {
      if (this.state.spinner === true){
        setTimeout(()=>{
        if(this.state.today===0) {this.setState({page: 8})}
     else if (this.state.flag===true) this.setState({page: this.state.today});
     else this.setState({page: 9});
     
    }, 100);
    clearInterval(myinterval)}
    }, 100);
    
    return(
      <DeviceThemeProvider>
        <DocStyle />
        {(() => {
          switch (this.state.character) {
            case "sber":
              return <ThemeBackgroundSber />;
            case "eva":
              return <ThemeBackgroundEva />;
            case "joy":
              return <ThemeBackgroundJoy />;
            default:
              return;
          }
        })()}
      <div  >
        <Container style = {{padding: 0}}>
        <Spinner color="var(--plasma-colors-button-accent)" style={{position:" absolute", top: "40%", left:" 45%", marginRight: "-50%"}}/>
        </Container>
      </div>
      </DeviceThemeProvider>
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