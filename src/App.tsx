import React, {useState, useEffect, useRef} from "react";
import {
  Container,
  Row,
  Col,
  Button,
  DeviceThemeProvider,
  Spinner,
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
  RectSkeleton,
  HeaderTitleWrapper,
  Image,
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
} from "./APIHelper";
import logo from "./images/logo.png";
import image from "./images/frame.png"
import karta from "./images/Karta.png";
import groups from './groups_list.json';
import Home from './components/HomeView.jsx';
import Navigator from './components/Navigator.jsx';
import BellView from './components/BellView.jsx';
import DaysCarousel from './components/DaysCarousel.jsx';
import StarButtonView from './components/StarButtonView.jsx'
import DashboardView from './components/DashboardView.jsx'
import {Bell} from './ScheduleStructure'

import engGroups from './data/engGroups.json'
import building from './data/buldings.json'

console.log('engGroups:', engGroups)

export const NAV_PAGE_NO = 15;

const INITIAL_PAGE = 7;

const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;
export const DEFAULT_TEXT_COLOR = 'var(--plasma-colors-white-secondary)';
export const COLOR_BLACK = '';


const initializeAssistant = (getState) => {
  if (process.env.NODE_ENV === "development") {
    return createSmartappDebugger({
      token: process.env.REACT_APP_TOKEN ?? "",
      initPhrase: `Запусти ${process.env.REACT_APP_SMARTAPP}`,
      getState,
    });
  }
  return createAssistant({getState});
};

const ThemeBackgroundEva = createGlobalStyle(darkEva);
const ThemeBackgroundSber = createGlobalStyle(darkSber);
const ThemeBackgroundJoy = createGlobalStyle(darkJoy);

export const DocStyle = createGlobalStyle`
  html:root {
    min-height: 100vh;
    color: ${text};
    background-color: ${background};
    background-image: ${gradient};
  }
`;

const MyDiv100 = styled.div`
  width: 100px;
  height: 100px;
`;

const MyDiv200 = styled.div`
  width: 200px;
  height: 200px;
`;

// const PAIR_NAME_IDX = 0;
// const TEACHER_NAME_IDX = 1;
// const PAIR_NO_IDX = 5;

const breaks = {
  '1': '09:00',
  '2': '10:35-10:50',
  '3': '12:25-12:40',
  '4': '14:15-14:30',
  '5': '16:05-16:20',
  '6': '17:55-18:10',
  '7': '19:45'
}

const dayNameDict = {
  "Пн": ["В понедельник", 1],
  "Вт": ["Во вторник", 2],
  "Ср": ["В среду", 3],
  "Чт": ["В четверг", 4],
  "Пт": ["В пятницу", 5],
  "Сб": ["В субботу", 6]
}

/**
 * Порядковые числительные именительный падеж
 */
const ordinalNominativeCaseSingularFemDict = {
  "1": "первая",
  "2": "вторая",
  "3": "третья",
  "4": "четвертая",
  "5": "пятая",
  "6": "шестая",
  "7": "седьмая"
}

const ordinalGenitiveCaseSingularFemDict = {
  1: "первой",
  2: "второй",
  3: "третьей",
  4: "четвертой",
  5: "пятой",
  6: "шестой",
  7: "седьмой"
}


// const DAY_TODAY = 'today';
const DAY_TODAY = 'today';
const DAY_TOMORROW = 'tomorrow';
type TodayOrTomorrow = 'today' | 'tomorrow'

type StartOrEnd = 'start' | 'end'

const TODAY_TOMORROW_DICT = {
  [DAY_TODAY]: 1,
  [DAY_TOMORROW]: 0,
}

const CHAR_SBER = 'sber';
const CHAR_EVA = 'eva';
const CHAR_JOY = 'joy';
type Character = 'sber' | 'eva' | 'joy'

export const getThemeBackgroundByChar = (character: Character) => {
  const themeBackgroundByChar = {
    [CHAR_SBER]: <ThemeBackgroundSber/>,
    [CHAR_EVA]: <ThemeBackgroundEva/>,
    [CHAR_JOY]: <ThemeBackgroundJoy/>,
  }
  const themeBackground = themeBackgroundByChar[character];
  return themeBackground || null;
}

const COLOR_NAME_ERROR = 'error'
const COLOR_NAME_WARN_RU = 'Предупреждение'

const DEFAULT_STATE_DAY = [
  {
    title: 'Пн',
    date: ["", ""],
    count: [0, 0]
  }, {
    title: 'Вт',
    date: ["", ""],
    count: [0, 0]
  }, {
    title: 'Ср',
    date: ["", ""],
    count: [0, 0]
  }, {
    title: 'Чт',
    date: ["", ""],
    count: [0, 0]
  }, {
    title: 'Пт',
    date: ["", ""],
    count: [0, 0]
  }, {
    title: 'Сб',
    date: ["", ""],
    count: [0, 0]
  }
]

// const X = ({today, current, day_num, days, i, timeParam, weekParam}) => {
//   //const day_num = props.day_num;
//   //const days= props.days;
//   const curr_day_obj = days[day_num]
//   const bell_id = `bell_${i + 1}`;
//   const curr_pair_obj = curr_day_obj[bell_id];
//   const curr_pair_week_obj = curr_pair_obj[weekParam];
//
//   //const curr_day_obj = Array.isArray(days) ? days[ day_num ] : undefined;
//   //const bell_id  = `bell_${i + 1}`;
//   //const curr_pair_obj = Array.isArray(curr_day_obj) ? curr_day_obj[ bell_id ] : undefined;
//   //const curr_pair_week_obj = curr_pair_obj[ weekParam ];
//
//   const pairName = curr_pair_week_obj[PAIR_NAME_IDX];
//   const curr_pair_no_full = curr_pair_week_obj[PAIR_NO_IDX];
//   const curr_pair_no = curr_pair_no_full[0]; // берем первый символ строки (второй - точка)
//   const teacherName = curr_pair_week_obj[TEACHER_NAME_IDX];
//
//   return curr_pair_no === current
//   && teacherName !== ""
//   && today === timeParam
//   && weekParam === 0
//     ? (
//       < CardHeadline3 style={{color: "var(--plasma-colors-button-accent)"}}>
//         {pairName}
//       </ CardHeadline3>
//     )
//     : (
//       < CardHeadline3>
//         {pairName}
//       </ CardHeadline3>
//     )
// }

interface IBuilding {
  name: string
  address: string
  color: string
  short: string
}


interface IScheduleTeacherData {
  name: string
}

interface IScheduleGroup {
  name: string
  subgroup_name: string | undefined
}

interface IScheduleLessonInfo {
  groups: IScheduleGroup[]
  subject_name: string
  teachers: IScheduleTeacherData[]
  room_name: string
  type: string
  other: string
}

interface IScheduleBellHeader {
  start_lesson: string
  end_lesson: string
}

