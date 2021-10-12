import React, {useState, useEffect, useRef} from "react";
import logo from "../src/logo.png";
import image from "../src/frame.png"
import karta from "../src/Karta.png";
import groups from './groups_list.js';
import Home from '../src/components/HomeView.jsx';
import Navigator from '../src/components/Navigator.jsx';
import {
  Container,
  Row,
  Col,
  Button,
  Tabs,
  TabItem,
  DeviceThemeProvider,
  Header,
  Spinner,
  HeaderContent,
  Cell,
  HeaderSubtitle
} from '@sberdevices/plasma-ui';
import {ToastContainer, toast} from 'react-toastify';
import {useToast, ToastProvider, Toast} from '@sberdevices/plasma-ui'
import {detectDevice} from '@sberdevices/plasma-ui/utils';
import 'react-toastify/dist/ReactToastify.css';
import {
  Card,
  CardBody,
  CardBody2,
  CardBody1,
  CardContent,
  CardMedia,
  CardParagraph1,
  CardParagraph2,
  TextBoxBigTitle,
  TextBox,
  TextBoxSubTitle,
  TextBoxTitle,
  HeaderLogo,
  HeaderRoot,
  HeaderTitle,
  CarouselGridWrapper,
  Carousel, CarouselCol,
  Badge,
  TextBoxLabel,
  Checkbox,
  CellListItem,
  CardHeadline3,
  CardHeadline2,
  CardHeadline1,
  ButtonSkeleton,
  RectSkeleton,
  HeaderTitleWrapper,
  Image,
  Link
} from "@sberdevices/plasma-ui";
import {
  createSmartappDebugger,
  createAssistant,
} from "@sberdevices/assistant-client";
import "./App.css";
import styled, {createGlobalStyle, div} from "styled-components";
import {darkJoy, darkEva, darkSber} from "@sberdevices/plasma-tokens/themes";
import {text, background, gradient} from "@sberdevices/plasma-tokens";
import {TextField, ActionButton} from "@sberdevices/plasma-ui";
import {
  IconSettings,
  IconChevronRight,
  IconLocation,
  IconNavigationArrow,
  IconStar,
  IconStarFill,
  IconChevronLeft,
  IconMoreVertical,
  IconHouse
} from "@sberdevices/plasma-icons";
import {
  createUser,
  getScheduleFromDb,
  getIdTeacherFromDb,
  getInTeacherFromDb,
  getScheduleTeacherFromDb,
  getUser,
  putScheduleIntoDb,
  updateUser,
} from "./APIHelper.js";
import {verify} from "crypto";
import eng from './eng.js'
import {Bell, Day} from './ScheduleStructure.js'

export const NAV_PAGE_NO = 15;

const initializeAssistant = (getState) => {
  if (process.env.NODE_ENV === "development") {
    return createSmartappDebugger({
      token:      process.env.REACT_APP_TOKEN ?? "",
      initPhrase: `Запусти ${process.env.REACT_APP_SMARTAPP}`,
      getState,
    });
  }
  return createAssistant({ getState });
};

const ThemeBackgroundEva  = createGlobalStyle(darkEva);
const ThemeBackgroundSber = createGlobalStyle(darkSber);
const ThemeBackgroundJoy  = createGlobalStyle(darkJoy);

const DocStyle = createGlobalStyle`
  html:root {
    min-height: 100vh;
    color: ${text};
    background-color: ${background};
    background-image: ${gradient};
  }
`;

const MyDiv100 = styled.div`
  width:  100px;
  height: 100px;
`;

const MyDiv200 = styled.div`
  width:  200px;
  height: 200px;
`;

const PAIR_NAME_IDX = 0;
const TEACHER_NAME_IDX = 1;
const PAIR_NO_IDX      = 5;

const X = ({ today, current, day_num, days, i, timeParam, weekParam }) => {
  //const day_num = props.day_num;
  //const days= props.days;
  const curr_day_obj = days[ day_num ]
  const bell_id  = `bell_${i + 1}`;
  const curr_pair_obj = curr_day_obj[ bell_id ];
  const curr_pair_week_obj = curr_pair_obj[ weekParam ];

  //const curr_day_obj = Array.isArray(days) ? days[ day_num ] : undefined;
  //const bell_id  = `bell_${i + 1}`;
  //const curr_pair_obj = Array.isArray(curr_day_obj) ? curr_day_obj[ bell_id ] : undefined;
  //const curr_pair_week_obj = curr_pair_obj[ weekParam ];

  const pairName = curr_pair_week_obj[ PAIR_NAME_IDX ];
  const curr_pair_no_full = curr_pair_week_obj[ PAIR_NO_IDX ];
  const curr_pair_no = curr_pair_no_full[ 0 ]; // берем первый символ строки (второй - точка)
  const teacherName = curr_pair_week_obj[ TEACHER_NAME_IDX ];

  return curr_pair_no === current
         && teacherName !== ""
         && today === timeParam
         && weekParam === 0
         ? (
           < CardHeadline3 style={{ color: "var(--plasma-colors-button-accent)" }}>
             { pairName }
           </ CardHeadline3>
         )
         : (
           < CardHeadline3>
             { pairName }
           </ CardHeadline3>)
}


export class App extends React.Component {

  constructor(props) {
    super(props);
    this.setValue             = this.setValue.bind(this)
    this.isCorrect            = this.isCorrect.bind(this)
    this.isCorrectTeacher     = this.isCorrectTeacher.bind(this)
    this.convertIdInGroupName = this.convertIdInGroupName.bind(this);
    this.tfRef                = React.createRef();
    console.log('constructor');
    const bell                = Array.from({ length: 2 }, (v, i) => Array.from({ length: 8 }, (v, i) => ""))
    this.state                = {
      notes: [],
      //
      userId: "",
      //
      page:            7,
      logo:            null,
      flag:            true,
      checked:         true,
      description:     "",
      group:           "",
      groupId:         "",
      subGroup:        "",
      engGroup:        "",
      correct:         null,
      labelGroup:      "Номер академической группы через дефисы",
      labelSubgroup:   "Номер подгруппы: 1 или 2",
      labelEnggroup:   "Число номера группы по английскому",
      label_teacher:   "Фамилия И. О.",
      i:               0,
      day:             [ { title: 'Пн', date: [ "", "" ], count: [ 0, 0 ] }, {
        title: 'Вт',
        date:  [ "", "" ],
        count: [ 0, 0 ]
      }, { title: 'Ср', date: [ "", "" ], count: [ 0, 0 ] }, {
        title: 'Чт',
        date:  [ "", "" ],
        count: [ 0, 0 ]
      }, { title: 'Пт', date: [ "", "" ], count: [ 0, 0 ] }, { title: 'Сб', date: [ "", "" ], count: [ 0, 0 ] } ],
      days : [],
      spinner:         false,
      date:            Date.now(),
      today:           0,
      color_group:     "var(--plasma-colors-white-secondary)",
      color_teacher:   "var(--plasma-colors-white-secondary)",
      color_sub:       "var(--plasma-colors-white-secondary)",
      character:       "sber",
      star:            false,
      bd:              "",
      student:         true,
      teacher:         "",
      teacherId:       "",
      teacher_checked: false,
      teacher_star:    false,
      teacher_bd:      "",
      teacher_correct: false,
      building:        [
        { name: "Корпус «Б» (главный)", address: "Ленинский проспект, дом 4", color: "#5487a4", short: "Б" },
        { name: "Корпус «К»", address: "Крымский вал, дом 3", color: "#72aa9f", short: "К" },
        { name: "Корпус «Г» (горный)", address: "Ленинский проспект, дом 6, строение 1", color: "#906aa3", short: "Г" },
        { name: "Корпус «А»", address: "Ленинский проспект, дом 6, строение 2", color: "#9bb2de", short: "А" },
        { name: "Корпус «Д»", address: "Ленинский проспект, дом 6, строение 21", color: "#87a72a", short: "Д" },
        {
          name:    "Корпус «Л» (лабораторный)",
          address: "Ленинский проспект, дом 6, строение 7",
          color:   "#f1ddab",
          short:   "Л"
        },
        { name: "Корпус «В»", address: "Ленинский проспект, дом 6, строение 20", color: "#ffe14d", short: "В" },
        {
          name:    "Корпус «Варшава» (административный)",
          address: "Ленинский проспект, дом 2",
          color:   "#dc86b3",
          short:   ""
        },
        {
          name:    "Спорткомплекс",
          address: "Ленинский проспект, дом 6, строение 7",
          color:   "#ce8d90",
          short:   "Спорткомплекс"
        },

      ]
    }
    this.Home                 = Home.bind(this);
    this.Navigator            = Navigator.bind(this);
    this.Raspisanie           = this.Raspisanie.bind(this);
    this.convertIdInGroupName = this.convertIdInGroupName.bind(this);
  }