interface ISchedule {
  header: IScheduleBellHeader
  day1: IScheduleLessonInfo
  day2: IScheduleLessonInfo
  day3: IScheduleLessonInfo
  day4: IScheduleLessonInfo
  day5: IScheduleLessonInfo
  day6: IScheduleLessonInfo
  day7: IScheduleLessonInfo
}

interface IScheduleHeaderDay {
  date: string
}

interface IScheduleHeader {
  day1: IScheduleHeaderDay,
  day2: IScheduleHeaderDay,
  day3: IScheduleHeaderDay,
  day4: IScheduleHeaderDay,
  day5: IScheduleHeaderDay,
  day6: IScheduleHeaderDay,
  day7: IScheduleHeaderDay,
}

// interface Schedule {
//   bell: ScheduleHeader[]
// }

interface IScheduleData {
  schedule: ISchedule[]
  schedule_header: IScheduleHeader
}

type IScheduleDays = Bell[][][]

interface IAppProps {
}

interface DayHeader {
  title: string
  date: string[]
  count: number[]
}

interface IAppState {
  notes: { id: string, title: string }[];
  userId: string
  page: number
  logo
  flag: boolean
  checked: boolean
  description: string
  group: string
  groupId: string
  subGroup: string
  engGroup: string
  correct
  labelGroup: string
  labelSubgroup: string
  labelEnggroup: string
  label_teacher: string
  i: number
  day: DayHeader[]
  days: IScheduleDays
  spinner: boolean
  date: number
  today: number
  color_group: string
  color_teacher: string
  color_sub: string
  color_enggroup?: string
  character: Character
  star: boolean
  bd: string
  student: boolean
  teacher: string
  teacherId: string
  teacher_checked: boolean
  teacher_star: boolean
  teacher_bd: string
  teacher_correct: boolean
  building: IBuilding[]
}

interface IHeaderScheduleProps {
  student: boolean,
  teacher_correct: boolean,
  teacher: string,
  groupname: string
}



export class App extends React.Component<IAppProps, IAppState> {
  assistant

  constructor(props) {
    super(props);
    this.setValue = this.setValue.bind(this)
    this.isCorrect = this.isCorrect.bind(this)
    this.isCorrectTeacher = this.isCorrectTeacher.bind(this)
    this.convertIdInGroupName = this.convertIdInGroupName.bind(this);
    // this.tfRef                = React.createRef();
    console.log('constructor');
    // const bell = Array.from({length: 2}, (v, i) => Array.from({length: 8}, (v, i) => ""))
    this.state = {
      notes: [],
      //
      userId: "",
      //
      page: INITIAL_PAGE,
      logo: null,
      flag: true,
      checked: true,
      description: "",
      group: "",
      groupId: "",
      subGroup: "",
      engGroup: "",
      correct: null,
      labelGroup: "Номер академической группы через дефисы",
      labelSubgroup: "Номер подгруппы: 1 или 2",
      labelEnggroup: "Число номера группы по английскому",
      label_teacher: "Фамилия И. О.",
      i: 0,
      day: DEFAULT_STATE_DAY,
      days: [],
      spinner: false,
      date: Date.now(),
      today: 0,
      color_group: DEFAULT_TEXT_COLOR,
      color_teacher: DEFAULT_TEXT_COLOR,
      color_sub: DEFAULT_TEXT_COLOR,
      character: CHAR_SBER,
      star: false,
      bd: "",
      student: true,
      teacher: "",
      teacherId: "",
      teacher_checked: false,
      teacher_star: false,
      teacher_bd: "",
      teacher_correct: false,
      building: building,
    }
    // this.Home                 = Home.bind(this);
    // this.Navigator            = Navigator.bind(this);
    this.Raspisanie = this.Raspisanie.bind(this);
    this.convertIdInGroupName = this.convertIdInGroupName.bind(this);
  }