  componentDidMount() {
    console.log('componentDidMount');

    this.assistant = initializeAssistant(() => this.getStateForAssistant());
    this.assistant.on("data", (event) => {
      switch (event.type) {
        case "character":
          console.log(event.character.id);
          this.state.character = event.character.id;
          if (event.character.id === "timeParamoy") {

            this.state.description = "Заполни данные, чтобы открывать расписание одной фразой"
          } else this.state.description = "Чтобы посмотреть расписание, укажите данные учебной группы"
          break;

        case "smart_app_data":
          console.log("User");
          console.log(event);
          if (event.sub !== undefined) {
            console.log("Sub", event.sub);
            this.state.userId = event.sub;
            getUser(this.state.userId).then((user) => {

              if (user !== "0") {
                console.log('user', user)
                this.setState({
                  groupId:   user[ "group_id" ],
                  subGroup:  user[ "subgroup_name" ],
                  engGroup:  user[ "eng_group" ],
                  teacherId: user[ "teacher_id" ]
                })
                this.convertIdInGroupName()
                if (this.state.teacherId !== "") {
                  getInTeacherFromDb(this.state.teacherId).then((id) => {
                      this.id = JSON.parse(id);
                      console.log(id);
                      this.setState({ teacher: `${this.id[ 'last_name' ]} ${this.id[ 'first_name' ]}. ${this.id[ 'mid_name' ]}.` })
                    }
                  );
                  getScheduleTeacherFromDb(this.state.teacherId, this.getFirstDayWeek(new Date(this.state.date))).then((response) => {
                    this.showWeekSchedule(response, 0)
                  });
                  this.setState({
                    student:         false,
                    page:            7,
                    teacher_checked: true,
                    teacher_star:    true,
                    teacher_bd:      this.state.teacherId,
                    teacher_correct: true
                  });
                } else if (this.state.groupId !== "") {
                  getScheduleFromDb(this.state.groupId, this.state.engGroup, this.getFirstDayWeek(new Date(this.state.date))).then((response) => {
                    this.showWeekSchedule(response, 0)
                  });
                  this.setState({ page: 7, checked: true, star: true, bd: this.state.groupId, student: true });
                } else this.setState({ page: 0 });
              } else {
                this.setState({ page: 0 });
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

  // setGroup(value){
  //   this.setState({groups: value})
  // }
  // setSubGroup(value){
  //   this.setState({subGroup:value})
  // }
  // setEngGroup(value){
  //   this.setState({engGroup: value})
  // }
  // setChecked(value){
  //   this.setState({checked: value})
  // }
  // setPage(value){
  //   this.setState({page:value})
  // }
  // setStudent(value){
  //   this.setState({student:value})
  // }
  setValue(key, value) {
    console.log(key, value)
    switch (key) {
      case "group":
        this.setState({ group: value });
        break;
      case "subGroup":
        this.setState({ subGroup: value });
      case "teacher":
        this.setState({ teacher: value });
        break;
      case "page":
        this.setState({ page: value });
        break;
      case "student":
        this.setState({ student: value });
        break;
      case "teacher_checked":
        this.setState({ teacher_checked: value });
        break;
      case "engGroup":
        this.setState({ engGroup: value });
        break;
      case "checked":
        this.setState({ checked: value });
        break;
      default:
        break;

    }
  }

  // определяет когда начинаются пары сегодня или завтра
  getStartFirstLesson(day) {
    let dict = { "today": 1, "tomorrow": 0 }
    day      = dict[ day ]
    console.log("getStartFirstLesson")
    for (let bell in this.state.days[ this.state.today - day ]) {
      if (this.state.days[ this.state.today - day ][ bell ][ 0 ][ 3 ] !== "") {
        return this.state.days[ this.state.today - day ][ bell ][ 0 ][ 3 ].slice(0, 5)
      }
    }
  }

  // определяет когда кончаются пары сегодня или завтра
  getEndLastLesson(day) {
    let dict = { "today": 1, "tomorrow": 0 }
    day      = dict[ day ]
    for (let bell = 7; bell > 0; bell--) {
      if (this.state.days[ this.state.today - day ][ `bell_${bell}` ][ 0 ][ 3 ] !== "") {
        return this.state.days[ this.state.today - day ][ `bell_${bell}` ][ 0 ][ 3 ].slice(8)
      }
    }
  }

  // определяет начало или конец энной пары сегодня или завтра
  getBordersRequestLesson(type, day, lessonNum) {
    let dict = { "today": 1, "tomorrow": 0 }
    day      = dict[ day ]
    if (this.state.days[ this.state.today - day ][ `bell_${lessonNum}` ][ 0 ][ 3 ] !== "") {
      if (type === "start") {
        return this.state.days[ this.state.today - day ][ `bell_${lessonNum}` ][ 0 ][ 3 ].slice(0, 5)
      } else {
        return this.state.days[ this.state.today - day ][ `bell_${lessonNum}` ][ 0 ][ 3 ].slice(8)
      }
    }
  }

  getStartEndLesson(type, day, lessonNum) {
    if (day === "today" && this.state.today === 0) {
      return [ day, "sunday" ]
    }
    if (day === "tomorrow" && this.state.today === 6) {
      return [ day, "sunday" ]
    }
    if (type === "start") {
      if (day === "today") {
        if (lessonNum === "0") {
          return this.getStartFirstLesson(day)
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

  // форматировние даты в вид "DD.MM.YY"
  getDateWithDots(date) {
    const month = date.getMonth() + 1;
    const day   = date.getDate();
    const year  = String(date.getFullYear()).slice(2, 4)
    return `${(day < 10 ? '0' : '').concat(day)}.${(month < 10 ? '0' : '').concat(month)}.${year}`;
  }

  // подсчет количества пар в указанную дату
  // возвращает массив с днем недели и количеством пар в этот день
  getAmountOfLessons(date) {
    for (let day of this.state.day) {
      for (let week = 0; week < 2; week++) {
        console.log("this.getDateWithDots(date)", this.getDateWithDots(date))
        console.log("day.date[week]", day.date[ week ])
        if (this.getDateWithDots(date) === day.date[ week ]) {
          return [ day.title, day.count[ week ] ]
        }
      }
    }
    // if (res !== undefined) {return res}
    // else {return null}
  }

  // получить текущее время в формате "HH:MM"
  getTime(date) {
    const hours   = date.getHours()
    const minutes = date.getMinutes()
    return `${(hours < 10 ? '0' : '').concat(hours)}:${(minutes < 10 ? '0' : '').concat(minutes)}`
  }

  // получить текущую пару
  getCurrentLesson(date) {
    if (this.state.today !== 0) {
      for (let bell in this.state.days[ this.state.today - 1 ]) {
        if ((this.getTime(date) > this.state.days[ this.state.today - 1 ][ bell ][ 0 ].startAndfinishTime.slice(0, 6)) &&
          (this.getTime(date) < this.state.days[ this.state.today - 1 ][ bell ][ 0 ].startAndfinishTime.slice(8)) &&
          (this.state.days[ this.state.today - 1 ][ bell ][ 0 ].startAndfinishTime.slice(0, 6) !== "")) {
          return this.state.days[ this.state.today - 1 ][ bell ][ 0 ][ 5 ].lessonName
        }
      }
    }
  }

  // возвращает количество оставшихся на сегодня пар
  getAmountOfRemainingLessons(date) {
    let countRemainingLessons = 0
    if ((this.state.today !== 0) && (this.state.today + 1 !== 7))
      for (let bell in this.state.days[ this.state.today - 1 ]) {
        if (this.getTime(date) < this.state.days[ this.state.today - 1 ][ bell ][ 0 ][ 3 ].slice(0, 6) &&
          this.state.days[ this.state.today - 1 ][ bell ][ 0 ][ 3 ].slice(0, 6) !== "") {
          countRemainingLessons += 1
        }
      }
    return countRemainingLessons
  }

  getTimeFirstLesson(daynum) {
    let first;
    let num;
    let week = 0;
    if (daynum < this.state.today) week = 1;
    for (let bell in this.state.days[ daynum - 1 ]) {
      if (this.state.days[ daynum - 1 ][ bell ][ week ][ 5 ] !== "") {
        first = this.state.days[ daynum - 1 ][ bell ][ week ][ 3 ];
        num   = this.state.days[ daynum - 1 ][ bell ][ week ][ 5 ][ 0 ];
        break
      }
    }
    return [ first, num ];
  }

  whatLesson(date, when) { //определяет название пары, которая идет или будет
    // ключ - номер пары, значение - перерыв до этой пары
    if (this.state.day[ this.state.today - 1 ][ "count" ][ 0 ] == 0) return { lesson: undefined, type: when }
    else {
      console.log(this.state.day[ this.state.today - 1 ][ "count" ][ 0 ], "count");
      if (this.getTime(date) < this.getTimeFirstLesson(this.state.today)[ 0 ].slice(0, 5)) console.log(true)
      let breaks = {
        '1': '09:00',
        '2': '10:35-10:50',
        '3': '12:25-12:40',
        '4': '14:15-14:30',
        '5': '16:05-16:20',
        '6': '17:55-18:10',
        '7': '19:45'
      }
      console.log(" что за пара", this.getTime(date), when, this.getTimeFirstLesson(this.state.today)[ 0 ].slice(0, 5))
      if (this.state.today !== 0) {

        if ((this.getCurrentLesson(date) !== undefined) && (when === "now"))
          for (let bell in this.state.days[ this.state.today - 1 ]) {
            if ((this.state.days[ this.state.today - 1 ][ bell ][ 0 ][ 5 ][ 0 ] === this.getCurrentLesson(date)) && (this.state.days[ this.state.today - 1 ][ bell ][ 0 ][ 5 ][ 0 ] !== "")) {
              return { lesson: this.state.days[ this.state.today - 1 ][ bell ][ 0 ][ 0 ], type: "now" };
            }
          }
        else if ((when === "will") && (this.getCurrentLesson(date) !== undefined) && (parseInt(this.getCurrentLesson(date)) + 1 < 8)) {
          console.log("будет")
          for (let bell in this.state.days[ this.state.today - 1 ]) {
            console.log(parseInt(this.getCurrentLesson(date)) + 1);
            if ((this.state.days[ this.state.today - 1 ][ bell ][ 0 ][ 5 ][ 0 ] == parseInt(this.getCurrentLesson(date)) + 1) && (this.state.days[ this.state.today - 1 ][ bell ][ 0 ][ 5 ][ 0 ] !== "")) {
              return { lesson: this.state.days[ this.state.today - 1 ][ bell ][ 0 ][ 0 ], type: "next" };
            }
          }
        } else if ((this.getTimeFirstLesson(this.state.today)[ 0 ].slice(0, 5) !== undefined) && (this.getTime(date) <= this.getTimeFirstLesson(this.state.today)[ 0 ].slice(0, 5))) {
          console.log(this.state.days[ this.state.today - 1 ][ `bell_${parseInt(this.getTimeFirstLesson(this.state.today)[ 1 ])}` ][ 0 ][ 0 ]);
          return {
            lesson: this.state.days[ this.state.today - 1 ][ `bell_${parseInt(this.getTimeFirstLesson(this.state.today)[ 1 ])}` ][ 0 ][ 0 ],
            type:   "will"
          }
        } else for (let i in breaks) {
          if ((this.getTime(date) > breaks[ i ].slice(0, 5) && this.getTime(date) < breaks[ i ].slice(6)) && (this.state.days[ this.state.today - 1 ][ `bell_${i}` ][ 0 ][ 5 ][ 0 ] !== "")) return {
            lesson: this.state.days[ this.state.today - 1 ][ `bell_${i}` ][ 0 ][ 0 ],
            type:   "will"
          };
          else return { lesson: undefined, type: when };
        }
      }
    }
  }

  // определяет ближайшую пару, если сейчас идет какая то пара, то сообщает об этом
  whereWillLesson(date, will) {
    let nextLessonRoom
    console.log('текущее время', this.getTime(date))
    console.log("will", will)
    // ключ - номер пары, значение - перерыв до этой пары
    let breaks = {
      '1': '09:00',
      '2': '10:35-10:50',
      '3': '12:25-12:40',
      '4': '14:15-14:30',
      '5': '16:05-16:20',
      '6': '17:55-18:10',
      '7': '19:45'
    }
    let numberNearestLesson
    // проверяем, что сегодня не воскресенье
    if (this.state.today !== 0) {
      // определяем номер ближайшей пары
      for (let i in breaks) {
        if (this.getTime(date) < breaks[ '1' ]) {
          numberNearestLesson = '1';
          break
        } else if (this.getTime(date) > breaks[ i ].slice(0, 5) && this.getTime(date) < breaks[ i ].slice(6)) {
          numberNearestLesson = i;
          break
        } else if (this.getTime(date) > breaks[ '7' ]) {
          numberNearestLesson = null
        } else {
          console.log(this.getTime(date))
        }
      }
      console.log(this.getAmountOfLessons(date))
      if (this.getAmountOfLessons(date)[ 1 ] === 0) {
        return { exist: "empty" }
      }
      console.log("numberNearestLesson", numberNearestLesson)
      if (numberNearestLesson !== undefined) {
        console.log(this.state.days)
        for (let bell in this.state.days[ this.state.today - 1 ]) {
          // если пара с таким номером есть в расписании
          if (this.state.days[ this.state.today - 1 ][ bell ][ 0 ][ 5 ][ 0 ] === numberNearestLesson) {
            // выводим эту пару
            console.log(this.state.days[ this.state.today - 1 ][ bell ][ 0 ])
            return {
              audience: this.state.days[ this.state.today - 1 ][ bell ][ 0 ][ 2 ],
              type:     "nearest",
              exist:    "inSchedule"
            }
          } else {
            // сообщаем, что такой пары нет
            console.log(`Сейчас перерыв. Ближайшей будет ${numberNearestLesson} пара`)
            for (let bell in this.state.days[ this.state.today - 1 ]) {
              if (this.state.days[ this.state.today - 1 ][ bell ][ 0 ][ 5 ][ 0 ] !== numberNearestLesson) {
                console.log(this.state.days[ this.state.today - 1 ][ bell ][ 0 ][ 0 ])
                return {
                  audience: this.state.days[ this.state.today - 1 ][ bell ][ 0 ][ 2 ],
                  type:     "nearest",
                  exist:    "notInSchedule"
                }
              }
            }
          }
        }
      }
      if (numberNearestLesson === undefined && will === "now") {
        // вернуть номер текущей пары
        let whereCurrentLesson
        console.log('сейчас идет пара номер', this.getCurrentLesson(date))
        for (let bell in this.state.days[ this.state.today - 1 ]) {
          if (this.state.days[ this.state.today - 1 ][ bell ][ 0 ][ 5 ][ 0 ] === this.getCurrentLesson(date)) {
            console.log(this.state.days[ this.state.today - 1 ][ bell ][ 0 ][ 0 ])
            whereCurrentLesson = this.state.days[ this.state.today - 1 ][ bell ][ 0 ][ 2 ]
            //console.log('whereCurrentLesson', whereCurrentLesson)
            // return {audience:this.state.days[this.state.today - 1][bell][0][2], type:"current"}
          }
        }
        if (whereCurrentLesson === "") {
          console.log("here yoo");
          return { exist: "notInSchedule" }
        } else {
          return { audience: whereCurrentLesson, type: "current" }
        }
      }
      if (numberNearestLesson === undefined && will === "will") {
        console.log("here")
        for (let bell in this.state.days[ this.state.today - 1 ]) {
          // не работает, если сейчас пары нет, а следующая есть
          console.log('номер следующей пары', Number(this.getCurrentLesson(date)) + 1)
          if (this.state.days[ this.state.today - 1 ][ bell ][ 0 ][ 5 ][ 0 ] === String(Number(this.getCurrentLesson(date)) + 1)) {
            console.log('следующей будет пара номер', String(Number(this.getCurrentLesson(date)) + 1))
            console.log(this.state.days[ this.state.today - 1 ][ bell ][ 0 ][ 0 ])
            nextLessonRoom = this.state.days[ this.state.today - 1 ][ bell ][ 0 ][ 2 ]
          }
        }
        if (nextLessonRoom !== "") {
          return { audience: nextLessonRoom, type: "next" }
        } else {
          console.log('пар больше нет')
          return { exist: "endLessons" }
        }
      }
    } else {
      return { exist: "sunday" }
    }
  }

  dispatchAssistantAction(action) {
    console.log('dispatchAssistantAction', action);
    const numPron = { 0: "ноль", 1: "одна", 2: "две", 3: "три", 4: "четыре", 5: "пять", 6: "шесть", 7: "семь" }
    if (action) {
      switch (action.type) {
        case 'profile':
          return this.setState({ page: 0 });
        case 'for_today':
          if ((this.state.group !== "") || (this.state.teacher !== ""))
            if (this.state.today === 0) {
              this.assistant.sendData({
                action: {
                  action_id:  "todaySchedule",
                  parameters: { day: "sunday" },
                },
              })
              return this.setState({ page: 8 });
            } else {
              this.assistant.sendData({
                action: {
                  action_id:  "todaySchedule",
                  parameters: { day: "notSunday" },
                },
              })
              return this.setState({ page: this.state.today });
            }

        case 'for_tomorrow':
          if ((this.state.group !== "") || (this.state.teacher !== ""))
            if (this.state.today + 1 === 7) {
              this.assistant.sendData({
                action: {
                  action_id:  "tomorrowSchedule",
                  parameters: { day: "sunday" },
                },
              })
              return this.setState({ page: 8 });
            } else {
              this.assistant.sendData({
                action: {
                  action_id:  "tomorrowSchedule",
                  parameters: { day: "notSunday" },
                },
              })
              return this.setState({ page: this.state.today + 1 });
            }

        case 'for_next_week':
          if ((this.state.group !== "") || (this.state.teacher !== "")) {
            this.NextWeek();
            return this.setState({ page: 9 });
          }

        case 'for_this_week':
          if ((this.state.group !== "") || (this.state.teacher !== "")) {
            return this.setState({ date: Date.now(), flag: true, page: 7 });
          }

        case 'when_lesson':
          if ((this.state.group !== "") || (this.state.teacher !== "")) {
            let params
            let answer = this.getStartEndLesson(action.note[ 0 ], action.note[ 1 ], action.note[ 2 ])
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
            if (answer !== undefined && answer[ 1 ] === "sunday") {
              params = { type: answer[ 0 ], day: answer[ 1 ] }
            } else {
              params = {
                type:    action.note[ 0 ],
                day:     action.note[ 1 ],
                ordinal: toOrdinal[ action.note[ 2 ] ],
                time:    answer
              }
            }
            console.log("params", params)
            console.log("today", this.state.today)
            this.assistant.sendData({
              action: {
                action_id:  "say",
                parameters: params,
              },
            })

            if (params.day === "sunday") {
              return this.setState({ page: 8 })
            } else if ((params.day === 'today') && (this.state.today !== 0)) return this.setState({ page: this.state.today });
            else if (this.state.today + 1 === 7) return this.setState({ page: 8 });
            else this.setState({ page: this.state.today + 1 });
          }
          break

        case 'how_many':
          let response
          let day
          let lesson
          let page = 0;
          if ((this.state.group !== "") || (this.state.teacher !== "")) {
            if (action.note !== undefined) {
              console.log(action.note)
              response = this.getAmountOfLessons(new Date(action.note.timestamp))
              if (String(this.state.today + 1) === action.note.dayOfWeek) {
                day  = "today";
                page = 0
              } else if (String(this.state.today + 2) === action.note.dayOfWeek) {
                day  = "tomorrow";
                page = 0
              }
            } else {
              response = this.getAmountOfLessons(new Date(Date.now()))
              day      = "today"
            }
            const dayNameDict = {
              "Пн": [ "В понедельник", 1 ],
              "Вт": [ "Во вторник", 2 ],
              "Ср": [ "В среду", 3 ],
              "Чт": [ "В четверг", 4 ],
              "Пт": [ "В пятницу", 5 ],
              "Сб": [ "В субботу", 6 ]
            }
            console.log("response", response[ 1 ])
            let howManyParams
            if (this.state.group !== "")
              if (response === undefined) {
                howManyParams = { day: "sunday" }
                this.setState({ page: 8 })
              } else {
                if (response[ 1 ] === 1) {
                  lesson = "пара"
                } else if (response[ 1 ] === 2 || response[ 1 ] === 3 || response[ 1 ] === 4) {
                  lesson = "пары"
                } else {
                  lesson = "пар"
                }
                howManyParams = {
                  lesson:  lesson,
                  day:     day,
                  dayName: dayNameDict[ response[ 0 ] ][ 0 ],
                  amount:  numPron[ response[ 1 ] ]
                }
                if (dayNameDict[ response[ 0 ] ][ 1 ] < this.state.today) page = 8;
                this.setState({ page: dayNameDict[ response[ 0 ] ][ 1 ] + page })
              }
            this.assistant.sendData({
              action: {
                action_id:  "say1",
                parameters: howManyParams,
              },
            })
          }
          break

        case 'how_many_left':
          if ((this.state.group !== "") || (this.state.teacher !== "")) {
            let howManyLeftParams
            let amountOfRemainingLessons = this.getAmountOfRemainingLessons(new Date(Date.now()))
            if (this.state.today === 0) {
              howManyLeftParams = { day: "sunday" }
            } else {
              howManyLeftParams = {
                amount: amountOfRemainingLessons,
                pron:   numPron[ amountOfRemainingLessons ]
              }
            }
            this.assistant.sendData({
              action: {
                action_id:  "say2",
                parameters: howManyLeftParams,
              },
            })
            if (this.state.group !== "")
              if (this.state.today === 0) {
                this.setState({ page: 8 })
              } else {
                this.setState({ page: this.state.today })
              }
          }
          break

        case 'where':
          // console.log("getCurrentLesson")
          // console.log(this.getCurrentLesson(new Date(Date.now() + 36000000 + 7200000)))
          console.log('ok')
          if ((this.state.group !== "") || (this.state.teacher !== "")) {
            if (action.note === undefined) {
              action.note = { "when": "now" }
            }
            let whereLessonParams
            whereLessonParams = this.whereWillLesson(new Date(this.state.date), action.note.when)
            this.assistant.sendData({
              action: {
                action_id:  "say3",
                parameters: whereLessonParams,
              },
            })

            if (whereLessonParams.exist === "sunday") {
              this.setState({ page: 8 })
            } else {
              this.setState({ page: this.state.today });
            }
          }
          break

        case 'what_lesson':
          console.log("какая пара")
          if ((this.state.group !== "") || (this.state.teacher !== "")) {
            if (action.note === undefined) {
              action.note = { "when": "now" }
            }
            let whatlesson
            whatlesson = this.whatLesson(new Date(Date.now()), action.note.when);
            console.log(this.whatLesson(new Date(Date.now()), action.note.when))
            this.assistant.sendData({
              action: {
                action_id:  "say4",
                parameters: whatlesson,
              },
            })
            if (this.state.today === 0) {
              this.setState({ page: 8 })
            } else {
              this.setState({ page: this.state.today });
            }
          }
          break

        case 'first_lesson':
          if ((this.state.group !== "") || (this.state.teacher !== "")) {
            const num = {
              1: "первой",
              2: "второй",
              3: "третьей",
              4: "четвертой",
              5: "пятой",
              6: "шестой",
              7: "седьмой"
            }
            let number
            let day1
            let page1 = 0;
            if (action.note !== undefined) {
              console.log(action.note)
              console.log(parseInt(action.note.dayOfWeek) - 1);
              number = this.getTimeFirstLesson(parseInt(action.note.dayOfWeek) - 1)[ 1 ]
              if (String(this.state.today + 1) === action.note.dayOfWeek) {
                day1  = "today";
                page1 = 0
              } else if (String(this.state.today + 2) === action.note.dayOfWeek) {
                day1  = "tomorrow";
                page1 = 0
              }
            } else {
              console.log(this.getTimeFirstLesson(parseInt(action.note.dayOfWeek) - 1)[ 1 ]);
              number = this.getTimeFirstLesson(parseInt(action.note.dayOfWeek) - 1)[ 1 ];
              day    = "today"
            }
            const dayNameDict1 = {
              1: [ "В понедельник", 1 ],
              2: [ "Во вторник", 2 ],
              3: [ "В среду", 3 ],
              4: [ "В четверг", 4 ],
              5: [ "В пятницу", 5 ],
              6: [ "В субботу", 6 ]
            }
            console.log("response", number, parseInt(action.note.dayOfWeek) - 1)
            let whichFirst
            if (this.state.group !== "")
              if (number === undefined) {
                whichFirst = { day1: "sunday" }
                this.setState({ page: 8 })
              } else {
                whichFirst = {
                  num:     num[ number[ 0 ] ],
                  day:     day1,
                  dayName: dayNameDict1[ parseInt(action.note.dayOfWeek) - 1 ][ 0 ]
                }
                if (dayNameDict1[ parseInt(action.note.dayOfWeek) - 1 ][ 1 ] < this.state.today) page1 = 8;
                this.setState({ page: dayNameDict1[ parseInt(action.note.dayOfWeek) - 1 ][ 1 ] + page1 })
              }
            this.assistant.sendData({
              action: {
                action_id:  "say5",
                parameters: whichFirst,
              },
            })
          }
          break
        case 'day_schedule':
          if ((this.state.group !== "") || (this.state.teacher !== "")) {
            let page2 = 0;
            if ((action.note[ 1 ] === null) && (action.note[ 2 ] === null)) {
              if (this.state.flag === false) {
                console.log(this.state.flag);
                page2 = 8;
              } else page2 = 0;
            } else {
              console.log(action.note)
              console.log(parseInt(action.note[ 0 ].dayOfWeek) - 1);
              if (action.note[ 1 ] !== null) {
                console.log(action.note[ 1 ]);
                page2 = 0;
              } else if (action.note[ 2 ] !== null) {
                console.log(action.note[ 2 ]);
                page2 = 8;
              }
            }
            const dayNameDict2 = {
              1: [ "понедельник", 1 ],
              2: [ "вторник", 2 ],
              3: [ "среду", 3 ],
              4: [ "четверг", 4 ],
              5: [ "пятницу", 5 ],
              6: [ "субботу", 6 ],
              0: [ "воскресенье", 8 ]
            }
            let daySchedule
            if (this.state.group !== "") {
              daySchedule = {
                dayName: dayNameDict2[ parseInt(action.note[ 0 ].dayOfWeek) - 1 ][ 0 ]
              }

              this.setState({ page: dayNameDict2[ parseInt(action.note[ 0 ].dayOfWeek) - 1 ][ 1 ] + page2 })
            }
            this.assistant.sendData({
              action: {
                action_id:  "say6",
                parameters: daySchedule,
              },
            })
          }
          break
        case 'group':
          if (action.note[ 0 ] === 0) {
            console.log(action.note[ 1 ].data.groupName[ 0 ]);
            this.setState({ group: action.note[ 1 ].data.groupName[ 0 ].toUpperCase(), page: 0 });
          } else {
            console.log(action.note[ 1 ].data.groupName[ 1 ])
            this.setState({ group: action.note[ 1 ].data.groupName[ 1 ].toUpperCase(), page: 0 })
          }
          break
        case 'show_schedule':
          console.log("показать расписание");
          if (this.state.page === 0)
            return this.isCorrect();
        case 'subgroup':
          console.log('subgroup', action)
          this.setState({ subGroup: action.note, page: 0 });
          break
        default:
        //throw new Error();
      }
    }
  }

  getStateForAssistant() {
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
    for (let group of groups) {
      console.log(this.state.groupId, "id")
      if (String(this.state.groupId) === String(group.id)) {
        this.setState({ group: group.name })
        console.log(group.name, "группа")
      }
    }
  }

  convertGroupNameInId() {
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
    var now = new Date();
    this.setState({ today: now.getDay() });
    this.weekDay = date.getDay()
    if (this.weekDay === 0) {
      this.firstDay = date - this.msInDay(this.weekDay + 6)
      console.log(this.formatearFecha(new Date(this.firstDay)))
      //return null
    } else if (this.weekDay === 1) return this.formatearFecha(date)
    else {
      // число первого дня недели
      this.firstDay = date - this.msInDay(this.weekDay - 1)
    }
    return this.formatearFecha(new Date(this.firstDay))
  }

  NextWeek() { //заполнение расписанием на следующую неделю
    this.state.student === false && this.state.teacher_correct === true ? getScheduleTeacherFromDb(this.state.teacherId, this.getFirstDayWeek(new Date(this.state.date + 604800000))).then((response) => {
                                                                          this.showWeekSchedule(response, 1);
                                                                        })
                                                                        : getScheduleFromDb(this.state.groupId, this.state.engGroup, this.getFirstDayWeek(new Date(this.state.date + 604800000))).then((response) => {
                                                                          this.showWeekSchedule(response, 1);
                                                                        })
    this.setState({ date: this.state.date + 604800000, flag: false });
  }

  PreviousWeek() { //заполнение расписанием на предыдущую неделю
    this.state.student === false && this.state.teacher_correct === true ? getScheduleTeacherFromDb(this.state.teacherId, this.getFirstDayWeek(new Date(this.state.date - 604800000))).then((response) => {
                                                                          this.showWeekSchedule(response, 1);
                                                                        })

                                                                        : getScheduleFromDb(this.state.groupId, this.state.engGroup, this.getFirstDayWeek(new Date(this.state.date - 604800000))).then((response) => {
                                                                          this.showWeekSchedule(response, 1);
                                                                        })
    this.setState({ date: this.state.date - 604800000, flag: false });
  }

  showWeekSchedule(schedule, i) { //заполнение данными расписания из бд
    this.state.spinner = false;
    this.schedule      = JSON.parse(schedule);
    this.state.days = new Array(7).fill([])
    console.log(this.state.days)
    for (let day in this.state.days) {
      this.state.days[day]=Array(7).fill([])
      for(let bell in  this.state.days[day]){
        this.state.days[day][bell]=[new Bell(), new Bell()];
      }
      console.log(this.state.days)
    }

    for (let day_num = 1; day_num < 7; day_num++) {
      let countLessons =  this.state.day[ day_num - 1 ][ "count" ][ i ]
      countLessons = 0;
      if (this.schedule[ "schedule" ] !== null) {
        this.state.day[ day_num - 1 ][ "date" ][ i ] = this.schedule[ "schedule_header" ][ `day_${day_num}` ][ "date" ];
        for (let bell in this.schedule[ "schedule" ]) { //проверка
          let bell_num = Number(bell.slice(-1))-1
          let lesson_info = this.schedule[ "schedule" ][ bell ][ `day_${day_num}` ][ "lessons" ][ 0 ]
          let lesson_info_state = this.state.days[ day_num - 1 ][ bell_num ][ i ]
          if ((this.schedule[ "schedule" ][ bell_num ] !== undefined) && (lesson_info !== undefined) && 
          (lesson_info[ "groups" ][ 0 ][ "subgroup_name" ] !== undefined) && 
          (lesson_info[ "groups" ][ 0 ][ "subgroup_name" ] === this.state.subGroup) && (this.state.subGroup !== "")) {

            lesson_info_state.lessonName =lesson_info[ "subject_name" ];
            lesson_info_state.teacher = lesson_info[ "teachers" ][ 0 ][ "name" ];
            lesson_info_state.room = lesson_info[ "room_name" ];
            lesson_info_state.startAndfinishTime = `${this.schedule[ "schedule" ][ bell ][ `header` ][ "start_lesson" ]} - ${this.schedule[ "schedule" ][ bell ][ `header` ][ "end_lesson" ]}`;
            lesson_info_state.lessonType = lesson_info[ "type" ];
            lesson_info_state.lessonNumber = `${bell.slice(5, 6)}. `;
            lesson_info_state.url = lesson_info[ "other" ];

            countLessons++;
          } else if ((this.schedule[ "schedule" ][ bell ] !== undefined) && (lesson_info !== undefined)
           && (lesson_info[ "subgroup_name" ] !== undefined) && (lesson_info[ "groups" ][ 0 ][ "subgroup_name" ] !== this.state.subGroup) 
           && (lesson_info[ "groups" ][ 0 ][ "subgroup_name" ] !== undefined) && (this.state.subGroup !== "")) {
            this.state.days[ day_num - 1 ][ bell ][ i ].reset()
          } else if ((this.schedule[ "schedule" ][ bell ] !== undefined) && (lesson_info!== undefined)) {

            lesson_info_state.lessonName = lesson_info[ "subject_name" ];
            lesson_info_state.teacher = lesson_info[ "teachers" ][ 0 ][ "name" ];
            lesson_info_state.room = lesson_info[ "room_name" ];
            lesson_info_state.startAndfinishTime = `${this.schedule[ "schedule" ][ bell ][ `header` ][ "start_lesson" ]} - ${this.schedule[ "schedule" ][ bell ][ `header` ][ "end_lesson" ]}`;
            lesson_info_state.lessonType= lesson_info[ "type" ];
            lesson_info_state.lessonNumber = `${bell.slice(5, 6)}. `;
            lesson_info_state.url = lesson_info[ "other" ];

            for (let name in lesson_info[ "groups" ]) {
              lesson_info_state.groupNumber += `${lesson_info[ "groups" ][ name ][ "name" ]} `;
            }
            countLessons++;
          } else {
            // this.state.days[day_num-1][bell][i].forEach((element) => {element=""; console.log(element, "element")});
            // console.log("обнуление групп", this.state.days[day_num-1][bell][i][0])
            this.state.days[ day_num - 1 ][ bell_num ][ i ].reset();
          }
        }
        if (countLessons === 0)
         this.state.days[ day_num - 1 ][ 0 ][ i ].lessonName = "Пар нет 🎉";
      
      } else {
        this.state.days[ day_num - 1 ][ 0 ][ i ].lessonName = "Пар нет 🎉";
      }
      
    }
    this.setState({ spinner: true });
  }


  Sunday() {
    this.state.i = 0;
    let index    = 0;
    let groupname;
    if (this.state.checked === true) {
      this.state.star = true
    } else {
      if (this.state.groupId == this.state.bd) {
        this.state.star = true;
      } else this.state.star = false;
    }
    if (this.state.teacher_checked === true) {
      this.state.teacher_star = true
    } else {
      if (this.state.teacherId == this.state.teacher_bd) {
        this.state.teacher_star = true;
      } else this.state.teacher_star = false;
    }
    if (this.state.subGroup !== "") groupname = `${this.state.group} (${this.state.subGroup})`
    else groupname = `${this.state.group} `
    return (
      <DeviceThemeProvider>
        <DocStyle/>
        {(() => {
          switch (this.state.character) {
            case "sber":
              return <ThemeBackgroundSber/>;
            case "eva":
              return <ThemeBackgroundEva/>;
            case "joy":
              return <ThemeBackgroundJoy/>;
            default:
              return;
          }
        })()}
        <div>
          <Container style={{ padding: 0 }}>
            <Row style={{ margin: "1em" }}>
              <Col style={{ maxWidth: '3rem' }}>

                <Image src={logo} ratio="1 / 1" onClick={() => {
                  console.log("sunday")
                }}/>
              </Col>
              <Col style={{ marginLeft: "0.5em" }}>
                <TextBox>
                  <TextBoxTitle>Расписание занятий</TextBoxTitle>
                  {this.state.student === false && this.state.teacher_correct === true ?
                   <TextBoxSubTitle>{this.state.teacher}</TextBoxSubTitle>
                                                                                       :
                   <TextBoxSubTitle>{groupname}</TextBoxSubTitle>}
                </TextBox>
              </Col>
              <Col style={{ margin: "0 0 0 auto" }}>
                <Button size="s" view="clear" pin="circle-circle" onClick={() => this.setState({ page: NAV_PAGE_NO })}
                        contentRight={<IconNavigationArrow size="s" color="inherit"/>}/>
                {this.state.student === false && this.state.teacher_correct === true ? (
                  <Button size="s" view="clear" pin="circle-circle" onClick={() => {
                    this.setState({ teacher_star: !this.state.teacher_star });
                    this.Star()
                  }} contentRight={this.state.teacher_star === true ? <IconStarFill size="s" color="inherit"/> :
                                   <IconStar size="s" color="inherit"/>}/>
                ) : (
                   <Button size="s" view="clear" pin="circle-circle" onClick={() => {
                     this.setState({ star: !this.state.star });
                     this.Star()
                   }} contentRight={this.state.star === true ? <IconStarFill size="s" color="inherit"/> :
                                    <IconStar size="s" color="inherit"/>}/>
                 )}
                <Button size="s" view="clear" pin="circle-circle" onClick={() => this.setState({ page: 0 })}
                        contentRight={<IconSettings size="s" color="inherit"/>}/>

                {/* <Button size="s" view="clear" pin="circle-circle" onClick={()=>this.setState({ page: 16 })}  contentRight={<IconHouse size="s" color="inherit"/>} /> */}
              </Col>
            </Row>
            <Row style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <div>
                <Button view="clear" size="s" pin="circle-circle" onClick={() => {
                  this.state.spinner = false;
                  this.PreviousWeek();
                  this.setState({ page: 9 })
                }} style={{ margin: "1em" }}
                        contentRight={<IconChevronLeft size="s" color="inherit" style={{ paddingBottom: "1.5em" }}/>}/>
                <Button view="primary" size="m" text="Текущая неделя" onClick={() => {
                  this.state.date = Date.now();
                  this.setState({ date: Date.now(), flag: true, page: 7 })
                }} style={{ position: "relative", bottom: "0.5em" }}/>
                <Button view="clear" size="s" pin="circle-circle" onClick={() => {
                  this.state.spinner = false;
                  this.NextWeek();
                  this.setState({ page: 9 })
                }} style={{ margin: "1em" }}
                        contentRight={<IconChevronRight size="s" color="inherit" style={{ paddingBottom: "1.5em" }}/>}/>
              </div>
            </Row>
            <Row style={{ margin: "0.5em" }}>
              <CarouselGridWrapper>
                <Carousel
                  as={Row}
                  axis="x"
                  scrollAlign="center"
                  index={this.state.i}
                  scrollSnapType="mandatory"
                  animatedScrollByIndex="true"
                  detectActive="true"
                  detectThreshold={0.5}
                  onIndexChange={() => this.Index()}
                  paddingStart="0%"
                  paddingEnd="50%"

                >
                  {this.state.day.map(({ title, date }, i) =>
                    this.state.today === i + 1
                    ? (
                      <CarouselCol key={`item:${i}`}><Button view="secondary"
                                                             style={{ marginTop: "0.5em", marginBottom: "0.5em" }}
                                                             size="s" pin="circle-circle"
                                                             text={`${title} ${date[ 0 ].slice(0, 5)}`}
                                                             focused={i + 1 === index} onClick={() => {
                        this.setState({ page: i + 1 })
                      }}/></CarouselCol>
                    ) : (<CarouselCol key={`item:${i}`}><Button view="clear"
                                                                style={{ marginTop: "0.5em", marginBottom: "0.5em" }}
                                                                size="s" pin="circle-circle"
                                                                text={`${title} ${date[ 0 ].slice(0, 5)}`}
                                                                focused={i + 1 === index} onClick={() => {
                      this.setState({ page: i + 1 })
                    }}/></CarouselCol>)
                  )}
                </Carousel>
              </CarouselGridWrapper>
            </Row>
            <MyDiv100/>
{/*
            <div style={{
              width:  '100px',
              height: '100px',
            }}></div>
*/}
            <Row style={{ display: "flex", flexDirection: "row", alignSelf: "center", justifyContent: "center" }}>
              <TextBox>
                <TextBoxBigTitle>Выходной 😋</TextBoxBigTitle>
              </TextBox>
            </Row>
            <MyDiv200/>
{/*
            <div style={{
              width:  '200px',
              height: '200px',
            }}></div>
*/}
          </Container>
        </div>
      </DeviceThemeProvider>
    );

  }

  async Star() {
    if (this.state.student/* === true*/) {
      if (!this.state.star/* === false*/) {
        /*await*/
        createUser(this.state.userId, "880", String(this.state.groupId), String(this.state.subGroup), String(this.state.engGroup), String(this.state.teacherId));
        this.setState({ checked: true, bd: this.state.groupId });
      } else {
        /*await*/
        createUser(this.state.userId, "", "", "", "", "");
        this.setState({ checked: false, bd: "" });
      }
    } else {
      if (!this.state.teacher_star/* === false*/) {
        /*await*/
        createUser(this.state.userId, "880", String(this.state.groupId), String(this.state.subGroup), String(this.state.engGroup), String(this.state.teacherId));
        this.setState({ teacher_checked: true, teacher_bd: this.state.groupId });
      } else {
        /*await*/
        createUser(this.state.userId, "", String(this.state.groupId), String(this.state.subGroup), "", "");
        this.setState({ teacher_checked: false, teacher_bd: "" });
      }
    }
  }


  Raspisanie(timeParam, weekParam) {
    this.state.i    = 0;
    this.state.star = false;
    let current     = this.getCurrentLesson(new Date(Date.now()));
    let day_num     = timeParam - 1;
    let index       = timeParam;
    let groupname;
    let page        = 0;
    if (weekParam === 1) {
      page            = 8;
      this.state.flag = false;
    } else {
      page            = 0;
      this.state.flag = true;
    }
    if (this.state.checked === true) {
      this.state.star = true
    } else {
      if (this.state.groupId == this.state.bd) {
        this.state.star = true;
      } else this.state.star = false;
    }
    if (this.state.teacher_checked === true) {
      this.state.teacher_star = true
    } else {
      if (this.state.teacherId == this.state.teacher_bd) {
        this.state.teacher_star = true;
      } else this.state.teacher_star = false;
    }
    if (this.state.subGroup !== "") groupname = `${this.state.group} (${this.state.subGroup})`
    else groupname = `${this.state.group} `
    //const { showToast, hideToast } = useToast()
    return (
      <DeviceThemeProvider>
        <DocStyle/>
        {(() => {
          switch (this.state.character) {
            case "sber":
              return <ThemeBackgroundSber/>;
            case "eva":
              return <ThemeBackgroundEva/>;
            case "joy":
              return <ThemeBackgroundJoy/>;
            default:
              return;
          }
        })()}
        <div>
          <Container style={{ padding: 0, overflow: "hidden" }}>

            <Row style={{ margin: "1em" }}>

              <Col style={{ maxWidth: '3rem' }}>
                <Image src={logo} ratio="1 / 1"/>
              </Col>

              <Col style={{ marginLeft: "0.5em" }}>
                <TextBox>
                  <TextBoxTitle>Расписание занятий</TextBoxTitle>
                  {this.state.student === false && this.state.teacher_correct === true ?
                   <TextBoxSubTitle>{this.state.teacher}</TextBoxSubTitle>
                                                                                       :
                   <TextBoxSubTitle>{groupname}</TextBoxSubTitle>}
                </TextBox>
              </Col>

              <Col style={{ margin: "0 0 0 auto" }}>
                <Button size="s" view="clear" pin="circle-circle" onClick={() => this.setState({ page: NAV_PAGE_NO })}
                        contentRight={<IconNavigationArrow size="s" color="inherit"/>}
                />
                {this.state.student === false && this.state.teacher_correct === true ? (
                  <Button
                    size="s"
                    view="clear"
                    pin="circle-circle"
                    onClick={() => {
                      this.setState({ teacher_star: !this.state.teacher_star });
                      this.Star()
                    }}
                    contentRight={this.state.teacher_star === true
                                  ? <IconStarFill size="s" color="inherit"/>
                                  :
                                  <IconStar size="s" color="inherit"/>}/>
                ) : (
                   <Button size="s" view="clear" pin="circle-circle" onClick={() => {
                     this.setState({ star: !this.state.star });
                     this.Star();
                   }} contentRight={this.state.star === true ? <IconStarFill size="s" color="inherit"/> :
                                    <IconStar size="s" color="inherit"/>}/>
                 )}
                <Button size="s" view="clear" pin="circle-circle" onClick={() => this.setState({ page: 0 })}
                        contentRight={<IconSettings size="s" color="inherit"/>}/>

                {/* <Button size="s" view="clear" pin="circle-circle" onClick={()=>this.setState({ page: 16 })}  contentRight={<IconHouse size="s" color="inherit"/>} /> */}
              </Col>
            </Row>
            <Row style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <div>
                <Button view="clear" size="s" pin="circle-circle" onClick={() => {
                  this.state.spinner = false;
                  this.PreviousWeek();
                  this.setState({ page: 9 })
                }} style={{ margin: "1em" }}
                        contentRight={<IconChevronLeft size="s" color="inherit" style={{ paddingBottom: "1.5em" }}/>}/>
                <Button view="primary" size="m" text="Текущая неделя" onClick={() => {
                  this.state.date = Date.now();
                  this.setState({ date: Date.now(), flag: true, page: 7 })
                }} style={{ position: "relative", bottom: "0.5em" }}/>
                <Button view="clear" size="s" pin="circle-circle" onClick={() => {
                  this.state.spinner = false;
                  this.NextWeek();
                  this.setState({ page: 9 })
                }} style={{ margin: "1em" }}
                        contentRight={<IconChevronRight size="s" color="inherit" style={{ paddingBottom: "1.5em" }}/>}/>
              </div>
            </Row>
            <Row style={{ margin: "0.5em", marginRight: "0", overflow: "hidden" }}>
              <CarouselGridWrapper>
                <Carousel
                  as={Row}
                  axis="x"
                  scrollAlign="center"
                  index={this.state.i}
                  scrollSnapType="mandatory"
                  animatedScrollByIndex="true"
                  detectActive="true"
                  detectThreshold={0.5}
                  onIndexChange={() => this.Index()}
                  paddingStart="0%"
                  paddingEnd="40%"

                >
                  {this.state.day.map(({ title, date }, i) =>
                    this.state.today === i + 1 && weekParam === 0 ?
                    (
                      <CarouselCol key={`item:${i}`}><Button view={i + 1 === index ? "secondary" : "clear"} style={{
                        margin: "0.5em",
                        color:  "var(--plasma-colors-accent)"
                      }} size="s" pin="circle-circle" text={`${title} ${date[ weekParam ].slice(0, 5)}`}
                                                             onClick={() => {
                                                               this.setState({ page: i + 1 + page })
                                                             }}/></CarouselCol>
                    ) : (<CarouselCol key={`item:${i}`}><Button view={i + 1 === index ? "secondary" : "clear"}
                                                                style={{ margin: "0.5em" }} size="s" pin="circle-circle"
                                                                text={`${title} ${date[ weekParam ].slice(0, 5)}`}
                                                                onClick={() => {
                                                                  this.setState({ page: i + 1 + page })
                                                                }}/></CarouselCol>)
                  )}
                </Carousel>
              </CarouselGridWrapper>
            </Row>
            {this.state.spinner === false ? (<RectSkeleton width="90%" height="25rem" roundness={16}
                                                           style={{ marginLeft: "5%", marginTop: "0.5em" }}/>) : (
               <div style={{ flexDirection: "column" }}>
                 <Card style={{ width: "90%", marginLeft: "5%", marginTop: "0.5em" }}>
                   <CardBody style={{ padding: "0 0 0 0" }}>
                     <CardContent compact style={{ padding: "0.3em 0.3em" }}>
                       {/* <TextBoxBigTitle style={{color: "var(--plasma-colors-secondary)"}}> {this.state.day[day_num]["title"]} {this.state.day[day_num]["date"][weekParam].slice(0, 5)},  {this.Para(this.state.day[day_num]["count"][weekParam])} </TextBoxBigTitle> */}
                       {
                         this.state.days.map((_,bellNumber) => {
                           const curr_day_obj       = this.state.days[ day_num ]
                           const bell_id            = bellNumber;
                           const curr_pair_obj      = curr_day_obj[ bell_id ];
                           const curr_pair_week_obj = curr_pair_obj[ weekParam ];

                           return this.state.days[ day_num ][bellNumber][ weekParam ].lessonName !== "" ? (
                             <CellListItem
                               key={`item:${bellNumber}`}
                               content={
                                 <TextBox>
                                   <TextBoxSubTitle lines={8}>
                                     {this.state.days[ day_num ][bellNumber][ weekParam ].startAndfinishTime}
                                   </TextBoxSubTitle>
                                   {
                                     this.state.days[ day_num ][bellNumber][ weekParam ].lessonNumber[ 0 ] === current
                                     && this.state.days[ day_num ][bellNumber][ weekParam ].teacher !== ""
                                     && this.state.today === timeParam && weekParam === 0
                                     ? (
                                       < CardHeadline3 style={{ color: "var(--plasma-colors-button-accent)" }}>
                                         {this.state.days[ day_num ][bellNumber][ weekParam ].lessonName}
                                       </ CardHeadline3>
                                     )
                                     : (
                                       < CardHeadline3>
                                         {this.state.days[ day_num ][bellNumber][ weekParam ].lessonName}
                                       </ CardHeadline3>)
                                   }
                                   {this.state.student === false && this.state.teacher_correct === true
                                    ? (
                                      <TextBoxTitle> {this.state.days[ day_num ][bellNumber][ weekParam ].groupNumber} </TextBoxTitle>)
                                    : (
                                      <a onClick={() => {
                                        this.state.teacher = this.state.days[ day_num ][ bellNumber][ weekParam ].teacher;
                                        this.isCorrectTeacher()
                                      }}> {this.state.days[ day_num ][bellNumber][ weekParam ].teacher} </a>)}

                                   {/* {this.state.days[day_num][`bell_${i+1}`][weekParam][7]!=="" ? (
                   <TextBoxLabel> {this.state.days[day_num][`bell_${i+1}`][weekParam][7]} подгруппа</TextBoxLabel>) : (<div></div>)
                  } */}
                                   {this.state.days[ day_num ][bellNumber ][ weekParam ].url!== "" && this.state.days[ day_num ][ bellNumber ][ weekParam ].url !== null ? (
                                     <a href={this.state.days[ day_num ][ bellNumber ][ weekParam ].url}
                                        style={{ color: "var(--plasma-colors-white-secondary)" }}>Ссылка на
                                       онлайн-конференцию</a>) : (<div></div>)
                                   }
                                 </TextBox>
                               }

                               contentRight={
                                 <TextBox>
                                   <Badge
                                     text={this.state.days[ day_num ][bellNumber][ weekParam ].room}
                                     contentLeft={<IconLocation size="xs"/>}
                                     style={{ backgroundColor: "rgba(0,0,0, 0)" }}/>
                                   <TextBoxTitle> {this.Type(this.state.days[ day_num ][bellNumber][ weekParam ].lessonType)}</TextBoxTitle>

                                 </TextBox>}
                               contentLeft={this.state.days[ day_num ][ bellNumber][ weekParam ].teacher !== "" ? (
                                 <Badge
                                   text={this.state.days[ day_num ][ bellNumber][ weekParam ].lessonNumber[ 0 ]}
                                   view="primary" style={{ marginRight: "0.5em" }} size="l"/>) : (<div></div>)
                               }
                             />

                           ) : (<div></div>)
                         })
                         
                       }
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

  Index() {
    if (this.state.i < 7) {
      this.state.i++;
    } else if (this.state.i > 0)
      this.state.i--;
  }

  Dashboard() {
    let current = this.getCurrentLesson(new Date(Date.now()));
    console.log(current + 1);
    return (
      <DeviceThemeProvider>
        <DocStyle/>
        {(() => {
          switch (this.state.character) {
            case "sber":
              return <ThemeBackgroundSber/>;
            case "eva":
              return <ThemeBackgroundEva/>;
            case "joy":
              return <ThemeBackgroundJoy/>;
            default:
              return;
          }
        })()}
        <Container style={{ padding: 0 }}>
          <Row style={{ margin: "1em" }}>
            <Col style={{ maxWidth: '3rem' }}>
              <Image src={logo} ratio="1 / 1"/>
            </Col>
            <Col style={{ marginLeft: "0.5em", paddingTop: "0.5em" }}>
              <TextBox
              >
                <CardHeadline3>Мир МИСиС</CardHeadline3>
              </TextBox>
            </Col>
            <Col style={{ margin: "0 0 0 auto" }}>
              <Button size="s" view="clear" pin="circle-circle" onClick={() => this.setState({ page: 0 })}
                      contentRight={<IconSettings size="s" color="inherit"/>}/>
            </Col>
          </Row>
          {current !== undefined ? (
            <Row style={{ marginLeft: "1em" }}>
              <Col style={{ marginLeft: "1em" }}>
                <TextBox>
                  <CardBody2>Сейчас</CardBody2>
                </TextBox>
              </Col>
              <Card style={{ width: "90%", marginLeft: "5%", marginTop: "0.5em" }}>
                <CardBody style={{ padding: "0 0 0 0" }}>
                  <CardContent compact style={{ padding: "0.3em 0.3em" }}>
                    <CellListItem
                      content={
                        <TextBox>

                          <TextBoxSubTitle lines={8}>
                            {this.state.days[ this.state.today - 1 ][ `bell_${current}` ][ 0 ][ 3 ]}
                          </TextBoxSubTitle>
                          < CardHeadline3 style={{ color: "var(--plasma-colors-button-accent)" }}>
                            {this.state.days[ this.state.today - 1 ][ `bell_${current}` ][ 0 ][ 0 ]}
                          </ CardHeadline3>

                          {this.state.student === false && this.state.teacher_correct === true ? (
                                                                                                 <TextBoxTitle> {this.state.days[ this.state.today - 1 ][ `bell_${current}` ][ 0 ][ 7 ]} </TextBoxTitle>)
                                                                                               : (<a onClick={() => {
                              this.isCorrectTeacher()
                            }}> {this.state.days[ this.state.today - 1 ][ current-1 ][ 0 ][ 1 ]} </a>)}

                          {this.state.days[ this.state.today - 1 ][ current-1 ][ 0 ].url !== "" && this.state.days[ this.state.today - 1 ][ `bell_${current}` ][ 0 ].url!== null ? (
                            <a href={this.state.days[ this.state.today - 1 ][current-1][ 0 ].url}
                               style={{ color: "var(--plasma-colors-white-secondary)" }}>Ссылка на
                              онлайн-конференцию</a>) : (<div></div>)
                          }
                        </TextBox>
                      }

                      contentRight={
                        <TextBox>
                          <Badge text={this.state.days[ this.state.today - 1 ][ `bell_${current}` ][ 0 ][ 2 ]}
                                 contentLeft={<IconLocation size="xs"/>}
                                 style={{ backgroundColor: "rgba(0,0,0, 0)" }}/>
                          <TextBoxTitle> {this.Type(this.state.days[ this.state.today - 1 ][ `bell_${current}` ][ 0 ][ 4 ])}</TextBoxTitle>

                        </TextBox>}
                      contentLeft={this.state.days[ this.state.today - 1 ][ `bell_${current}` ][ 0 ][ 1 ] !== "" ? (
                        <Badge text={this.state.days[ this.state.today - 1 ][ `bell_${current}` ][ 0 ][ 5 ][ 0 ]}
                               view="primary" style={{ marginRight: "0.5em" }} size="l"/>) : (<div></div>)
                      }
                    ></CellListItem>
                  </CardContent>
                </CardBody>
              </Card>
            </Row>) : (<div></div>)
          }
          {/* {
    this.whatLesson(new Date(Date.now()   ), "next")!== undefined ? ( <Row style={{marginLeft: "1em"}}>
    </TextBox>
    </Col>
    <Card style={{ width: "90%", marginLeft: "5%", marginTop: "0.5em"}}>
    <CardBody  style={{ padding: "0 0 0 0"}}>
      <CardContent compact style={{ padding: "0.3em 0.3em"}}>
      <CellListItem
      content={
      <TextBox>
          <TextBoxSubTitle  lines={8}>
            {this.state.days[this.state.today-1][`bell_${current+1}`][0][3]}
          </TextBoxSubTitle>
           < CardHeadline3 style={{color: "var(--plasma-colors-button-accent)"}}>
            {this.state.days[this.state.today-1][`bell_${current+1}`][0][0]}
            </ CardHeadline3>
          {this.state.student===false&&this.state.teacher_correct===true ? (<TextBoxTitle> {this.state.days[this.state.today-1][`bell_${current}`][0][7]} </TextBoxTitle>)
          :( <a onClick={()=>{this.isCorrectTeacher()}}> {this.state.days[this.state.today-1][`bell_${current}`][0][1]} </a>) }
          { this.state.days[this.state.today-1][`bell_${current}`][0][6] !== ""&&this.state.days[this.state.today-1][`bell_${current}`][0][6] !== null ? (
          <a href={this.state.days[this.state.today-1][`bell_${current}`][0][6]} style={{color:"var(--plasma-colors-white-secondary)"}}>Ссылка на онлайн-конференцию</a>):(<div></div>)
      }
          </TextBox>
        }
        contentRight={
          <TextBox>
        <Badge text={this.state.days[this.state.today-1][`bell_${current}`][0][2]} contentLeft={<IconLocation size="xs"/>}
        style={{backgroundColor: "rgba(0,0,0, 0)" }}/>
         <TextBoxTitle> {this.Type(this.state.days[this.state.today-1][`bell_${current}`][0][4])}</TextBoxTitle>
      </TextBox>}
      contentLeft={this.state.days[this.state.today-1][`bell_${current}`][0][1]!=="" ? (
      <Badge text={this.state.days[this.state.today-1][`bell_${current}`][0][5][0]}  view="primary" style={{ marginRight:"0.5em" }} size="l"/>) : (<div></div>)
       }
       ></CellListItem>
      </CardContent>
    </CardBody>
  </Card>
  </Row>) : (<div></div>)
  } */}

          <div style={{
            width:  '200px',
            height: '300px',
          }}></div>
        </Container>
      </DeviceThemeProvider>

    )
  }


  isCorrectTeacher() {
    console.log(this.state.teacher);
    getIdTeacherFromDb(this.state.teacher).then((id) => {
      this.id = JSON.parse(id);

      //this.state.teacherId=this.id['id'];
      console.log(id)
      console.log(this.id[ 'status' ], "status")
      if (this.id[ 'status' ] == "-1") {
        console.log("status");
        this.setState({ label_teacher: "Такого преподавателя нет в НИТУ МИСиС", color_teacher: "error" })
      } else if (this.id[ 'status' ] == "-2") {
        this.setState({ label_teacher: "Некорректно введены данные", color_teacher: "Предупреждение" })
      } else {
        getScheduleTeacherFromDb(this.id[ 'id' ], this.getFirstDayWeek(new Date(Date.now()))).then((response) => {
          this.showWeekSchedule(response, 0);

        });
        getInTeacherFromDb(this.id[ 'id' ]).then((id) => {
          this.id = JSON.parse(id);
          this.setState({ teacher: `${this.id[ 'last_name' ]} ${this.id[ 'first_name' ]}. ${this.id[ 'mid_name' ]}.` })
        })
        this.setState({
          teacherId:       this.id[ 'id' ],
          student:         false,
          teacher_correct: true,
          date:            Date.now(),
          flag:            true,
          page:            7,
          label_teacher:   "Фамилия И. О.",
          color_teacher:   "var(--plasma-colors-white-secondary)"
        });
      }
      if (this.state.teacher_checked === true) createUser(this.state.userId, "880", String(this.state.groupId), String(this.state.subGroup), String(this.state.engGroup), String(this.state.teacherId));
    })
  }

  isCorrect() {
    this.setState({ correct: false, date: Date.now() })
    let correct_sub = false;
    let correct_eng = false;
    for (let i of groups) {
      if (this.state.group.toLowerCase() === i.name.toLowerCase()) {
        this.state.correct = true
        console.log(`Correct ${this.state.correct}`)
        this.convertGroupNameInId()
      }
    }
    for (let i of eng) {
      if ((this.state.engGroup == i) || (this.state.engGroup === "")) {
        correct_eng = true;
        console.log(`Correct ${correct_eng}`);
      }
    }
    if ((this.state.subGroup === "") || (this.state.subGroup === "1") || (this.state.subGroup === "2")) correct_sub = true;
    if ((this.state.correct === true) && (correct_sub === true) && (correct_eng === true)) {

      if (this.state.checked === true) createUser(this.state.userId, "808", String(this.state.groupId), String(this.state.subGroup), String(this.state.engGroup), "");

      getScheduleFromDb(this.state.groupId, String(this.state.engGroup), this.getFirstDayWeek(new Date(Date.now()))).then((response) => {
        this.showWeekSchedule(response, 0);
      });
      console.log(String(this.state.engGroup));
      this.state.flag = true;
      this.convertIdInGroupName();
      this.setState({ page: 7, labelGroup: "Номер академической группы", color_group: "Предупреждение" });
    } else if (this.state.correct === true) {
      this.setState({ labelGroup: "Номер академической группы", color_group: "Предупреждение" });
    } else if (this.state.group === "") {
      this.setState({ labelGroup: "Поле с номером группы является обязательным для ввода", color_group: "error" })
    } else {
      this.setState({ labelGroup: "Некорректно введен номер группы", color_group: "error" })
    }
    if (correct_sub === false) {
      this.setState({ color_sub: "error" })
    } else this.setState({ color_sub: "Предупреждение", star: false });
    if (correct_eng === false) {
      this.setState({ color_enggroup: "error" })
    } else this.setState({ color_enggroup: "Предупреждение", star: false });
  }

  Para(count) {
    switch (count) {
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

  Type(type) {
    switch (type) {
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

  Spinner() {
    var myinterval = setInterval(() => {
      if (this.state.spinner === true) {
        setTimeout(() => {
          if (this.state.today === 0) {
            if (this.state.flag === true)
              this.setState({ page: 8 })
            else this.setState({ page: 9 })
          } else if (this.state.flag === true) this.setState({ page: this.state.today });
          else this.setState({ page: 9 });

        }, 100);
        clearInterval(myinterval)
      }
    }, 100);

    return (
      <DeviceThemeProvider>
        <DocStyle/>
        {(() => {
          switch (this.state.character) {
            case "sber":
              return <ThemeBackgroundSber/>;
            case "eva":
              return <ThemeBackgroundEva/>;
            case "joy":
              return <ThemeBackgroundJoy/>;
            default:
              return;
          }
        })()}
        <div>
          <Container style={{ padding: 0 }}>
            <Spinner color="var(--plasma-colors-button-accent)"
                     style={{ position: " absolute", top: "40%", left: " 43%", marginRight: "-50%" }}/>
          </Container>
        </div>
      </DeviceThemeProvider>
    )
  }

  render() {
    console.log('render');
    switch (this.state.page) {
      case 0:
        return <Home state={this.state} isCorrect={this.isCorrect} convertIdInGroupName={this.convertIdInGroupName}
                     isCorrectTeacher={this.isCorrectTeacher} setValue={this.setValue}></Home>;//this.Home();
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
      case NAV_PAGE_NO:
        return <Navigator state={this.state} setValue={this.setValue}></Navigator>
      case 16:
        return this.Dashboard();
      default:
        break;
    }
  }
}