  componentDidMount() {
    console.log('componentDidMount');

    this.assistant = initializeAssistant(() => this.getStateForAssistant());
    this.assistant.on("data", (event) => {
      switch (event.type) {
        case "character":
          console.log(event.character.id);
          this.setState({character: event.character.id});
          if (event.character.id === "timeParamoy") {

            this.setState({description: "Заполни данные, чтобы открывать расписание одной фразой"});
          } else {
            this.setState({description: "Чтобы посмотреть расписание, укажите данные учебной группы"});
          }
          break;

        case "smart_app_data":
          console.log("User");
          console.log(event);
          if (event.sub !== undefined) {
            console.log("Sub", event.sub);
            this.setState({userId: event.sub});
            getUser(this.state.userId).then((user) => {

              if (user !== "0") {
                console.log('user', user)
                this.setState({
                  groupId: user.group_id,
                  subGroup: user.subgroup_name,
                  engGroup: user.eng_group,
                  teacherId: user.teacher_id,
                })
                this.convertIdInGroupName()
                if (this.state.teacherId !== "") {
                  getInTeacherFromDb(this.state.teacherId)
                    .then((teacherData) => {
                        const teacher = `${teacherData.last_name} ${teacherData.first_name}. ${teacherData.mid_name}.`;
                        this.setState({
                          teacher
                        })
                      }
                    );
                  getScheduleTeacherFromDb(
                    this.state.teacherId,
                    this.getFirstDayWeek(new Date(this.state.date))
                  )
                    .then((response) => {
                      this.showWeekSchedule(response, 0)
                    });
                  this.ChangePage()
                  this.setState({
                    student: false,
                    page: 7,
                    teacher_checked: true,
                    teacher_star: true,
                    teacher_bd: this.state.teacherId,
                    teacher_correct: true
                  });
                } else if (this.state.groupId !== "") {
                  getScheduleFromDb(this.state.groupId, this.state.engGroup, this.getFirstDayWeek(new Date(this.state.date))).then((response) => {
                    this.showWeekSchedule(response, 0)
                  });
                  this.ChangePage()
                  this.setState({page: 7, checked: true, star: true, bd: this.state.groupId, student: true});
                } else {
                  this.ChangePage()
                  this.setState({page: 0});
                }
              } else {
                this.ChangePage()
                this.setState({page: 0});
              }
            })
          }
          console.log(`assistant.on(data)`, event);
          const {action} = event;
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

  setValue(key, value) {
    console.log(key, value)
    switch (key) {
      case "group":
        this.setState({group: value});
        break;
      case "subGroup":
        this.setState({subGroup: value});
        break;
      case "teacher":
        this.setState({teacher: value});
        break;
      case "page":
        this.ChangePage()
        this.setState({page: value});
        break;
      case "student":
        this.setState({student: value});
        break;
      case "teacher_checked":
        this.setState({teacher_checked: value});
        break;
      case "engGroup":
        this.setState({engGroup: value});
        break;
      case "checked":
        this.setState({checked: value});
        break;
      case "description":
        this.setState({description: value});
        break;
      case "bd":
        this.setState({bd: value});
        break;
      case "teacher_bd":
        this.setState({teacher_bd: value})
        break;
      default:
        break;

    }
  }

  HeaderSchedule(props: IHeaderScheduleProps) {
    return (
      <Col style={{marginLeft: "0.5em"}}>
        <TextBox>
          <TextBoxTitle>Расписание занятий</TextBoxTitle>
          {
            !props.student && props.teacher_correct
              ? <TextBoxSubTitle>{props.teacher}</TextBoxSubTitle>
              : <TextBoxSubTitle>{props.groupname}</TextBoxSubTitle>
          }
        </TextBox>
      </Col>
    )
  }

  // определяет когда начинаются пары сегодня или завтра
  getStartFirstLesson(todayOrTomorrow: TodayOrTomorrow): string | undefined {
    const dayShift = TODAY_TOMORROW_DICT[todayOrTomorrow]
    const dayNumber = this.state.today - dayShift;
    for (let bell in this.state.days[dayNumber]) {
      const startAndfinishTime = this.state.days[dayNumber][bell][0].startAndfinishTime
      if (startAndfinishTime !== "") {
        return startAndfinishTime.slice(0, 5)
      }
    }
  }

  // определяет когда кончаются пары сегодня или завтра
  getEndLastLesson(todayOrTomorrow: TodayOrTomorrow): string | undefined {
    const dayShift = TODAY_TOMORROW_DICT[todayOrTomorrow]
    const dayNumber = this.state.today - dayShift;
    for (let bell = 7; bell > 0; bell--) {
      const startAndfinishTime = this.state.days[dayNumber][bell - 1][0].startAndfinishTime
      if (startAndfinishTime !== "") {
        return startAndfinishTime.slice(8)
      }
    }
  }

  // определяет начало или конец энной пары сегодня или завтра
  getBordersRequestLesson(type: StartOrEnd, todayOrTomorrow: TodayOrTomorrow, lessonNum: number): string | undefined {
    const dayShift = TODAY_TOMORROW_DICT[todayOrTomorrow]
    const dayNumber = this.state.today - dayShift;
    const startAndfinishTime = this.state.days[dayNumber][lessonNum - 1][0].startAndfinishTime;
    if (startAndfinishTime !== "") {
      if (type === "start") {
        return startAndfinishTime.slice(0, 5)
      } else {
        return startAndfinishTime.slice(8)
      }
    }
  }

  getStartEndLesson(type: StartOrEnd, todayOrTomorrow: TodayOrTomorrow, lessonNum) {
    if (todayOrTomorrow === DAY_TODAY && this.state.today === 0) {
      return [todayOrTomorrow, "sunday"]
    }
    if (todayOrTomorrow === DAY_TOMORROW && this.state.today === 6) {
      return [todayOrTomorrow, "sunday"]
    }
    if (type === "start") {
      if (todayOrTomorrow === DAY_TODAY) {
        if (lessonNum === "0") {
          return this.getStartFirstLesson(todayOrTomorrow)
        } else {
          return this.getBordersRequestLesson(type, todayOrTomorrow, lessonNum)
        }
      } else {
        if (lessonNum === "0") {
          return this.getStartFirstLesson(todayOrTomorrow)
        } else {
          return this.getBordersRequestLesson(type, todayOrTomorrow, lessonNum)
        }
      }
    } else if (type === "end") {
      if (todayOrTomorrow === DAY_TODAY) {
        if (lessonNum === "0") {
          return this.getEndLastLesson(todayOrTomorrow)
        } else {
          return this.getBordersRequestLesson(type, todayOrTomorrow, lessonNum)
        }
      } else {
        if (lessonNum === "0") {
          return this.getEndLastLesson(todayOrTomorrow)
        } else {
          return this.getBordersRequestLesson(type, todayOrTomorrow, lessonNum)
        }
      }
    }
  }

  // форматирование даты в вид "DD.MM.YY"
  getDateWithDots(date: Date): string {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = String(date.getFullYear()).slice(2, 4)
    return `${(day < 10 ? '0' : '').concat('' + day)}.${(month < 10 ? '0' : '').concat('' + month)}.${year}`;
  }

  // подсчет количества пар в указанную дату
  // возвращает массив с днем недели и количеством пар в этот день
  getAmountOfLessons(date: Date) {
    for (let day of this.state.day) {
      for (let week = 0; week < 2; week++) {
        console.log("this.getDateWithDots(date)", this.getDateWithDots(date))
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
  getTime(date: Date): string {
    const hours = date.getHours()
    const minutes = date.getMinutes()
    return `${(hours < 10 ? '0' : '').concat('' + hours)}:${(minutes < 10 ? '0' : '').concat('' + minutes)}`
  }

  // получить текущую пару
  getCurrentLesson(date: Date) {
    if (this.state.today !== 0) {
      for (let bell in this.state.days[this.state.today - 1]) {
        if ((this.getTime(date) > this.state.days[this.state.today - 1][bell][0].startAndfinishTime.slice(0, 6)) &&
          (this.getTime(date) < this.state.days[this.state.today - 1][bell][0].startAndfinishTime.slice(8)) &&
          (this.state.days[this.state.today - 1][bell][0].startAndfinishTime.slice(0, 6) !== "")) {
          return this.state.days[this.state.today - 1][bell][0].lessonNumber[0]
        }
      }
    }
  }

  // возвращает количество оставшихся на сегодня пар
  getAmountOfRemainingLessons(date: Date): number {
    let countRemainingLessons = 0
    if ((this.state.today !== 0) && (this.state.today + 1 !== 7))
      for (let bell in this.state.days[this.state.today - 1]) {
        if (this.getTime(date) < this.state.days[this.state.today - 1][bell][0].startAndfinishTime.slice(0, 6) &&
          this.state.days[this.state.today - 1][bell][0].startAndfinishTime.slice(0, 6) !== "") {
          countRemainingLessons += 1
        }
      }
    return countRemainingLessons
  }

  getTimeFirstLesson(daynum: number) {
    let first;
    let num;
    let week = 0;
    if (daynum < this.state.today) week = 1;
    for (let bell in this.state.days[daynum - 1]) {
      if (this.state.days[daynum - 1][bell][week][5] !== "") {
        first = this.state.days[daynum - 1][bell][week].startAndfinishTime;
        num = this.state.days[daynum - 1][bell][week].lessonNumber[0];
        break
      }
    }
    return [first, num];
  }

  whatLesson(date: Date, when: string): { lesson: string | undefined, type: string } { //определяет название пары, которая идет или будет
    // ключ - номер пары, значение - перерыв до этой пары
    if (this.state.day[this.state.today - 1].count[0] == 0) {
      return {
        lesson: undefined,
        type: when,
      }
    } else {
      console.log(this.state.day[this.state.today - 1].count[0], "count");
      if (this.getTime(date) < this.getTimeFirstLesson(this.state.today)[0].slice(0, 5)) {
        console.log(true)
      }
      console.log(" что за пара", this.getTime(date), when, this.getTimeFirstLesson(this.state.today)[0].slice(0, 5))
      if (this.state.today !== 0) {

        if ((this.getCurrentLesson(date) !== undefined) && (when === "now")) {
          for (let bell in this.state.days[this.state.today - 1]) {
            if ((this.state.days[this.state.today - 1][bell][0][5][0] === this.getCurrentLesson(date)) && (this.state.days[this.state.today - 1][bell][0][5][0] !== "")) {
              return {
                lesson: this.state.days[this.state.today - 1][bell][0][0],
                type: "now",
              };
            }
          }
        } else if ((when === "will") && (this.getCurrentLesson(date) !== undefined) && (parseInt(this.getCurrentLesson(date)) + 1 < 8)) {
          console.log("будет")
          for (let bell in this.state.days[this.state.today - 1]) {
            console.log(parseInt(this.getCurrentLesson(date)) + 1);
            if ((this.state.days[this.state.today - 1][bell][0][5][0] == parseInt(this.getCurrentLesson(date)) + 1) && (this.state.days[this.state.today - 1][bell][0][5][0] !== "")) {
              return {
                lesson: this.state.days[this.state.today - 1][bell][0][0],
                type: "next"
              };
            }
          }
        } else if ((this.getTimeFirstLesson(this.state.today)[0].slice(0, 5) !== undefined) && (this.getTime(date) <= this.getTimeFirstLesson(this.state.today)[0].slice(0, 5))) {
          console.log(this.state.days[this.state.today - 1][`bell_${parseInt(this.getTimeFirstLesson(this.state.today)[1])}`][0][0]);
          return {
            lesson: this.state.days[this.state.today - 1][`bell_${parseInt(this.getTimeFirstLesson(this.state.today)[1])}`][0][0],
            type: "will"
          }
        } else {
          for (let i in breaks) {
            if ((this.getTime(date) > breaks[i].slice(0, 5) && this.getTime(date) < breaks[i].slice(6)) && (this.state.days[this.state.today - 1][`bell_${i}`][0][5][0] !== "")) {
              return {
                lesson: this.state.days[this.state.today - 1][`bell_${i}`][0][0],
                type: "will"
              };
            } else {
              return {
                lesson: undefined,
                type: when,
              };
            }
          }
        }
      }
    }
    return {
      lesson: undefined,
      type: when,
    };
  }

  // определяет ближайшую пару, если сейчас идет какая то пара, то сообщает об этом
  whereWillLesson(date: Date, will: string) {
    let nextLessonRoom
    let numberNearestLesson
    // проверяем, что сегодня не воскресенье
    if (this.state.today !== 0) {
      // определяем номер ближайшей пары
      for (let i in breaks) {
        if (this.getTime(date) < breaks['1']) {
          numberNearestLesson = '1';
          break
        } else if (this.getTime(date) > breaks[i].slice(0, 5) && this.getTime(date) < breaks[i].slice(6)) {
          numberNearestLesson = i;
          break
        } else if (this.getTime(date) > breaks['7']) {
          numberNearestLesson = null
        }
      }
      const amountOfLessons = this.getAmountOfLessons(date);
      if (amountOfLessons && amountOfLessons[1] === 0) {
        return {
          exist: "empty",
        }
      }
      if (numberNearestLesson !== undefined) {
        for (let bell in this.state.days[this.state.today - 1]) {
          // если пара с таким номером есть в расписании
          if (this.state.days[this.state.today - 1][bell][0].lessonNumber[0] === numberNearestLesson) {
            return {
              audience: this.state.days[this.state.today - 1][bell][0].room,
              type: "nearest",
              exist: "inSchedule",
            }
          } else {
            // сообщаем, что такой пары нет
            console.log(`Сейчас перерыв. Ближайшей будет ${numberNearestLesson} пара`)
            for (let bell in this.state.days[this.state.today - 1]) {
              if (this.state.days[this.state.today - 1][bell][0].lessonNumber[0] !== numberNearestLesson) {
                return {
                  audience: this.state.days[this.state.today - 1][bell][0].room,
                  type: "nearest",
                  exist: "notInSchedule",
                }
              }
            }
          }
        }
      }
      if (numberNearestLesson === undefined && will === "now") {
        // вернуть номер текущей пары
        let whereCurrentLesson
        for (let bell in this.state.days[this.state.today - 1]) {
          if (this.state.days[this.state.today - 1][bell][0].lessonNumber[0] === this.getCurrentLesson(date)) {
            whereCurrentLesson = this.state.days[this.state.today - 1][bell][0].room
          }
        }
        if (whereCurrentLesson === "") {
          return {
            exist: "notInSchedule",
          }
        } else {
          return {
            audience: whereCurrentLesson,
            type: "current",
          }
        }
      }
      if (numberNearestLesson === undefined && will === "will") {
        for (let bell in this.state.days[this.state.today - 1]) {
          if (this.state.days[this.state.today - 1][bell][0].lessonNumber[0] === String(Number(this.getCurrentLesson(date)) + 1)) {
            nextLessonRoom = this.state.days[this.state.today - 1][bell][0].room
          }
        }
        if (nextLessonRoom !== "") {
          return {
            audience: nextLessonRoom,
            type: "next",
          }
        } else {
          return {
            exist: "endLessons",
          }
        }
      }
    } else {
      return {
        exist: "sunday",
      }
    }
  }

  dispatchAssistantAction(action) {
    const numPron = {0: "ноль", 1: "одна", 2: "две", 3: "три", 4: "четыре", 5: "пять", 6: "шесть", 7: "семь"}
    if (action) {
      switch (action.type) {
        case 'profile':
          this.ChangePage()
          return this.setState({page: 0});
          break;

        case 'for_today':
          if ((this.state.group !== "") || (this.state.teacher !== ""))
            if (this.state.today === 0) {
              this.assistant.sendData({
                action: {
                  action_id: "todaySchedule",
                  parameters: {day: "sunday"},
                },
              })
              this.ChangePage()
              return this.setState({page: 8});
            } else {
              this.assistant.sendData({
                action: {
                  action_id: "todaySchedule",
                  parameters: {day: "notSunday"},
                },
              })
              this.ChangePage()
              return this.setState({page: this.state.today});
            }
          break;

        case 'for_tomorrow':
          if ((this.state.group !== "") || (this.state.teacher !== ""))
            if (this.state.today + 1 === 7) {
              this.assistant.sendData({
                action: {
                  action_id: "tomorrowSchedule",
                  parameters: {day: "sunday"},
                },
              })
              this.ChangePage()
              return this.setState({page: 8});
            } else {
              this.assistant.sendData({
                action: {
                  action_id: "tomorrowSchedule",
                  parameters: {day: "notSunday"},
                },
              })
              this.ChangePage()
              return this.setState({page: this.state.today + 1});
            }
          break;

        case 'for_next_week':
          if ((this.state.group !== "") || (this.state.teacher !== "")) {
            this.NextWeek();
            this.ChangePage()
            return this.setState({page: 9});
          }
          break;

        case 'for_this_week':
          if ((this.state.group !== "") || (this.state.teacher !== "")) {
            this.ChangePage()
            return this.setState({date: Date.now(), flag: true, page: 7});
          }
          break;

        case 'when_lesson':
          if ((this.state.group !== "") || (this.state.teacher !== "")) {
            let params

            type ActionNoteWhenLesson = [StartOrEnd, TodayOrTomorrow, string];

            const [type, day, lessonNum] = action.note as ActionNoteWhenLesson || [];

            let answer = this.getStartEndLesson(type, day, lessonNum)
            // const [ type, day ] = this.getStartEndLesson(type, day, lessonNum)


            console.log("answer", answer)
            if (answer !== undefined && answer[1] === "sunday") {
              params = {type: answer[0], day: answer[1]}
            } else {
              params = {
                type: type,
                day: day,
                ordinal: ordinalNominativeCaseSingularFemDict[lessonNum],
                time: answer
              }
            }
            this.assistant.sendData({
              action: {
                action_id: "say",
                parameters: params,
              },
            })

            if ((params.day === DAY_TODAY) && (this.state.today !== 0)) {
              this.ChangePage()
              return this.setState({page: this.state.today});
            } else if (this.state.today + 1 === 7) {
              this.ChangePage();
              return this.setState({page: 8});
            } else {
              this.ChangePage();
              this.setState({page: this.state.today + 1});
            }
          }
          break

        case 'how_many':
          let response
          let day
          let lesson
          let page = 0;
          if ((this.state.group !== "") || (this.state.teacher !== "")) {
            if (action.note !== undefined) {
              response = this.getAmountOfLessons(new Date(action.note.timestamp))
              if (String(this.state.today + 1) === action.note.dayOfWeek) {
                day = DAY_TODAY;
                page = 0
              } else if (String(this.state.today + 2) === action.note.dayOfWeek) {
                day = DAY_TOMORROW;
                page = 0
              }
            } else {
              response = this.getAmountOfLessons(new Date(Date.now()))
              day = DAY_TODAY
            }
            let howManyParams
            if (this.state.group !== "")
              if (response === undefined) {
                howManyParams = {day: "sunday"}
                // this.ChangePage();
                // this.setState({ page: 8 })
              } else {
                if (response[1] === 1) {
                  lesson = "пара"
                } else if (response[1] === 2 || response[1] === 3 || response[1] === 4) {
                  lesson = "пары"
                } else {
                  lesson = "пар"
                }
                howManyParams = {
                  lesson: lesson,
                  day: day,
                  dayName: dayNameDict[response[0]][0],
                  amount: numPron[response[1]]
                }
                if (dayNameDict[response[0]][1] < this.state.today) page = 8;
                this.ChangePage();
                this.setState({page: dayNameDict[response[0]][1] + page})
              }
            this.assistant.sendData({
              action: {
                action_id: "say1",
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
            if (this.state.group !== "")
              this.ChangePage();
            if (this.state.today === 0) {
              this.setState({page: 8})
            } else {
              this.setState({page: this.state.today})
            }
          }
          break

        case 'where':
          console.log('ok')
          if ((this.state.group !== "") || (this.state.teacher !== "")) {
            if (action.note === undefined) {
              action.note = {"when": "now"}
            }
            let whereLessonParams
            whereLessonParams = this.whereWillLesson(new Date(this.state.date), action.note.when)
            this.assistant.sendData({
              action: {
                action_id: "say3",
                parameters: whereLessonParams,
              },
            })
            this.ChangePage();
            if (whereLessonParams.exist === "sunday") {
              //this.setState({ page: 8 })
            } else {
              this.setState({page: this.state.today});
            }
          }
          break

        case 'what_lesson':
          console.log("какая пара")
          if ((this.state.group !== "") || (this.state.teacher !== "")) {
            if (action.note === undefined) {
              action.note = {"when": "now"}
            }
            let whatlesson
            whatlesson = this.whatLesson(new Date(Date.now()), action.note.when);
            console.log(this.whatLesson(new Date(Date.now()), action.note.when))
            this.assistant.sendData({
              action: {
                action_id: "say4",
                parameters: whatlesson,
              },
            })
            this.ChangePage();
            if (this.state.today === 0) {
              this.setState({page: 8})
            } else {
              this.setState({page: this.state.today});
            }
          }
          break

        case 'first_lesson':
          if ((this.state.group !== "") || (this.state.teacher !== "")) {
            let number
            let day1
            let page1 = 0;
            if (action.note !== undefined) {
              console.log(action.note)
              console.log(parseInt(action.note.dayOfWeek) - 1);
              number = this.getTimeFirstLesson(parseInt(action.note.dayOfWeek) - 1)[1]
              if (String(this.state.today + 1) === action.note.dayOfWeek) {
                day1 = DAY_TODAY;
                page1 = 0
              } else if (String(this.state.today + 2) === action.note.dayOfWeek) {
                day1 = DAY_TOMORROW;
                page1 = 0
              }
            } else {
              console.log(this.getTimeFirstLesson(parseInt(action.note.dayOfWeek) - 1)[1]);
              number = this.getTimeFirstLesson(parseInt(action.note.dayOfWeek) - 1)[1];
              day = DAY_TODAY
            }
            let whichFirst
            if (this.state.group !== "")
              if (number === undefined) {
                whichFirst = {day1: "sunday"}
                // this.ChangePage();
                // this.setState({ page: 8 })
              } else {
                whichFirst = {
                  num: ordinalGenitiveCaseSingularFemDict[number[0]],
                  day: day1,
                  dayName: dayNameDict[parseInt(action.note.dayOfWeek) - 1][0]
                }
                if (dayNameDict[parseInt(action.note.dayOfWeek) - 1][1] < this.state.today) page1 = 8;
                this.ChangePage();
                this.setState({page: dayNameDict[parseInt(action.note.dayOfWeek) - 1][1] + page1})
              }
            this.assistant.sendData({
              action: {
                action_id: "say5",
                parameters: whichFirst,
              },
            })
          }
          break

        case 'day_schedule':
          if ((this.state.group !== "") || (this.state.teacher !== "")) {
            let page2 = 0;
            if ((action.note[1] === null) && (action.note[2] === null)) {
              if (this.state.flag === false) {
                console.log(this.state.flag);
                page2 = 8;
              } else page2 = 0;
            } else {
              console.log(action.note)
              console.log(parseInt(action.note[0].dayOfWeek) - 1);
              if (action.note[1] !== null) {
                console.log(action.note[1]);
                page2 = 0;
              } else if (action.note[2] !== null) {
                console.log(action.note[2]);
                page2 = 8;
              }
            }
            let daySchedule
            if (this.state.group !== "") {
              daySchedule = {
                dayName: dayNameDict[parseInt(action.note[0].dayOfWeek) - 1][0]
              }
              this.ChangePage();
              this.setState({page: dayNameDict[parseInt(action.note[0].dayOfWeek) - 1][1] + page2})
            }
            this.assistant.sendData({
              action: {
                action_id: "say6",
                parameters: daySchedule,
              },
            })
          }
          break

        case 'group':
          if (action.note[0] === 0) {
            console.log(action.note[1].data.groupName[0]);
            this.setState({group: action.note[1].data.groupName[0].toUpperCase(), page: 0});
          } else {
            console.log(action.note[1].data.groupName[1])
            this.setState({group: action.note[1].data.groupName[1].toUpperCase(), page: 0})
          }
          break

        case 'show_schedule':
          console.log("показать расписание");
          if (this.state.page === 0)
            return this.isCorrect();
          break;

        case 'subgroup':
          console.log('subgroup', action)
          this.ChangePage();
          this.setState({subGroup: action.note, page: 0});
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
          ({id, title}, index) => ({
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
        this.setState({group: group.name})
        console.log(group.name, "группа")
      }
    }
  }

  convertGroupNameInId() {
    for (let group of groups) {
      if (this.state.group.toLowerCase() === group.name.toLowerCase()) {
        const groupId = '' + group.id; // convert to string
        this.setState({groupId}, () => {
          console.log(`groupId ${this.state.groupId}`)
        })
      }
    }
  }

  IsTeacher() {
    return !this.state.student && this.state.teacher_correct
  }

  // сколько миллисекунд в n днях
  msInDay(n) {
    return n * 24 * 60 * 60 * 1000
  }


  // форматирование даты в "YYYY-MM-DD"
  formatearFecha(fecha: Date): string {
    const mes = fecha.getMonth() + 1;
    const dia = fecha.getDate();
    return `${fecha.getFullYear()}-${(mes < 10 ? '0' : '').concat('' + mes)}-${(dia < 10 ? '0' : '').concat('' + dia)}`;
  };


  // получить дату первого дня недели
  getFirstDayWeek(date: Date): string {
    // номер дня недели
    const now = new Date();
    this.setState({today: now.getDay()});
    const weekDay = date.getDay()
    let firstDay: number;
    if (weekDay === 0) {
      firstDay = date.getTime() - this.msInDay(weekDay + 6)
      console.log(this.formatearFecha(new Date(firstDay)))
      //return null
    } else if (weekDay === 1) {
      return this.formatearFecha(date)
    } else {
      // число первого дня недели
      firstDay = date.getTime() - this.msInDay(weekDay - 1)
    }
    return this.formatearFecha(new Date(firstDay))
  }

  async getScheduleFromDb(date) {
    const firstDayWeek = this.getFirstDayWeek(new Date(date));
    if (this.state.student === false && this.state.teacher_correct === true) {
      await getScheduleTeacherFromDb(
        this.state.teacherId,
        firstDayWeek
      ).then((response) => {
        this.showWeekSchedule(response, 1);
      })
    } else {
      await getScheduleFromDb(
        this.state.groupId,
        this.state.engGroup,
        firstDayWeek
      ).then((response) => {
        this.showWeekSchedule(response, 1);
      })
    }
    this.setState({date: date, flag: false});
  }

  /**
   * Заполнение расписанием на следующую неделю
   */
  async NextWeek() {
    const datePlusWeek = this.state.date + SEVEN_DAYS;
    return this.getScheduleFromDb(datePlusWeek);
  }

  /**
   * Заполнение расписанием на предыдущую неделю
   */
  async PreviousWeek() {
    const dateMinusWeek = this.state.date - SEVEN_DAYS;
    return this.getScheduleFromDb(dateMinusWeek);
  }

  showWeekSchedule(rawSchedule: string, i) { //заполнение данными расписания из бд
    this.setState({spinner: false});

    const parsedSchedule: IScheduleData = JSON.parse(rawSchedule);
    let days = new Array(7).fill([]);
    for (let day in days) {
      days[day] = Array(7).fill([])
      for (let bell in days[day]) {
        days[day][bell] = [new Bell(), new Bell()];
      }
    }

    for (let day_num = 1; day_num < 7; day_num++) {

      // todo
      let countLessons = this.state.day[day_num - 1].count[i]
      countLessons = 0;

      if (parsedSchedule.schedule !== null) {
        this.state.day[day_num - 1].date[i] = parsedSchedule.schedule_header[`day_${day_num}`].date;
        for (let bell in parsedSchedule.schedule) { //проверка
          let bell_num = Number(bell.slice(-1)) - 1
          let lesson_info: IScheduleLessonInfo = parsedSchedule.schedule[bell][`day_${day_num}`].lessons[0]
          let lesson_info_state: Bell = days[day_num - 1][bell_num][i]
          if ((parsedSchedule.schedule[bell_num] !== undefined) && (lesson_info !== undefined) &&
            (lesson_info.groups[0].subgroup_name !== undefined) &&
            (lesson_info.groups[0].subgroup_name === this.state.subGroup) && (this.state.subGroup !== "")) {

            lesson_info_state.lessonName = lesson_info.subject_name;
            lesson_info_state.teacher = lesson_info.teachers[0].name;
            lesson_info_state.room = lesson_info.room_name;
            lesson_info_state.startAndfinishTime = `${parsedSchedule.schedule[bell].header.start_lesson} 
            - ${parsedSchedule.schedule[bell].header.end_lesson}`;
            lesson_info_state.lessonType = lesson_info.type;
            lesson_info_state.lessonNumber = `${bell.slice(5, 6)}. `;
            lesson_info_state.url = lesson_info.other;


            countLessons++;
          } else if ((parsedSchedule.schedule[bell] !== undefined) && (lesson_info !== undefined)
            && (lesson_info.groups[0].subgroup_name !== undefined) && (lesson_info.groups[0].subgroup_name !==
              this.state.subGroup)
            && (lesson_info.groups[0].subgroup_name !== undefined) && (this.state.subGroup !== "")) {
            lesson_info_state.reset()
          } else if ((parsedSchedule.schedule[bell] !== undefined) && (lesson_info !== undefined)) {

            lesson_info_state.lessonName = lesson_info.subject_name;
            lesson_info_state.teacher = lesson_info.teachers[0].name;
            lesson_info_state.room = lesson_info.room_name;
            lesson_info_state.startAndfinishTime = `${parsedSchedule.schedule[bell].header.start_lesson} 
            - ${parsedSchedule.schedule[bell].header.end_lesson}`;
            lesson_info_state.lessonType = lesson_info.type;
            lesson_info_state.lessonNumber = `${bell.slice(5, 6)}. `;
            lesson_info_state.url = lesson_info.other;

            for (let name in lesson_info.groups) {
              lesson_info_state.groupNumber += `${lesson_info.groups[name].name} `;
            }
            countLessons++;
          } else {
            lesson_info_state.reset();
          }
        }
        if (countLessons === 0)
          days[day_num - 1][0][i].lessonName = "Пар нет 🎉";

      } else {
        days[day_num - 1][0][i].lessonName = "Пар нет 🎉";
      }

    }
    this.setState({spinner: true});
    this.setState({days: days});
  }

  ChangePage() {

    let timeParam = 0;
    let weekParam = 0;
    switch (this.state.page) {
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
      case 6:
        timeParam = this.state.page
        weekParam = 0;
        break;
      case 9:
        timeParam = 1
        weekParam = 1
        break;
      case 10:
        timeParam = 2
        weekParam = 1
        break;
      case 11:
        timeParam = 3
        weekParam = 1
        break;
      case 12:
        timeParam = 4
        weekParam = 1
        break;
      case 13:
        timeParam = 5
        weekParam = 1
        break;
      case 14:
        timeParam = 6
        weekParam = 1
        break;
      default:
        break;
    }
    this.setState({i: 0});
    this.setState({star: false});
    if (weekParam === 1) {
      this.setState({flag: false});
    } else {
      this.setState({flag: true});
    }
    if (this.state.checked === true) {
      this.setState({star: true});
    } else {
      if (this.state.groupId == this.state.bd) {
        this.setState({star: true});
      } else {
        this.setState({star: false});
      }
    }
    if (this.state.teacher_checked === true) {
      this.setState({teacher_star: true});
    } else {
      if (this.state.teacherId == this.state.teacher_bd) {
        this.setState({teacher_star: true});
      } else {
        this.setState({teacher_star: false});
      }
    }
  }


  Raspisanie(timeParam, weekParam) {
    let current = this.getCurrentLesson(new Date(Date.now()));
    let day_num = timeParam - 1;
    let index = timeParam;
    let groupname;
    let page = 0;
    if (weekParam === 1) {
      page = 8;
    } else {
      page = 0;
    }

    if (this.state.subGroup !== "") groupname = `${this.state.group} (${this.state.subGroup})`
    else groupname = `${this.state.group} `


    //const { showToast, hideToast } = useToast()
    return (
      <DeviceThemeProvider>
        <DocStyle/>
        {
          getThemeBackgroundByChar(this.state.character)
        }
        <div>
          <Container style={{padding: 0, overflow: "hidden"}}>

            <Row style={{margin: "1em"}}>

              <Col style={{maxWidth: '3rem'}}>
                <Image src={logo} ratio="1 / 1"/>
              </Col>

              <this.HeaderSchedule
                groupname={groupname}
                student={this.state.student}
                teacher={this.state.teacher}
                teacher_correct={this.state.teacher_correct}
              />

              <Col style={{margin: "0 0 0 auto"}}>
                <Button size="s" view="clear" pin="circle-circle" onClick={() => this.setState({page: NAV_PAGE_NO})}
                        contentRight={<IconNavigationArrow size="s" color="inherit"/>}
                />
                {
                  this.IsTeacher()
                    ? (
                      <StarButtonView
                        star={this.state.star}
                        student={this.state.student}
                        userId={this.state.userId}
                        groupId={this.state.groupId}
                        subGroup={this.state.subGroup}
                        engGroup={this.state.engGroup}
                        teacherId={this.state.teacherId}
                        teacher_star={this.state.teacher_star}
                        setValue={this.setValue}
                        onClick={this.setValue("teacher_star", !this.state.teacher_star)}
                      />
                    ) : (
                      <StarButtonView
                        star={this.state.star}
                        student={this.state.student}
                        userId={this.state.userId}
                        groupId={this.state.groupId}
                        subGroup={this.state.subGroup}
                        engGroup={this.state.engGroup}
                        teacherId={this.state.teacherId}
                        teacher_star={this.state.teacher_star}
                        setValue={this.setValue}
                        onClick={this.setValue("star", !this.state.star)}
                      />
                    )}
                <Button
                  size="s"
                  view="clear"
                  pin="circle-circle"
                  onClick={() => this.setState({page: 0})}
                  contentRight={
                    <IconSettings size="s" color="inherit"/>
                  }
                />

                {/* <Button size="s" view="clear" pin="circle-circle" onClick={()=>this.setState({ page: 16 })}  contentRight={<IconHouse size="s" color="inherit"/>} /> */}
              </Col>
            </Row>
            <Row style={{display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"}}>
              <div>
                <Button
                  view="clear"
                  size="s"
                  pin="circle-circle"
                  onClick={() => {

                  }} style={{margin: "1em"}}
                  contentRight={
                    <IconChevronLeft
                      size="s"
                      color="inherit"
                      // @ts-ignore
                      style={{paddingBottom: "1.5em"}}
                    />
                  }
                />
                <Button
                  view="primary"
                  size="m"
                  text="Текущая неделя"
                  onClick={() => {
                    console.log(199)
                    this.setState({date: Date.now()});
                    this.setState({date: Date.now(), flag: true, page: 7})
                  }}
                  style={{position: "relative", bottom: "0.5em"}}/>
                <Button
                  view="clear"
                  size="s"
                  pin="circle-circle"
                  onClick={() => {
                    this.setState({spinner: false});
                    this.NextWeek();
                    this.setState({page: 9})
                  }}
                  style={{margin: "1em"}}
                  contentRight={
                    <IconChevronRight
                      size="s"
                      color="inherit"
                      // @ts-ignore
                      style={{paddingBottom: "1.5em"}}
                    />
                  }
                />

              </div>
            </Row>
            <Row style={{margin: "0.5em", marginRight: "0", overflow: "hidden"}}>
              <CarouselGridWrapper>
                <Carousel
                  as={Row}
                  axis="x"
                  scrollAlign="center"
                  index={this.state.i}
                  scrollSnapType="mandatory"
                  animatedScrollByIndex={true}
                  detectActive={true}
                  detectThreshold={0.5}
                  onIndexChange={() => this.Index()}
                  paddingStart="0%"
                  paddingEnd="40%"

                >
                  {
                    this.state.day.map(
                      ({title, date}, i) =>
                        <DaysCarousel
                          ViewType={i + 1 === index}
                          text={`${title} ${date[weekParam].slice(0, 5)}`}
                          IsCurrent={this.state.today === i + 1 && weekParam === 0}
                          setValue={this.setValue}
                          page={i + 1 + page}
                          i={i}
                        />
                    )
                  }
                </Carousel>
              </CarouselGridWrapper>
            </Row>
            {
              !this.state.spinner
                ? (
                  <RectSkeleton
                    width="90%"
                    height="25rem"
                    roundness={16}
                    style={{marginLeft: "5%", marginTop: "0.5em"}}/>
                )
                : (
                  <div style={{flexDirection: "column"}}>
                    <Card style={{width: "90%", marginLeft: "5%", marginTop: "0.5em"}}>
                      <CardBody style={{padding: "0 0 0 0"}}>
                        <CardContent compact style={{padding: "0.3em 0.3em"}}>
                          {/* <TextBoxBigTitle style={{color: "var(--plasma-colors-secondary)"}}> {this.state.day[day_num]["title"]} {this.state.day[day_num]["date"][weekParam].slice(0, 5)},  {this.Para(this.state.day[day_num]["count"][weekParam])} </TextBoxBigTitle> */}
                          {
                            timeParam == 7
                              ? (
                                <Row style={{
                                  display: "flex",
                                  flexDirection: "row",
                                  alignSelf: "center",
                                  justifyContent: "center"
                                }}>
                                  <TextBox>
                                    <TextBoxBigTitle>Выходной 😋</TextBoxBigTitle>
                                  </TextBox>
                                </Row>
                              )
                              : (
                                this.state.days.map((_, bellNumber) => {
                                  const curr_day_obj = this.state.days[day_num]
                                  const bell_id = bellNumber;
                                  const bell = this.state.days[day_num][bellNumber][weekParam];

                                  return bell.lessonName !== ""
                                    ? (
                                      <BellView
                                        bell={bell}
                                        current={current}
                                        weekParam={weekParam}
                                        timeParam={timeParam}
                                        student={this.state.student}
                                        teacher_correct={this.state.teacher_correct}
                                        today={this.state.today}
                                        Type={this.Type}
                                        isCorrectTeacher={this.isCorrectTeacher}
                                        setValue={this.setValue}/>

                                    )
                                    : (
                                      <div></div>
                                    )
                                })

                              )
                          }
                        </CardContent>
                      </CardBody>
                    </Card>
                  </div>)
            }
            <MyDiv200/>
            {/*
            <div style={{
              width: '200px',
              height: '200px',
            }}></div>
*/}
          </Container>
        </div>
      </DeviceThemeProvider>
    );
  }

  Index() {
    const currI = this.state.i;
    if (currI < 7) {
      this.setState({i: currI + 1});
    } else if (currI > 0) {
      this.setState({i: currI - 1});
    }
  }

  Dashboard() {
    return <DashboardView
      state={this.state}
      setState={this.setState}
      getCurrentLesson={this.getCurrentLesson}
      Type={this.Type}
    />
  }


  async isCorrectTeacher() {

    getIdTeacherFromDb(this.state.teacher).then((teacherData) => {
      console.log(teacherData)
      console.log(teacherData.status, "status")
      if (teacherData.status == "-1") {
        console.log("status");
        this.setState({
          label_teacher: "Такого преподавателя нет в НИТУ МИСиС",
          color_teacher: COLOR_NAME_ERROR,
        })
      } else if (teacherData.status == "-2") {
        this.setState({
          label_teacher: "Некорректно введены данные",
          color_teacher: COLOR_NAME_WARN_RU,
        })
      } else {
        getScheduleTeacherFromDb(
          teacherData.id,
          this.getFirstDayWeek(new Date(Date.now()))
        ).then((response) => {
          this.showWeekSchedule(response, 0);

        });
        getInTeacherFromDb(teacherData.id).then((parsedTeacher2) => {
          this.setState({
            teacher: `${teacherData.last_name} ${teacherData.first_name}. ${teacherData.mid_name}.`
          })
        })
        this.setState({
          teacherId: teacherData.id,
          student: false,
          teacher_correct: true,
          date: Date.now(),
          flag: true,
          page: 7,
          label_teacher: "Фамилия И. О.",
          color_teacher: DEFAULT_TEXT_COLOR,
        });
      }
      if (this.state.teacher_checked === true) {
        createUser(
          this.state.userId,
          // todo hardcoded 880
          "880",
          String(this.state.groupId),
          String(this.state.subGroup),
          String(this.state.engGroup),
          String(this.state.teacherId),
        );
      }
    })
  }

  isCorrect() {
    this.setState({correct: false, date: Date.now()})
    let correct_sub = false;
    let correct_eng = false;
    for (let i of groups) {
      if (this.state.group.toLowerCase() === i.name.toLowerCase()) {
        this.setState({correct: true})
        console.log(`Correct ${this.state.correct}`)
        this.convertGroupNameInId()
      }
    }
    for (let i of engGroups) {
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
      this.setState({flag: true});
      this.convertIdInGroupName();
      this.setState({page: 7, labelGroup: "Номер академической группы", color_group: COLOR_NAME_WARN_RU});
    } else if (this.state.correct === true) {
      this.setState({labelGroup: "Номер академической группы", color_group: COLOR_NAME_WARN_RU});
    } else if (this.state.group === "") {
      this.setState({labelGroup: "Поле с номером группы является обязательным для ввода", color_group: COLOR_NAME_ERROR})
    } else {
      this.setState({labelGroup: "Некорректно введен номер группы", color_group: COLOR_NAME_ERROR})
    }
    if (correct_sub === false) {
      this.setState({color_sub: COLOR_NAME_ERROR})
    } else this.setState({color_sub: COLOR_NAME_WARN_RU, star: false});
    if (correct_eng === false) {
      this.setState({color_enggroup: COLOR_NAME_ERROR})
    } else {
      this.setState({color_enggroup: COLOR_NAME_WARN_RU, star: false});
    }
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
              this.setState({page: 8})
            else this.setState({page: 9})
          } else if (this.state.flag === true) this.setState({page: this.state.today});
          else this.setState({page: 9});

        }, 100);
        clearInterval(myinterval)
      }
    }, 100);

    return (
      <DeviceThemeProvider>
        <DocStyle/>
        {
          getThemeBackgroundByChar(this.state.character)
        }
        <div>
          <Container style={{padding: 0}}>
            <Spinner color="var(--plasma-colors-button-accent)"
                     style={{position: " absolute", top: "40%", left: " 43%", marginRight: "-50%"}}/>
          </Container>
        </div>
      </DeviceThemeProvider>
    )
  }

  render() {
    console.log('render');
    switch (this.state.page) {
      case 0:
        return <Home
          state={this.state}
          isCorrect={this.isCorrect}
          convertIdInGroupName={this.convertIdInGroupName}
          isCorrectTeacher={this.isCorrectTeacher}
          setValue={this.setValue}
          groupId={this.state.groupId}
          description={this.state.description}
          character={this.state.character}
          student={this.state.student}
          teacher={this.state.teacher}
          labelGroup={this.state.labelGroup}
          color_group={this.state.color_group}
          group={this.state.group}
          labelSubgroup={this.state.labelSubgroup}
          subGroup={this.state.subGroup}
          color_sub={this.state.color_sub}
          labelEnggroup={this.state.labelEnggroup}
          color_enggroup={this.state.color_enggroup}
          checked={this.state.checked}
          label_teacher={this.state.label_teacher}
          teacher_checked={this.state.teacher_checked}
        ></Home>;//this.Home();
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
        return this.Raspisanie(7, 0);
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
